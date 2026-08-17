# app/services/auth/otp_service.py
import hashlib
from typing import Literal

from app.core.config import settings
from app.core.redis import redis_client, rkey
from app.core.security import generate_otp_code

OTPPurpose = Literal["signup", "reset", "email_change"]


class OTPError(Exception):
    """Base class for OTP failures the routes translate into HTTP responses."""


class OTPCooldownError(OTPError):
    def __init__(self, retry_after_seconds: int):
        self.retry_after_seconds = retry_after_seconds
        super().__init__(f"Resend cooldown active for {retry_after_seconds}s")


class OTPNotFoundError(OTPError):
    """No pending OTP for this email/purpose — never requested, or already expired."""


class OTPInvalidCodeError(OTPError):
    def __init__(self, attempts_remaining: int):
        self.attempts_remaining = attempts_remaining
        super().__init__("Invalid OTP code")


class OTPMaxAttemptsError(OTPError):
    """Too many wrong guesses — the OTP has been invalidated, caller must request a new one."""


def _hash_code(email: str, purpose: str, code: str) -> str:
    payload = f"{settings.SECRET_KEY}:{purpose}:{email.lower()}:{code}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def _data_key(email: str, purpose: str) -> str:
    return rkey("auth", "otp", purpose, email.lower())


def _cooldown_key(email: str, purpose: str) -> str:
    return rkey("auth", "otp", "cooldown", purpose, email.lower())


async def generate_and_store(email: str, purpose: OTPPurpose, *, extra: dict[str, str] | None = None) -> str:
    """Generates a fresh OTP, stores its hash in Redis, and returns the plaintext
    code for the caller to email. Raises OTPCooldownError if resent too soon."""
    cooldown_key = _cooldown_key(email, purpose)
    ttl = await redis_client.ttl(cooldown_key)
    if ttl and ttl > 0:
        raise OTPCooldownError(retry_after_seconds=ttl)

    code = generate_otp_code()
    data_key = _data_key(email, purpose)
    mapping = {"code_hash": _hash_code(email, purpose, code), "attempts": "0"}
    if extra:
        mapping.update(extra)

    await redis_client.delete(data_key)
    await redis_client.hset(data_key, mapping=mapping)
    await redis_client.expire(data_key, settings.OTP_EXPIRE_MINUTES * 60)
    await redis_client.set(cooldown_key, "1", ex=settings.OTP_RESEND_COOLDOWN_SECONDS)

    return code


async def verify(email: str, purpose: OTPPurpose, code: str) -> dict[str, str]:
    """Verifies a code and returns any extra data stored alongside it (e.g. the
    pending new email for an email-change flow). Deletes the OTP on success."""
    data_key = _data_key(email, purpose)
    data = await redis_client.hgetall(data_key)
    if not data:
        raise OTPNotFoundError()

    if data.get("code_hash") != _hash_code(email, purpose, code):
        attempts = await redis_client.hincrby(data_key, "attempts", 1)
        if attempts >= settings.OTP_MAX_ATTEMPTS:
            await redis_client.delete(data_key)
            raise OTPMaxAttemptsError()
        raise OTPInvalidCodeError(attempts_remaining=settings.OTP_MAX_ATTEMPTS - attempts)

    await redis_client.delete(data_key)
    return {k: v for k, v in data.items() if k not in ("code_hash", "attempts")}
