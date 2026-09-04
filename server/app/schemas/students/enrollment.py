# app/schemas/courses/enrollment.py
import uuid
from datetime import datetime
from pydantic import BaseModel
from app.models.students.enrollment import EnrollmentStatus

class EnrollmentRead(BaseModel):
    id: uuid.UUID
    course_id: uuid.UUID
    status: EnrollmentStatus
    progress_pct: int
    started_at: datetime
    completed_at: datetime | None

    class Config:
        from_attributes = True

class ModuleProgress(BaseModel):
    module_id: uuid.UUID
    title: str
    order_index: int
    lessons_total: int
    lessons_completed: int
    # True once every lesson in the module is completed by this student.
    completed: bool

class CourseProgressResponse(BaseModel):
    course_id: uuid.UUID
    status: EnrollmentStatus
    progress_pct: int
    total_lessons: int
    completed_lessons: int
    completed_lesson_ids: list[uuid.UUID]
    modules: list[ModuleProgress] = []