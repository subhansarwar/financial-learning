# app/routes/courses/admin.py
import uuid

from fastapi import APIRouter, HTTPException, Query, status

from app.core.deps import CurrentAdmin, SessionDep
from app.crud.courses import course as course_crud
from app.crud.courses import lesson as lesson_crud
from app.crud.courses import module as module_crud
from app.schemas.auth.auth import MessageResponse
from app.schemas.courses.course import CourseCreate, CourseRead, CourseUpdate
from app.schemas.courses.lesson import LessonCreate, LessonRead, LessonUpdate
from app.schemas.courses.module import ModuleCreate, ModuleRead, ModuleUpdate

router = APIRouter()


@router.get("", response_model=list[CourseRead])
async def list_courses(
    db: SessionDep,
    _admin: CurrentAdmin,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
) -> list[CourseRead]:
    courses, _ = await course_crud.list_courses(db, published_only=False, skip=skip, limit=limit)
    return [CourseRead.model_validate(c) for c in courses]


@router.post("", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
async def create_course(payload: CourseCreate, db: SessionDep, admin: CurrentAdmin) -> CourseRead:
    existing = await course_crud.get_by_slug(db, payload.slug)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A course with that slug already exists")

    course = await course_crud.create_course(db, created_by=admin.id, **payload.model_dump())
    return CourseRead.model_validate(course)


@router.patch("/{course_id}", response_model=CourseRead)
async def update_course(course_id: uuid.UUID, payload: CourseUpdate, db: SessionDep, _admin: CurrentAdmin) -> CourseRead:
    course = await course_crud.get_by_id(db, course_id)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    if payload.slug and payload.slug != course.slug:
        existing = await course_crud.get_by_slug(db, payload.slug)
        if existing is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A course with that slug already exists")

    course = await course_crud.update_course(db, course, **payload.model_dump(exclude_unset=True))
    return CourseRead.model_validate(course)


@router.delete("/{course_id}", response_model=MessageResponse)
async def delete_course(course_id: uuid.UUID, db: SessionDep, _admin: CurrentAdmin) -> MessageResponse:
    course = await course_crud.get_by_id(db, course_id)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    await course_crud.delete_course(db, course)
    return MessageResponse(message="Course deleted")


@router.post("/{course_id}/modules", response_model=ModuleRead, status_code=status.HTTP_201_CREATED)
async def create_module(course_id: uuid.UUID, payload: ModuleCreate, db: SessionDep, _admin: CurrentAdmin) -> ModuleRead:
    course = await course_crud.get_by_id(db, course_id)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    module = await module_crud.create_module(db, course_id=course_id, **payload.model_dump())
    return ModuleRead(id=module.id, course_id=module.course_id, title=module.title, order_index=module.order_index)


@router.patch("/modules/{module_id}", response_model=ModuleRead)
async def update_module(module_id: uuid.UUID, payload: ModuleUpdate, db: SessionDep, _admin: CurrentAdmin) -> ModuleRead:
    module = await module_crud.get_by_id(db, module_id)
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    module = await module_crud.update_module(db, module, **payload.model_dump(exclude_unset=True))
    return ModuleRead(id=module.id, course_id=module.course_id, title=module.title, order_index=module.order_index)


@router.delete("/modules/{module_id}", response_model=MessageResponse)
async def delete_module(module_id: uuid.UUID, db: SessionDep, _admin: CurrentAdmin) -> MessageResponse:
    module = await module_crud.get_by_id(db, module_id)
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    await module_crud.delete_module(db, module)
    return MessageResponse(message="Module deleted")


@router.post("/modules/{module_id}/lessons", response_model=LessonRead, status_code=status.HTTP_201_CREATED)
async def create_lesson(module_id: uuid.UUID, payload: LessonCreate, db: SessionDep, _admin: CurrentAdmin) -> LessonRead:
    module = await module_crud.get_by_id(db, module_id)
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    lesson = await lesson_crud.create_lesson(db, module_id=module_id, **payload.model_dump())
    return LessonRead.model_validate(lesson)


@router.patch("/lessons/{lesson_id}", response_model=LessonRead)
async def update_lesson(lesson_id: uuid.UUID, payload: LessonUpdate, db: SessionDep, _admin: CurrentAdmin) -> LessonRead:
    lesson = await lesson_crud.get_by_id(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    fields = payload.model_dump(exclude_unset=True)
    lesson = await lesson_crud.update_lesson(db, lesson, **fields)
    return LessonRead.model_validate(lesson)


@router.delete("/lessons/{lesson_id}", response_model=MessageResponse)
async def delete_lesson(lesson_id: uuid.UUID, db: SessionDep, _admin: CurrentAdmin) -> MessageResponse:
    lesson = await lesson_crud.get_by_id(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    await lesson_crud.delete_lesson(db, lesson)
    return MessageResponse(message="Lesson deleted")
