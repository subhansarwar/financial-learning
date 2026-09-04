# app/routes/courses/course_api.py
import uuid
from fastapi import APIRouter, HTTPException, Query, status
from app.core.deps import CurrentAdmin, SessionDep
from app.crud.courses import course_api as course_crud
from app.crud.courses import lesson_api as lesson_crud
from app.crud.courses import module_api as module_crud
from app.models.courses.course import Course, CourseLevel
from app.schemas.courses.course import CourseDetail, CourseListItem, CourseRead
from app.schemas.auth.auth import MessageResponse
from app.schemas.courses.course import CourseCreate, CourseRead, CourseUpdate
from app.schemas.courses.lesson import LessonCreate, LessonRead, LessonUpdate
from app.schemas.courses.module import ModuleCreate, ModuleRead, ModuleUpdate

async def _build_module_read(db: SessionDep, module) -> ModuleRead:
    lessons = await lesson_crud.list_lessons_by_module(db, module.id)
    return ModuleRead(
        id=module.id,
        course_id=module.course_id,
        title=module.title,
        order_index=module.order_index,
        lessons=[LessonRead.model_validate(l) for l in lessons],
    )

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



router = APIRouter(prefix="/admin/courses", tags=["Course Catalog - Admin"])

@router.get("/all", response_model=list[CourseRead])
async def list_courses(
    db: SessionDep,
    name: str | None = Query(default=None, description="Filter by course name (case-insensitive, partial match)"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
) -> list[CourseRead]:   # _admin: CurrentAdmin,
    courses, _ = await course_crud.list_all_courses(
        db, published_only=False, name=name, skip=skip, limit=limit
    )
    return [CourseRead.model_validate(c) for c in courses]


@router.get("/search", response_model=list[CourseRead])
async def search_courses_by_name(
    db: SessionDep,
    name: str = Query(min_length=1, description="Course name to search for (case-insensitive, partial match)"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
) -> list[CourseRead]:   # _admin: CurrentAdmin,
    courses, _ = await course_crud.list_all_courses(
        db, published_only=False, name=name, skip=skip, limit=limit
    )
    return [CourseRead.model_validate(c) for c in courses]

@router.get("/read/{slug}", response_model=CourseDetail)
async def get_course(slug: str, db: SessionDep) -> CourseDetail:
    course = await course_crud.get_course_by_slug(db, slug)
    if course is None or not course.is_published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return await _build_course_detail(db, course)

@router.post("/create", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
async def create_course(payload: CourseCreate, db: SessionDep) -> CourseRead: # , admin: CurrentAdmin
    existing = await course_crud.get_course_by_slug(db, payload.slug)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A course with that slug already exists")

    course = await course_crud.create_course(db, created_by=None, **payload.model_dump()) # TODO: use admin.id once CurrentAdmin is re-enabled
    return CourseRead.model_validate(course)


@router.patch("/update/{course_id}", response_model=CourseRead)
async def update_course(course_id: uuid.UUID, payload: CourseUpdate, db: SessionDep) -> CourseRead: #, _admin: CurrentAdmin
    course = await course_crud.get_course_by_id(db, course_id)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    if payload.slug and payload.slug != course.slug:
        existing = await course_crud.get_course_by_slug(db, payload.slug)
        if existing is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A course with that slug already exists")

    course = await course_crud.update_course(db, course, **payload.model_dump(exclude_unset=True))
    return CourseRead.model_validate(course)


@router.delete("/delete/{course_id}", response_model=MessageResponse)
async def delete_course(course_id: uuid.UUID, db: SessionDep) -> MessageResponse: #, _admin: CurrentAdmin
    course = await course_crud.get_course_by_id(db, course_id)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    await course_crud.delete_course(db, course)
    return MessageResponse(message="Course deleted")


@router.get("/list-modules/{course_id}", response_model=list[ModuleRead])
async def list_modules(course_id: uuid.UUID, db: SessionDep) -> list[ModuleRead]:    # , _admin: CurrentAdmin
    course = await course_crud.get_course_by_id(db, course_id)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    modules = await module_crud.list_for_course(db, course_id)
    return [await _build_module_read(db, m) for m in modules]


@router.get("/read-modules/{module_id}", response_model=ModuleRead)
async def get_module(module_id: uuid.UUID, db: SessionDep) -> ModuleRead:    # , _admin: CurrentAdmin
    module = await module_crud.get_by_module_id(db, module_id)
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    return await _build_module_read(db, module)


@router.post("/create-modules/{course_id}", response_model=ModuleRead, status_code=status.HTTP_201_CREATED)
async def create_module(course_id: uuid.UUID, payload: ModuleCreate, db: SessionDep) -> ModuleRead:    # , _admin: CurrentAdmin
    course = await course_crud.get_course_by_id(db, course_id)
    if course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    module = await module_crud.create_module(db, course_id=course_id, **payload.model_dump())
    return ModuleRead(id=module.id, course_id=module.course_id, title=module.title, order_index=module.order_index)


@router.patch("/update-modules/{module_id}", response_model=ModuleRead)
async def update_module(module_id: uuid.UUID, payload: ModuleUpdate, db: SessionDep) -> ModuleRead:    # , _admin: CurrentAdmin
    module = await module_crud.get_by_module_id(db, module_id)
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    module = await module_crud.update_module(db, module, **payload.model_dump(exclude_unset=True))
    return ModuleRead(id=module.id, course_id=module.course_id, title=module.title, order_index=module.order_index)


@router.delete("/delete-modules/{module_id}", response_model=MessageResponse)
async def delete_module(module_id: uuid.UUID, db: SessionDep) -> MessageResponse: # , _admin: CurrentAdmin
    module = await module_crud.get_by_module_id(db, module_id)
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    await module_crud.delete_module(db, module)
    return MessageResponse(message="Module deleted")


@router.post("/create-lessons/{module_id}/lessons", response_model=LessonRead, status_code=status.HTTP_201_CREATED)
async def create_lesson(module_id: uuid.UUID, payload: LessonCreate, db: SessionDep) -> LessonRead: # , _admin: CurrentAdmin
    module = await module_crud.get_by_module_id(db, module_id)
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    lesson = await lesson_crud.create_lesson(db, module_id=module_id, **payload.model_dump())
    return LessonRead.model_validate(lesson)


@router.patch("/update-lessons/{lesson_id}", response_model=LessonRead)
async def update_lesson(lesson_id: uuid.UUID, payload: LessonUpdate, db: SessionDep) -> LessonRead:  # , _admin: CurrentAdmin
    lesson = await lesson_crud.get_lesson_by_id(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    fields = payload.model_dump(exclude_unset=True)
    lesson = await lesson_crud.update_lesson(db, lesson, **fields)
    return LessonRead.model_validate(lesson)


@router.delete("/delete-lessons/{lesson_id}", response_model=MessageResponse)
async def delete_lesson(lesson_id: uuid.UUID, db: SessionDep) -> MessageResponse:   # , _admin: CurrentAdmin
    lesson = await lesson_crud.get_lesson_by_id(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    await lesson_crud.delete_lesson(db, lesson)
    return MessageResponse(message="Lesson deleted")
