# app/crud/case_studies/case_study.py
import uuid
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.case_studies.case_study import CaseStudy

async def get_by_id(db: AsyncSession, case_study_id: uuid.UUID) -> CaseStudy | None:
    result = await db.execute(select(CaseStudy).where(CaseStudy.id == case_study_id))
    return result.scalar_one_or_none()

async def get_by_slug(db: AsyncSession, slug: str) -> CaseStudy | None:
    result = await db.execute(select(CaseStudy).where(CaseStudy.slug == slug))
    return result.scalar_one_or_none()

async def list_case_studies(
    db: AsyncSession,
    *,
    published_only: bool,
    industry: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[CaseStudy], int]:
    filters = []
    if published_only:
        filters.append(CaseStudy.is_published.is_(True))
    if industry:
        filters.append(CaseStudy.industry == industry)
    if search:
        like = f"%{search}%"
        filters.append(or_(CaseStudy.title.ilike(like), CaseStudy.summary.ilike(like)))

    count_stmt = select(func.count()).select_from(CaseStudy)
    list_stmt = select(CaseStudy).order_by(CaseStudy.created_at.desc()).offset(skip).limit(limit)
    for f in filters:
        count_stmt = count_stmt.where(f)
        list_stmt = list_stmt.where(f)

    total = (await db.execute(count_stmt)).scalar_one()
    case_studies = (await db.execute(list_stmt)).scalars().all()
    return list(case_studies), total

async def create_case_study(db: AsyncSession, *, created_by: uuid.UUID, **fields) -> CaseStudy:
    case_study = CaseStudy(created_by=created_by, **fields)
    db.add(case_study)
    await db.commit()
    await db.refresh(case_study)
    return case_study


async def update_case_study(db: AsyncSession, case_study: CaseStudy, **fields) -> CaseStudy:
    for key, value in fields.items():
        if value is not None:
            setattr(case_study, key, value)
    await db.commit()
    await db.refresh(case_study)
    return case_study


async def delete_case_study(db: AsyncSession, case_study: CaseStudy) -> None:
    await db.delete(case_study)
    await db.commit()
