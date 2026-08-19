# app/crud/courses/lesson.py
import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.courses.course import Course
from app.models.courses.module import Module
from app.models.courses.lesson import Lesson


async def get_by_id(db: AsyncSession, lesson_id: uuid.UUID) -> Lesson | None:
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    return result.scalar_one_or_none()


async def list_for_module(db: AsyncSession, module_id: uuid.UUID) -> list[Lesson]:
    result = await db.execute(
        select(Lesson).where(Lesson.module_id == module_id).order_by(Lesson.order_index)
    )
    return list(result.scalars().all())


async def list_for_course(db: AsyncSession, course_id: uuid.UUID) -> list[Lesson]:
    result = await db.execute(
        select(Lesson)
        .join(Module, Module.id == Lesson.module_id)
        .where(Module.course_id == course_id)
        .order_by(Module.order_index, Lesson.order_index)
    )
    return list(result.scalars().all())


async def count_for_course(db: AsyncSession, course_id: uuid.UUID) -> int:
    result = await db.execute(
        select(func.count())
        .select_from(Lesson)
        .join(Module, Module.id == Lesson.module_id)
        .where(Module.course_id == course_id)
    )
    return result.scalar_one()


async def get_course_id_for_lesson(db: AsyncSession, lesson_id: uuid.UUID) -> uuid.UUID | None:
    result = await db.execute(
        select(Course.id)
        .join(Module, Module.course_id == Course.id)
        .join(Lesson, Lesson.module_id == Module.id)
        .where(Lesson.id == lesson_id)
    )
    return result.scalar_one_or_none()


async def create_lesson(db: AsyncSession, *, module_id: uuid.UUID, **fields) -> Lesson:
    lesson = Lesson(module_id=module_id, **fields)
    db.add(lesson)
    await db.commit()
    await db.refresh(lesson)
    return lesson


async def update_lesson(db: AsyncSession, lesson: Lesson, **fields) -> Lesson:
    for key, value in fields.items():
        if value is not None:
            setattr(lesson, key, value)
    await db.commit()
    await db.refresh(lesson)
    return lesson


async def delete_lesson(db: AsyncSession, lesson: Lesson) -> None:
    await db.delete(lesson)
    await db.commit()
