# app/services/users/notification_service.py
import logging

from app.core.celery_app import celery_app
from app.services.users.mailer import send_email

logger = logging.getLogger(__name__)


@celery_app.task(name="app.services.users.notification_service.notify_new_login")
def notify_new_login(email: str, *, ip_address: str | None, user_agent: str | None) -> None:
    """Best-effort security notice — a failure here must never block login."""
    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>New login to your account</h2>
      <p>We noticed a new sign-in to your Financial Learning Platform account.</p>
      <ul style="color: #444;">
        <li>IP address: {ip_address or "unknown"}</li>
        <li>Device: {user_agent or "unknown"}</li>
      </ul>
      <p style="color: #666;">If this wasn't you, reset your password and use "log out of all devices" from your account settings.</p>
    </div>
    """
    try:
        send_email(to=email, subject="New login to your account", html_body=html)
    except Exception as exc:
        logger.warning("Failed to send new-login notice to %s: %s", email, exc)
