# app/crud/courses/module.py
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.courses.module import Module


async def get_by_id(db: AsyncSession, module_id: uuid.UUID) -> Module | None:
    result = await db.execute(select(Module).where(Module.id == module_id))
    return result.scalar_one_or_none()


async def list_for_course(db: AsyncSession, course_id: uuid.UUID) -> list[Module]:
    result = await db.execute(
        select(Module).where(Module.course_id == course_id).order_by(Module.order_index)
    )
    return list(result.scalars().all())


async def create_module(db: AsyncSession, *, course_id: uuid.UUID, **fields) -> Module:
    module = Module(course_id=course_id, **fields)
    db.add(module)
    await db.commit()
    await db.refresh(module)
    return module


async def update_module(db: AsyncSession, module: Module, **fields) -> Module:
    for key, value in fields.items():
        if value is not None:
            setattr(module, key, value)
    await db.commit()
    await db.refresh(module)
    return module


async def delete_module(db: AsyncSession, module: Module) -> None:
    await db.delete(module)
    await db.commit()
