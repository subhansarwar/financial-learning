# app/schemas/courses/lesson.py
import uuid

from pydantic import BaseModel, Field

from app.models.courses.lesson import LessonType


class QuizQuestion(BaseModel):
    q: str
    choices: list[str]
    answer: int
    explain: str | None = None


class LessonContentBlock(BaseModel):
    paragraph_title: str | None = Field(default=None, max_length=300)
    paragraph: str = Field(min_length=1)
    order_index: int = Field(default=0, ge=0)


class LessonRead(BaseModel):
    id: uuid.UUID
    module_id: uuid.UUID
    title: str
    type: LessonType
    duration_min: int
    order_index: int
    content: str | None
    video_url: str | None
    quiz_pass_pct: int | None
    quiz_questions: list[QuizQuestion] | None

    summary: str | None
    learning_objectives: list[str] = []
    content_blocks: list[LessonContentBlock] | None

    class Config:
        from_attributes = True


class LessonCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    type: LessonType
    duration_min: int = Field(ge=0)
    order_index: int = 0
    content: str | None = None
    video_url: str | None = None
    quiz_pass_pct: int | None = Field(default=None, ge=0, le=100)
    quiz_questions: list[QuizQuestion] | None = None

    summary: str | None = None
    learning_objectives: list[str] = []
    content_blocks: list[LessonContentBlock] | None = None


class LessonUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    type: LessonType | None = None
    duration_min: int | None = Field(default=None, ge=0)
    order_index: int | None = None
    content: str | None = None
    video_url: str | None = None
    quiz_pass_pct: int | None = Field(default=None, ge=0, le=100)
    quiz_questions: list[QuizQuestion] | None = None

    summary: str | None = None
    learning_objectives: list[str] | None = None
    content_blocks: list[LessonContentBlock] | None = None
