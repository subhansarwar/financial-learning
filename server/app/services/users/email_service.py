# app/services/users/email_service.py
import html
import logging

from app.core.celery_app import celery_app
from app.services.users.mailer import send_email

logger = logging.getLogger(__name__)

_OTP_COPY = {
    "signup": ("Verify your email", "Use the code below to verify your email and finish creating your account."),
    "reset": ("Reset your password", "Use the code below to reset your password."),
    "email_change": ("Confirm your new email", "Use the code below to confirm your new email address."),
}


def _otp_email_html(code: str, intro: str) -> str:
    return f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Financial Learning Platform</h2>
      <p>{intro}</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">{code}</p>
      <p style="color: #666;">This code expires shortly and can only be used once. If you didn't request this, you can safely ignore this email.</p>
    </div>
    """


@celery_app.task(name="app.services.users.email_service.send_otp_email", bind=True, max_retries=3)
def send_otp_email(self, email: str, code: str, purpose: str) -> None:
    subject, intro = _OTP_COPY.get(purpose, ("Your verification code", "Use the code below to continue."))
    try:
        send_email(to=email, subject=subject, html_body=_otp_email_html(code, intro))
    except Exception as exc:
        logger.warning("Failed to send OTP email to %s (purpose=%s): %s", email, purpose, exc)
        raise self.retry(exc=exc, countdown=30)


@celery_app.task(name="app.services.users.email_service.send_welcome_email")
def send_welcome_email(email: str, full_name: str) -> None:
    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Welcome, {full_name}!</h2>
      <p>Your account is verified and ready to go. Glad to have you on the Financial Learning Platform.</p>
    </div>
    """
    try:
        send_email(to=email, subject="Welcome to Financial Learning Platform", html_body=html)
    except Exception as exc:
        logger.warning("Failed to send welcome email to %s: %s", email, exc)


@celery_app.task(name="app.services.users.email_service.send_password_changed_email")
def send_password_changed_email(email: str) -> None:
    html = """
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Your password was changed</h2>
      <p>This is a confirmation that your account password was just changed. If this wasn't you, reset your password immediately and contact support.</p>
    </div>
    """
    try:
        send_email(to=email, subject="Your password was changed", html_body=html)
    except Exception as exc:
        logger.warning("Failed to send password-changed email to %s: %s", email, exc)


@celery_app.task(name="app.services.users.email_service.send_publication_approved_email")
def send_publication_approved_email(email: str, title: str, notes: str | None) -> None:
    safe_title, safe_notes = html.escape(title), html.escape(notes) if notes else None
    notes_html = f"<p><strong>Reviewer note:</strong> {safe_notes}</p>" if safe_notes else ""
    body = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Your paper was approved</h2>
      <p>"{safe_title}" has been reviewed and approved. It's now visible to the public on the platform.</p>
      {notes_html}
    </div>
    """
    try:
        send_email(to=email, subject="Your paper was approved", html_body=body)
    except Exception as exc:
        logger.warning("Failed to send publication-approved email to %s: %s", email, exc)


@celery_app.task(name="app.services.users.email_service.send_publication_rejected_email")
def send_publication_rejected_email(email: str, title: str, notes: str) -> None:
    safe_title, safe_notes = html.escape(title), html.escape(notes)
    body = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Your paper was not approved</h2>
      <p>"{safe_title}" was reviewed and was not approved for publication.</p>
      <p><strong>Reviewer note:</strong> {safe_notes}</p>
      <p style="color: #666;">You can edit and resubmit it for another review.</p>
    </div>
    """
    try:
        send_email(to=email, subject="Your paper was not approved", html_body=body)
    except Exception as exc:
        logger.warning("Failed to send publication-rejected email to %s: %s", email, exc)


@celery_app.task(name="app.services.users.email_service.send_publication_deleted_email")
def send_publication_deleted_email(email: str, title: str, notes: str) -> None:
    safe_title, safe_notes = html.escape(title), html.escape(notes)
    body = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Your paper was removed</h2>
      <p>"{safe_title}" has been removed from the platform by an administrator.</p>
      <p><strong>Reason:</strong> {safe_notes}</p>
    </div>
    """
    try:
        send_email(to=email, subject="Your paper was removed", html_body=body)
    except Exception as exc:
        logger.warning("Failed to send publication-deleted email to %s: %s", email, exc)
