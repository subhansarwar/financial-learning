# app/crud/publications/publication_api.py
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import String, cast, func, or_, select, update
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.core.deps import SessionDep
from app.core.security import logger
from app.models.publications.publication import Publication, PublicationStatus

async def get_publication_by_id(db: SessionDep, publication_id: uuid.UUID) -> Publication | None:
    try:
        result = await db.execute(select(Publication).where(Publication.id == publication_id))
        return result.scalar_one_or_none()
    except SQLAlchemyError: 
        logger.exception( "Failed to fetch publication: publication_id=%s", publication_id, ) 
        raise

async def get_publication_by_number(db: SessionDep, publication_number: str) -> Publication | None:
    publication_number = publication_number.strip() 
    if not publication_number: 
        return None
    try:
        result = await db.execute(select(Publication).where(Publication.publication_number == publication_number))
        return result.scalar_one_or_none()
    except SQLAlchemyError: 
        logger.exception( "Failed to fetch publication by number: " "publication_number=%s", publication_number, ) 
        raise

async def list_published_publications(
    db: SessionDep,
    *,
    category: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[Publication], int]:
    if skip < 0: 
        raise ValueError("skip cannot be negative") 

    if limit <= 0: 
        raise ValueError("limit must be greater than 0")

    filters = [Publication.status == PublicationStatus.PUBLISHED]
    if category:
        filters.append(Publication.category == category)
    if search:
        like = f"%{search}%"
        filters.append(
            or_(Publication.title.ilike(like), Publication.abstract.ilike(like), cast(Publication.keywords, String).ilike(like))
        )
    try:
        count_stmt = select(func.count()).select_from(Publication)
        list_stmt = select(Publication).order_by(Publication.published_at.desc()).offset(skip).limit(limit)
        for f in filters:
            count_stmt = count_stmt.where(f)
            list_stmt = list_stmt.where(f)

        total = (await db.execute(count_stmt)).scalar_one()
        publications = (await db.execute(list_stmt)).scalars().all()
        return list(publications), total
    
    except SQLAlchemyError: 
        logger.exception(
            "Failed to list published publications: " 
            "category=%s search=%s skip=%s limit=%s", category, search, skip, limit, 
        ) 
        raise

async def list_publications_by_author(db: SessionDep, author_id: uuid.UUID) -> list[Publication]:
    try:
        result = await db.execute(
            select(Publication).where(Publication.author_id == author_id).order_by(Publication.created_at.desc())
        )
        return list(result.scalars().all())
    except SQLAlchemyError: 
        logger.exception( "Failed to list publications for author: author_id=%s", author_id, ) 
        raise

async def list_pending_review_publications(db: SessionDep, *, skip: int = 0, limit: int = 20) -> list[Publication]:

    if skip < 0: raise ValueError("skip cannot be negative") 
    if limit <= 0: raise ValueError("limit must be greater than 0")

    try:
        result = await db.execute(
            select(Publication)
            .where(Publication.status == PublicationStatus.PENDING_REVIEW)
            .order_by(Publication.submitted_at)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
    
    except SQLAlchemyError: 
        logger.exception( "Failed to list publications pending review: " "skip=%s limit=%s", skip, limit, ) 
        raise

async def create_publication(db: SessionDep, *, author_id: uuid.UUID, publication_number: str, fields: dict[str, Any],) -> Publication:

    publication_number = publication_number.strip() 

    if not publication_number: 
        raise ValueError( "publication_number cannot be empty" )
    
    publication = Publication(author_id=author_id, publication_number=publication_number, **fields)
    try:
        db.add(publication)
        await db.commit()
        await db.refresh(publication)
        return publication
    except IntegrityError: 
        await db.rollback() 
        logger.warning( "Integrity error creating publication: " "author_id=%s publication_number=%s", author_id, publication_number, exc_info=True, ) 
        raise
    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Database error creating publication: " 
                         "author_id=%s publication_number=%s", author_id, publication_number, ) 
        raise

async def update_publication(db: SessionDep, publication: Publication, fields: dict[str, Any],) -> Publication:
    try:
        for key, value in fields.items():
            if value is not None:
                setattr(publication, key, value)
        await db.commit()
        await db.refresh(publication)
        return publication
    except IntegrityError: 
        await db.rollback() 
        logger.warning( "Integrity error updating publication: " 
                       "publication_id=%s", publication.id, exc_info=True, ) 
        raise 
    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Database error updating publication: " 
                                             "publication_id=%s", publication.id, ) 
        raise
    
async def delete_publication(db: SessionDep, publication: Publication) -> None:
    try: 
        await db.delete(publication) 
        await db.commit() 
    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Database error deleting publication: " 
                         "publication_id=%s", publication.id, ) 
        raise


async def set_publication_file_url(db: SessionDep, publication: Publication, file_url: str) -> Publication:
    file_url = file_url.strip() 
    if not file_url: 
        raise ValueError("file_url cannot be empty") 
    try: 
        publication.file_url = file_url 
        await db.flush() 
        await db.refresh(publication) 
        return publication 
    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Failed to set publication file URL: "
                          "publication_id=%s", publication.id, ) 
        raise

async def submit_publication_for_review(db: SessionDep, publication: Publication) -> Publication:
    try: 
        publication.status = PublicationStatus.PENDING_REVIEW 
        publication.submitted_at = datetime.now(timezone.utc) 
        # Previous rejection feedback should not carry into 
        # a new review cycle unless your business rules require it. 
        publication.review_notes = None 
        publication.reviewed_by = None 
        await db.flush() 
        await db.refresh(publication) 
        return publication 
    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Failed to submit publication for review: " 
                         "publication_id=%s", publication.id, ) 
        raise


async def approve_publication(db: SessionDep, publication: Publication, *, reviewer_id: uuid.UUID, notes: str | None) -> Publication:
    try:
        publication.status = PublicationStatus.PUBLISHED
        publication.published_at = datetime.now(timezone.utc)
        publication.reviewed_by = reviewer_id
        publication.review_notes = notes
        await db.commit()
        await db.refresh(publication)
        return publication
    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Failed to approve publication: " 
                         "publication_id=%s reviewer_id=%s", publication.id, reviewer_id, ) 
        raise

async def reject_publication(db: SessionDep, publication: Publication, *, reviewer_id: uuid.UUID, notes: str) -> Publication:
    notes = notes.strip() 
    if not notes: 
        raise ValueError( "Rejection notes cannot be empty" )
    try:
        publication.status = PublicationStatus.REJECTED
        publication.reviewed_by = reviewer_id
        publication.review_notes = notes
        await db.commit()
        await db.refresh(publication)
        return publication
    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Failed to reject publication: " 
                         "publication_id=%s reviewer_id=%s", publication.id, reviewer_id, ) 
        raise

async def increment_publication_view(db: SessionDep, publication_id: uuid.UUID) -> None:
    try: 
        stmt = (update(Publication).where( Publication.id == publication_id,).values( view_count=Publication.view_count + 1, )) 
        await db.execute(stmt) 
    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Failed to increment publication view count: " 
                         "publication_id=%s", publication_id, ) 
        raise


async def increment_publication_download(db: SessionDep, publication_id: uuid.UUID,) -> None:
    try: 
        stmt = ( update(Publication).where( Publication.id == publication_id,).values(download_count=Publication.download_count + 1,)) 
        await db.execute(stmt) 
    except SQLAlchemyError: 
        await db.rollback() 
        logger.exception( "Failed to increment publication download count: " 
                         "publication_id=%s", publication_id, ) 
        raise
    