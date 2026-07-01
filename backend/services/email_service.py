import asyncio
import logging
from config import settings

logger = logging.getLogger(__name__)


async def send_email(to: str, subject: str, html: str) -> bool:
    if not settings.resend_api_key:
        logger.info("[DEV] Email to %s: %s", to, subject)
        logger.debug("[DEV] HTML body: %s...", html[:200])
        return True

    try:
        import resend
        resend.api_key = settings.resend_api_key
        params = {"from": settings.email_from, "to": to, "subject": subject, "html": html}
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, lambda: resend.Emails.send(params))
        logger.info("Email sent to %s: %s", to, response.get("id"))
        return True
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to, e)
        return False


async def send_password_reset(email: str, reset_token: str):
    reset_url = f"{settings.frontend_url}/reset-password?token={reset_token}"
    subject = "Reset your LuminaStay password"
    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#1f2937;">Reset your password</h2>
      <p style="color:#6b7280;font-size:14px;">
        We received a request to reset the password for your LuminaStay account.
      </p>
      <a href="{reset_url}" style="display:inline-block;padding:12px 24px;background:#1f2937;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;margin:16px 0;">
        Reset Password
      </a>
      <p style="color:#9ca3af;font-size:12px;">
        This link expires in 1 hour. If you didn't request this, you can ignore this email.
      </p>
    </div>
    """
    return await send_email(email, subject, html)


async def send_otp_email(email: str, otp: str):
    subject = "Your LuminaStay verification code"
    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#1f2937;">Verification code</h2>
      <p style="color:#6b7280;font-size:14px;">Use this code to sign in to your LuminaStay account:</p>
      <div style="font-size:32px;letter-spacing:8px;font-weight:bold;color:#1f2937;text-align:center;padding:16px;background:#f9fafb;border-radius:8px;margin:16px 0;">
        {otp}
      </div>
      <p style="color:#9ca3af;font-size:12px;">This code expires in 5 minutes.</p>
    </div>
    """
    return await send_email(email, subject, html)
