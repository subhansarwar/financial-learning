# app/services/courses/progress_service_api.py
import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.core.deps import SessionDep
from app.core.security import logger
from app.crud.courses import module_api as module_crud
from app.crud.courses.course_api import get_course_by_id
from app.crud.courses.enrollment_api import create_enrollement, get_enrollment_by_user_and_course
from app.crud.courses.lesson_api import (
    count_lessons_for_course,
    get_course_id_for_lesson,
    list_lessons_by_module,
)
from app.crud.courses.lesson_progress_api import list_completed_lesson_ids_for_course
from app.models.courses.enrollment import EnrollmentStatus
from app.models.courses.lesson_progress import LessonCompletion
from app.models.users.user import User
from app.schemas.courses.enrollment import CourseProgressResponse, ModuleProgress
from app.services.courses.certificate_service_api import issue_certificate


class CourseNotFoundForLessonError(Exception):
    """Raised when a lesson doesn't belong to any known course (orphaned FK chain)."""


async def _build_module_progress(
    db: SessionDep, *, course_id: uuid.UUID, completed_lesson_ids: list[uuid.UUID]
) -> list[ModuleProgress]:
    """Per-module completion for one student, derived from their lesson completions.
    A module is complete once every lesson in it is done."""
    completed = set(completed_lesson_ids)
    modules = await module_crud.list_for_course(db, course_id)

    out: list[ModuleProgress] = []
    for module in modules:
        lessons = await list_lessons_by_module(db, module.id)
        total = len(lessons)
        done = sum(1 for lesson in lessons if lesson.id in completed)
        out.append(
            ModuleProgress(
                module_id=module.id,
                title=module.title,
                order_index=module.order_index,
                lessons_total=total,
                lessons_completed=done,
                completed=total > 0 and done >= total,
            )
        )
    return out


async def get_progress(db: SessionDep, *, user_id: uuid.UUID, course_id: uuid.UUID) -> CourseProgressResponse:
    enrollment = await get_enrollment_by_user_and_course(db, user_id=user_id, course_id=course_id)
    completed_ids = await list_completed_lesson_ids_for_course(
        db, user_id=user_id, course_id=course_id
    )
    total_lessons = await count_lessons_for_course(db, course_id)
    modules = await _build_module_progress(
        db, course_id=course_id, completed_lesson_ids=completed_ids
    )

    return CourseProgressResponse(
        course_id=course_id,
        status=enrollment.status if enrollment else EnrollmentStatus.IN_PROGRESS,
        progress_pct=enrollment.progress_pct if enrollment else 0,
        total_lessons=total_lessons,
        completed_lessons=len(completed_ids),
        completed_lesson_ids=completed_ids,
        modules=modules,
    )


def _progress_pct(*, completed: int, total: int, is_complete: bool) -> int:
    """Course completion percentage as an int. Never reports 100 through rounding —
    only a genuinely finished course (``is_complete``) gets 100; anything short of
    that is floored and capped at 99."""
    if total <= 0:
        return 0
    if is_complete:
        return 100
    return min(99, (completed * 100) // total)


async def _record_completion(db: SessionDep, *, user_id: uuid.UUID, lesson_id: uuid.UUID) -> bool:
    """Records a lesson completion inside the caller's transaction (flush only, no
    commit) so it lands together with the enrollment update. Returns True when a new
    row was written, False when the lesson was already complete. Safe for concurrent
    callers racing on the same (user, lesson): the loser of the race rolls back only
    its savepoint and reports the completion as already recorded."""
    existing = await db.execute(
        select(LessonCompletion.id).where(
            LessonCompletion.user_id == user_id,
            LessonCompletion.lesson_id == lesson_id,
        )
    )
    if existing.scalar_one_or_none() is not None:
        return False

    try:
        async with db.begin_nested():
            db.add(LessonCompletion(user_id=user_id, lesson_id=lesson_id))
        return True
    except IntegrityError:
        logger.info(
            "Concurrent lesson completion for user_id=%s lesson_id=%s; treating as idempotent",
            user_id,
            lesson_id,
        )
        return False


async def complete_lesson(db: SessionDep, *, user: User, lesson_id: uuid.UUID) -> CourseProgressResponse:
    """Records a lesson as completed, recomputes the course's overall progress, and —
    once every lesson in the course is done — marks the enrollment complete and issues
    a certificate. Safe to call repeatedly for the same lesson (idempotent)."""
    course_id = await get_course_id_for_lesson(db, lesson_id)
    if course_id is None:
        raise CourseNotFoundForLessonError()

    # Ensure an enrollment exists so the progress update below can't hit a None.
    enrollment = await create_enrollement(db, user_id=user.id, course_id=course_id)

    # --- single progress transaction: lesson completion + enrollment update ---
    await _record_completion(db, user_id=user.id, lesson_id=lesson_id)

    completed_ids = await list_completed_lesson_ids_for_course(
        db, user_id=user.id, course_id=course_id
    )
    total_lessons = await count_lessons_for_course(db, course_id)

    # A course with no lessons can never be "completed".
    is_complete = total_lessons > 0 and len(completed_ids) >= total_lessons

    try:
        if is_complete and enrollment.status != EnrollmentStatus.COMPLETED:
            enrollment.status = EnrollmentStatus.COMPLETED
            enrollment.progress_pct = 100
            enrollment.completed_at = datetime.now(timezone.utc)
        elif not is_complete:
            enrollment.progress_pct = _progress_pct(
                completed=len(completed_ids), total=total_lessons, is_complete=is_complete
            )
        await db.commit()
        await db.refresh(enrollment)
    except SQLAlchemyError:
        await db.rollback()
        logger.exception(
            "Failed to persist course progress: user_id=%s course_id=%s", user.id, course_id
        )
        raise

    # --- certificate issuance runs only after the progress transaction commits ---
    # Fires whenever the course is complete, not just on the call that completed the
    # final lesson: issue_certificate is idempotent on the certificate row, so a
    # retry of an already-completed lesson re-attempts a previously failed PDF upload.
    if is_complete:
        course = await get_course_by_id(db, course_id)
        if course is not None:
            try:
                await issue_certificate(db, user=user, course=course)
            except Exception:
                # Progress is already committed. A failed certificate (e.g. storage
                # misconfigured) must not 500 the completion request — issue_certificate
                # is idempotent and retries on the next completion call.
                logger.exception(
                    "Course %s completed for user %s but certificate issuance failed",
                    course_id,
                    user.id,
                )

    modules = await _build_module_progress(
        db, course_id=course_id, completed_lesson_ids=completed_ids
    )

    return CourseProgressResponse(
        course_id=course_id,
        status=enrollment.status,
        progress_pct=enrollment.progress_pct,
        total_lessons=total_lessons,
        completed_lessons=len(completed_ids),
        completed_lesson_ids=completed_ids,
        modules=modules,
    )
