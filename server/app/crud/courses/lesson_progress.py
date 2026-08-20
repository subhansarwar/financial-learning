# app/crud/courses/lesson_progress.py
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.courses.lesson import Lesson
from app.models.courses.lesson_progress import LessonCompletion
from app.models.courses.module import Module


async def get(db: AsyncSession, *, user_id: uuid.UUID, lesson_id: uuid.UUID) -> LessonCompletion | None:
    result = await db.execute(
        select(LessonCompletion).where(
            LessonCompletion.user_id == user_id, LessonCompletion.lesson_id == lesson_id
        )
    )
    return result.scalar_one_or_none()


async def get_or_create(db: AsyncSession, *, user_id: uuid.UUID, lesson_id: uuid.UUID) -> LessonCompletion:
    completion = await get(db, user_id=user_id, lesson_id=lesson_id)
    if completion is not None:
        return completion

    completion = LessonCompletion(user_id=user_id, lesson_id=lesson_id)
    db.add(completion)
    await db.commit()
    await db.refresh(completion)
    return completion


async def list_completed_lesson_ids_for_course(
    db: AsyncSession, *, user_id: uuid.UUID, course_id: uuid.UUID
) -> list[uuid.UUID]:
    result = await db.execute(
        select(LessonCompletion.lesson_id)
        .join(Lesson, Lesson.id == LessonCompletion.lesson_id)
        .join(Module, Module.id == Lesson.module_id)
        .where(LessonCompletion.user_id == user_id, Module.course_id == course_id)
    )
    return list(result.scalars().all())
