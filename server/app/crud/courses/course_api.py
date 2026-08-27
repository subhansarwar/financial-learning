# app/crud/courses/course_api.py
import uuid
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.core.deps import SessionDep
from app.models.courses.course import Course
from app.core.security import logger

async def get_course_by_id(db: SessionDep, course_id: uuid.UUID) -> Course | None:
    try:
        result = await db.execute(select(Course).where(Course.id == course_id))
        return result.scalar_one_or_none()
    except SQLAlchemyError:
        logger.exception("Failed to fetch course: course_id=%s", course_id,)
        raise

async def get_course_by_slug(db: SessionDep, slug: str) -> Course | None:
    slug = slug.strip().lower()

    if not slug:
        return None

    try:
        result = await db.execute(select(Course).where(Course.slug == slug))
        return result.scalar_one_or_none()
    except SQLAlchemyError:
        logger.exception("Failed to fetch course by slug: slug=%s", slug,)
        raise


    
async def list_all_courses(
    db: SessionDep,
    *,
    published_only: bool,
    topic: str | None = None,
    level: str | None = None,
    search: str | None = None,
    skip: int = 0, limit: int = 20,) -> tuple[list[Course], int]:

    if skip < 0:
        raise ValueError("skip cannot be negative")

    if limit < 1:
        raise ValueError("limit must be greater than 0")

    
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

    try:
        count_stmt = select(func.count()).select_from(Course)
        list_stmt = select(Course).order_by(Course.created_at.desc()).offset(skip).limit(limit)
        for f in filters:
            count_stmt = count_stmt.where(f)
            list_stmt = list_stmt.where(f)

        total = (await db.execute(count_stmt)).scalar_one()
        courses = (await db.execute(list_stmt)).scalars().all()
        return list(courses), total
    except SQLAlchemyError:
        logger.exception(
            "Failed to list courses: "
            "published_only=%s topic=%s level=%s search=%s " 
            "skip=%s limit=%s", 
            published_only, topic, level, search, skip, limit,
        )
        raise

async def create_course(db: SessionDep, *, created_by: uuid.UUID, **fields) -> Course:
    course = Course(created_by=created_by, **fields)
    try:
        db.add(course)
        await db.commit()
        await db.refresh(course)
        return course

    except IntegrityError:
        await db.rollback()

        logger.warning(
            "Integrity error creating course: created_by=%s",
            created_by,
            exc_info=True,
        )

        raise

async def update_course(db: SessionDep, course: Course, **fields) -> Course:
    try:
        for key, value in fields.items():
            if value is not None:
                setattr(course, key, value)
        await db.commit()
        await db.refresh(course)
        return course
    except IntegrityError:
        await db.rollback()
        logger.warning("Integrity error updating course: course_id=%s", course.id, exc_info=True,)
        raise
    except SQLAlchemyError:
        await db.rollback()
        logger.exception("Database error updating course: course_id=%s", course.id,)
        raise

async def delete_course(db: SessionDep, course: Course) -> None:
    try:
        await db.delete(course)
        await db.flush()
    except SQLAlchemyError:
        await db.rollback()
        logger.exception("Database error deleting course: course_id=%s", course.id,)
        raise