# app/services/users/mailer.py
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr, parseaddr

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_email(*, to: str, subject: str, html_body: str) -> None:
    # SMTP_FROM_EMAIL is supposed to be a bare address, but if it's ever misconfigured as
    # "Name <addr>" (as it was — see mailer.py history), parseaddr still pulls out just the
    # address instead of nesting it inside another display name and breaking the header/envelope.
    from_address = parseaddr(settings.SMTP_FROM_EMAIL)[1] or settings.SMTP_FROM_EMAIL

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = formataddr((settings.SMTP_FROM_NAME, from_address))
    message["To"] = to
    message.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.sendmail(from_address, [to], message.as_string())

    logger.info("Sent email to %s: %s", to, subject)
