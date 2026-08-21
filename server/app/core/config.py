# app/core/config.py
from pydantic_settings import BaseSettings
from urllib.parse import quote

class Settings(BaseSettings):
    APP_NAME: str = "Financial Learning Platform"
    DATABASE_URL: str
    DATABASE_ECHO: bool = False
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_DB: int
    REDIS_PASSWORD: str | None = None
    REDIS_KEY_PREFIX: str

    
    @property
    def REDIS_URL(self) -> str:
        auth = f":{quote(self.REDIS_PASSWORD)}@" if self.REDIS_PASSWORD else ""
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # OTP
    OTP_LENGTH: int = 6
    OTP_EXPIRE_MINUTES: int = 10
    OTP_RESEND_COOLDOWN_SECONDS: int = 60
    OTP_MAX_ATTEMPTS: int = 5

    # Login / lockout
    LOGIN_MAX_FAILED_ATTEMPTS: int = 5
    LOGIN_LOCKOUT_MINUTES: int = 15

    # Avatar upload
    AVATAR_MAX_SIZE_MB: int = 5
    AVATAR_ALLOWED_CONTENT_TYPES: tuple[str, ...] = ("image/jpeg", "image/png", "image/webp")

    # SMTP (email delivery for OTPs and account notifications)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    SMTP_FROM_EMAIL: str
    SMTP_FROM_NAME: str = "Financial Learning Platform"

    # Supabase Storage (avatar uploads) — optional, avatar endpoint 503s if unset
    SUPABASE_URL: str | None = None
    SUPABASE_SERVICE_ROLE_KEY: str | None = None
    SUPABASE_AVATAR_BUCKET: str = "avatars"
    SUPABASE_CERTIFICATE_BUCKET: str = "certificates"
    SUPABASE_PUBLICATION_BUCKET: str = "publications"

    # Course catalog
    COURSE_CATALOG_PAGE_SIZE: int = 20

    # Student publications
    PUBLICATION_CATALOG_PAGE_SIZE: int = 20
    PUBLICATION_MAX_SIZE_MB: int = 20
    PUBLICATION_ALLOWED_CONTENT_TYPES: tuple[str, ...] = ("application/pdf",)

    # Social login — optional, respective endpoint 503s if unset
    GOOGLE_CLIENT_ID: str | None = None
    APPLE_CLIENT_ID: str | None = None

    # Admin access — Google accounts allowed to authenticate via /api/auth/admin/google, as a
    # comma-separated string ("a@gmail.com,b@gmail.com"). Kept as a plain str (not list[str]) so
    # pydantic-settings doesn't try to JSON-decode it as a "complex" env value.
    # Anyone not on this list is refused admin login even if their user row has is_admin set.
    ADMIN_EMAILS: str = ""

    @property
    def ADMIN_EMAIL_SET(self) -> set[str]:
        return {e.strip().lower() for e in self.ADMIN_EMAILS.split(",") if e.strip()}

    FRONTEND_URL: str = "http://localhost:3000"

    BACKEND_CORS_ORIGINS: list[str] = []

    @property
    def CORS_ORIGINS(self) -> list[str]:
        """Falls back to the configured frontend origin instead of '*' — a wildcard origin
        combined with allow_credentials=True is rejected by browsers and is a CORS misconfig."""
        return self.BACKEND_CORS_ORIGINS or [self.FRONTEND_URL]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
