# app/schemas/courses/quiz.py
import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.students.enrollment import CourseProgressResponse


class QuizQuestionPublic(BaseModel):
    """A quiz question as shown to a student — the correct answer is withheld."""
    index: int
    q: str
    choices: list[str]


class QuizView(BaseModel):
    """Everything the frontend needs to render a module quiz."""
    lesson_id: uuid.UUID
    module_id: uuid.UUID
    course_id: uuid.UUID
    lesson_title: str
    total_questions: int
    pass_pct: int
    questions: list[QuizQuestionPublic]
    # The student's standing on this quiz so far.
    attempts: int
    best_score_pct: int | None
    passed: bool


class QuizSubmission(BaseModel):
    """Answers parallel to the quiz's questions: answers[i] is the choice index the
    student picked for question i, or null if left blank."""
    answers: list[int | None] = Field(min_length=1)


class QuizAnswerFeedback(BaseModel):
    index: int
    q: str
    your_answer: int | None
    correct_answer: int
    is_correct: bool
    explain: str | None = None


class QuizResult(BaseModel):
    lesson_id: uuid.UUID
    module_id: uuid.UUID
    course_id: uuid.UUID
    attempt_no: int
    total_questions: int
    correct_count: int
    score_pct: int
    pass_pct: int
    passed: bool
    submitted_at: datetime
    best_score_pct: int
    # Per-question breakdown — only returned on submit, not on history reads.
    feedback: list[QuizAnswerFeedback] = []
    # Refreshed course progress when this attempt passed and the quiz lesson was
    # marked complete; null otherwise.
    course_progress: CourseProgressResponse | None = None


class QuizAttemptRead(BaseModel):
    id: uuid.UUID
    lesson_id: uuid.UUID
    attempt_no: int
    total_questions: int
    correct_count: int
    score_pct: int
    pass_pct: int
    passed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ModuleQuizStanding(BaseModel):
    lesson_id: uuid.UUID
    lesson_title: str
    total_questions: int
    pass_pct: int
    attempts: int
    best_score_pct: int | None
    passed: bool


class ModuleQuizSummary(BaseModel):
    module_id: uuid.UUID
    module_title: str
    order_index: int
    has_quiz: bool
    quizzes: list[ModuleQuizStanding]
    # True when the module has at least one quiz and every quiz in it is passed.
    module_passed: bool


class CourseQuizResults(BaseModel):
    course_id: uuid.UUID
    default_pass_pct: int
    total_quiz_modules: int
    passed_quiz_modules: int
    modules: list[ModuleQuizSummary]
