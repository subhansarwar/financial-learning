# app/schemas/media/media_asset.py
import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.media.media_asset import MediaContainer, MediaKind


class MediaAssetRead(BaseModel):
    id: uuid.UUID
    kind: MediaKind
    container: MediaContainer
    title: str | None
    alt_text: str | None
    original_filename: str | None
    storage_path: str
    file_url: str
    content_type: str
    size_bytes: int
    uploaded_by: uuid.UUID | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
