# app/services/users/maintenance_service.py
import asyncio
import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import delete, select

from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.models.auth.refresh_token import RefreshToken
from app.models.users.user import User

logger = logging.getLogger(__name__)

# Abandoned signups (never verified) get cleaned up after this long so a
# stale unverified row can't squat on an email address indefinitely.
UNVERIFIED_USER_TTL = timedelta(hours=24)


async def _cleanup_async() -> tuple[int, int]:
    now = datetime.now(timezone.utc)
    async with SessionLocal() as db:
        expired_tokens = await db.execute(delete(RefreshToken).where(RefreshToken.expires_at < now))

        stale_cutoff = now - UNVERIFIED_USER_TTL
        result = await db.execute(
            select(User.id).where(User.is_verified.is_(False), User.created_at < stale_cutoff)
        )
        stale_user_ids = [row[0] for row in result.all()]
        if stale_user_ids:
            await db.execute(delete(User).where(User.id.in_(stale_user_ids)))

        await db.commit()
        return expired_tokens.rowcount or 0, len(stale_user_ids)


@celery_app.task(name="app.services.users.maintenance_service.cleanup_expired_data")
def cleanup_expired_data() -> None:
    tokens_deleted, users_deleted = asyncio.run(_cleanup_async())
    logger.info(
        "Auth maintenance cleanup: removed %d expired refresh tokens, %d stale unverified users",
        tokens_deleted,
        users_deleted,
    )
