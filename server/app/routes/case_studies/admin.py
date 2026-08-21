# app/routes/case_studies/admin.py
import uuid

from fastapi import APIRouter, HTTPException, Query, status

from app.core.deps import CurrentAdmin, SessionDep
from app.crud.case_studies import case_study as case_study_crud
from app.schemas.auth.auth import MessageResponse
from app.schemas.case_studies.case_study import CaseStudyCreate, CaseStudyRead, CaseStudyUpdate

router = APIRouter()


@router.get("", response_model=list[CaseStudyRead])
async def list_case_studies(
    db: SessionDep,
    _admin: CurrentAdmin,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
) -> list[CaseStudyRead]:
    case_studies, _ = await case_study_crud.list_case_studies(db, published_only=False, skip=skip, limit=limit)
    return [CaseStudyRead.model_validate(c) for c in case_studies]


@router.post("", response_model=CaseStudyRead, status_code=status.HTTP_201_CREATED)
async def create_case_study(payload: CaseStudyCreate, db: SessionDep, admin: CurrentAdmin) -> CaseStudyRead:
    existing = await case_study_crud.get_by_slug(db, payload.slug)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A case study with that slug already exists")

    case_study = await case_study_crud.create_case_study(db, created_by=admin.id, **payload.model_dump())
    return CaseStudyRead.model_validate(case_study)


@router.patch("/{case_study_id}", response_model=CaseStudyRead)
async def update_case_study(
    case_study_id: uuid.UUID, payload: CaseStudyUpdate, db: SessionDep, _admin: CurrentAdmin
) -> CaseStudyRead:
    case_study = await case_study_crud.get_by_id(db, case_study_id)
    if case_study is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case study not found")

    if payload.slug and payload.slug != case_study.slug:
        existing = await case_study_crud.get_by_slug(db, payload.slug)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="A case study with that slug already exists"
            )

    case_study = await case_study_crud.update_case_study(db, case_study, **payload.model_dump(exclude_unset=True))
    return CaseStudyRead.model_validate(case_study)


@router.delete("/{case_study_id}", response_model=MessageResponse)
async def delete_case_study(case_study_id: uuid.UUID, db: SessionDep, _admin: CurrentAdmin) -> MessageResponse:
    case_study = await case_study_crud.get_by_id(db, case_study_id)
    if case_study is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case study not found")

    await case_study_crud.delete_case_study(db, case_study)
    return MessageResponse(message="Case study deleted")
