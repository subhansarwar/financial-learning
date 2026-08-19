# app/routes/courses/certificates.py
import uuid

from fastapi import APIRouter, HTTPException, status

from app.core.deps import CurrentUser, SessionDep
from app.crud.courses import certificate as certificate_crud
from app.crud.courses import course as course_crud
from app.crud.users import user as user_crud
from app.schemas.courses.certificate import CertificateRead, CertificateVerifyResponse

router = APIRouter()


@router.get("/me", response_model=list[CertificateRead])
async def list_my_certificates(db: SessionDep, current_user: CurrentUser) -> list[CertificateRead]:
    certificates = await certificate_crud.list_for_user(db, current_user.id)
    return [CertificateRead.model_validate(c) for c in certificates]


@router.get("/{course_id}", response_model=CertificateRead)
async def get_certificate(course_id: uuid.UUID, db: SessionDep, current_user: CurrentUser) -> CertificateRead:
    certificate = await certificate_crud.get_by_user_course(db, user_id=current_user.id, course_id=course_id)
    if certificate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No certificate for this course yet — complete it first"
        )
    return CertificateRead.model_validate(certificate)


@router.get("/verify/{certificate_number}", response_model=CertificateVerifyResponse)
async def verify_certificate(certificate_number: str, db: SessionDep) -> CertificateVerifyResponse:
    certificate = await certificate_crud.get_by_number(db, certificate_number)
    if certificate is None:
        return CertificateVerifyResponse(valid=False, certificate_number=certificate_number)

    course = await course_crud.get_by_id(db, certificate.course_id)
    holder = await user_crud.get_by_id(db, certificate.user_id)

    return CertificateVerifyResponse(
        valid=True,
        certificate_number=certificate.certificate_number,
        course_title=course.title if course else None,
        holder_name=holder.full_name if holder else None,
        issued_at=certificate.issued_at,
    )
