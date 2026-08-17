# app/schemas/auth/auth.py
from pydantic import BaseModel, EmailStr, Field, field_validator

from app.core.security import PASSWORD_MIN_LENGTH, validate_password_strength


class SignupRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=150)
    password: str = Field(min_length=PASSWORD_MIN_LENGTH)

    @field_validator("password")
    @classmethod
    def _check_strength(cls, v: str) -> str:
        return validate_password_strength(v)


class SignupResponse(BaseModel):
    message: str
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=4, max_length=8)


class ResendOTPRequest(BaseModel):
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str


class MessageResponse(BaseModel):
    message: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=4, max_length=8)
    new_password: str = Field(min_length=PASSWORD_MIN_LENGTH)

    @field_validator("new_password")
    @classmethod
    def _check_strength(cls, v: str) -> str:
        return validate_password_strength(v)


class GoogleLoginRequest(BaseModel):
    id_token: str


class AppleLoginRequest(BaseModel):
    id_token: str
    full_name: str | None = None
