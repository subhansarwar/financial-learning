# app/services/courses/progress_service.py
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.courses import course as course_crud
from app.crud.courses import enrollment as enrollment_crud
from app.crud.courses import lesson as lesson_crud
from app.crud.courses import lesson_progress as lesson_progress_crud
from app.models.courses.enrollment import EnrollmentStatus
from app.models.users.user import User
from app.schemas.courses.enrollment import CourseProgressResponse
from app.services.courses.certificate_service import issue_certificate


class CourseNotFoundForLessonError(Exception):
    """Raised when a lesson doesn't belong to any known course (orphaned FK chain)."""


async def get_progress(db: AsyncSession, *, user_id: uuid.UUID, course_id: uuid.UUID) -> CourseProgressResponse:
    enrollment = await enrollment_crud.get(db, user_id=user_id, course_id=course_id)
    completed_ids = await lesson_progress_crud.list_completed_lesson_ids_for_course(
        db, user_id=user_id, course_id=course_id
    )
    total_lessons = await lesson_crud.count_for_course(db, course_id)

    return CourseProgressResponse(
        course_id=course_id,
        status=enrollment.status if enrollment else EnrollmentStatus.IN_PROGRESS,
        progress_pct=enrollment.progress_pct if enrollment else 0,
        total_lessons=total_lessons,
        completed_lessons=len(completed_ids),
        completed_lesson_ids=completed_ids,
    )


async def complete_lesson(db: AsyncSession, *, user: User, lesson_id: uuid.UUID) -> CourseProgressResponse:
    """Records a lesson as completed, recomputes the course's overall progress, and —
    once every lesson in the course is done — marks the enrollment complete and issues
    a certificate. Safe to call repeatedly for the same lesson (idempotent)."""
    course_id = await lesson_crud.get_course_id_for_lesson(db, lesson_id)
    if course_id is None:
        raise CourseNotFoundForLessonError()

    await lesson_progress_crud.get_or_create(db, user_id=user.id, lesson_id=lesson_id)
    enrollment = await enrollment_crud.get_or_create(db, user_id=user.id, course_id=course_id)

    completed_ids = await lesson_progress_crud.list_completed_lesson_ids_for_course(
        db, user_id=user.id, course_id=course_id
    )
    total_lessons = await lesson_crud.count_for_course(db, course_id)
    progress_pct = round((len(completed_ids) / total_lessons) * 100) if total_lessons else 0

    if total_lessons and len(completed_ids) >= total_lessons:
        enrollment = await enrollment_crud.mark_completed(db, enrollment)
        course = await course_crud.get_by_id(db, course_id)
        if course is not None:
            await issue_certificate(db, user=user, course=course)
    else:
        enrollment = await enrollment_crud.update_progress(db, enrollment, progress_pct=progress_pct)

    return CourseProgressResponse(
        course_id=course_id,
        status=enrollment.status,
        progress_pct=enrollment.progress_pct,
        total_lessons=total_lessons,
        completed_lessons=len(completed_ids),
        completed_lesson_ids=completed_ids,
    )
