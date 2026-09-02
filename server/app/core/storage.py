# app/core/storage.py
import posixpath
import uuid
from supabase import Client, create_client
from app.core.config import settings

class StorageNotConfiguredError(Exception):
    """Raised when Supabase Storage credentials aren't set in the environment."""

_client: Client | None = None


def _get_client() -> Client:
    global _client
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        raise StorageNotConfiguredError("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured")
    if _client is None:
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    return _client


def upload_avatar(*, user_id: uuid.UUID, content: bytes, content_type: str) -> str:
    """Uploads avatar bytes to the configured Supabase Storage bucket and
    returns a public URL. Raises StorageNotConfiguredError if Supabase isn't set up."""
    client = _get_client()
    extension = content_type.split("/")[-1]
    path = f"{user_id}/avatar.{extension}"

    client.storage.from_(settings.SUPABASE_AVATAR_BUCKET).upload(
        path,
        content,
        {"content-type": content_type, "upsert": "true"},
    )
    return client.storage.from_(settings.SUPABASE_AVATAR_BUCKET).get_public_url(path)


def upload_certificate(*, certificate_number: str, content: bytes) -> str:
    """Uploads a generated certificate PDF to the configured Supabase Storage bucket and
    returns a public URL. Raises StorageNotConfiguredError if Supabase isn't set up."""
    client = _get_client()
    path = f"{certificate_number}.pdf"

    client.storage.from_(settings.SUPABASE_CERTIFICATE_BUCKET).upload(
        path,
        content,
        {"content-type": "application/pdf", "upsert": "true"},
    )
    return client.storage.from_(settings.SUPABASE_CERTIFICATE_BUCKET).get_public_url(path)


def upload_publication_file(*, publication_id: uuid.UUID, content: bytes, content_type: str) -> str:
    """Uploads a student-submitted publication PDF to the configured Supabase Storage
    bucket and returns a public URL. Raises StorageNotConfiguredError if Supabase isn't set up."""
    client = _get_client()
    extension = content_type.split("/")[-1]
    path = f"{publication_id}/paper.{extension}"

    client.storage.from_(settings.SUPABASE_PUBLICATION_BUCKET).upload(
        path,
        content,
        {"content-type": content_type, "upsert": "true"},
    )
    return client.storage.from_(settings.SUPABASE_PUBLICATION_BUCKET).get_public_url(path)


def _media_extension(*, filename: str | None, content_type: str) -> str:
    """Best-effort file extension: prefer the uploaded filename, fall back to the MIME subtype."""
    if filename and "." in filename:
        ext = filename.rsplit(".", 1)[-1].strip().lower()
        if ext.isalnum():
            return ext
    subtype = content_type.split("/")[-1].strip().lower()
    subtype = subtype.split("+")[0]  # e.g. "svg+xml" -> "svg"
    return subtype or "bin"


def upload_media(
    *,
    asset_id: uuid.UUID,
    container: str,
    kind: str,
    content: bytes,
    content_type: str,
    filename: str | None = None,
) -> tuple[str, str]:
    """Uploads an image/video for the website, course material, or case studies to the
    configured Supabase Storage media bucket.

    Returns ``(storage_path, public_url)``. Raises StorageNotConfiguredError if Supabase isn't set up.
    """
    client = _get_client()
    extension = _media_extension(filename=filename, content_type=content_type)
    path = f"{container}/{kind}/{asset_id}.{extension}"

    client.storage.from_(settings.SUPABASE_MEDIA_BUCKET).upload(
        path,
        content,
        {"content-type": content_type, "upsert": "true"},
    )
    return path, client.storage.from_(settings.SUPABASE_MEDIA_BUCKET).get_public_url(path)


def delete_media(*, storage_path: str) -> None:
    """Removes a previously uploaded media object from the Supabase Storage media bucket.
    Raises StorageNotConfiguredError if Supabase isn't set up."""
    client = _get_client()
    # Guard against absolute paths / traversal sneaking into the remove() call.
    clean_path = posixpath.normpath(storage_path).lstrip("/")
    client.storage.from_(settings.SUPABASE_MEDIA_BUCKET).remove([clean_path])
