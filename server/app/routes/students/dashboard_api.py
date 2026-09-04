# app/routes/students/dashboard_api.py
"""Student dashboard endpoints — the data behind the user panel's Dashboard,
My Courses, Upcoming Tasks and Upcoming Agenda screens.

All figures are read-only and scoped to the authenticated student. "Time spent",
"spent hours", tasks and agenda are derived from the student's real lesson
completions and quiz attempts (there is no time-log or calendar table).
"""
from datetime import date

from fastapi import APIRouter, Query

from app.core.deps import CurrentUser, SessionDep
from app.schemas.students.dashboard import (
    AgendaView,
    DashboardPeriod,
    DashboardSummaryResponse,
    MyCoursesResponse,
    UpcomingAgendaResponse,
    UpcomingTasksResponse,
)
from app.services.students import dashboard_service_api

router = APIRouter(prefix="/dashboard", tags=["Student Dashboard"])


@router.get("/summary", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(
    db: SessionDep,
    current_user: CurrentUser,
    period: DashboardPeriod = Query(
        default=DashboardPeriod.WEEKLY,
        description="Aggregation window for stat cards, the spent-hours chart and its metrics",
    ),
) -> DashboardSummaryResponse:
    """Stat cards (courses / lessons / quizzes / time spent), the Learning vs
    Challenge spent-hours breakdown with trend metrics, and recent course activity."""
    return await dashboard_service_api.get_summary(db, user=current_user, period=period)


@router.get("/my-courses", response_model=MyCoursesResponse)
async def get_my_courses(db: SessionDep, current_user: CurrentUser) -> MyCoursesResponse:
    """Every course the student is enrolled in, with progress, lesson/quiz counts
    and last activity."""
    return await dashboard_service_api.get_my_courses(db, user=current_user)


@router.get("/upcoming-tasks", response_model=UpcomingTasksResponse)
async def get_upcoming_tasks(
    db: SessionDep,
    current_user: CurrentUser,
    limit: int = Query(default=10, ge=1, le=50),
) -> UpcomingTasksResponse:
    """The next not-yet-completed lessons across the student's in-progress
    courses, in curriculum order."""
    return await dashboard_service_api.get_upcoming_tasks(db, user=current_user, limit=limit)


@router.get("/upcoming-agenda", response_model=UpcomingAgendaResponse)
async def get_upcoming_agenda(
    db: SessionDep,
    current_user: CurrentUser,
    start: date | None = Query(
        default=None, description="First day of the plan (defaults to today, UTC)"
    ),
    view: AgendaView = Query(default=AgendaView.WEEK),
) -> UpcomingAgendaResponse:
    """A suggested study plan: upcoming lessons laid out one per day from `start`,
    each as a timed slot. These are generated, not user-scheduled events."""
    return await dashboard_service_api.get_upcoming_agenda(
        db, user=current_user, start=start, view=view
    )
