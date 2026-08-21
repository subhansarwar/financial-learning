# app/schemas/case_studies/case_study.py
import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class CaseStudyListItem(BaseModel):
    id: uuid.UUID
    slug: str
    title: str
    summary: str
    industry: str | None
    tags: list[str]
    thumbnail_url: str | None
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CaseStudyRead(BaseModel):
    id: uuid.UUID
    slug: str
    title: str
    summary: str
    content: str
    industry: str | None
    tags: list[str]
    thumbnail_url: str | None
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CaseStudyCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=160, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    title: str = Field(min_length=1, max_length=200)
    summary: str = Field(min_length=1, max_length=400)
    content: str = Field(min_length=1)
    industry: str | None = Field(default=None, max_length=100)
    tags: list[str] = []
    thumbnail_url: str | None = None
    is_published: bool = False


class CaseStudyUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=160, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    title: str | None = Field(default=None, min_length=1, max_length=200)
    summary: str | None = Field(default=None, min_length=1, max_length=400)
    content: str | None = Field(default=None, min_length=1)
    industry: str | None = Field(default=None, max_length=100)
    tags: list[str] | None = None
    thumbnail_url: str | None = None
    is_published: bool | None = None
