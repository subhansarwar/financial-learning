# app/routes/publications/admin.py
import uuid
from fastapi import APIRouter, HTTPException, Query, status
from app.core.deps import CurrentAdmin, SessionDep
from app.crud.publications import publication_api as publication_crud
from app.crud.users.user_api import get_by_id
from app.schemas.auth.auth import MessageResponse
from app.schemas.publications.publication import ApproveRequest, DeleteRequest, PublicationRead, RejectRequest
from app.services.publications import publication_service_api
from app.services.users.email_service import (
    send_publication_approved_email,
    send_publication_deleted_email,
    send_publication_rejected_email,
)

router = APIRouter(prefix="/admin/publications", tags=["Student Publications - Moderation"])

@router.get("/pending/all", response_model=list[PublicationRead])
async def list_pending_reviews(
    db: SessionDep,
    # _admin: CurrentAdmin,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
) -> list[PublicationRead]:
    publications = await publication_crud.list_pending_review_publications(db, skip=skip, limit=limit)
    return [PublicationRead.model_validate(p) for p in publications]

@router.get("/read/{publication_id}", response_model=PublicationRead)
async def get_publications(publication_id: uuid.UUID, db: SessionDep, _admin: CurrentAdmin) -> PublicationRead: # 
    publication = await publication_crud.get_publication_by_id(db, publication_id)
    if publication is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
    return PublicationRead.model_validate(publication)


@router.post("/approve/{publication_id}/approve", response_model=PublicationRead)
async def approve_publication(publication_id: uuid.UUID, payload: ApproveRequest, db: SessionDep, _admin: CurrentAdmin) -> PublicationRead:
    publication = await publication_crud.get_publication_by_id(db, publication_id)
    if publication is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")

    try:
        publication = await publication_service_api.approve(db, publication, reviewer=_admin, notes=payload.notes)
    except publication_service_api.InvalidStatusTransitionError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)

    author = await get_by_id(db, publication.author_id)
    if author is not None:
        send_publication_approved_email.delay(author.email, publication.title, payload.notes)
    return PublicationRead.model_validate(publication)


@router.post("/reject/{publication_id}/reject", response_model=PublicationRead)
async def reject_publication(
    publication_id: uuid.UUID, payload: RejectRequest, db: SessionDep, admin: CurrentAdmin
) -> PublicationRead:
    publication = await publication_crud.get_publication_by_id(db, publication_id)
    if publication is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")

    try:
        publication = await publication_service_api.reject(db, publication, reviewer=admin, notes=payload.notes)
    except publication_service_api.InvalidStatusTransitionError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)

    author = await get_by_id(db, publication.author_id)
    if author is not None:
        send_publication_rejected_email.delay(author.email, publication.title, payload.notes)
    return PublicationRead.model_validate(publication)


@router.delete("/delete/{publication_id}", response_model=MessageResponse)
async def delete_publication(
    publication_id: uuid.UUID, payload: DeleteRequest, db: SessionDep, _admin: CurrentAdmin
) -> MessageResponse:
    publication = await publication_crud.get_publication_by_id(db, publication_id)
    if publication is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")

    author = await get_by_id(db, publication.author_id)
    title = publication.title
    await publication_crud.delete_publication(db, publication)

    if author is not None:
        send_publication_deleted_email.delay(author.email, title, payload.notes)
    return MessageResponse(message="Publication deleted")
