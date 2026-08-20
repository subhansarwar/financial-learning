# app/services/publications/publication_service.py
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.publications import publication as publication_crud
from app.models.publications.publication import Publication, PublicationStatus
from app.models.users.user import User
from app.schemas.publications.publication import PublicationCreate


class PublicationError(Exception):
    """Base class for publication workflow failures the routes translate into HTTP responses."""


class InvalidStatusTransitionError(PublicationError):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


def _generate_publication_number() -> str:
    return f"FLP-PUB-{uuid.uuid4().hex[:10].upper()}"


async def create_draft(db: AsyncSession, *, author: User, payload: PublicationCreate) -> Publication:
    return await publication_crud.create_publication(
        db, author_id=author.id, publication_number=_generate_publication_number(), **payload.model_dump()
    )


async def submit_for_review(db: AsyncSession, publication: Publication) -> Publication:
    if publication.status not in (PublicationStatus.DRAFT, PublicationStatus.REJECTED):
        raise InvalidStatusTransitionError(
            f"Cannot submit a publication with status '{publication.status.value}' for review"
        )
    if not publication.file_url:
        raise InvalidStatusTransitionError("Upload the paper's PDF before submitting it for review")

    return await publication_crud.submit_for_review(db, publication)


async def approve(db: AsyncSession, publication: Publication, *, reviewer: User, notes: str | None) -> Publication:
    if publication.status != PublicationStatus.PENDING_REVIEW:
        raise InvalidStatusTransitionError("Only publications pending review can be approved")

    return await publication_crud.approve(db, publication, reviewer_id=reviewer.id, notes=notes)


async def reject(db: AsyncSession, publication: Publication, *, reviewer: User, notes: str) -> Publication:
    if publication.status != PublicationStatus.PENDING_REVIEW:
        raise InvalidStatusTransitionError("Only publications pending review can be rejected")

    return await publication_crud.reject(db, publication, reviewer_id=reviewer.id, notes=notes)
