# app/services/publications/publication_service_api.py
import uuid
from app.core.deps import SessionDep
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.crud.publications import publication_api as publication_crud
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


async def create_publication_draft(db: SessionDep, *, author: User, payload: PublicationCreate) -> Publication:
    return await publication_crud.create_publication(
        db, author_id=author.id, publication_number=_generate_publication_number(), **payload.model_dump()
    )


async def submit_publication_for_reviews(db: SessionDep, publication: Publication) -> Publication:
    if publication.status not in (PublicationStatus.DRAFT, PublicationStatus.REJECTED):
        raise InvalidStatusTransitionError(
            f"Cannot submit a publication with status '{publication.status.value}' for review"
        )
    if not publication.file_url:
        raise InvalidStatusTransitionError("Upload the paper's PDF before submitting it for review")

    return await publication_crud.submit_publication_for_review(db, publication)


async def approve_publications(db: SessionDep, publication: Publication, *, reviewer: User, notes: str | None) -> Publication:
    if publication.status != PublicationStatus.PENDING_REVIEW:
        raise InvalidStatusTransitionError("Only publications pending review can be approved")

    return await publication_crud.approve_publication(db, publication, reviewer_id=reviewer.id, notes=notes)


async def reject_publications(db: SessionDep, publication: Publication, *, reviewer: User, notes: str) -> Publication:
    if publication.status != PublicationStatus.PENDING_REVIEW:
        raise InvalidStatusTransitionError("Only publications pending review can be rejected")

    return await publication_crud.reject_publication(db, publication, reviewer_id=reviewer.id, notes=notes)
