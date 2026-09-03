# app/crud/courses/certificate_api.py
import uuid
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from app.core.deps import SessionDep
from app.core.security import logger
from app.models.students.certificate import Certificate

async def get_certificate_by_user_course(db: SessionDep, *, user_id: uuid.UUID, course_id: uuid.UUID) -> Certificate | None:
    try:
        result = await db.execute(select(Certificate).where(Certificate.user_id == user_id, Certificate.course_id == course_id))
        return result.scalar_one_or_none()
    except SQLAlchemyError:
        logger.exception("Failed to fetch certificate for user_id=%s course_id=%s",user_id, course_id,)
        raise

async def get_certificate_by_id(db: SessionDep, certificate_number: str) -> Certificate | None:
    certificate_number = certificate_number.strip()

    if not certificate_number:
        raise ValueError("certificate_number cannot be empty")
    try:
        result = await db.execute(select(Certificate).where(Certificate.certificate_number == certificate_number))
        return result.scalar_one_or_none()
    except SQLAlchemyError:
        logger.exception("Failed to fetch certificate_number=%s", certificate_number,)
        raise

async def list_all_certificate(db: SessionDep, user_id: uuid.UUID) -> list[Certificate]:
    try:
        result = await db.execute(select(Certificate).where(Certificate.user_id == user_id).order_by(Certificate.issued_at.desc()))
        return list(result.scalars().all())
    except SQLAlchemyError:
        logger.exception(
            "Failed to fetch user_id=%s",
            user_id,
        )
        raise

async def create_certificate(db: SessionDep, *, user_id: uuid.UUID, course_id: uuid.UUID, certificate_number: str, pdf_url: str) -> Certificate:
    certificate_number = certificate_number.strip()
    pdf_url = pdf_url.strip()

    if not certificate_number:
        raise ValueError("certificate_number cannot be empty")

    if not pdf_url:
        raise ValueError("pdf_url cannot be empty")
    try:
        certificate = Certificate(user_id=user_id, course_id=course_id, certificate_number=certificate_number, pdf_url=pdf_url)

        db.add(certificate)
        await db.commit()
        await db.refresh(certificate)

        return certificate

    except IntegrityError:
        await db.rollback()

        logger.warning(
            ("Integrity error while creating certificate "
            "user_id=%s course_id=%s certificate_number=%s"),
            user_id, course_id, certificate_number, exc_info=True,
        )

        raise
