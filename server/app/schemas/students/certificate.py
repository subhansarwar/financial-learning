# app/schemas/courses/certificate.py
import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Literal

class CertificateRead(BaseModel):
    id: uuid.UUID
    certificate_number: str = Field(
        min_length=1,
        max_length=40,
    )
    course_id: uuid.UUID
    pdf_url: str
    issued_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

class CertificateVerifyRequest(BaseModel):
    certificate_number: str = Field(
        min_length=1,
        max_length=40,
    )

class ValidCertificateResponse(BaseModel):
    valid: Literal[True] = True
    certificate_number: str
    course_title: str
    holder_name: str
    issued_at: datetime

class InvalidCertificateResponse(BaseModel):
    valid: Literal[False] = False
    certificate_number: str

CertificateVerifyResponse = (
    ValidCertificateResponse
    | InvalidCertificateResponse
)