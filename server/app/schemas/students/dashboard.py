# app/schemas/students/dashboard.py
"""Response models for the student dashboard.

The platform has no time-tracking or calendar tables, so "time spent",
"spent hours", "upcoming tasks" and "upcoming agenda" are *derived*:

* learning time  = duration of the non-quiz lessons the student has completed
* challenge time = duration of the quiz lesson behind every quiz attempt
* upcoming work  = the next not-yet-completed lessons of the student's
  in-progress courses, in curriculum order (agenda spreads them over a
  suggested one-lesson-per-day study plan).
"""
import enum
import uuid
from datetime import date, datetime

from pydantic import BaseModel

from app.models.courses.lesson import LessonType
from app.models.students.enrollment import EnrollmentStatus
from app.schemas.courses.course import CourseLevel


class DashboardPeriod(str, enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class AgendaView(str, enum.Enum):
    DAY = "day"
    WEEK = "week"
    MONTH = "month"


class DateRange(BaseModel):
    start: datetime
    end: datetime


# --- summary -----------------------------------------------------------------

class DashboardStats(BaseModel):
    # Current standing (not period scoped).
    courses_enrolled: int
    courses_in_progress: int
    courses_completed: int
    # Scoped to the selected period.
    lessons_completed: int
    quizzes_completed: int
    time_spent_minutes: int
    time_spent_label: str


class SpentHoursBucket(BaseModel):
    label: str
    start: datetime
    end: datetime
    learning_minutes: int
    challenge_minutes: int
    learning_hours: float
    challenge_hours: float
    total_hours: float


class SpentHoursPeak(BaseModel):
    label: str | None = None
    hours: float = 0.0
    duration_label: str = "0:00 Hours"


class SpentHours(BaseModel):
    buckets: list[SpentHoursBucket]
    total_hours: float
    peak: SpentHoursPeak


class DashboardMetric(BaseModel):
    key: str
    label: str
    value: float
    delta_pct: float
    trend: str  # "up" | "down" | "flat"


class RecentActivityItem(BaseModel):
    course_id: uuid.UUID
    slug: str
    title: str
    instructor_name: str
    thumbnail_url: str | None
    status: EnrollmentStatus
    progress_pct: int
    last_activity_at: datetime | None


class DashboardSummaryResponse(BaseModel):
    period: DashboardPeriod
    range: DateRange
    stats: DashboardStats
    spent_hours: SpentHours
    metrics: list[DashboardMetric]
    recent_activity: list[RecentActivityItem]


# --- my courses ------------------------------------------------------------

class MyCourseItem(BaseModel):
    enrollment_id: uuid.UUID
    course_id: uuid.UUID
    slug: str
    title: str
    tagline: str
    topic: str
    level: CourseLevel
    thumbnail_url: str | None
    instructor_name: str
    instructor_title: str | None
    length_min: int
    is_published: bool
    status: EnrollmentStatus
    progress_pct: int
    total_lessons: int
    completed_lessons: int
    total_quizzes: int
    passed_quizzes: int
    started_at: datetime
    completed_at: datetime | None
    last_activity_at: datetime | None
    created_at: datetime


class MyCoursesResponse(BaseModel):
    total: int
    in_progress: int
    completed: int
    courses: list[MyCourseItem]


# --- upcoming tasks --------------------------------------------------------

class UpcomingTaskItem(BaseModel):
    lesson_id: uuid.UUID
    course_id: uuid.UUID
    course_slug: str
    course_title: str
    course_topic: str
    module_id: uuid.UUID
    module_title: str
    title: str
    type: LessonType
    activity: str  # "Course" | "Challenge"
    duration_min: int
    lesson_number: int
    lesson_label: str  # e.g. "Lesson 4"
    course_progress_pct: int
    instructor_name: str


class UpcomingTasksResponse(BaseModel):
    total: int
    tasks: list[UpcomingTaskItem]


# --- upcoming agenda -----------------------------------------------------

class AgendaItem(BaseModel):
    lesson_id: uuid.UUID
    course_id: uuid.UUID
    course_slug: str
    course_title: str
    title: str
    subtitle: str
    type: LessonType
    activity: str  # "Course" | "Challenge"
    field_label: str  # "Progress" | "Category"
    field_value: str
    duration_min: int
    duration_label: str  # e.g. "60 min"
    scheduled_start: datetime
    scheduled_end: datetime


class AgendaDay(BaseModel):
    date: date
    items: list[AgendaItem]


class UpcomingAgendaResponse(BaseModel):
    start: date
    end: date
    view: AgendaView
    # These slots are an auto-generated study plan, not user-scheduled events.
    generated: bool
    items: list[AgendaItem]
    days: list[AgendaDay]
