# app/routes/publications/student.py
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile, status
# from sqlalchemy.ext.asyncio import SessionDep

from app.core import storage
from app.core.config import settings
from app.core.deps import CurrentUser, SessionDep
from app.crud.publications import bookmark_api as bookmark_crud
from app.crud.publications import publication_api as publication_crud
from app.models.publications.publication import Publication, PublicationStatus
from app.models.users.user import User
from app.schemas.auth.auth import MessageResponse
from app.schemas.publications.bookmark import BookmarkRead
from app.schemas.publications.publication import (
    PublicationCreate,
    PublicationFileUploadResponse,
    PublicationRead,
    PublicationUpdate,
)
from app.services.publications import publication_service_api

router = APIRouter( prefix="/publications/student", tags=["Student Publications"])


async def _get_owned_publication(db: SessionDep, current_user: User, publication_id: uuid.UUID) -> Publication:
    publication = await publication_crud.get_publication_by_id(db, publication_id)
    if publication is None or publication.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
    return publication


@router.post("/create", response_model=PublicationRead, status_code=status.HTTP_201_CREATED)
async def create_publication(payload: PublicationCreate, db: SessionDep, current_user: CurrentUser) -> PublicationRead:
    publication = await publication_service_api.create_publication_draft(db, author=current_user, payload=payload)
    return PublicationRead.model_validate(publication)


@router.get("/me", response_model=list[PublicationRead])
async def list_my_publications(db: SessionDep, current_user: CurrentUser) -> list[PublicationRead]:
    publications = await publication_crud.list_publications_by_author(db, current_user.id)
    return [PublicationRead.model_validate(p) for p in publications]


@router.get("/me/bookmarks/all", response_model=list[PublicationRead])
async def list_my_bookmarks(db: SessionDep, current_user: CurrentUser) -> list[PublicationRead]:
    bookmarks = await bookmark_crud.list_bookmarks_by_user(db, current_user.id)
    publications = []
    for b in bookmarks:
        publication = await publication_crud.get_publication_by_id(db, b.publication_id)
        if publication is not None:
            publications.append(publication)
    return [PublicationRead.model_validate(p) for p in publications]


@router.get("/me/read/{publication_id}", response_model=PublicationRead)
async def get_my_publication(publication_id: uuid.UUID, db: SessionDep, current_user: CurrentUser) -> PublicationRead:
    publication = await _get_owned_publication(db, current_user, publication_id)
    return PublicationRead.model_validate(publication)


@router.patch("/me/update/{publication_id}", response_model=PublicationRead)
async def update_my_publication(
    publication_id: uuid.UUID, payload: PublicationUpdate, db: SessionDep, current_user: CurrentUser
) -> PublicationRead:
    publication = await _get_owned_publication(db, current_user, publication_id)
    if publication.status not in (PublicationStatus.DRAFT, PublicationStatus.REJECTED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft or rejected publications can be edited",
        )

    publication = await publication_crud.update_publication(
        db, publication, fields=payload.model_dump(exclude_unset=True)
    )
    return PublicationRead.model_validate(publication)


@router.delete("/me/delete/{publication_id}", response_model=MessageResponse)
async def delete_my_publication(publication_id: uuid.UUID, db: SessionDep, current_user: CurrentUser) -> MessageResponse:
    publication = await _get_owned_publication(db, current_user, publication_id)
    if publication.status != PublicationStatus.DRAFT:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only draft publications can be deleted")

    await publication_crud.delete_publication(db, publication)
    return MessageResponse(message="Publication deleted")


@router.post("/me/upload/{publication_id}/file", response_model=PublicationFileUploadResponse)
async def upload_publication_file(
    publication_id: uuid.UUID, db: SessionDep, current_user: CurrentUser, file: UploadFile = File(...)
) -> PublicationFileUploadResponse:
    publication = await _get_owned_publication(db, current_user, publication_id)
    if publication.status not in (PublicationStatus.DRAFT, PublicationStatus.REJECTED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft or rejected publications can have their file replaced",
        )

    if file.content_type not in settings.PUBLICATION_ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Allowed: {', '.join(settings.PUBLICATION_ALLOWED_CONTENT_TYPES)}",
        )

    content = await file.read()
    max_bytes = settings.PUBLICATION_MAX_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size is {settings.PUBLICATION_MAX_SIZE_MB}MB",
        )

    try:
        file_url = storage.upload_publication_file(
            publication_id=publication.id, content=content, content_type=file.content_type
        )
    except storage.StorageNotConfiguredError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Publication storage is not configured")

    await publication_crud.set_publication_file_url(db, publication, file_url)
    return PublicationFileUploadResponse(file_url=file_url)


@router.post("/me/submit/{publication_id}/submit", response_model=PublicationRead)
async def submit_publication(publication_id: uuid.UUID, db: SessionDep, current_user: CurrentUser) -> PublicationRead:
    publication = await _get_owned_publication(db, current_user, publication_id)
    try:
        publication = await publication_service_api.submit_publication_for_reviews(db, publication)
    except publication_service_api.InvalidStatusTransitionError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)
    return PublicationRead.model_validate(publication)


@router.post("/bookmark/{publication_id}/bookmark", response_model=BookmarkRead, status_code=status.HTTP_201_CREATED)
async def bookmark_publication(publication_id: uuid.UUID, db: SessionDep, current_user: CurrentUser) -> BookmarkRead:
    publication = await publication_crud.get_publication_by_id(db, publication_id)
    if publication is None or publication.status != PublicationStatus.PUBLISHED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")

    existing = await bookmark_crud.get(db, user_id=current_user.id, publication_id=publication_id)
    if existing is not None:
        return BookmarkRead.model_validate(existing)

    bookmark = await bookmark_crud.create(db, user_id=current_user.id, publication_id=publication_id)
    return BookmarkRead.model_validate(bookmark)


@router.delete("/upbookmark/{publication_id}", response_model=MessageResponse)
async def unbookmark_publication(publication_id: uuid.UUID, db: SessionDep, current_user: CurrentUser) -> MessageResponse:
    bookmark = await bookmark_crud.get_bookmark(db, user_id=current_user.id, publication_id=publication_id)
    if bookmark is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bookmark not found")

    await bookmark_crud.delete(db, bookmark)
    return MessageResponse(message="Bookmark removed")
