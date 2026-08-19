# app/schemas/courses/certificate.py
import uuid
from datetime import datetime

from pydantic import BaseModel


class CertificateRead(BaseModel):
    id: uuid.UUID
    certificate_number: str
    course_id: uuid.UUID
    pdf_url: str
    issued_at: datetime

    class Config:
        from_attributes = True


class CertificateVerifyResponse(BaseModel):
    valid: bool
    certificate_number: str
    course_title: str | None = None
    holder_name: str | None = None
    issued_at: datetime | None = None
