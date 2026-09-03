# app/models/courses/certificate.py
import uuid
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, func, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Certificate(Base):
    __tablename__ = "certificates"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    certificate_number: Mapped[str] = mapped_column(String(40), unique=True, index=True, nullable=False)

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)

    pdf_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    __table_args__ = (UniqueConstraint("user_id", "course_id", name="uq_certificate_user_course"), Index("ix_certificates_user_issued_at", "user_id", "issued_at",),)
