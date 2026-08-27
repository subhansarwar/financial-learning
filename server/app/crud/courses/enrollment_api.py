# app/crud/courses/enrollment.py
import uuid
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.core.deps import SessionDep
from app.models.courses.enrollment import CourseEnrollment, EnrollmentStatus
from app.core.security import logger

async def get_enrollment_by_user_and_course(db: SessionDep, *, user_id: uuid.UUID, course_id: uuid.UUID) -> CourseEnrollment | None:
    try:
        result = await db.execute(
            select(CourseEnrollment).where(
                CourseEnrollment.user_id == user_id, CourseEnrollment.course_id == course_id
            )
        )
        return result.scalar_one_or_none()
    except SQLAlchemyError:
        logger.exception(
            "Failed to fetch enrollment: user_id=%s course_id=%s",
            user_id,
            course_id,
        )
        raise

async def list_enrollments_by_user(db: SessionDep, user_id: uuid.UUID) -> list[CourseEnrollment]:
    try:
        result = await db.execute(
            select(CourseEnrollment)
            .where(CourseEnrollment.user_id == user_id)
            .order_by(CourseEnrollment.started_at.desc())
        )
        return list(result.scalars().all())
    except SQLAlchemyError:
        logger.exception("Failed to list enrollments: user_id=%s", user_id,)
        raise


async def create_enrollement(db: SessionDep, *, user_id: uuid.UUID, course_id: uuid.UUID) -> CourseEnrollment:
    enrollment = await get_enrollment_by_user_and_course(db, user_id=user_id, course_id=course_id)
    if enrollment is not None:
        return enrollment

    enrollment = CourseEnrollment(user_id=user_id, course_id=course_id)
    try:
        db.add(enrollment)
        await db.commit()
        await db.refresh(enrollment)
        return enrollment

    except IntegrityError:
        await db.rollback()
        logger.warning("Integrity error creating enrollment: "
            "user_id=%s course_id=%s", user_id, course_id, exc_info=True, )
        raise

    except SQLAlchemyError:
        await db.rollback()
        logger.exception("Database error creating enrollment: "
            "user_id=%s course_id=%s", user_id, course_id, )
        raise


async def update_progress(db: SessionDep, enrollment: CourseEnrollment, *, progress_pct: int) -> CourseEnrollment:
    if not 0 <= progress_pct <= 100:
        raise ValueError("progress_pct must be between 0 and 100")

    try:
        enrollment.progress_pct = progress_pct
        await db.commit()
        await db.refresh(enrollment)
        return enrollment

    except SQLAlchemyError:
        await db.rollback()
        logger.exception(
            "Failed to update enrollment progress: "
            "enrollment_id=%s progress_pct=%s", enrollment.id, progress_pct,)
        raise

async def mark_completed(db: SessionDep, enrollment: CourseEnrollment) -> CourseEnrollment:
    if enrollment.status == EnrollmentStatus.COMPLETED:
        return enrollment

    try:
        enrollment.status = EnrollmentStatus.COMPLETED
        enrollment.progress_pct = 100
        enrollment.completed_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(enrollment)
        return enrollment
    except SQLAlchemyError:
        await db.rollback()
        logger.exception("Failed to mark enrollment completed: "
            "enrollment_id=%s", enrollment.id,)
        raise