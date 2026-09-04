# app/crud/students/dashboard_api.py
import uuid
from datetime import datetime
from sqlalchemy import case, func, select
from sqlalchemy.exc import SQLAlchemyError
from app.core.deps import SessionDep
from app.core.security import logger
from app.models.courses.course import Course
from app.models.courses.lesson import Lesson, LessonType
from app.models.courses.module import Module
from app.models.students.enrollment import CourseEnrollment, EnrollmentStatus
from app.models.students.lesson_progress import LessonCompletion
from app.models.students.quiz_attempt import QuizAttempt

async def count_enrollments(
    db: SessionDep, *, user_id: uuid.UUID, status: EnrollmentStatus | None = None
) -> int:
    stmt = select(func.count(CourseEnrollment.id)).where(CourseEnrollment.user_id == user_id)
    if status is not None:
        stmt = stmt.where(CourseEnrollment.status == status)
    try:
        return (await db.execute(stmt)).scalar_one()
    except SQLAlchemyError:
        logger.exception("Failed to count enrollments: user_id=%s status=%s", user_id, status)
        raise

async def list_enrollments_with_course(
    db: SessionDep, *, user_id: uuid.UUID
) -> list[tuple[CourseEnrollment, Course]]:
    stmt = (
        select(CourseEnrollment, Course)
        .join(Course, Course.id == CourseEnrollment.course_id)
        .where(CourseEnrollment.user_id == user_id)
        .order_by(CourseEnrollment.started_at.desc())
    )
    try:
        rows = (await db.execute(stmt)).all()
        return [(row[0], row[1]) for row in rows]
    except SQLAlchemyError:
        logger.exception("Failed to list enrollments with course: user_id=%s", user_id)
        raise

async def count_lesson_completions(
    db: SessionDep,
    *,
    user_id: uuid.UUID,
    start: datetime | None = None,
    end: datetime | None = None,
    exclude_quiz: bool = False,
) -> int:
    stmt = select(func.count(LessonCompletion.id)).where(LessonCompletion.user_id == user_id)
    if exclude_quiz:
        stmt = stmt.join(Lesson, Lesson.id == LessonCompletion.lesson_id).where(
            Lesson.type != LessonType.QUIZ
        )
    if start is not None:
        stmt = stmt.where(LessonCompletion.completed_at >= start)
    if end is not None:
        stmt = stmt.where(LessonCompletion.completed_at < end)
    try:
        return (await db.execute(stmt)).scalar_one()
    except SQLAlchemyError:
        logger.exception("Failed to count lesson completions: user_id=%s", user_id)
        raise

async def count_passed_quizzes(
    db: SessionDep,
    *,
    user_id: uuid.UUID,
    start: datetime | None = None,
    end: datetime | None = None,
) -> int:
    """Distinct quiz lessons the student has passed at least once."""
    stmt = select(func.count(func.distinct(QuizAttempt.lesson_id))).where(
        QuizAttempt.user_id == user_id, QuizAttempt.passed.is_(True)
    )
    if start is not None:
        stmt = stmt.where(QuizAttempt.created_at >= start)
    if end is not None:
        stmt = stmt.where(QuizAttempt.created_at < end)
    try:
        return (await db.execute(stmt)).scalar_one()
    except SQLAlchemyError:
        logger.exception("Failed to count passed quizzes: user_id=%s", user_id)
        raise

async def list_learning_minutes(
    db: SessionDep, *, user_id: uuid.UUID, start: datetime, end: datetime
) -> list[tuple[datetime, int]]:
    """(completed_at, lesson duration) for every non-quiz lesson completed in range."""
    stmt = (
        select(LessonCompletion.completed_at, Lesson.duration_min)
        .join(Lesson, Lesson.id == LessonCompletion.lesson_id)
        .where(
            LessonCompletion.user_id == user_id,
            Lesson.type != LessonType.QUIZ,
            LessonCompletion.completed_at >= start,
            LessonCompletion.completed_at < end,
        )
    )
    try:
        return [(ts, minutes or 0) for ts, minutes in (await db.execute(stmt)).all()]
    except SQLAlchemyError:
        logger.exception("Failed to list learning minutes: user_id=%s", user_id)
        raise

async def list_challenge_minutes(
    db: SessionDep, *, user_id: uuid.UUID, start: datetime, end: datetime
) -> list[tuple[datetime, int]]:
    """(attempt time, quiz lesson duration) for every quiz attempt in range.

    Each attempt counts — retaking a quiz is time spent on the challenge.
    """
    stmt = (
        select(QuizAttempt.created_at, Lesson.duration_min)
        .join(Lesson, Lesson.id == QuizAttempt.lesson_id)
        .where(
            QuizAttempt.user_id == user_id,
            QuizAttempt.created_at >= start,
            QuizAttempt.created_at < end,
        )
    )
    try:
        return [(ts, minutes or 0) for ts, minutes in (await db.execute(stmt)).all()]
    except SQLAlchemyError:
        logger.exception("Failed to list challenge minutes: user_id=%s", user_id)
        raise

async def lesson_counts_by_course(
    db: SessionDep, *, course_ids: list[uuid.UUID]
) -> dict[uuid.UUID, tuple[int, int]]:
    """course_id -> (total lessons, quiz lessons)."""
    if not course_ids:
        return {}
    quiz_flag = case((Lesson.type == LessonType.QUIZ, 1), else_=0)
    stmt = (
        select(Module.course_id, func.count(Lesson.id), func.coalesce(func.sum(quiz_flag), 0))
        .join(Lesson, Lesson.module_id == Module.id)
        .where(Module.course_id.in_(course_ids))
        .group_by(Module.course_id)
    )
    try:
        rows = (await db.execute(stmt)).all()
        return {cid: (int(total), int(quizzes)) for cid, total, quizzes in rows}
    except SQLAlchemyError:
        logger.exception("Failed to count lessons by course")
        raise

async def completed_lesson_counts_by_course(
    db: SessionDep, *, user_id: uuid.UUID, course_ids: list[uuid.UUID]
) -> dict[uuid.UUID, int]:
    if not course_ids:
        return {}
    stmt = (
        select(Module.course_id, func.count(LessonCompletion.id))
        .join(Lesson, Lesson.id == LessonCompletion.lesson_id)
        .join(Module, Module.id == Lesson.module_id)
        .where(LessonCompletion.user_id == user_id, Module.course_id.in_(course_ids))
        .group_by(Module.course_id)
    )
    try:
        return {cid: int(count) for cid, count in (await db.execute(stmt)).all()}
    except SQLAlchemyError:
        logger.exception("Failed to count completed lessons by course: user_id=%s", user_id)
        raise

async def passed_quiz_counts_by_course(
    db: SessionDep, *, user_id: uuid.UUID, course_ids: list[uuid.UUID]
) -> dict[uuid.UUID, int]:
    if not course_ids:
        return {}
    stmt = (
        select(Module.course_id, func.count(func.distinct(QuizAttempt.lesson_id)))
        .join(Lesson, Lesson.id == QuizAttempt.lesson_id)
        .join(Module, Module.id == Lesson.module_id)
        .where(
            QuizAttempt.user_id == user_id,
            QuizAttempt.passed.is_(True),
            Module.course_id.in_(course_ids),
        )
        .group_by(Module.course_id)
    )
    try:
        return {cid: int(count) for cid, count in (await db.execute(stmt)).all()}
    except SQLAlchemyError:
        logger.exception("Failed to count passed quizzes by course: user_id=%s", user_id)
        raise

async def last_activity_by_course(
    db: SessionDep, *, user_id: uuid.UUID, course_ids: list[uuid.UUID]
) -> dict[uuid.UUID, datetime]:
    """course_id -> most recent lesson completion timestamp for this student."""
    if not course_ids:
        return {}
    stmt = (
        select(Module.course_id, func.max(LessonCompletion.completed_at))
        .join(Lesson, Lesson.id == LessonCompletion.lesson_id)
        .join(Module, Module.id == Lesson.module_id)
        .where(LessonCompletion.user_id == user_id, Module.course_id.in_(course_ids))
        .group_by(Module.course_id)
    )
    try:
        return {cid: ts for cid, ts in (await db.execute(stmt)).all() if ts is not None}
    except SQLAlchemyError:
        logger.exception("Failed to resolve last activity by course: user_id=%s", user_id)
        raise