# app/routes/auth/auth.py
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Request, status
from jose import JWTError, jwt
from app.core.config import settings
from app.core.deps import CurrentTokenPayload, CurrentUser, SessionDep
from app.core.security import (
    blocklist_token,
    create_access_token,
    create_refresh_token,
    verify_password,
)
from app.crud.auth import refresh_token_api as refresh_token_crud
from app.crud.auth import social_account_api as social_account_crud
from app.crud.users.user_api import get_by_email, get_by_id, create_user, set_verified, set_password, update_profile, set_avatar_url, register_failed_login, reset_failed_login, invalidate_all_tokens, grant_admin
from app.models.auth.social_account import SocialProvider
from app.models.users.user import User
from app.schemas.auth.auth import (
    AppleLoginRequest,
    ForgotPasswordRequest,
    GoogleLoginRequest,
    LoginRequest,
    LogoutRequest,
    MessageResponse,
    RefreshRequest,
    ResendOTPRequest,
    ResetPasswordRequest,
    SignupRequest,
    SignupResponse,
    TokenPair,
    VerifyOTPRequest,
)
from app.services.auth import otp_service
from app.services.auth.apple_oauth import AppleTokenError, verify_apple_id_token
from app.services.auth.google_oauth import GoogleTokenError, verify_google_id_token_async
from app.services.users.email_service import (
    send_otp_email,
    send_password_changed_email,
    send_welcome_email,
)
from app.services.users.notification_service import notify_new_login

router = APIRouter(prefix="/auth", tags=["Authentication System"])

_GENERIC_FORGOT_PASSWORD_MESSAGE = "If an account with that email exists, a password reset code has been sent."


def _client_ip(request: Request) -> str | None:
    return request.client.host if request.client else None


async def _issue_token_pair(db: SessionDep, user: User, request: Request) -> TokenPair:
    access_token = create_access_token(str(user.id))
    refresh_token_str, jti, expires_at = create_refresh_token(str(user.id))
    await refresh_token_crud.create(
        db,
        user_id=user.id,
        jti=jti,
        expires_at=expires_at,
        user_agent=request.headers.get("user-agent"),
        ip_address=_client_ip(request),
    )
    return TokenPair(
        access_token=access_token,
        refresh_token=refresh_token_str,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


def _decode_refresh_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    return payload


async def _find_or_create_social_user(
    db: SessionDep,
    *,
    provider: SocialProvider,
    subject: str,
    email: str | None,
    full_name: str | None,
    avatar_url: str | None = None,
) -> User:
    account = await social_account_crud.get_by_provider_subject(db, provider=provider, provider_user_id=subject)
    if account is not None:
        user = await get_by_id(db, account.user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account no longer exists")
        return user

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{provider.value.capitalize()} did not provide an email for this account",
        )

    user = await get_by_email(db, email)
    if user is None:
        user = await create_user(
            db,
            email=email,
            full_name=full_name or email.split("@")[0],
            password=None,
            is_verified=True,
            avatar_url=avatar_url,
        )

    await social_account_crud.create(db, user_id=user.id, provider=provider, provider_user_id=subject, email=email)
    return user


@router.post("/signup", response_model=SignupResponse)
async def signup(payload: SignupRequest, db: SessionDep) -> SignupResponse:
    if payload.email.lower() in settings.ADMIN_EMAIL_SET:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email must sign in through the admin Google login",
        )

    existing = await get_by_email(db, payload.email)
    if existing and existing.is_verified:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

    if existing:
        await set_password(db, existing, payload.password)
        await update_profile(db, existing, full_name=payload.full_name)
    else:
        await create_user(
            db, email=payload.email, full_name=payload.full_name, password=payload.password, is_verified=False
        )

    try:
        code = await otp_service.generate_and_store(payload.email, "signup")
    except otp_service.OTPCooldownError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Please wait {exc.retry_after_seconds}s before requesting another code",
        )

    send_otp_email.delay(payload.email, code, "signup")
    return SignupResponse(message="Account created. Check your email for a verification code.", email=payload.email)


@router.post("/verify-otp", response_model=TokenPair)
async def verify_otp(payload: VerifyOTPRequest, db: SessionDep, request: Request) -> TokenPair:
    user = await get_by_email(db, payload.email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    if user.is_verified:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account is already verified")

    try:
        await otp_service.verify(payload.email, "signup", payload.code)
    except otp_service.OTPNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No pending code for this email — request a new one"
        )
    except otp_service.OTPInvalidCodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid code — {exc.attempts_remaining} attempt(s) remaining",
        )
    except otp_service.OTPMaxAttemptsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Too many incorrect attempts — request a new code"
        )

    await set_verified(db, user)
    send_welcome_email.delay(user.email, user.full_name)
    return await _issue_token_pair(db, user, request)


@router.post("/resend-otp", response_model=MessageResponse)
async def resend_otp(payload: ResendOTPRequest, db: SessionDep) -> MessageResponse:
    user = await get_by_email(db, payload.email)
    if user is not None and not user.is_verified:
        try:
            code = await otp_service.generate_and_store(payload.email, "signup")
        except otp_service.OTPCooldownError as exc:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Please wait {exc.retry_after_seconds}s before requesting another code",
            )
        send_otp_email.delay(payload.email, code, "signup")

    return MessageResponse(message="If that account needs verification, a new code has been sent.")


@router.post("/login", response_model=TokenPair)
async def login(payload: LoginRequest, db: SessionDep, request: Request) -> TokenPair:
    invalid_creds = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    user = await get_by_email(db, payload.email)
    if user is None or user.hashed_password is None:
        raise invalid_creds

    if user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin accounts must sign in with Google"
        )

    if user.locked_until and user.locked_until > datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Account is temporarily locked. Try again later."
        )

    if not verify_password(payload.password, user.hashed_password):
        await register_failed_login(db, user)
        raise invalid_creds

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    if not user.is_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Email not verified")

    await reset_failed_login(db, user)
    tokens = await _issue_token_pair(db, user, request)
    notify_new_login.delay(user.email, ip_address=_client_ip(request), user_agent=request.headers.get("user-agent"))
    return tokens


@router.post("/refresh", response_model=TokenPair)
async def refresh(payload: RefreshRequest, db: SessionDep, request: Request) -> TokenPair:
    token_payload = _decode_refresh_token(payload.refresh_token)
    jti = token_payload.get("jti")
    invalid = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token is invalid or expired")

    stored = await refresh_token_crud.get_by_jti(db, jti) if jti else None

    if stored is not None and stored.revoked_at is not None and stored.expires_at > datetime.now(timezone.utc):
        # This jti was already rotated out by an earlier /refresh call, yet someone just
        # presented it again — a legitimate client never reuses a refresh token, so this is
        # a signal the token was copied/stolen. Kill every session for the account instead of
        # just rejecting this one request.
        await refresh_token_crud.revoke_all_for_user(db, stored.user_id)
        breached_user = await get_by_id(db, stored.user_id)
        if breached_user is not None:
            await invalidate_all_tokens(db, breached_user)
        raise invalid

    if stored is None or not refresh_token_crud.is_usable(stored):
        raise invalid

    user = await get_by_id(db, stored.user_id)
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account is unavailable")

    if user.locked_until and user.locked_until > datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is locked")

    await refresh_token_crud.revoke(db, stored)
    return await _issue_token_pair(db, user, request)


@router.post("/logout", response_model=MessageResponse)
async def logout(
    payload: LogoutRequest, db: SessionDep, current_user: CurrentUser, token_payload: CurrentTokenPayload
) -> MessageResponse:
    try:
        refresh_payload = _decode_refresh_token(payload.refresh_token)
    except HTTPException:
        refresh_payload = None

    if refresh_payload is not None:
        stored = await refresh_token_crud.get_by_jti(db, refresh_payload.get("jti"))
        if stored is not None and stored.user_id == current_user.id:
            await refresh_token_crud.revoke(db, stored)

    exp = token_payload.get("exp")
    jti = token_payload.get("jti")
    if exp and jti:
        await blocklist_token(jti, datetime.fromtimestamp(exp, tz=timezone.utc))

    return MessageResponse(message="Logged out")


@router.post("/logout-all", response_model=MessageResponse)
async def logout_all(db: SessionDep, current_user: CurrentUser) -> MessageResponse:
    await refresh_token_crud.revoke_all_for_user(db, current_user.id)
    await invalidate_all_tokens(db, current_user)
    return MessageResponse(message="Logged out of all devices")


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(payload: ForgotPasswordRequest, db: SessionDep) -> MessageResponse:
    user = await get_by_email(db, payload.email)
    if user is not None and user.hashed_password is not None:
        try:
            code = await otp_service.generate_and_store(payload.email, "reset")
            send_otp_email.delay(payload.email, code, "reset")
        except otp_service.OTPCooldownError:
            pass

    return MessageResponse(message=_GENERIC_FORGOT_PASSWORD_MESSAGE)


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(payload: ResetPasswordRequest, db: SessionDep) -> MessageResponse:
    try:
        await otp_service.verify(payload.email, "reset", payload.code)
    except otp_service.OTPNotFoundError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No pending reset code for this email")
    except otp_service.OTPInvalidCodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid code — {exc.attempts_remaining} attempt(s) remaining",
        )
    except otp_service.OTPMaxAttemptsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Too many incorrect attempts — request a new code"
        )

    user = await get_by_email(db, payload.email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account not found")

    if user.hashed_password and verify_password(payload.new_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from your previous password",
        )

    await set_password(db, user, payload.new_password)
    await reset_failed_login(db, user)
    await invalidate_all_tokens(db, user)
    await refresh_token_crud.revoke_all_for_user(db, user.id)
    send_password_changed_email.delay(user.email)

    return MessageResponse(message="Password has been reset. Please log in again.")


@router.post("/google", response_model=TokenPair)
async def google_login(payload: GoogleLoginRequest, db: SessionDep, request: Request) -> TokenPair:
    try:
        info = await verify_google_id_token_async(payload.id_token)
    except RuntimeError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Google login is not configured")
    except GoogleTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google credential")

    user = await _find_or_create_social_user(
        db,
        provider=SocialProvider.GOOGLE,
        subject=info.subject,
        email=info.email,
        full_name=info.full_name,
        avatar_url=info.picture,
    )
    if user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Use the admin login to sign in to this account"
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    tokens = await _issue_token_pair(db, user, request)
    notify_new_login.delay(user.email, ip_address=_client_ip(request), user_agent=request.headers.get("user-agent"))
    return tokens


@router.post("/admin/google", response_model=TokenPair)
async def admin_google_login(payload: GoogleLoginRequest, db: SessionDep, request: Request) -> TokenPair:
    """Admin authentication is Google-only and restricted to settings.ADMIN_EMAILS.
    A Google account not on that allow-list never becomes (or stays authenticated as) an admin here,
    regardless of any is_admin flag already on the row."""
    try:
        info = await verify_google_id_token_async(payload.id_token)
    except RuntimeError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Google login is not configured")
    except GoogleTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google credential")

    if info.email.lower() not in settings.ADMIN_EMAIL_SET:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="This Google account is not authorized for admin access"
        )

    user = await _find_or_create_social_user(
        db,
        provider=SocialProvider.GOOGLE,
        subject=info.subject,
        email=info.email,
        full_name=info.full_name,
        avatar_url=info.picture,
    )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    user = await grant_admin(db, user)

    tokens = await _issue_token_pair(db, user, request)
    notify_new_login.delay(user.email, ip_address=_client_ip(request), user_agent=request.headers.get("user-agent"))
    return tokens


@router.post("/apple", response_model=TokenPair)
async def apple_login(payload: AppleLoginRequest, db: SessionDep, request: Request) -> TokenPair:
    try:
        info = await verify_apple_id_token(payload.id_token)
    except RuntimeError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Apple login is not configured")
    except AppleTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Apple credential")

    user = await _find_or_create_social_user(
        db,
        provider=SocialProvider.APPLE,
        subject=info.subject,
        email=info.email,
        full_name=payload.full_name,
    )
    if user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Use the admin login to sign in to this account"
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    tokens = await _issue_token_pair(db, user, request)
    notify_new_login.delay(user.email, ip_address=_client_ip(request), user_agent=request.headers.get("user-agent"))
    return tokens
