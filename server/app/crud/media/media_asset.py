# app/crud/media/media_asset.py
import uuid
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError

from app.core.deps import SessionDep
from app.core.security import logger
from app.models.media.media_asset import MediaAsset, MediaContainer, MediaKind


async def get_by_id(db: SessionDep, asset_id: uuid.UUID) -> MediaAsset | None:
    try:
        result = await db.execute(select(MediaAsset).where(MediaAsset.id == asset_id))
        return result.scalar_one_or_none()
    except SQLAlchemyError:
        logger.exception("Failed to fetch media asset: asset_id=%s", asset_id)
        raise


async def list_assets(
    db: SessionDep,
    *,
    kind: MediaKind,
    container: MediaContainer | None = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[MediaAsset], int]:
    if skip < 0:
        raise ValueError("skip cannot be negative")
    if limit <= 0:
        raise ValueError("limit must be greater than 0")

    filters = [MediaAsset.kind == kind]
    if container is not None:
        filters.append(MediaAsset.container == container)

    try:
        count_stmt = select(func.count()).select_from(MediaAsset)
        list_stmt = select(MediaAsset).order_by(MediaAsset.created_at.desc()).offset(skip).limit(limit)
        for f in filters:
            count_stmt = count_stmt.where(f)
            list_stmt = list_stmt.where(f)

        total = (await db.execute(count_stmt)).scalar_one()
        assets = (await db.execute(list_stmt)).scalars().all()
        return list(assets), total
    except SQLAlchemyError:
        logger.exception(
            "Failed to list media assets: kind=%s container=%s skip=%s limit=%s", kind, container, skip, limit
        )
        raise


async def create_asset(db: SessionDep, *, fields: dict[str, Any]) -> MediaAsset:
    asset = MediaAsset(**fields)
    try:
        db.add(asset)
        await db.commit()
        await db.refresh(asset)
        return asset
    except SQLAlchemyError:
        await db.rollback()
        logger.exception("Database error creating media asset: fields=%s", {k: fields.get(k) for k in ("kind", "container")})
        raise


async def update_asset(db: SessionDep, asset: MediaAsset, *, fields: dict[str, Any]) -> MediaAsset:
    try:
        for key, value in fields.items():
            setattr(asset, key, value)
        await db.commit()
        await db.refresh(asset)
        return asset
    except SQLAlchemyError:
        await db.rollback()
        logger.exception("Database error updating media asset: asset_id=%s", asset.id)
        raise


async def delete_asset(db: SessionDep, asset: MediaAsset) -> None:
    try:
        await db.delete(asset)
        await db.commit()
    except SQLAlchemyError:
        await db.rollback()
        logger.exception("Database error deleting media asset: asset_id=%s", asset.id)
        raise
