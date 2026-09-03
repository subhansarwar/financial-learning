# app/schemas/courses/course.py
import enum
import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.courses.module import ModuleRead

class CourseLevel(str, enum.Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"

class CourseListItem(BaseModel):
    id: uuid.UUID
    slug: str
    title: str
    tagline: str
    topic: str
    level: CourseLevel
    length_min: int
    thumbnail_url: str | None
    instructor_name: str
    is_published: bool

    class Config:
        from_attributes = True

class CourseRead(BaseModel):
    id: uuid.UUID
    slug: str
    title: str
    tagline: str
    description: str | None
    topic: str
    level: CourseLevel
    length_min: int
    thumbnail_url: str | None
    instructor_name: str
    instructor_title: str | None
    instructor_bio: str | None
    outcomes: list[str]
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CourseDetail(CourseRead):
    modules: list[ModuleRead] = []

class CourseCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=160, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    title: str = Field(min_length=1, max_length=200)
    tagline: str = Field(min_length=1, max_length=300)
    description: str | None = None
    topic: str = Field(min_length=1, max_length=100)
    level: CourseLevel
    length_min: int = Field(ge=0)
    thumbnail_url: str | None = None
    instructor_name: str = Field(min_length=1, max_length=150)
    instructor_title: str | None = None
    instructor_bio: str | None = None
    outcomes: list[str] = []
    is_published: bool = False

class CourseUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=160, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    title: str | None = Field(default=None, min_length=1, max_length=200)
    tagline: str | None = Field(default=None, min_length=1, max_length=300)
    description: str | None = None
    topic: str | None = Field(default=None, min_length=1, max_length=100)
    level: CourseLevel | None = None
    length_min: int | None = Field(default=None, ge=0)
    thumbnail_url: str | None = None
    instructor_name: str | None = Field(default=None, min_length=1, max_length=150)
    instructor_title: str | None = None
    instructor_bio: str | None = None
    outcomes: list[str] | None = None
    is_published: bool | None = None