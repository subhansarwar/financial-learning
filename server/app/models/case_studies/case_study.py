# app/models/case_studies/case_study.py
import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class CaseStudy(Base):
    __tablename__ = "case_studies"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[str] = mapped_column(String(400), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    industry: Mapped[str | None] = mapped_column(String(100), index=True, nullable=True)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    thumbnail_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    source: Mapped[str | None] = mapped_column(String(500), nullable=True)
    date: Mapped[str | None] = mapped_column(String(100), nullable=True)
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    company_name: Mapped[str | None] = mapped_column(String(200), index=True, nullable=True)
    key_results: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)

    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
