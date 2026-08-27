# app/routes/courses/certificates.py
import uuid

from fastapi import APIRouter, HTTPException, status

from app.core.deps import CurrentUser, SessionDep
from app.crud.courses.certificate_api import list_all_certificate, get_certificate_by_id, get_certificate_by_user_course
from app.crud.courses import course_api as course_crud
from app.crud.users.user_api import get_by_id
from app.schemas.courses.certificate import (
    CertificateRead,
    CertificateVerifyResponse,
    ValidCertificateResponse,
    InvalidCertificateResponse,
)

router = APIRouter(prefix="/certificates",
    tags=["Certificates"],)


@router.get("/all", response_model=list[CertificateRead])
async def list_my_certificates(db: SessionDep, current_user: CurrentUser) -> list[CertificateRead]:
    certificates = await list_all_certificate(db, current_user.id)
    return [CertificateRead.model_validate(c) for c in certificates]


@router.get("/read/{course_id}", response_model=CertificateRead)
async def get_certificates(course_id: uuid.UUID, db: SessionDep, current_user: CurrentUser) -> CertificateRead:
    certificate = await get_certificate_by_user_course(db, user_id=current_user.id, course_id=course_id)
    if certificate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No certificate for this course yet — complete it first"
        )
    return CertificateRead.model_validate(certificate)


@router.get("/verify/{certificate_number}", response_model=CertificateVerifyResponse)
async def verify_certificates(certificate_number: str, db: SessionDep) -> CertificateVerifyResponse:
    certificate = await get_certificate_by_id(db, certificate_number)
    if certificate is None:
        return InvalidCertificateResponse(certificate_number=certificate_number)

    course = await course_crud.get_course_by_id(db, certificate.course_id)
    holder = await get_by_id(db, certificate.user_id)

    return ValidCertificateResponse(
        certificate_number=certificate.certificate_number,
        course_title=course.title if course else "",
        holder_name=holder.full_name if holder else "",
        issued_at=certificate.issued_at,
    )
