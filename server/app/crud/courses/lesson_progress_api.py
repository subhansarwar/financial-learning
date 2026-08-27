# app/crud/courses/lesson_progress_api.py
import uuid
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.core.deps import SessionDep
from app.models.courses.lesson import Lesson
from app.models.courses.lesson_progress import LessonCompletion
from app.models.courses.module import Module
from app.core.security import logger

async def get_lesson_completion(db: SessionDep, *, user_id: uuid.UUID, lesson_id: uuid.UUID) -> LessonCompletion | None:
    try:
        result = await db.execute(
            select(LessonCompletion).where(
                LessonCompletion.user_id == user_id, LessonCompletion.lesson_id == lesson_id
            )
        )
        return result.scalar_one_or_none()
    except SQLAlchemyError:
        logger.exception(
            "Failed to fetch lesson completion: "
            "user_id=%s lesson_id=%s",
            user_id,
            lesson_id,
        )
        raise


async def create_lesson_completion(db: SessionDep, *, user_id: uuid.UUID, lesson_id: uuid.UUID) -> LessonCompletion:
    completion = await get_lesson_completion(db, user_id=user_id, lesson_id=lesson_id)
    if completion is not None:
        return completion
    completion = LessonCompletion(user_id=user_id, lesson_id=lesson_id)

    try:
        
        db.add(completion)
        await db.commit()
        await db.refresh(completion)
        return completion

    except IntegrityError:
        await db.rollback()

        logger.warning(
            "Integrity error creating lesson completion: "
            "user_id=%s lesson_id=%s",
            user_id,
            lesson_id,
            exc_info=True,
        )

        raise

    except SQLAlchemyError:
        await db.rollback()

        logger.exception(
            "Database error creating lesson completion: "
            "user_id=%s lesson_id=%s",
            user_id,
            lesson_id,
        )

        raise

async def list_completed_lesson_ids_for_course(db: SessionDep, *, user_id: uuid.UUID, course_id: uuid.UUID) -> list[uuid.UUID]:

    try:
        result = await db.execute(
            select(LessonCompletion.lesson_id)
            .join(Lesson, Lesson.id == LessonCompletion.lesson_id)
            .join(Module, Module.id == Lesson.module_id)
            .where(LessonCompletion.user_id == user_id, Module.course_id == course_id)
        )
        return list(result.scalars().all())
    except SQLAlchemyError:
        logger.exception(
            "Failed to list completed lesson IDs: "
            "user_id=%s course_id=%s",
            user_id,
            course_id,
        )

        raise