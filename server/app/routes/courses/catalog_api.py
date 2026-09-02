# app/routes/courses/catalog_api.py
import uuid
from fastapi import APIRouter, HTTPException, Query, status
from app.core.config import settings
from app.core.deps import CurrentUser, SessionDep
from app.crud.courses import course_api as course_crud
from app.crud.courses import enrollment_api as enrollment_crud
from app.crud.courses import lesson_api as lesson_crud
from app.crud.courses import module_api as module_crud
from app.models.courses.course import Course, CourseLevel
from app.schemas.courses.course import CourseDetail, CourseListItem, CourseRead
from app.schemas.courses.enrollment import CourseProgressResponse, EnrollmentRead
from app.schemas.courses.lesson import LessonRead
from app.schemas.courses.module import ModuleRead
from app.schemas.courses.quiz import (
    CourseQuizResults,
    QuizAttemptRead,
    QuizResult,
    QuizSubmission,
    QuizView,
)
from app.crud.courses import quiz_attempt_api as quiz_crud
from app.models.courses.lesson import LessonType
from app.services.courses import progress_service_api, quiz_service_api

router = APIRouter(prefix="/courses", tags=["Course Catalog"])

async def _build_course_detail(db: SessionDep, course: Course) -> CourseDetail:
    modules = await module_crud.list_for_course(db, course.id)
    module_reads = []
    for m in modules:
        lessons = await lesson_crud.list_lessons_by_module(db, m.id)
        module_reads.append(
            ModuleRead(
                id=m.id,
                course_id=m.course_id,
                title=m.title,
                order_index=m.order_index,
                lessons=[LessonRead.model_validate(l) for l in lessons],
            )
        )
    return CourseDetail(**CourseRead.model_validate(course).model_dump(), modules=module_reads)

@router.get("/all", response_model=list[CourseListItem])
async def list_courses(
    db: SessionDep,
    q: str | None = Query(default=None, description="Search title/tagline"),
    topic: str | None = Query(default=None),
    level: CourseLevel | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=settings.COURSE_CATALOG_PAGE_SIZE, ge=1, le=100),
) -> list[CourseListItem]:
    courses, _ = await course_crud.list_all_courses(
        db, published_only=True, topic=topic, level=level.value if level else None, search=q, skip=skip, limit=limit
    )
    return [CourseListItem.model_validate(c) for c in courses]

@router.get("/me/enrollments", response_model=list[EnrollmentRead])
async def list_my_enrollments(db: SessionDep, current_user: CurrentUser) -> list[EnrollmentRead]:
    enrollments = await enrollment_crud.list_enrollments_by_user(db, current_user.id)
    return [EnrollmentRead.model_validate(e) for e in enrollments]

@router.get("/read/{slug}", response_model=CourseDetail)
async def get_course(slug: str, db: SessionDep) -> CourseDetail:
    course = await course_crud.get_course_by_slug(db, slug)
    if course is None or not course.is_published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return await _build_course_detail(db, course)

@router.post("/{course_id}/enroll", response_model=EnrollmentRead)
async def enroll(course_id: uuid.UUID, db: SessionDep, current_user: CurrentUser) -> EnrollmentRead:
    course = await course_crud.get_course_by_id(db, course_id)
    if course is None or not course.is_published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    enrollment = await enrollment_crud.create_enrollement(db, user_id=current_user.id, course_id=course_id)
    return EnrollmentRead.model_validate(enrollment)

@router.get("/{course_id}/progress", response_model=CourseProgressResponse)
async def get_progress(course_id: uuid.UUID, db: SessionDep, current_user: CurrentUser) -> CourseProgressResponse:
    course = await course_crud.get_course_by_id(db, course_id)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return await progress_service_api.get_progress(db, user_id=current_user.id, course_id=course_id)

@router.post("/lessons/{lesson_id}/complete", response_model=CourseProgressResponse)
async def complete_lesson(lesson_id: uuid.UUID, db: SessionDep, current_user: CurrentUser) -> CourseProgressResponse:
    lesson = await lesson_crud.get_lesson_by_id(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    if quiz_service_api.is_quiz_lesson(lesson):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This is a quiz lesson — submit it via /courses/lessons/{lesson_id}/quiz/submit to complete it",
        )
    try:
        return await progress_service_api.complete_lesson(db, user=current_user, lesson_id=lesson_id)
    except progress_service_api.CourseNotFoundForLessonError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")


# --- Quizzes -------------------------------------------------------------------

async def _get_quiz_lesson_or_404(db: SessionDep, lesson_id: uuid.UUID):
    lesson = await lesson_crud.get_lesson_by_id(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    if not quiz_service_api.is_quiz_lesson(lesson):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="This lesson has no quiz")
    return lesson


@router.get("/lessons/{lesson_id}/quiz", response_model=QuizView)
async def get_lesson_quiz(lesson_id: uuid.UUID, db: SessionDep, current_user: CurrentUser) -> QuizView:
    """The module quiz for this lesson (questions without the answer key), plus the
    student's best score and pass mark so far."""
    lesson = await _get_quiz_lesson_or_404(db, lesson_id)
    return await quiz_service_api.get_quiz_view(db, user=current_user, lesson=lesson)


@router.post("/lessons/{lesson_id}/quiz/submit", response_model=QuizResult)
async def submit_lesson_quiz(
    lesson_id: uuid.UUID, payload: QuizSubmission, db: SessionDep, current_user: CurrentUser
) -> QuizResult:
    """Grade a quiz submission immediately. Scoring >= the pass mark (default 70%)
    marks the quiz lesson complete and advances course progress."""
    lesson = await _get_quiz_lesson_or_404(db, lesson_id)
    try:
        return await quiz_service_api.submit_quiz(
            db, user=current_user, lesson=lesson, answers=payload.answers
        )
    except quiz_service_api.QuizError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)


@router.get("/lessons/{lesson_id}/quiz/attempts", response_model=list[QuizAttemptRead])
async def list_lesson_quiz_attempts(
    lesson_id: uuid.UUID, db: SessionDep, current_user: CurrentUser
) -> list[QuizAttemptRead]:
    """This student's past attempts for the quiz, newest first."""
    await _get_quiz_lesson_or_404(db, lesson_id)
    attempts = await quiz_crud.list_attempts_for_lesson(db, user_id=current_user.id, lesson_id=lesson_id)
    return [QuizAttemptRead.model_validate(a) for a in attempts]


@router.get("/{course_id}/quiz-results", response_model=CourseQuizResults)
async def get_course_quiz_results(
    course_id: uuid.UUID, db: SessionDep, current_user: CurrentUser
) -> CourseQuizResults:
    """Per-module quiz standing for this student across the whole course: best mark,
    attempts, pass mark, and whether each module's quiz is passed."""
    course = await course_crud.get_course_by_id(db, course_id)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return await quiz_service_api.get_course_quiz_results(db, user=current_user, course_id=course_id)