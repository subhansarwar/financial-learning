# app/core/image_ops.py
#
# Server-side image transcoding for the media library. Raster uploads (JPEG/PNG)
# are re-encoded to WebP before they hit storage, which typically cuts 25-35% off
# the byte size at visually identical quality. Vector art (SVG), animated images
# (GIF, APNG), and formats already as small/modern as WebP (WebP itself, AVIF)
# are left untouched.
import io

from PIL import Image, ImageOps, UnidentifiedImageError

# Source MIME types we re-encode. Everything else passes through verbatim.
_CONVERTIBLE_TYPES = frozenset({"image/jpeg", "image/pjpeg", "image/png"})

# quality: perceptual target (0-100). method: 0 (fast) .. 6 (best ratio, slower).
_WEBP_QUALITY = 82
_WEBP_METHOD = 6

# Modes WebP can encode directly; anything else is converted first.
_WEBP_NATIVE_MODES = frozenset({"RGB", "RGBA", "L", "LA"})


class ImageConversionError(Exception):
    """The uploaded bytes could not be decoded as an image for WebP conversion."""


def to_webp(*, content: bytes, content_type: str) -> tuple[bytes, str] | None:
    """Re-encode ``content`` to WebP when it's a raster format worth transcoding.

    Returns ``(webp_bytes, "image/webp")`` on success, or ``None`` when the input
    should be stored as-is (unsupported type, animated, or already compact). Raises
    :class:`ImageConversionError` when a supposedly-supported image won't decode.
    """
    if content_type not in _CONVERTIBLE_TYPES:
        return None

    try:
        with Image.open(io.BytesIO(content)) as im:
            # Animated source (APNG / multi-frame): keep the original.
            if getattr(im, "n_frames", 1) > 1:
                return None

            im = ImageOps.exif_transpose(im)  # bake in camera orientation

            if im.mode not in _WEBP_NATIVE_MODES:
                has_alpha = im.mode in ("P", "PA") and "transparency" in im.info
                im = im.convert("RGBA" if has_alpha or im.mode == "RGBA" else "RGB")

            buffer = io.BytesIO()
            im.save(buffer, format="WEBP", quality=_WEBP_QUALITY, method=_WEBP_METHOD)
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError) as exc:
        raise ImageConversionError(str(exc)) from exc

    return buffer.getvalue(), "image/webp"
