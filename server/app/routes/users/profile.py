# app/routes/users/profile.py
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.core import storage
from app.core.config import settings
from app.core.deps import CurrentUser, SessionDep
from app.core.security import verify_password
from app.crud.users import user as user_crud
from app.schemas.auth.auth import MessageResponse
from app.schemas.users.user import (
    AvatarUploadResponse,
    ChangePasswordRequest,
    EmailChangeConfirm,
    EmailChangeRequest,
    UserRead,
    UserUpdate,
)
from app.services.auth import otp_service
from app.services.users.email_service import send_otp_email, send_password_changed_email

router = APIRouter()


@router.get("/me", response_model=UserRead)
async def get_me(current_user: CurrentUser) -> UserRead:
    return UserRead.model_validate(current_user)


@router.patch("/me", response_model=UserRead)
async def update_me(payload: UserUpdate, db: SessionDep, current_user: CurrentUser) -> UserRead:
    updated = await user_crud.update_profile(db, current_user, full_name=payload.full_name)
    return UserRead.model_validate(updated)


@router.post("/me/change-password", response_model=MessageResponse)
async def change_password(payload: ChangePasswordRequest, db: SessionDep, current_user: CurrentUser) -> MessageResponse:
    if current_user.hashed_password is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account has no password set — it was created via social login",
        )
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Current password is incorrect")

    await user_crud.set_password(db, current_user, payload.new_password)
    send_password_changed_email.delay(current_user.email)
    return MessageResponse(message="Password changed")


@router.post("/me/avatar", response_model=AvatarUploadResponse)
async def upload_avatar(db: SessionDep, current_user: CurrentUser, file: UploadFile = File(...)) -> AvatarUploadResponse:
    if file.content_type not in settings.AVATAR_ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Allowed: {', '.join(settings.AVATAR_ALLOWED_CONTENT_TYPES)}",
        )

    content = await file.read()
    max_bytes = settings.AVATAR_MAX_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"File too large. Max size is {settings.AVATAR_MAX_SIZE_MB}MB"
        )

    try:
        avatar_url = storage.upload_avatar(user_id=current_user.id, content=content, content_type=file.content_type)
    except storage.StorageNotConfiguredError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Avatar storage is not configured")

    await user_crud.set_avatar_url(db, current_user, avatar_url)
    return AvatarUploadResponse(avatar_url=avatar_url)


@router.post("/me/email-change/request", response_model=MessageResponse)
async def request_email_change(payload: EmailChangeRequest, db: SessionDep, current_user: CurrentUser) -> MessageResponse:
    if payload.new_email.lower() == current_user.email.lower():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="That's already your current email")

    existing = await user_crud.get_by_email(db, payload.new_email)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="That email is already in use")

    try:
        code = await otp_service.generate_and_store(
            current_user.email, "email_change", extra={"new_email": payload.new_email.lower()}
        )
    except otp_service.OTPCooldownError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Please wait {exc.retry_after_seconds}s before requesting another code",
        )

    send_otp_email.delay(payload.new_email, code, "email_change")
    return MessageResponse(message="Verification code sent to your new email address")


@router.post("/me/email-change/confirm", response_model=UserRead)
async def confirm_email_change(payload: EmailChangeConfirm, db: SessionDep, current_user: CurrentUser) -> UserRead:
    try:
        extra = await otp_service.verify(current_user.email, "email_change", payload.code)
    except otp_service.OTPNotFoundError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No pending email change for this account")
    except otp_service.OTPInvalidCodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid code — {exc.attempts_remaining} attempt(s) remaining",
        )
    except otp_service.OTPMaxAttemptsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Too many incorrect attempts — request a new code"
        )

    new_email = extra.get("new_email")
    if not new_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No pending email change for this account")

    await user_crud.set_email(db, current_user, new_email)
    return UserRead.model_validate(current_user)
