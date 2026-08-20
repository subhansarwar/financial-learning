# app/schemas/courses/module.py
import uuid

from pydantic import BaseModel, Field

from app.schemas.courses.lesson import LessonRead


class ModuleRead(BaseModel):
    id: uuid.UUID
    course_id: uuid.UUID
    title: str
    order_index: int
    lessons: list[LessonRead] = []

    class Config:
        from_attributes = True


class ModuleCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    order_index: int = 0


class ModuleUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    order_index: int | None = None
