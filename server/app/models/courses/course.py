# app/models/courses/admin_course.py
import uuid
from datetime import datetime
from sqlalchemy import JSON, Boolean, DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from app.schemas.courses.course import CourseLevel

class Course(Base):
    __tablename__ = "courses"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    tagline: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    topic: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    level: Mapped[CourseLevel] = mapped_column(Enum(CourseLevel, name="course_level"), nullable=False)
    length_min: Mapped[int] = mapped_column(Integer, nullable=False)
    thumbnail_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    instructor_name: Mapped[str] = mapped_column(String(150), nullable=False)
    instructor_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    instructor_bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    outcomes: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)

    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)