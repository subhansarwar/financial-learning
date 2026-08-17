# app/services/auth/google_oauth.py
from dataclasses import dataclass

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token

from app.core.config import settings


class GoogleTokenError(Exception):
    """Raised when the Google ID token fails verification."""


@dataclass(frozen=True)
class GoogleUserInfo:
    subject: str
    email: str
    email_verified: bool
    full_name: str | None
    picture: str | None


_request = google_requests.Request()


def verify_google_id_token(token: str) -> GoogleUserInfo:
    if not settings.GOOGLE_CLIENT_ID:
        raise RuntimeError("GOOGLE_CLIENT_ID is not configured")

    try:
        claims = google_id_token.verify_oauth2_token(token, _request, settings.GOOGLE_CLIENT_ID)
    except (ValueError, GoogleTokenError) as exc:
        raise GoogleTokenError(str(exc)) from exc

    email = claims.get("email")
    if not email or not claims.get("email_verified", False):
        raise GoogleTokenError("Google account email is missing or unverified")

    return GoogleUserInfo(
        subject=claims["sub"],
        email=email,
        email_verified=True,
        full_name=claims.get("name"),
        picture=claims.get("picture"),
    )
