# app/crud/publications/publication.py
import uuid
from datetime import datetime, timezone

from sqlalchemy import String, cast, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.publications.publication import Publication, PublicationStatus


async def get_by_id(db: AsyncSession, publication_id: uuid.UUID) -> Publication | None:
    result = await db.execute(select(Publication).where(Publication.id == publication_id))
    return result.scalar_one_or_none()


async def get_by_number(db: AsyncSession, publication_number: str) -> Publication | None:
    result = await db.execute(select(Publication).where(Publication.publication_number == publication_number))
    return result.scalar_one_or_none()


async def list_published(
    db: AsyncSession,
    *,
    category: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[Publication], int]:
    filters = [Publication.status == PublicationStatus.PUBLISHED]
    if category:
        filters.append(Publication.category == category)
    if search:
        like = f"%{search}%"
        filters.append(
            or_(Publication.title.ilike(like), Publication.abstract.ilike(like), cast(Publication.keywords, String).ilike(like))
        )

    count_stmt = select(func.count()).select_from(Publication)
    list_stmt = select(Publication).order_by(Publication.published_at.desc()).offset(skip).limit(limit)
    for f in filters:
        count_stmt = count_stmt.where(f)
        list_stmt = list_stmt.where(f)

    total = (await db.execute(count_stmt)).scalar_one()
    publications = (await db.execute(list_stmt)).scalars().all()
    return list(publications), total


async def list_for_author(db: AsyncSession, author_id: uuid.UUID) -> list[Publication]:
    result = await db.execute(
        select(Publication).where(Publication.author_id == author_id).order_by(Publication.created_at.desc())
    )
    return list(result.scalars().all())


async def list_pending_review(db: AsyncSession, *, skip: int = 0, limit: int = 20) -> list[Publication]:
    result = await db.execute(
        select(Publication)
        .where(Publication.status == PublicationStatus.PENDING_REVIEW)
        .order_by(Publication.submitted_at)
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def create_publication(db: AsyncSession, *, author_id: uuid.UUID, publication_number: str, **fields) -> Publication:
    publication = Publication(author_id=author_id, publication_number=publication_number, **fields)
    db.add(publication)
    await db.commit()
    await db.refresh(publication)
    return publication


async def update_publication(db: AsyncSession, publication: Publication, **fields) -> Publication:
    for key, value in fields.items():
        if value is not None:
            setattr(publication, key, value)
    await db.commit()
    await db.refresh(publication)
    return publication


async def delete_publication(db: AsyncSession, publication: Publication) -> None:
    await db.delete(publication)
    await db.commit()


async def set_file_url(db: AsyncSession, publication: Publication, file_url: str) -> Publication:
    publication.file_url = file_url
    await db.commit()
    await db.refresh(publication)
    return publication


async def submit_for_review(db: AsyncSession, publication: Publication) -> Publication:
    publication.status = PublicationStatus.PENDING_REVIEW
    publication.submitted_at = datetime.now(timezone.utc)
    publication.review_notes = None
    await db.commit()
    await db.refresh(publication)
    return publication


async def approve(db: AsyncSession, publication: Publication, *, reviewer_id: uuid.UUID, notes: str | None) -> Publication:
    publication.status = PublicationStatus.PUBLISHED
    publication.published_at = datetime.now(timezone.utc)
    publication.reviewed_by = reviewer_id
    publication.review_notes = notes
    await db.commit()
    await db.refresh(publication)
    return publication


async def reject(db: AsyncSession, publication: Publication, *, reviewer_id: uuid.UUID, notes: str) -> Publication:
    publication.status = PublicationStatus.REJECTED
    publication.reviewed_by = reviewer_id
    publication.review_notes = notes
    await db.commit()
    await db.refresh(publication)
    return publication


async def increment_view(db: AsyncSession, publication: Publication) -> None:
    publication.view_count += 1
    await db.commit()


async def increment_download(db: AsyncSession, publication: Publication) -> None:
    publication.download_count += 1
    await db.commit()
