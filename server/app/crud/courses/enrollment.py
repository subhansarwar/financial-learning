# app/crud/courses/enrollment.py
import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.courses.enrollment import CourseEnrollment, EnrollmentStatus


async def get(db: AsyncSession, *, user_id: uuid.UUID, course_id: uuid.UUID) -> CourseEnrollment | None:
    result = await db.execute(
        select(CourseEnrollment).where(
            CourseEnrollment.user_id == user_id, CourseEnrollment.course_id == course_id
        )
    )
    return result.scalar_one_or_none()


async def list_for_user(db: AsyncSession, user_id: uuid.UUID) -> list[CourseEnrollment]:
    result = await db.execute(
        select(CourseEnrollment)
        .where(CourseEnrollment.user_id == user_id)
        .order_by(CourseEnrollment.started_at.desc())
    )
    return list(result.scalars().all())


async def get_or_create(db: AsyncSession, *, user_id: uuid.UUID, course_id: uuid.UUID) -> CourseEnrollment:
    enrollment = await get(db, user_id=user_id, course_id=course_id)
    if enrollment is not None:
        return enrollment

    enrollment = CourseEnrollment(user_id=user_id, course_id=course_id)
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)
    return enrollment


async def update_progress(db: AsyncSession, enrollment: CourseEnrollment, *, progress_pct: int) -> CourseEnrollment:
    enrollment.progress_pct = progress_pct
    await db.commit()
    await db.refresh(enrollment)
    return enrollment


async def mark_completed(db: AsyncSession, enrollment: CourseEnrollment) -> CourseEnrollment:
    enrollment.status = EnrollmentStatus.COMPLETED
    enrollment.progress_pct = 100
    enrollment.completed_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(enrollment)
    return enrollment
