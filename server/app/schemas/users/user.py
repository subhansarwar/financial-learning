# app/schemas/users/user.py
import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.core.security import PASSWORD_MIN_LENGTH, validate_password_strength


class UserRead(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    avatar_url: str | None
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=150)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=PASSWORD_MIN_LENGTH)

    @field_validator("new_password")
    @classmethod
    def _check_strength(cls, v: str) -> str:
        return validate_password_strength(v)


class EmailChangeRequest(BaseModel):
    new_email: EmailStr


class EmailChangeConfirm(BaseModel):
    code: str = Field(min_length=4, max_length=8)


class AvatarUploadResponse(BaseModel):
    avatar_url: str
