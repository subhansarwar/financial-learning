# app/schemas/courses/enrollment.py
import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.courses.enrollment import EnrollmentStatus


class EnrollmentRead(BaseModel):
    id: uuid.UUID
    course_id: uuid.UUID
    status: EnrollmentStatus
    progress_pct: int
    started_at: datetime
    completed_at: datetime | None

    class Config:
        from_attributes = True


class CourseProgressResponse(BaseModel):
    course_id: uuid.UUID
    status: EnrollmentStatus
    progress_pct: int
    total_lessons: int
    completed_lessons: int
    completed_lesson_ids: list[uuid.UUID]
