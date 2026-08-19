# app/schemas/publications/bookmark.py
import uuid
from datetime import datetime

from pydantic import BaseModel


class BookmarkRead(BaseModel):
    id: uuid.UUID
    publication_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
