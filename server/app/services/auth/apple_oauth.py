# app/services/auth/apple_oauth.py
import json
from dataclasses import dataclass

import httpx
from jose import jwt
from jose.exceptions import JOSEError

from app.core.config import settings
from app.core.redis import redis_client, rkey

APPLE_ISSUER = "https://appleid.apple.com"
APPLE_JWKS_URL = "https://appleid.apple.com/auth/keys"
_JWKS_CACHE_KEY = rkey("auth", "apple", "jwks")
_JWKS_CACHE_TTL_SECONDS = 3600


class AppleTokenError(Exception):
    """Raised when the Apple identity token fails verification."""


@dataclass(frozen=True)
class AppleUserInfo:
    subject: str
    email: str | None


async def _get_jwks() -> dict:
    cached = await redis_client.get(_JWKS_CACHE_KEY)
    if cached:
        return json.loads(cached)

    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(APPLE_JWKS_URL)
        response.raise_for_status()
        jwks = response.json()

    await redis_client.set(_JWKS_CACHE_KEY, json.dumps(jwks), ex=_JWKS_CACHE_TTL_SECONDS)
    return jwks


async def verify_apple_id_token(token: str) -> AppleUserInfo:
    if not settings.APPLE_CLIENT_ID:
        raise RuntimeError("APPLE_CLIENT_ID is not configured")

    try:
        header = jwt.get_unverified_header(token)
    except JOSEError as exc:
        raise AppleTokenError("Malformed Apple identity token") from exc

    jwks = await _get_jwks()
    matching_key = next((key for key in jwks.get("keys", []) if key.get("kid") == header.get("kid")), None)
    if matching_key is None:
        raise AppleTokenError("No matching Apple signing key found")

    try:
        claims = jwt.decode(
            token,
            matching_key,
            algorithms=["RS256"],
            audience=settings.APPLE_CLIENT_ID,
            issuer=APPLE_ISSUER,
        )
    except JOSEError as exc:
        raise AppleTokenError(str(exc)) from exc

    subject = claims.get("sub")
    if not subject:
        raise AppleTokenError("Apple identity token missing subject")

    return AppleUserInfo(subject=subject, email=claims.get("email"))
