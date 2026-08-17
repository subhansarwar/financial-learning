# app/crud/users/user.py
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import hash_password
from app.models.users.user import User


async def get_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email.lower()))
    return result.scalar_one_or_none()


async def get_by_id(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def create_user(
    db: AsyncSession,
    *,
    email: str,
    full_name: str,
    password: str | None = None,
    is_verified: bool = False,
    avatar_url: str | None = None,
) -> User:
    user = User(
        email=email.lower(),
        full_name=full_name,
        hashed_password=hash_password(password) if password else None,
        is_verified=is_verified,
        avatar_url=avatar_url,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def set_verified(db: AsyncSession, user: User) -> None:
    user.is_verified = True
    await db.commit()


async def set_password(db: AsyncSession, user: User, password: str) -> None:
    user.hashed_password = hash_password(password)
    await db.commit()


async def update_profile(db: AsyncSession, user: User, *, full_name: str | None = None) -> User:
    if full_name is not None:
        user.full_name = full_name
    await db.commit()
    await db.refresh(user)
    return user


async def set_avatar_url(db: AsyncSession, user: User, avatar_url: str) -> None:
    user.avatar_url = avatar_url
    await db.commit()


async def set_email(db: AsyncSession, user: User, email: str) -> None:
    user.email = email.lower()
    await db.commit()


async def register_failed_login(db: AsyncSession, user: User) -> None:
    user.failed_login_attempts += 1
    if user.failed_login_attempts >= settings.LOGIN_MAX_FAILED_ATTEMPTS:
        user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=settings.LOGIN_LOCKOUT_MINUTES)
    await db.commit()


async def reset_failed_login(db: AsyncSession, user: User) -> None:
    if user.failed_login_attempts or user.locked_until:
        user.failed_login_attempts = 0
        user.locked_until = None
        await db.commit()


async def invalidate_all_tokens(db: AsyncSession, user: User) -> None:
    user.tokens_invalid_before = datetime.now(timezone.utc)
    await db.commit()
