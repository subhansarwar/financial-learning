# app/schemas/courses/monitoring.py
import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.students.enrollment import EnrollmentStatus


class PaginatedResponse(BaseModel):
    total: int
    skip: int
    limit: int


class StudentSummary(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    enrolled_courses_count: int
    completed_courses_count: int


class StudentListResponse(PaginatedResponse):
    students: list[StudentSummary]


class EnrollmentActivityItem(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    user_email: str
    user_full_name: str
    course_id: uuid.UUID
    course_title: str
    status: EnrollmentStatus
    progress_pct: int
    started_at: datetime
    completed_at: datetime | None


class EnrollmentActivityResponse(PaginatedResponse):
    enrollments: list[EnrollmentActivityItem]


class LessonCompletionActivityItem(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    user_email: str
    user_full_name: str
    lesson_id: uuid.UUID
    lesson_title: str
    course_id: uuid.UUID
    course_title: str
    completed_at: datetime


class LessonCompletionActivityResponse(PaginatedResponse):
    completions: list[LessonCompletionActivityItem]


class StudentDetailResponse(BaseModel):
    student: StudentSummary
    enrollments: list[EnrollmentActivityItem]
    recent_lesson_completions: list[LessonCompletionActivityItem]
