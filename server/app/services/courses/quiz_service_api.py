# app/services/courses/quiz_service_api.py
"""Student-facing quiz grading.

A "module quiz" is simply a lesson inside that module which carries
``quiz_questions``. Submissions are graded immediately against the stored answer
key; a score at or above the pass mark (the lesson's ``quiz_pass_pct``, else
``settings.QUIZ_DEFAULT_PASS_PCT`` = 70) marks the quiz lesson complete and rolls
the course progress forward.
"""
import uuid

from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.deps import SessionDep
from app.core.security import logger
from app.crud.courses import module_api as module_crud
from app.crud.courses import quiz_attempt_api as quiz_crud
from app.crud.courses.lesson_api import get_course_id_for_lesson, list_lessons_by_module
from app.models.courses.lesson import Lesson
from app.models.users.user import User
from app.schemas.courses.quiz import (
    CourseQuizResults,
    ModuleQuizStanding,
    ModuleQuizSummary,
    QuizAnswerFeedback,
    QuizQuestionPublic,
    QuizResult,
    QuizView,
)
from app.services.courses import progress_service_api


class QuizError(Exception):
    """Base class for quiz submission problems that map to 4xx responses."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class NotAQuizLessonError(QuizError):
    """The lesson has no quiz_questions configured."""


class AnswerCountMismatchError(QuizError):
    """The submitted answer list doesn't line up with the question list."""


def pass_mark_for(lesson: Lesson) -> int:
    pct = lesson.quiz_pass_pct
    if pct is None:
        return settings.QUIZ_DEFAULT_PASS_PCT
    return pct


def _questions(lesson: Lesson) -> list[dict]:
    raw = lesson.quiz_questions
    if not raw:
        raise NotAQuizLessonError("This lesson has no quiz")
    return list(raw)


def is_quiz_lesson(lesson: Lesson) -> bool:
    return bool(lesson.quiz_questions)


def _grade(questions: list[dict], answers: list[int | None]) -> tuple[int, list[QuizAnswerFeedback]]:
    if len(answers) != len(questions):
        raise AnswerCountMismatchError(
            f"Expected {len(questions)} answers, got {len(answers)}"
        )

    correct = 0
    feedback: list[QuizAnswerFeedback] = []
    for i, question in enumerate(questions):
        key = question.get("answer")
        picked = answers[i]
        is_correct = picked is not None and picked == key
        if is_correct:
            correct += 1
        feedback.append(
            QuizAnswerFeedback(
                index=i,
                q=question.get("q", ""),
                your_answer=picked,
                correct_answer=key,
                is_correct=is_correct,
                explain=question.get("explain"),
            )
        )
    return correct, feedback


def _score_pct(correct: int, total: int) -> int:
    if total <= 0:
        return 0
    return int(round(correct * 100 / total))


async def get_quiz_view(db: SessionDep, *, user: User, lesson: Lesson) -> QuizView:
    questions = _questions(lesson)
    course_id = await get_course_id_for_lesson(db, lesson.id)

    best = await quiz_crud.get_best_attempt(db, user_id=user.id, lesson_id=lesson.id)
    attempts = await quiz_crud.count_attempts(db, user_id=user.id, lesson_id=lesson.id)

    return QuizView(
        lesson_id=lesson.id,
        module_id=lesson.module_id,
        course_id=course_id,
        lesson_title=lesson.title,
        total_questions=len(questions),
        pass_pct=pass_mark_for(lesson),
        questions=[
            QuizQuestionPublic(index=i, q=q.get("q", ""), choices=list(q.get("choices", [])))
            for i, q in enumerate(questions)
        ],
        attempts=attempts,
        best_score_pct=best.score_pct if best else None,
        passed=bool(best and best.passed),
    )


async def submit_quiz(
    db: SessionDep, *, user: User, lesson: Lesson, answers: list[int | None]
) -> QuizResult:
    questions = _questions(lesson)
    pass_pct = pass_mark_for(lesson)

    correct, feedback = _grade(questions, answers)
    total = len(questions)
    score_pct = _score_pct(correct, total)
    passed = score_pct >= pass_pct

    attempt_no = (await quiz_crud.count_attempts(db, user_id=user.id, lesson_id=lesson.id)) + 1
    attempt = await quiz_crud.create_attempt(
        db,
        user_id=user.id,
        lesson_id=lesson.id,
        attempt_no=attempt_no,
        total_questions=total,
        correct_count=correct,
        score_pct=score_pct,
        pass_pct=pass_pct,
        passed=passed,
        answers=answers,
    )

    course_id = await get_course_id_for_lesson(db, lesson.id)

    course_progress = None
    if passed:
        try:
            course_progress = await progress_service_api.complete_lesson(
                db, user=user, lesson_id=lesson.id
            )
        except progress_service_api.CourseNotFoundForLessonError:
            logger.warning("Quiz passed but lesson %s has no course; skipping completion", lesson.id)
        except SQLAlchemyError:
            logger.exception(
                "Quiz attempt saved but marking lesson %s complete failed for user %s",
                lesson.id,
                user.id,
            )

    best = await quiz_crud.get_best_attempt(db, user_id=user.id, lesson_id=lesson.id)

    return QuizResult(
        lesson_id=lesson.id,
        module_id=lesson.module_id,
        course_id=course_id,
        attempt_no=attempt.attempt_no,
        total_questions=total,
        correct_count=correct,
        score_pct=score_pct,
        pass_pct=pass_pct,
        passed=passed,
        submitted_at=attempt.created_at,
        best_score_pct=best.score_pct if best else score_pct,
        feedback=feedback,
        course_progress=course_progress,
    )


async def get_course_quiz_results(
    db: SessionDep, *, user: User, course_id: uuid.UUID
) -> CourseQuizResults:
    modules = await module_crud.list_for_course(db, course_id)
    best_by_lesson = await quiz_crud.list_best_attempts_for_course(
        db, user_id=user.id, course_id=course_id
    )
    attempts_by_lesson = await quiz_crud.count_attempts_by_lesson_for_course(
        db, user_id=user.id, course_id=course_id
    )

    module_summaries: list[ModuleQuizSummary] = []
    passed_quiz_modules = 0
    total_quiz_modules = 0

    for module in modules:
        lessons = await list_lessons_by_module(db, module.id)
        quiz_lessons = [l for l in lessons if is_quiz_lesson(l)]

        standings: list[ModuleQuizStanding] = []
        for l in quiz_lessons:
            best = best_by_lesson.get(l.id)
            standings.append(
                ModuleQuizStanding(
                    lesson_id=l.id,
                    lesson_title=l.title,
                    total_questions=len(l.quiz_questions or []),
                    pass_pct=pass_mark_for(l),
                    attempts=attempts_by_lesson.get(l.id, 0),
                    best_score_pct=best.score_pct if best else None,
                    passed=bool(best and best.passed),
                )
            )

        has_quiz = len(standings) > 0
        module_passed = has_quiz and all(s.passed for s in standings)
        if has_quiz:
            total_quiz_modules += 1
        if module_passed:
            passed_quiz_modules += 1

        module_summaries.append(
            ModuleQuizSummary(
                module_id=module.id,
                module_title=module.title,
                order_index=module.order_index,
                has_quiz=has_quiz,
                quizzes=standings,
                module_passed=module_passed,
            )
        )

    return CourseQuizResults(
        course_id=course_id,
        default_pass_pct=settings.QUIZ_DEFAULT_PASS_PCT,
        total_quiz_modules=total_quiz_modules,
        passed_quiz_modules=passed_quiz_modules,
        modules=module_summaries,
    )
