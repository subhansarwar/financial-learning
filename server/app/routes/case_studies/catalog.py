# app/routes/case_studies/catalog.py
from fastapi import APIRouter, HTTPException, Query, status

from app.core.config import settings
from app.core.deps import SessionDep
from app.crud.case_studies import case_study as case_study_crud
from app.schemas.case_studies.case_study import CaseStudyListItem, CaseStudyRead

router = APIRouter()


@router.get("", response_model=list[CaseStudyListItem])
async def list_case_studies(
    db: SessionDep,
    q: str | None = Query(default=None, description="Search title/summary"),
    industry: str | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=settings.COURSE_CATALOG_PAGE_SIZE, ge=1, le=100),
) -> list[CaseStudyListItem]:
    case_studies, _ = await case_study_crud.list_case_studies(
        db, published_only=True, industry=industry, search=q, skip=skip, limit=limit
    )
    return [CaseStudyListItem.model_validate(c) for c in case_studies]


@router.get("/{slug}", response_model=CaseStudyRead)
async def get_case_study(slug: str, db: SessionDep) -> CaseStudyRead:
    case_study = await case_study_crud.get_by_slug(db, slug)
    if case_study is None or not case_study.is_published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case study not found")
    return CaseStudyRead.model_validate(case_study)
