# app/crud/courses/lesson_api.py
import uuid
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.core.deps import SessionDep
from app.models.courses.course import Course
from app.models.courses.module import Module
from app.models.courses.lesson import Lesson
from app.core.security import logger

async def get_lesson_by_id(db: SessionDep, lesson_id: uuid.UUID) -> Lesson | None:
    try:
        result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
        return result.scalar_one_or_none()
    except SQLAlchemyError: 
        logger.exception( "Failed to fetch lesson: lesson_id=%s", lesson_id, ) 
        raise

async def list_lessons_by_module(db: SessionDep, module_id: uuid.UUID) -> list[Lesson]:
    try:
        result = await db.execute(
            select(Lesson).where(Lesson.module_id == module_id).order_by(Lesson.order_index)
        )
        return list(result.scalars().all())
    except SQLAlchemyError: 
        logger.exception( "Failed to list lessons for module: module_id=%s", module_id, ) 
        raise

async def list_lessons_by_course(db: SessionDep, course_id: uuid.UUID) -> list[Lesson]:
    try:
        result = await db.execute(
            select(Lesson)
            .join(Module, Module.id == Lesson.module_id)
            .where(Module.course_id == course_id)
            .order_by(Module.order_index, Lesson.order_index)
        )
        return list(result.scalars().all())
    except SQLAlchemyError: 
        logger.exception( "Failed to list lessons for course: course_id=%s", course_id, ) 
        raise

async def count_lessons_for_course(db: SessionDep, course_id: uuid.UUID) -> int:
    try:
        result = await db.execute(
            select(func.count(Lesson.id))
            .select_from(Lesson)
            .join(Module, Module.id == Lesson.module_id)
            .where(Module.course_id == course_id)
        )
        return result.scalar_one()
    except SQLAlchemyError: 
        logger.exception( "Failed to count lessons for course: course_id=%s", course_id, ) 
        raise

async def get_course_id_for_lesson(db: SessionDep, lesson_id: uuid.UUID) -> uuid.UUID | None:
    try:
        result = await db.execute(
            select(Course.id)
            .join(Module, Module.course_id == Course.id)
            .join(Lesson, Lesson.module_id == Module.id)
            .where(Lesson.id == lesson_id)
        )
        return result.scalar_one_or_none()
    except SQLAlchemyError: 
        logger.exception( "Failed to resolve course for lesson: lesson_id=%s", lesson_id, ) 
        raise

async def create_lesson(db: SessionDep, *, module_id: uuid.UUID, **fields) -> Lesson:
    lesson = Lesson(module_id=module_id, **fields)
    try:  
        db.add(lesson)
        await db.commit()
        await db.refresh(lesson)
        return lesson

    except IntegrityError: 
        await db.rollback() 
        logger.warning( "Integrity error creating lesson: module_id=%s", module_id, exc_info=True, ) 
        raise

    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Database error creating lesson: module_id=%s", module_id, ) 
        raise
    

async def update_lesson(db: SessionDep, lesson: Lesson, **fields) -> Lesson:
    try:
        for key, value in fields.items():
            if value is not None:
                setattr(lesson, key, value)
        await db.commit()
        await db.refresh(lesson)
        return lesson
    except IntegrityError: 
        await db.rollback() 
        logger.warning( "Integrity error updating lesson: lesson_id=%s", lesson.id, exc_info=True, ) 
        raise 
    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Database error updating lesson: lesson_id=%s", lesson.id, ) 
        raise

async def delete_lesson(db: SessionDep, lesson: Lesson) -> None:
    try:
        await db.delete(lesson)
        await db.commit()

    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Database error deleting lesson: lesson_id=%s", lesson.id, ) 
        raise
