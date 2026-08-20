# app/routes/publications/catalog.py
from fastapi import APIRouter, HTTPException, Query, status

from app.core.config import settings
from app.core.deps import SessionDep
from app.crud.publications import publication as publication_crud
from app.models.publications.publication import PublicationCategory, PublicationStatus
from app.schemas.publications.publication import PublicationListItem, PublicationRead

router = APIRouter()


@router.get("", response_model=list[PublicationListItem])
async def list_publications(
    db: SessionDep,
    q: str | None = Query(default=None, description="Search title/abstract/keywords"),
    category: PublicationCategory | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=settings.PUBLICATION_CATALOG_PAGE_SIZE, ge=1, le=100),
) -> list[PublicationListItem]:
    publications, _ = await publication_crud.list_published(
        db, category=category.value if category else None, search=q, skip=skip, limit=limit
    )
    return [PublicationListItem.model_validate(p) for p in publications]


@router.get("/{publication_number}", response_model=PublicationRead)
async def get_publication(publication_number: str, db: SessionDep) -> PublicationRead:
    publication = await publication_crud.get_by_number(db, publication_number)
    if publication is None or publication.status != PublicationStatus.PUBLISHED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")

    await publication_crud.increment_view(db, publication)
    return PublicationRead.model_validate(publication)


@router.get("/{publication_number}/download", response_model=PublicationRead)
async def download_publication(publication_number: str, db: SessionDep) -> PublicationRead:
    publication = await publication_crud.get_by_number(db, publication_number)
    if publication is None or publication.status != PublicationStatus.PUBLISHED or not publication.file_url:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")

    await publication_crud.increment_download(db, publication)
    return PublicationRead.model_validate(publication)
