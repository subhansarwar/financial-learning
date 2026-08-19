# app/schemas/publications/publication.py
import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.publications.publication import PublicationCategory, PublicationStatus


class PublicationListItem(BaseModel):
    id: uuid.UUID
    publication_number: str
    title: str
    category: PublicationCategory
    keywords: list[str]
    author_id: uuid.UUID
    status: PublicationStatus
    view_count: int
    download_count: int
    published_at: datetime | None

    class Config:
        from_attributes = True


class PublicationRead(BaseModel):
    id: uuid.UUID
    publication_number: str
    title: str
    abstract: str
    category: PublicationCategory
    keywords: list[str]
    author_id: uuid.UUID
    co_authors: list[str]
    file_url: str | None
    status: PublicationStatus
    view_count: int
    download_count: int
    review_notes: str | None
    submitted_at: datetime | None
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PublicationCreate(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    abstract: str = Field(min_length=1)
    category: PublicationCategory
    keywords: list[str] = []
    co_authors: list[str] = []


class PublicationUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=300)
    abstract: str | None = Field(default=None, min_length=1)
    category: PublicationCategory | None = None
    keywords: list[str] | None = None
    co_authors: list[str] | None = None


class PublicationFileUploadResponse(BaseModel):
    file_url: str


class ApproveRequest(BaseModel):
    notes: str | None = None


class RejectRequest(BaseModel):
    notes: str = Field(min_length=1)
