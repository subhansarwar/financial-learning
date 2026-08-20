# app/crud/courses/course.py
import uuid

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.courses.course import Course


async def get_by_id(db: AsyncSession, course_id: uuid.UUID) -> Course | None:
    result = await db.execute(select(Course).where(Course.id == course_id))
    return result.scalar_one_or_none()


async def get_by_slug(db: AsyncSession, slug: str) -> Course | None:
    result = await db.execute(select(Course).where(Course.slug == slug))
    return result.scalar_one_or_none()


async def list_courses(
    db: AsyncSession,
    *,
    published_only: bool,
    topic: str | None = None,
    level: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[Course], int]:
    filters = []
    if published_only:
        filters.append(Course.is_published.is_(True))
    if topic:
        filters.append(Course.topic == topic)
    if level:
        filters.append(Course.level == level)
    if search:
        like = f"%{search}%"
        filters.append(or_(Course.title.ilike(like), Course.tagline.ilike(like)))

    count_stmt = select(func.count()).select_from(Course)
    list_stmt = select(Course).order_by(Course.created_at.desc()).offset(skip).limit(limit)
    for f in filters:
        count_stmt = count_stmt.where(f)
        list_stmt = list_stmt.where(f)

    total = (await db.execute(count_stmt)).scalar_one()
    courses = (await db.execute(list_stmt)).scalars().all()
    return list(courses), total


async def create_course(db: AsyncSession, *, created_by: uuid.UUID, **fields) -> Course:
    course = Course(created_by=created_by, **fields)
    db.add(course)
    await db.commit()
    await db.refresh(course)
    return course


async def update_course(db: AsyncSession, course: Course, **fields) -> Course:
    for key, value in fields.items():
        if value is not None:
            setattr(course, key, value)
    await db.commit()
    await db.refresh(course)
    return course


async def delete_course(db: AsyncSession, course: Course) -> None:
    await db.delete(course)
    await db.commit()
