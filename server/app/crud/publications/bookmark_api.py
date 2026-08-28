# app/crud/publications/bookmark_api.py
import uuid
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.core.deps import SessionDep
from app.models.publications.bookmark import PublicationBookmark
from app.core.security import logger

async def get_bookmark(db: SessionDep, *, user_id: uuid.UUID, publication_id: uuid.UUID) -> PublicationBookmark | None:
    try:
        result = await db.execute(
            select(PublicationBookmark).where(
                PublicationBookmark.user_id == user_id, PublicationBookmark.publication_id == publication_id
            )
        )
        return result.scalar_one_or_none()
    except SQLAlchemyError:
        logger.exception(
            "Failed to fetch publication bookmark: "
            "user_id=%s publication_id=%s",
            user_id,
            publication_id,
        )
        raise

async def list_bookmarks_by_user(db: SessionDep, user_id: uuid.UUID) -> list[PublicationBookmark]:
    try:
        result = await db.execute(
            select(PublicationBookmark)
            .where(PublicationBookmark.user_id == user_id)
            .order_by(PublicationBookmark.created_at.desc())
        )
        return list(result.scalars().all())
    except SQLAlchemyError:
        logger.exception(
            "Failed to list publication bookmarks: user_id=%s",
            user_id,
        )
        raise

async def create_bookmark(db: SessionDep, *, user_id: uuid.UUID, publication_id: uuid.UUID) -> PublicationBookmark:
    bookmark = PublicationBookmark(user_id=user_id, publication_id=publication_id)
    try:
        db.add(bookmark)
        await db.commit()
        await db.refresh(bookmark)
        return bookmark
    except IntegrityError:
        await db.rollback()

        logger.warning(
            "Integrity error creating publication bookmark: "
            "user_id=%s publication_id=%s",
            user_id,
            publication_id,
            exc_info=True,
        )

        raise

    except SQLAlchemyError:
        await db.rollback()

        logger.exception(
            "Database error creating publication bookmark: "
            "user_id=%s publication_id=%s",
            user_id,
            publication_id,
        )

        raise

async def delete_bookmark(db: SessionDep, bookmark: PublicationBookmark) -> None:
    try:
        await db.delete(bookmark)
        await db.commit()
    except SQLAlchemyError:
        await db.rollback()

        logger.exception(
            "Database error deleting publication bookmark: "
            "bookmark_id=%s user_id=%s publication_id=%s",
            bookmark.id,
            bookmark.user_id,
            bookmark.publication_id,
        )

        raise