# app/models/media/media_asset.py
import enum
import uuid
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class MediaKind(str, enum.Enum):
    """Which upload API a row belongs to."""
    IMAGE = "image"
    VIDEO = "video"


class MediaContainer(str, enum.Enum):
    """Logical bucket the asset is used in — chosen by the admin on upload.

    WEBSITE          -> "Website"
    COURSE_MATERIAL  -> "Course Material"
    CASE_STUDIES     -> "Case Studies"
    """
    WEBSITE = "website"
    COURSE_MATERIAL = "course_material"
    CASE_STUDIES = "case_studies"


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    kind: Mapped[MediaKind] = mapped_column(Enum(MediaKind, name="media_kind"), nullable=False, index=True)
    container: Mapped[MediaContainer] = mapped_column(
        Enum(MediaContainer, name="media_container"), nullable=False, index=True
    )

    title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    alt_text: Mapped[str | None] = mapped_column(String(400), nullable=True)
    original_filename: Mapped[str | None] = mapped_column(String(400), nullable=True)

    storage_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    file_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    content_type: Mapped[str] = mapped_column(String(150), nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)

    uploaded_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
