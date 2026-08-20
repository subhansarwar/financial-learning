# app/crud/courses/certificate.py
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.courses.certificate import Certificate


async def get_by_user_course(db: AsyncSession, *, user_id: uuid.UUID, course_id: uuid.UUID) -> Certificate | None:
    result = await db.execute(
        select(Certificate).where(Certificate.user_id == user_id, Certificate.course_id == course_id)
    )
    return result.scalar_one_or_none()


async def get_by_number(db: AsyncSession, certificate_number: str) -> Certificate | None:
    result = await db.execute(select(Certificate).where(Certificate.certificate_number == certificate_number))
    return result.scalar_one_or_none()


async def list_for_user(db: AsyncSession, user_id: uuid.UUID) -> list[Certificate]:
    result = await db.execute(
        select(Certificate).where(Certificate.user_id == user_id).order_by(Certificate.issued_at.desc())
    )
    return list(result.scalars().all())


async def create(
    db: AsyncSession, *, user_id: uuid.UUID, course_id: uuid.UUID, certificate_number: str, pdf_url: str
) -> Certificate:
    certificate = Certificate(
        user_id=user_id, course_id=course_id, certificate_number=certificate_number, pdf_url=pdf_url
    )
    db.add(certificate)
    await db.commit()
    await db.refresh(certificate)
    return certificate
