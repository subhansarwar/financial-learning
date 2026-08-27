# app/services/courses/certificate_service_api.py
import io
from reportlab.pdfgen import canvas
import uuid
from datetime import datetime, timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import cm
from app.crud.courses.certificate_api import get_certificate_by_id, get_certificate_by_user_course, create_certificate
from app.core.deps import SessionDep
from app.core.storage import upload_certificate
from app.core.config import settings
from app.models.courses.course import Course
from app.models.users.user import User
from app.models.courses.certificate import Certificate

def _generate_certificate_number() -> str:
    return f"FLP-{uuid.uuid4().hex[:12].upper()}"


def generate_certificate_pdf(*, holder_name: str, course_title: str, certificate_number: str, issued_at: datetime) -> bytes:
    buffer = io.BytesIO()
    width, height = landscape(A4)
    pdf = canvas.Canvas(buffer, pagesize=landscape(A4))

    pdf.setStrokeColor(colors.HexColor("#1E3A5F"))
    pdf.setLineWidth(3)
    pdf.rect(1 * cm, 1 * cm, width - 2 * cm, height - 2 * cm)
    pdf.setLineWidth(1)
    pdf.rect(1.3 * cm, 1.3 * cm, width - 2.6 * cm, height - 2.6 * cm)

    pdf.setFont("Helvetica", 14)
    pdf.setFillColor(colors.HexColor("#1E3A5F"))
    pdf.drawCentredString(width / 2, height - 3.2 * cm, settings.APP_NAME)

    pdf.setFont("Helvetica-Bold", 32)
    pdf.drawCentredString(width / 2, height - 5.2 * cm, "Certificate of Completion")

    pdf.setFont("Helvetica", 14)
    pdf.drawCentredString(width / 2, height - 7 * cm, "This certifies that")

    pdf.setFont("Helvetica-Bold", 26)
    pdf.drawCentredString(width / 2, height - 8.5 * cm, holder_name)

    pdf.setFont("Helvetica", 14)
    pdf.drawCentredString(width / 2, height - 10 * cm, "has successfully completed the course")

    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawCentredString(width / 2, height - 11.5 * cm, course_title)

    pdf.setFont("Helvetica", 11)
    pdf.drawCentredString(width / 2, 3.2 * cm, f"Issued on {issued_at.strftime('%B %d, %Y')}")
    pdf.drawCentredString(width / 2, 2.6 * cm, f"Certificate No. {certificate_number}")

    pdf.showPage()
    pdf.save()
    return buffer.getvalue()


async def issue_certificate(db: SessionDep, *, user: User, course: Course) -> Certificate:
    """Idempotently issues a completion certificate: reuses an existing one for
    this user/course pair, otherwise generates the PDF, uploads it, and persists it."""
    existing = await get_certificate_by_user_course(db, user_id=user.id, course_id=course.id)
    if existing is not None:
        return existing

    certificate_number = _generate_certificate_number()
    issued_at = datetime.now(timezone.utc)
    pdf_bytes = generate_certificate_pdf(
        holder_name=user.full_name,
        course_title=course.title,
        certificate_number=certificate_number,
        issued_at=issued_at,
    )
    pdf_url = upload_certificate(certificate_number=certificate_number, content=pdf_bytes)

    return await create_certificate(
        db, user_id=user.id, course_id=course.id, certificate_number=certificate_number, pdf_url=pdf_url
    )
