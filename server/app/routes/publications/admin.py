# app/routes/publications/admin.py
import uuid

from fastapi import APIRouter, HTTPException, Query, status

from app.core.deps import CurrentAdmin, SessionDep
from app.crud.publications import publication as publication_crud
from app.schemas.publications.publication import ApproveRequest, PublicationRead, RejectRequest
from app.services.publications import publication_service

router = APIRouter()


@router.get("/pending", response_model=list[PublicationRead])
async def list_pending_review(
    db: SessionDep,
    _admin: CurrentAdmin,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
) -> list[PublicationRead]:
    publications = await publication_crud.list_pending_review(db, skip=skip, limit=limit)
    return [PublicationRead.model_validate(p) for p in publications]


@router.get("/{publication_id}", response_model=PublicationRead)
async def get_publication(publication_id: uuid.UUID, db: SessionDep, _admin: CurrentAdmin) -> PublicationRead:
    publication = await publication_crud.get_by_id(db, publication_id)
    if publication is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
    return PublicationRead.model_validate(publication)


@router.post("/{publication_id}/approve", response_model=PublicationRead)
async def approve_publication(
    publication_id: uuid.UUID, payload: ApproveRequest, db: SessionDep, admin: CurrentAdmin
) -> PublicationRead:
    publication = await publication_crud.get_by_id(db, publication_id)
    if publication is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")

    try:
        publication = await publication_service.approve(db, publication, reviewer=admin, notes=payload.notes)
    except publication_service.InvalidStatusTransitionError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)
    return PublicationRead.model_validate(publication)


@router.post("/{publication_id}/reject", response_model=PublicationRead)
async def reject_publication(
    publication_id: uuid.UUID, payload: RejectRequest, db: SessionDep, admin: CurrentAdmin
) -> PublicationRead:
    publication = await publication_crud.get_by_id(db, publication_id)
    if publication is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")

    try:
        publication = await publication_service.reject(db, publication, reviewer=admin, notes=payload.notes)
    except publication_service.InvalidStatusTransitionError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)
    return PublicationRead.model_validate(publication)
