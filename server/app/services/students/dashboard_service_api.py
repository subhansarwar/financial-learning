# app/services/students/dashboard_service_api.py
"""Business logic behind the student dashboard endpoints.

No calendar or time-log tables exist, so figures are derived from real records:

* learning minutes  -> duration of completed non-quiz lessons (by completed_at)
* challenge minutes -> duration of the quiz lesson behind each quiz attempt
* upcoming work      -> next incomplete lessons of in-progress courses, in
  curriculum order; the agenda lays them out one lesson per day.
"""
import uuid
from datetime import date, datetime, time, timedelta, timezone

from app.core.deps import SessionDep
from app.crud.courses import lesson_api as lesson_crud
from app.crud.courses import module_api as module_crud
from app.crud.students import dashboard_api as dashboard_crud
from app.crud.students import lesson_progress_api as progress_crud
from app.models.courses.lesson import LessonType
from app.models.students.enrollment import EnrollmentStatus
from app.models.users.user import User
from app.schemas.students.dashboard import (
    AgendaDay,
    AgendaItem,
    AgendaView,
    DashboardMetric,
    DashboardPeriod,
    DashboardStats,
    DashboardSummaryResponse,
    DateRange,
    MyCourseItem,
    MyCoursesResponse,
    RecentActivityItem,
    SpentHours,
    SpentHoursBucket,
    SpentHoursPeak,
    UpcomingTaskItem,
    UpcomingTasksResponse,
    UpcomingAgendaResponse,
)

# Suggested study-plan slots start at this UTC hour.
_AGENDA_START_HOUR = 9
_RECENT_ACTIVITY_LIMIT = 5


# --- small formatting helpers ---------------------------------------------

def _now() -> datetime:
    return datetime.now(timezone.utc)


def _minutes_label(minutes: int) -> str:
    minutes = max(0, int(minutes))
    if minutes < 60:
        return f"{minutes} min"
    hours, rem = divmod(minutes, 60)
    return f"{hours}h {rem}m" if rem else f"{hours}h"


def _clock_label(minutes: float) -> str:
    total = max(0, round(minutes))
    hours, rem = divmod(total, 60)
    return f"{hours}:{rem:02d} Hours"


def _round1(value: float) -> float:
    return round(value, 1)


def _delta_pct(current: float, previous: float) -> tuple[float, str]:
    if previous <= 0:
        pct = 0.0 if current <= 0 else 100.0
    else:
        pct = _round1((current - previous) / previous * 100)
    if pct > 0:
        return pct, "up"
    if pct < 0:
        return pct, "down"
    return 0.0, "flat"


# --- period / bucket resolution -----------------------------------------

_WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"]  # Sunday-first


def _week_start_sunday(d: date) -> date:
    return d - timedelta(days=(d.weekday() + 1) % 7)


def _month_start(d: date) -> date:
    return d.replace(day=1)


def _next_month_start(d: date) -> date:
    return date(d.year + 1, 1, 1) if d.month == 12 else date(d.year, d.month + 1, 1)


def _dt(d: date) -> datetime:
    return datetime.combine(d, time.min, tzinfo=timezone.utc)


def _resolve_period(period: DashboardPeriod, today: date):
    """Returns (range_start, range_end, prev_start, prev_end, buckets, num_days,
    label_suffix) where buckets is a list of (label, start_dt, end_dt)."""
    if period is DashboardPeriod.DAILY:
        start = _dt(today)
        end = start + timedelta(days=1)
        prev_start, prev_end = start - timedelta(days=1), start
        buckets = [
            (f"{h:02d}", start + timedelta(hours=h), start + timedelta(hours=h + 4))
            for h in range(0, 24, 4)
        ]
        return start, end, prev_start, prev_end, buckets, 1, "today"

    if period is DashboardPeriod.MONTHLY:
        m_start = _month_start(today)
        m_end = _next_month_start(today)
        start, end = _dt(m_start), _dt(m_end)
        prev_month_end = m_start
        prev_month_start = (
            date(m_start.year - 1, 12, 1)
            if m_start.month == 1
            else date(m_start.year, m_start.month - 1, 1)
        )
        prev_start, prev_end = _dt(prev_month_start), _dt(prev_month_end)
        buckets = []
        cursor = start
        idx = 1
        while cursor < end:
            b_end = min(cursor + timedelta(days=7), end)
            buckets.append((f"W{idx}", cursor, b_end))
            cursor = b_end
            idx += 1
        return start, end, prev_start, prev_end, buckets, (end - start).days, "in a month"

    # weekly (default)
    w_start = _week_start_sunday(today)
    start = _dt(w_start)
    end = start + timedelta(days=7)
    prev_start, prev_end = start - timedelta(days=7), start
    buckets = [
        (_WEEKDAY_INITIALS[i], start + timedelta(days=i), start + timedelta(days=i + 1))
        for i in range(7)
    ]
    return start, end, prev_start, prev_end, buckets, 7, "in a week"


def _bucketize(
    buckets: list[tuple[str, datetime, datetime]],
    learning_rows: list[tuple[datetime, int]],
    challenge_rows: list[tuple[datetime, int]],
) -> list[SpentHoursBucket]:
    learn = [0] * len(buckets)
    chal = [0] * len(buckets)

    def assign(rows, target):
        for ts, minutes in rows:
            if ts.tzinfo is None:
                ts = ts.replace(tzinfo=timezone.utc)
            for i, (_, b_start, b_end) in enumerate(buckets):
                if b_start <= ts < b_end:
                    target[i] += minutes
                    break

    assign(learning_rows, learn)
    assign(challenge_rows, chal)

    out: list[SpentHoursBucket] = []
    for i, (label, b_start, b_end) in enumerate(buckets):
        lh, ch = _round1(learn[i] / 60), _round1(chal[i] / 60)
        out.append(
            SpentHoursBucket(
                label=label,
                start=b_start,
                end=b_end,
                learning_minutes=learn[i],
                challenge_minutes=chal[i],
                learning_hours=lh,
                challenge_hours=ch,
                total_hours=_round1(lh + ch),
            )
        )
    return out


# --- summary ------------------------------------------------------------

async def get_summary(
    db: SessionDep, *, user: User, period: DashboardPeriod
) -> DashboardSummaryResponse:
    today = _now().date()
    start, end, prev_start, prev_end, bucket_defs, num_days, suffix = _resolve_period(
        period, today
    )

    learning_rows = await dashboard_crud.list_learning_minutes(
        db, user_id=user.id, start=start, end=end
    )
    challenge_rows = await dashboard_crud.list_challenge_minutes(
        db, user_id=user.id, start=start, end=end
    )
    prev_learning = await dashboard_crud.list_learning_minutes(
        db, user_id=user.id, start=prev_start, end=prev_end
    )
    prev_challenge = await dashboard_crud.list_challenge_minutes(
        db, user_id=user.id, start=prev_start, end=prev_end
    )

    buckets = _bucketize(bucket_defs, learning_rows, challenge_rows)

    learning_min = sum(m for _, m in learning_rows)
    challenge_min = sum(m for _, m in challenge_rows)
    prev_learning_min = sum(m for _, m in prev_learning)
    prev_challenge_min = sum(m for _, m in prev_challenge)
    total_min = learning_min + challenge_min
    prev_total_min = prev_learning_min + prev_challenge_min

    # stats
    courses_enrolled = await dashboard_crud.count_enrollments(db, user_id=user.id)
    courses_completed = await dashboard_crud.count_enrollments(
        db, user_id=user.id, status=EnrollmentStatus.COMPLETED
    )
    courses_in_progress = await dashboard_crud.count_enrollments(
        db, user_id=user.id, status=EnrollmentStatus.IN_PROGRESS
    )
    lessons_completed = await dashboard_crud.count_lesson_completions(
        db, user_id=user.id, start=start, end=end, exclude_quiz=True
    )
    quizzes_completed = await dashboard_crud.count_passed_quizzes(
        db, user_id=user.id, start=start, end=end
    )

    stats = DashboardStats(
        courses_enrolled=courses_enrolled,
        courses_in_progress=courses_in_progress,
        courses_completed=courses_completed,
        lessons_completed=lessons_completed,
        quizzes_completed=quizzes_completed,
        time_spent_minutes=total_min,
        time_spent_label=_minutes_label(total_min),
    )

    # spent hours block
    peak_bucket = max(buckets, key=lambda b: b.total_hours, default=None)
    if peak_bucket and peak_bucket.total_hours > 0:
        peak = SpentHoursPeak(
            label=peak_bucket.label,
            hours=peak_bucket.total_hours,
            duration_label=_clock_label(
                peak_bucket.learning_minutes + peak_bucket.challenge_minutes
            ),
        )
    else:
        peak = SpentHoursPeak(duration_label=_clock_label(0))

    spent_hours = SpentHours(
        buckets=buckets,
        total_hours=_round1(total_min / 60),
        peak=peak,
    )

    # metrics (value in hours, delta vs previous equivalent period)
    total_h, prev_total_h = total_min / 60, prev_total_min / 60
    course_h, prev_course_h = learning_min / 60, prev_learning_min / 60
    chal_h, prev_chal_h = challenge_min / 60, prev_challenge_min / 60
    avg_h = total_h / num_days if num_days else 0.0
    prev_avg_h = prev_total_h / num_days if num_days else 0.0

    def metric(key: str, label: str, value: float, prev: float) -> DashboardMetric:
        delta, trend = _delta_pct(value, prev)
        return DashboardMetric(
            key=key, label=label, value=_round1(value), delta_pct=delta, trend=trend
        )

    metrics = [
        metric("total_hours", f"Total hours {suffix}", total_h, prev_total_h),
        metric("avg_hours_per_day", "Average hours in a day", avg_h, prev_avg_h),
        metric("course_hours", f"Course hours {suffix}", course_h, prev_course_h),
        metric("challenge_hours", f"Challenge hours {suffix}", chal_h, prev_chal_h),
    ]

    # recent activity
    pairs = await dashboard_crud.list_enrollments_with_course(db, user_id=user.id)
    course_ids = [c.id for _, c in pairs]
    last_activity = await dashboard_crud.last_activity_by_course(
        db, user_id=user.id, course_ids=course_ids
    )
    pairs.sort(
        key=lambda p: last_activity.get(p[1].id) or p[0].started_at, reverse=True
    )
    recent_activity = [
        RecentActivityItem(
            course_id=course.id,
            slug=course.slug,
            title=course.title,
            instructor_name=course.instructor_name,
            thumbnail_url=course.thumbnail_url,
            status=enr.status,
            progress_pct=enr.progress_pct,
            last_activity_at=last_activity.get(course.id),
        )
        for enr, course in pairs[:_RECENT_ACTIVITY_LIMIT]
    ]

    return DashboardSummaryResponse(
        period=period,
        range=DateRange(start=start, end=end),
        stats=stats,
        spent_hours=spent_hours,
        metrics=metrics,
        recent_activity=recent_activity,
    )


# --- my courses -------------------------------------------------------

async def get_my_courses(db: SessionDep, *, user: User) -> MyCoursesResponse:
    pairs = await dashboard_crud.list_enrollments_with_course(db, user_id=user.id)
    course_ids = [c.id for _, c in pairs]

    lesson_counts = await dashboard_crud.lesson_counts_by_course(db, course_ids=course_ids)
    completed_counts = await dashboard_crud.completed_lesson_counts_by_course(
        db, user_id=user.id, course_ids=course_ids
    )
    passed_quiz_counts = await dashboard_crud.passed_quiz_counts_by_course(
        db, user_id=user.id, course_ids=course_ids
    )
    last_activity = await dashboard_crud.last_activity_by_course(
        db, user_id=user.id, course_ids=course_ids
    )

    items: list[MyCourseItem] = []
    for enr, course in pairs:
        total_lessons, total_quizzes = lesson_counts.get(course.id, (0, 0))
        items.append(
            MyCourseItem(
                enrollment_id=enr.id,
                course_id=course.id,
                slug=course.slug,
                title=course.title,
                tagline=course.tagline,
                topic=course.topic,
                level=course.level,
                thumbnail_url=course.thumbnail_url,
                instructor_name=course.instructor_name,
                instructor_title=course.instructor_title,
                length_min=course.length_min,
                is_published=course.is_published,
                status=enr.status,
                progress_pct=enr.progress_pct,
                total_lessons=total_lessons,
                completed_lessons=completed_counts.get(course.id, 0),
                total_quizzes=total_quizzes,
                passed_quizzes=passed_quiz_counts.get(course.id, 0),
                started_at=enr.started_at,
                completed_at=enr.completed_at,
                last_activity_at=last_activity.get(course.id),
                created_at=course.created_at,
            )
        )

    return MyCoursesResponse(
        total=len(items),
        in_progress=sum(1 for i in items if i.status == EnrollmentStatus.IN_PROGRESS),
        completed=sum(1 for i in items if i.status == EnrollmentStatus.COMPLETED),
        courses=items,
    )


# --- upcoming tasks / agenda ----------------------------------------

def _activity_for(lesson_type: LessonType) -> str:
    return "Challenge" if lesson_type == LessonType.QUIZ else "Course"


async def _collect_upcoming(db: SessionDep, *, user: User, limit: int) -> list[UpcomingTaskItem]:
    """Next incomplete lessons across the student's in-progress courses, in
    curriculum order, earliest enrolled course first."""
    pairs = await dashboard_crud.list_enrollments_with_course(db, user_id=user.id)
    in_progress = [
        (enr, course)
        for enr, course in pairs
        if enr.status == EnrollmentStatus.IN_PROGRESS
    ]
    in_progress.sort(key=lambda p: p[0].started_at)

    tasks: list[UpcomingTaskItem] = []
    for enr, course in in_progress:
        lessons = await lesson_crud.list_lessons_by_course(db, course.id)
        if not lessons:
            continue
        completed_ids = set(
            await progress_crud.list_completed_lesson_ids_for_course(
                db, user_id=user.id, course_id=course.id
            )
        )
        modules = await module_crud.list_for_course(db, course.id)
        module_titles = {m.id: m.title for m in modules}

        for position, lesson in enumerate(lessons, start=1):
            if lesson.id in completed_ids:
                continue
            tasks.append(
                UpcomingTaskItem(
                    lesson_id=lesson.id,
                    course_id=course.id,
                    course_slug=course.slug,
                    course_title=course.title,
                    course_topic=course.topic,
                    module_id=lesson.module_id,
                    module_title=module_titles.get(lesson.module_id, ""),
                    title=lesson.title,
                    type=lesson.type,
                    activity=_activity_for(lesson.type),
                    duration_min=lesson.duration_min,
                    lesson_number=position,
                    lesson_label=f"Lesson {position}",
                    course_progress_pct=enr.progress_pct,
                    instructor_name=course.instructor_name,
                )
            )
            if len(tasks) >= limit:
                return tasks
    return tasks


async def get_upcoming_tasks(
    db: SessionDep, *, user: User, limit: int
) -> UpcomingTasksResponse:
    tasks = await _collect_upcoming(db, user=user, limit=limit)
    return UpcomingTasksResponse(total=len(tasks), tasks=tasks)


_AGENDA_DAYS = {AgendaView.DAY: 1, AgendaView.WEEK: 7, AgendaView.MONTH: 30}


async def get_upcoming_agenda(
    db: SessionDep, *, user: User, start: date | None, view: AgendaView
) -> UpcomingAgendaResponse:
    start_date = start or _now().date()
    days = _AGENDA_DAYS[view]
    tasks = await _collect_upcoming(db, user=user, limit=days)

    items: list[AgendaItem] = []
    buckets: dict[date, list[AgendaItem]] = {}
    for offset, task in enumerate(tasks):
        slot_date = start_date + timedelta(days=offset)
        slot_start = datetime.combine(
            slot_date, time(hour=_AGENDA_START_HOUR), tzinfo=timezone.utc
        )
        slot_end = slot_start + timedelta(minutes=task.duration_min or 0)
        is_challenge = task.type == LessonType.QUIZ
        item = AgendaItem(
            lesson_id=task.lesson_id,
            course_id=task.course_id,
            course_slug=task.course_slug,
            course_title=task.course_title,
            title=task.title,
            subtitle=(
                f"{task.instructor_name} · "
                f"{slot_start:%d %b}, {slot_start:%I:%M}–{slot_end:%I:%M %p}"
            ),
            type=task.type,
            activity=task.activity,
            field_label="Category" if is_challenge else "Progress",
            field_value=task.course_topic if is_challenge else task.lesson_label,
            duration_min=task.duration_min,
            duration_label=f"{task.duration_min} min",
            scheduled_start=slot_start,
            scheduled_end=slot_end,
        )
        items.append(item)
        buckets.setdefault(slot_date, []).append(item)

    day_list = [AgendaDay(date=d, items=buckets[d]) for d in sorted(buckets)]

    return UpcomingAgendaResponse(
        start=start_date,
        end=start_date + timedelta(days=days),
        view=view,
        generated=True,
        items=items,
        days=day_list,
    )
