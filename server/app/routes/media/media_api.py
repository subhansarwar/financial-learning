# app/routes/media/media_api.py
#
# Two near-identical admin APIs for the media library, built from one factory so the
# IMAGES and VIDEOS routers stay in lock-step:
#
#   IMAGES  ->  /admin/media/images    (tag: "IMAGES")
#   VIDEOS  ->  /admin/media/videos    (tag: "VIDEOS")
#
# Every upload picks a container: Website | Course Material | Case Studies.
#
#   1. Create  -> POST   /admin/media/{images|videos}
#   2. Update  -> PUT    /admin/media/{images|videos}/{asset_id}   (replace file and/or metadata)
#   3. Delete  -> DELETE /admin/media/{images|videos}/{asset_id}
#
# Plus GET (list, filterable by container) and GET /{asset_id} for retrieval.
import uuid

from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile, status

from app.core import storage
from app.core.config import settings
from app.core.deps import CurrentAdmin, SessionDep
from app.crud.media import media_asset as media_crud
from app.models.media.media_asset import MediaContainer, MediaKind
from app.schemas.auth.auth import MessageResponse
from app.schemas.media.media_asset import MediaAssetRead


def _make_router(*, kind: MediaKind, tag: str, path_segment: str, allowed_types: tuple[str, ...], max_size_mb: int) -> APIRouter:
    router = APIRouter(prefix=f"/admin/media/{path_segment}", tags=[tag])
    max_bytes = max_size_mb * 1024 * 1024
    allowed_label = ", ".join(allowed_types)

    async def _read_validated_upload(file: UploadFile) -> bytes:
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"Unsupported {kind.value} type '{file.content_type}'. Allowed: {allowed_label}",
            )
        content = await file.read()
        if not content:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty")
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Max size is {max_size_mb}MB",
            )
        return content

    @router.get("", response_model=list[MediaAssetRead])
    async def list_media(
        db: SessionDep,
        _admin: CurrentAdmin,
        container: MediaContainer | None = Query(default=None, description="Filter by container"),
        skip: int = Query(default=0, ge=0),
        limit: int = Query(default=50, ge=1, le=200),
    ) -> list[MediaAssetRead]:
        assets, _ = await media_crud.list_assets(db, kind=kind, container=container, skip=skip, limit=limit)
        return [MediaAssetRead.model_validate(a) for a in assets]

    @router.get("/{asset_id}", response_model=MediaAssetRead)
    async def get_media(asset_id: uuid.UUID, db: SessionDep, _admin: CurrentAdmin) -> MediaAssetRead:
        asset = await media_crud.get_by_id(db, asset_id)
        if asset is None or asset.kind != kind:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{kind.value.title()} not found")
        return MediaAssetRead.model_validate(asset)

    # 1. CREATE
    @router.post("", response_model=MediaAssetRead, status_code=status.HTTP_201_CREATED)
    async def create_media(
        db: SessionDep,
        admin: CurrentAdmin,
        container: MediaContainer = Form(..., description="Website | Course Material | Case Studies"),
        file: UploadFile = File(...),
        title: str | None = Form(default=None, max_length=200),
        alt_text: str | None = Form(default=None, max_length=400),
    ) -> MediaAssetRead:
        content = await _read_validated_upload(file)

        asset_id = uuid.uuid4()
        try:
            storage_path, file_url = storage.upload_media(
                asset_id=asset_id,
                container=container.value,
                kind=kind.value,
                content=content,
                content_type=file.content_type,
                filename=file.filename,
            )
        except storage.StorageNotConfiguredError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Media storage is not configured"
            )

        asset = await media_crud.create_asset(
            db,
            fields={
                "id": asset_id,
                "kind": kind,
                "container": container,
                "title": title,
                "alt_text": alt_text,
                "original_filename": file.filename,
                "storage_path": storage_path,
                "file_url": file_url,
                "content_type": file.content_type,
                "size_bytes": len(content),
                "uploaded_by": admin.id,
            },
        )
        return MediaAssetRead.model_validate(asset)

    # 2. UPDATE — swap the file, the container, and/or the metadata. All fields optional.
    @router.put("/{asset_id}", response_model=MediaAssetRead)
    async def update_media(
        asset_id: uuid.UUID,
        db: SessionDep,
        _admin: CurrentAdmin,
        container: MediaContainer | None = Form(default=None, description="Move to another container"),
        file: UploadFile | None = File(default=None),
        title: str | None = Form(default=None, max_length=200),
        alt_text: str | None = Form(default=None, max_length=400),
    ) -> MediaAssetRead:
        asset = await media_crud.get_by_id(db, asset_id)
        if asset is None or asset.kind != kind:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{kind.value.title()} not found")

        fields: dict = {}
        if title is not None:
            fields["title"] = title
        if alt_text is not None:
            fields["alt_text"] = alt_text

        new_container = container or asset.container
        replacing_file = file is not None

        if replacing_file:
            content = await _read_validated_upload(file)
            old_storage_path = asset.storage_path
            try:
                storage_path, file_url = storage.upload_media(
                    asset_id=asset.id,
                    container=new_container.value,
                    kind=kind.value,
                    content=content,
                    content_type=file.content_type,
                    filename=file.filename,
                )
            except storage.StorageNotConfiguredError:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Media storage is not configured"
                )
            fields.update(
                container=new_container,
                original_filename=file.filename,
                storage_path=storage_path,
                file_url=file_url,
                content_type=file.content_type,
                size_bytes=len(content),
            )
            if old_storage_path != storage_path:
                try:
                    storage.delete_media(storage_path=old_storage_path)
                except Exception:  # best-effort cleanup — the new object is already live
                    pass
        elif container is not None and container != asset.container:
            # Metadata-only container move: keep the stored object where it is; only the
            # logical grouping changes. (Re-upload the file to physically relocate it.)
            fields["container"] = new_container

        if not fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nothing to update — provide a new file, container, title, or alt_text",
            )

        asset = await media_crud.update_asset(db, asset, fields=fields)
        return MediaAssetRead.model_validate(asset)

    # 3. DELETE
    @router.delete("/{asset_id}", response_model=MessageResponse)
    async def delete_media(asset_id: uuid.UUID, db: SessionDep, _admin: CurrentAdmin) -> MessageResponse:
        asset = await media_crud.get_by_id(db, asset_id)
        if asset is None or asset.kind != kind:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{kind.value.title()} not found")

        storage_path = asset.storage_path
        await media_crud.delete_asset(db, asset)

        try:
            storage.delete_media(storage_path=storage_path)
        except storage.StorageNotConfiguredError:
            pass  # row is gone; nothing to remove from a store that was never configured
        except Exception:
            pass  # row is gone; a dangling object is acceptable and can be swept later

        return MessageResponse(message=f"{kind.value.title()} deleted")

    return router


images_router = _make_router(
    kind=MediaKind.IMAGE,
    tag="IMAGES",
    path_segment="images",
    allowed_types=settings.MEDIA_IMAGE_ALLOWED_CONTENT_TYPES,
    max_size_mb=settings.MEDIA_IMAGE_MAX_SIZE_MB,
)

videos_router = _make_router(
    kind=MediaKind.VIDEO,
    tag="VIDEOS",
    path_segment="videos",
    allowed_types=settings.MEDIA_VIDEO_ALLOWED_CONTENT_TYPES,
    max_size_mb=settings.MEDIA_VIDEO_MAX_SIZE_MB,
)
