# app/crud/publications/bookmark.py
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.publications.bookmark import PublicationBookmark


async def get(db: AsyncSession, *, user_id: uuid.UUID, publication_id: uuid.UUID) -> PublicationBookmark | None:
    result = await db.execute(
        select(PublicationBookmark).where(
            PublicationBookmark.user_id == user_id, PublicationBookmark.publication_id == publication_id
        )
    )
    return result.scalar_one_or_none()


async def list_for_user(db: AsyncSession, user_id: uuid.UUID) -> list[PublicationBookmark]:
    result = await db.execute(
        select(PublicationBookmark)
        .where(PublicationBookmark.user_id == user_id)
        .order_by(PublicationBookmark.created_at.desc())
    )
    return list(result.scalars().all())


async def create(db: AsyncSession, *, user_id: uuid.UUID, publication_id: uuid.UUID) -> PublicationBookmark:
    bookmark = PublicationBookmark(user_id=user_id, publication_id=publication_id)
    db.add(bookmark)
    await db.commit()
    await db.refresh(bookmark)
    return bookmark


async def delete(db: AsyncSession, bookmark: PublicationBookmark) -> None:
    await db.delete(bookmark)
    await db.commit()
