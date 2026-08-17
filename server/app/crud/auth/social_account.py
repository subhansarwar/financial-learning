# app/crud/auth/social_account.py
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth.social_account import SocialAccount, SocialProvider


async def get_by_provider_subject(
    db: AsyncSession, *, provider: SocialProvider, provider_user_id: str
) -> SocialAccount | None:
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.provider == provider,
            SocialAccount.provider_user_id == provider_user_id,
        )
    )
    return result.scalar_one_or_none()


async def create(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    provider: SocialProvider,
    provider_user_id: str,
    email: str | None = None,
) -> SocialAccount:
    account = SocialAccount(
        user_id=user_id,
        provider=provider,
        provider_user_id=provider_user_id,
        email=email,
    )
    db.add(account)
    await db.commit()
    await db.refresh(account)
    return account
