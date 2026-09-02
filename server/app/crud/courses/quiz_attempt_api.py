# app/crud/courses/quiz_attempt_api.py
import uuid

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.core.deps import SessionDep
from app.core.security import logger
from app.models.courses.lesson import Lesson
from app.models.courses.module import Module
from app.models.courses.quiz_attempt import QuizAttempt


async def count_attempts(db: SessionDep, *, user_id: uuid.UUID, lesson_id: uuid.UUID) -> int:
    try:
        result = await db.execute(
            select(func.count(QuizAttempt.id)).where(
                QuizAttempt.user_id == user_id, QuizAttempt.lesson_id == lesson_id
            )
        )
        return result.scalar_one()
    except SQLAlchemyError:
        logger.exception("Failed to count quiz attempts: user_id=%s lesson_id=%s", user_id, lesson_id)
        raise


async def list_attempts_for_lesson(
    db: SessionDep, *, user_id: uuid.UUID, lesson_id: uuid.UUID
) -> list[QuizAttempt]:
    try:
        result = await db.execute(
            select(QuizAttempt)
            .where(QuizAttempt.user_id == user_id, QuizAttempt.lesson_id == lesson_id)
            .order_by(QuizAttempt.attempt_no.desc())
        )
        return list(result.scalars().all())
    except SQLAlchemyError:
        logger.exception("Failed to list quiz attempts: user_id=%s lesson_id=%s", user_id, lesson_id)
        raise


async def get_best_attempt(
    db: SessionDep, *, user_id: uuid.UUID, lesson_id: uuid.UUID
) -> QuizAttempt | None:
    try:
        result = await db.execute(
            select(QuizAttempt)
            .where(QuizAttempt.user_id == user_id, QuizAttempt.lesson_id == lesson_id)
            .order_by(QuizAttempt.score_pct.desc(), QuizAttempt.attempt_no.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()
    except SQLAlchemyError:
        logger.exception("Failed to fetch best quiz attempt: user_id=%s lesson_id=%s", user_id, lesson_id)
        raise


async def list_best_attempts_for_course(
    db: SessionDep, *, user_id: uuid.UUID, course_id: uuid.UUID
) -> dict[uuid.UUID, QuizAttempt]:
    """Best attempt per quiz lesson in the course, keyed by lesson_id."""
    try:
        result = await db.execute(
            select(QuizAttempt)
            .join(Lesson, Lesson.id == QuizAttempt.lesson_id)
            .join(Module, Module.id == Lesson.module_id)
            .where(QuizAttempt.user_id == user_id, Module.course_id == course_id)
            .order_by(QuizAttempt.lesson_id, QuizAttempt.score_pct.desc(), QuizAttempt.attempt_no.desc())
        )
        best: dict[uuid.UUID, QuizAttempt] = {}
        for attempt in result.scalars().all():
            if attempt.lesson_id not in best:
                best[attempt.lesson_id] = attempt
        return best
    except SQLAlchemyError:
        logger.exception(
            "Failed to list best quiz attempts for course: user_id=%s course_id=%s", user_id, course_id
        )
        raise


async def count_attempts_by_lesson_for_course(
    db: SessionDep, *, user_id: uuid.UUID, course_id: uuid.UUID
) -> dict[uuid.UUID, int]:
    try:
        result = await db.execute(
            select(QuizAttempt.lesson_id, func.count(QuizAttempt.id))
            .join(Lesson, Lesson.id == QuizAttempt.lesson_id)
            .join(Module, Module.id == Lesson.module_id)
            .where(QuizAttempt.user_id == user_id, Module.course_id == course_id)
            .group_by(QuizAttempt.lesson_id)
        )
        return {lesson_id: count for lesson_id, count in result.all()}
    except SQLAlchemyError:
        logger.exception(
            "Failed to count quiz attempts for course: user_id=%s course_id=%s", user_id, course_id
        )
        raise


async def create_attempt(
    db: SessionDep,
    *,
    user_id: uuid.UUID,
    lesson_id: uuid.UUID,
    attempt_no: int,
    total_questions: int,
    correct_count: int,
    score_pct: int,
    pass_pct: int,
    passed: bool,
    answers: list[int | None] | None,
) -> QuizAttempt:
    attempt = QuizAttempt(
        user_id=user_id,
        lesson_id=lesson_id,
        attempt_no=attempt_no,
        total_questions=total_questions,
        correct_count=correct_count,
        score_pct=score_pct,
        pass_pct=pass_pct,
        passed=passed,
        answers=answers,
    )
    try:
        db.add(attempt)
        await db.commit()
        await db.refresh(attempt)
        return attempt
    except IntegrityError:
        await db.rollback()
        logger.warning(
            "Integrity error creating quiz attempt: user_id=%s lesson_id=%s", user_id, lesson_id, exc_info=True
        )
        raise
    except SQLAlchemyError:
        await db.rollback()
        logger.exception("Database error creating quiz attempt: user_id=%s lesson_id=%s", user_id, lesson_id)
        raise
