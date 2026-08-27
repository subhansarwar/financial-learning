# app/crud/courses/module.py
import uuid
from typing import Any
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.core.deps import SessionDep
from app.models.courses.module import Module
from app.core.security import logger

async def get_by_module_id(db: SessionDep, module_id: uuid.UUID) -> Module | None:
    try:
        result = await db.execute(select(Module).where(Module.id == module_id))
        return result.scalar_one_or_none()
    except SQLAlchemyError: 
        logger.exception( "Failed to fetch module: module_id=%s", module_id, ) 
        raise

async def list_for_course(db: SessionDep, course_id: uuid.UUID) -> list[Module]:
    try:
        result = await db.execute(select(Module).where(Module.course_id == course_id).order_by(Module.order_index))
        return list(result.scalars().all())
    except SQLAlchemyError: 
        logger.exception( "Failed to list modules for course: course_id=%s", course_id, ) 
        raise

async def create_module(db: SessionDep, *, course_id: uuid.UUID, fields: dict[str, Any],) -> Module:
    module = Module(course_id=course_id, **fields)
    try:
        db.add(module)
        await db.commit()
        await db.refresh(module)
        return module

    except IntegrityError: 
        await db.rollback() 
        logger.warning( "Integrity error creating module: course_id=%s", course_id, exc_info=True, ) 
        raise

    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Database error creating module: course_id=%s", course_id, ) 
        raise

async def update_module(db: SessionDep, module: Module,  fields: dict[str, Any]) -> Module:

    try:
        for key, value in fields.items():
            if value is not None:
                setattr(module, key, value)
        await db.commit()
        await db.refresh(module)
        return module

    except IntegrityError: 
        await db.rollback() 
        logger.warning( "Integrity error updating module: module_id=%s", module.id, exc_info=True, ) 
        raise 

    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Database error updating module: module_id=%s", module.id, ) 
        raise

async def delete_module(db: SessionDep, module: Module) -> None:
    try: 
        await db.delete(module) 
        await db.flush() 
    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Database error deleting module: module_id=%s", module.id, ) 
        raise
