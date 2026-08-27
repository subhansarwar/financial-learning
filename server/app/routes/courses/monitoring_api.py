# app/routes/courses/monitoring.py
import uuid
from datetime import date, datetime, time, timedelta, timezone
from fastapi import APIRouter, HTTPException, Query, status
from app.core.deps import CurrentAdmin, SessionDep
from app.crud.courses import monitoring_api as monitoring_crud
from app.crud.users.user_api import get_by_id
from app.models.courses.enrollment import EnrollmentStatus
from app.schemas.courses.monitoring import (
    EnrollmentActivityItem,
    EnrollmentActivityResponse,
    LessonCompletionActivityItem,
    LessonCompletionActivityResponse,
    StudentDetailResponse,
    StudentListResponse,
    StudentSummary,
)

router = APIRouter()

def _resolve_range(
    on_date: date | None, date_from: datetime | None, date_to: datetime | None
) -> tuple[datetime | None, datetime | None]:
    """A single `on_date` (e.g. "which students finished a course today") takes
    precedence over an explicit from/to range when both are supplied."""
    if on_date is not None:
        start = datetime.combine(on_date, time.min, tzinfo=timezone.utc)
        end = start + timedelta(days=1)
        return start, end
    return date_from, date_to

def _student_summary(user, enrolled_count: int, completed_count: int) -> StudentSummary:
    return StudentSummary(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_verified=user.is_verified,
        created_at=user.created_at,
        enrolled_courses_count=enrolled_count,
        completed_courses_count=completed_count,
    )

def _enrollment_item(enrollment, user, course) -> EnrollmentActivityItem:
    return EnrollmentActivityItem(
        id=enrollment.id,
        user_id=user.id,
        user_email=user.email,
        user_full_name=user.full_name,
        course_id=course.id,
        course_title=course.title,
        status=enrollment.status,
        progress_pct=enrollment.progress_pct,
        started_at=enrollment.started_at,
        completed_at=enrollment.completed_at,
    )

def _lesson_completion_item(completion, user, lesson, course) -> LessonCompletionActivityItem:
    return LessonCompletionActivityItem(
        id=completion.id,
        user_id=user.id,
        user_email=user.email,
        user_full_name=user.full_name,
        lesson_id=lesson.id,
        lesson_title=lesson.title,
        course_id=course.id,
        course_title=course.title,
        completed_at=completion.completed_at,
    )

@router.get("/students", response_model=StudentListResponse)
async def list_students(
    db: SessionDep,
    _admin: CurrentAdmin,
    q: str | None = Query(default=None, description="Search by email or name"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
) -> StudentListResponse:
    rows, total = await monitoring_crud.list_students_with_stats(db, search=q, skip=skip, limit=limit)
    return StudentListResponse(
        total=total,
        skip=skip,
        limit=limit,
        students=[_student_summary(user, enrolled, completed) for user, enrolled, completed in rows],
    )


@router.get("/students/{user_id}", response_model=StudentDetailResponse)
async def get_student_detail(user_id: uuid.UUID, db: SessionDep, _admin: CurrentAdmin) -> StudentDetailResponse:
    student_user = await get_by_id(db, user_id)
    if student_user is None or student_user.is_admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    enrollments, _ = await monitoring_crud.list_enrollments(db, user_id=user_id, skip=0, limit=200)
    completed_count = sum(1 for e, _, _ in enrollments if e.status == EnrollmentStatus.COMPLETED)

    completions, _ = await monitoring_crud.list_lesson_completions(db, user_id=user_id, skip=0, limit=50)

    return StudentDetailResponse(
        student=_student_summary(student_user, len(enrollments), completed_count),
        enrollments=[_enrollment_item(e, u, c) for e, u, c in enrollments],
        recent_lesson_completions=[_lesson_completion_item(lc, u, l, c) for lc, u, l, c in completions],
    )


@router.get("/enrollments", response_model=EnrollmentActivityResponse)
async def list_enrollments(
    db: SessionDep,
    _admin: CurrentAdmin,
    course_id: uuid.UUID | None = Query(default=None),
    user_id: uuid.UUID | None = Query(default=None),
    status_filter: EnrollmentStatus | None = Query(default=None, alias="status"),
    on_date: date | None = Query(default=None, description="Filter to enrollments completed on this UTC date"),
    date_from: datetime | None = Query(default=None, description="completed_at >= this instant"),
    date_to: datetime | None = Query(default=None, description="completed_at < this instant"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
) -> EnrollmentActivityResponse:
    completed_from, completed_to = _resolve_range(on_date, date_from, date_to)
    rows, total = await monitoring_crud.list_enrollments(
        db,
        course_id=course_id,
        user_id=user_id,
        status_filter=status_filter,
        completed_from=completed_from,
        completed_to=completed_to,
        skip=skip,
        limit=limit,
    )
    return EnrollmentActivityResponse(
        total=total, skip=skip, limit=limit, enrollments=[_enrollment_item(e, u, c) for e, u, c in rows]
    )


@router.get("/activity", response_model=LessonCompletionActivityResponse)
async def list_activity(
    db: SessionDep,
    _admin: CurrentAdmin,
    course_id: uuid.UUID | None = Query(default=None),
    user_id: uuid.UUID | None = Query(default=None),
    lesson_id: uuid.UUID | None = Query(default=None),
    on_date: date | None = Query(default=None, description="Filter to activity on this UTC date"),
    date_from: datetime | None = Query(default=None, description="completed_at >= this instant"),
    date_to: datetime | None = Query(default=None, description="completed_at < this instant"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
) -> LessonCompletionActivityResponse:
    completed_from, completed_to = _resolve_range(on_date, date_from, date_to)
    rows, total = await monitoring_crud.list_lesson_completions(
        db,
        course_id=course_id,
        user_id=user_id,
        lesson_id=lesson_id,
        completed_from=completed_from,
        completed_to=completed_to,
        skip=skip,
        limit=limit,
    )
    return LessonCompletionActivityResponse(
        total=total, skip=skip, limit=limit, completions=[_lesson_completion_item(lc, u, l, c) for lc, u, l, c in rows]
    )
