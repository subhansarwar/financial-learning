# app/crud/auth/refresh_token.py
import uuid
from datetime import datetime, timezone

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth.refresh_token import RefreshToken


async def create(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    jti: str,
    expires_at: datetime,
    user_agent: str | None = None,
    ip_address: str | None = None,
) -> RefreshToken:
    token = RefreshToken(
        user_id=user_id,
        jti=jti,
        expires_at=expires_at,
        user_agent=user_agent,
        ip_address=ip_address,
    )
    db.add(token)
    await db.commit()
    await db.refresh(token)
    return token


async def get_by_jti(db: AsyncSession, jti: str) -> RefreshToken | None:
    result = await db.execute(select(RefreshToken).where(RefreshToken.jti == jti))
    return result.scalar_one_or_none()


def is_usable(token: RefreshToken) -> bool:
    if token.revoked_at is not None:
        return False
    return token.expires_at > datetime.now(timezone.utc)


async def revoke(db: AsyncSession, token: RefreshToken) -> None:
    if token.revoked_at is None:
        token.revoked_at = datetime.now(timezone.utc)
        await db.commit()


async def revoke_all_for_user(db: AsyncSession, user_id: uuid.UUID) -> None:
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=datetime.now(timezone.utc))
    )
    await db.commit()


async def delete_expired(db: AsyncSession, *, older_than: datetime) -> int:
    """Used by the maintenance service to prune rows that no longer matter."""
    result = await db.execute(select(RefreshToken).where(RefreshToken.expires_at < older_than))
    tokens = result.scalars().all()
    for token in tokens:
        await db.delete(token)
    await db.commit()
    return len(tokens)
