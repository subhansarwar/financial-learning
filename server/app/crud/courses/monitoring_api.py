# app/crud/courses/monitoring.py
import uuid
from datetime import datetime

from sqlalchemy import func, or_, select
from sqlalchemy.exc import SQLAlchemyError
from app.core.deps import SessionDep

from app.models.courses.course import Course
from app.models.courses.enrollment import CourseEnrollment, EnrollmentStatus
from app.models.courses.lesson import Lesson
from app.models.courses.lesson_progress import LessonCompletion
from app.models.courses.module import Module
from app.models.users.user import User
from app.core.security import logger


async def list_students_with_stats(db: SessionDep, *, search: str | None = None, skip: int = 0, limit: int = 50) -> tuple[list[tuple[User, int, int]], int]:
    enrolled_subq = (
        select(func.count(CourseEnrollment.id))
        .where(CourseEnrollment.user_id == User.id)
        .correlate(User)
        .scalar_subquery()
    )
    
    completed_subq = (
        select(func.count(CourseEnrollment.id))
        .where(CourseEnrollment.user_id == User.id, CourseEnrollment.status == EnrollmentStatus.COMPLETED)
        .correlate(User)
        .scalar_subquery()
    )

    filters = [User.is_admin.is_(False)]
    if search:
        like = f"%{search}%"
        filters.append(or_(User.email.ilike(like), User.full_name.ilike(like)))

    try:
        count_stmt = select(func.count()).select_from(User)
        list_stmt = (
            select(User, enrolled_subq, completed_subq).order_by(User.created_at.desc()).offset(skip).limit(limit)
        )
        for f in filters:
            count_stmt = count_stmt.where(f)
            list_stmt = list_stmt.where(f)

        total = (await db.execute(count_stmt)).scalar_one()
        rows = (await db.execute(list_stmt)).all()
        return [(row[0], row[1], row[2]) for row in rows], total

    except SQLAlchemyError:
        logger.exception(
            "Failed to list students with stats: "
            "search=%s skip=%s limit=%s",
            search,
            skip,
            limit,
        )
        raise


async def list_enrollments(
    db: SessionDep,
    *,
    course_id: uuid.UUID | None = None,
    user_id: uuid.UUID | None = None,
    status_filter: EnrollmentStatus | None = None,
    started_from: datetime | None = None,
    started_to: datetime | None = None,
    completed_from: datetime | None = None,
    completed_to: datetime | None = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[tuple[CourseEnrollment, User, Course]], int]:
    filters = []
    if course_id is not None:
        filters.append(CourseEnrollment.course_id == course_id)
    if user_id is not None:
        filters.append(CourseEnrollment.user_id == user_id)
    if status_filter is not None:
        filters.append(CourseEnrollment.status == status_filter)
    if started_from is not None:
        filters.append(CourseEnrollment.started_at >= started_from)
    if started_to is not None:
        filters.append(CourseEnrollment.started_at <= started_to)
    if completed_from is not None:
        filters.append(CourseEnrollment.completed_at >= completed_from)
    if completed_to is not None:
        filters.append(CourseEnrollment.completed_at <= completed_to)

    base = (
        select(CourseEnrollment, User, Course)
        .join(User, User.id == CourseEnrollment.user_id)
        .join(Course, Course.id == CourseEnrollment.course_id)
    )
    try:
        count_stmt = (
            select(func.count())
            .select_from(CourseEnrollment)
            .join(User, User.id == CourseEnrollment.user_id)
            .join(Course, Course.id == CourseEnrollment.course_id)
        )
        list_stmt = base.order_by(CourseEnrollment.started_at.desc()).offset(skip).limit(limit)
        for f in filters:
            count_stmt = count_stmt.where(f)
            list_stmt = list_stmt.where(f)

        total = (await db.execute(count_stmt)).scalar_one()
        rows = (await db.execute(list_stmt)).all()
        return [(row[0], row[1], row[2]) for row in rows], total
    except SQLAlchemyError:
        logger.exception(
            "Failed to list monitored enrollments: "
            "course_id=%s user_id=%s status=%s "
            "skip=%s limit=%s",
            course_id,
            user_id,
            status_filter,
            skip,
            limit,
        )

        raise

async def list_lesson_completions(
    db: SessionDep,
    *,
    course_id: uuid.UUID | None = None,
    user_id: uuid.UUID | None = None,
    lesson_id: uuid.UUID | None = None,
    completed_from: datetime | None = None,
    completed_to: datetime | None = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[tuple[LessonCompletion, User, Lesson, Course]], int]:
    filters = []
    if course_id is not None:
        filters.append(Module.course_id == course_id)
    if user_id is not None:
        filters.append(LessonCompletion.user_id == user_id)
    if lesson_id is not None:
        filters.append(LessonCompletion.lesson_id == lesson_id)
    if completed_from is not None:
        filters.append(LessonCompletion.completed_at >= completed_from)
    if completed_to is not None:
        filters.append(LessonCompletion.completed_at <= completed_to)

    base = (
        select(LessonCompletion, User, Lesson, Course)
        .join(User, User.id == LessonCompletion.user_id)
        .join(Lesson, Lesson.id == LessonCompletion.lesson_id)
        .join(Module, Module.id == Lesson.module_id)
        .join(Course, Course.id == Module.course_id)
    )
    try:
        count_stmt = (
            select(func.count())
            .select_from(LessonCompletion)
            .join(Lesson, Lesson.id == LessonCompletion.lesson_id)
            .join(Module, Module.id == Lesson.module_id)
        )
        list_stmt = base.order_by(LessonCompletion.completed_at.desc()).offset(skip).limit(limit)
        for f in filters:
            count_stmt = count_stmt.where(f)
            list_stmt = list_stmt.where(f)

        total = (await db.execute(count_stmt)).scalar_one()
        rows = (await db.execute(list_stmt)).all()
        return [(row[0], row[1], row[2], row[3]) for row in rows], total
    
    except SQLAlchemyError:
        logger.exception(
            "Failed to list lesson completions: "
            "course_id=%s user_id=%s lesson_id=%s "
            "skip=%s limit=%s",
            course_id,
            user_id,
            lesson_id,
            skip,
            limit,
        )

        raise