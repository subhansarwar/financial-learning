# app/models/courses/quiz_attempt.py
import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class QuizAttempt(Base):
    """One graded submission of a quiz lesson by a student.

    Retakes are allowed — every submission is stored as its own row. The "mark for
    the module" surfaced to the student is the best ``score_pct`` across their
    attempts for that quiz lesson.
    """
    __tablename__ = "quiz_attempts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    lesson_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True
    )

    attempt_no: Mapped[int] = mapped_column(Integer, nullable=False)

    total_questions: Mapped[int] = mapped_column(Integer, nullable=False)
    correct_count: Mapped[int] = mapped_column(Integer, nullable=False)
    score_pct: Mapped[int] = mapped_column(Integer, nullable=False)
    pass_pct: Mapped[int] = mapped_column(Integer, nullable=False)
    passed: Mapped[bool] = mapped_column(Boolean, nullable=False)

    # Parallel array to the lesson's quiz_questions: the choice index the student
    # picked for each question (null = left blank).
    answers: Mapped[list[int | None] | None] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
