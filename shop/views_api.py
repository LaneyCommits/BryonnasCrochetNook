import json
import re
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import EmailMessage

from .models import CustomOrder


def _is_valid_email(s: str) -> bool:
    if not s or len(s) > 254:
        return False
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", s.strip()))


@csrf_exempt
@require_http_methods(["POST"])
def api_custom_order(request):
    """Accept custom order form: save to DB and email to bcn.shop24@gmail.com."""
    try:
        data = json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "Invalid JSON."}, status=400)

    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()
    email = (data.get("email") or "").strip()
    order = (data.get("order") or "").strip()
    selected_items = data.get("selected_items") or []
    if isinstance(selected_items, str):
        selected_items = [s.strip() for s in selected_items.split(",") if s.strip()]
    selected_items = [s for s in selected_items if isinstance(s, str) and s]

    if not first_name or not last_name:
        return JsonResponse(
            {"ok": False, "error": "First name and last name are required."}, status=400
        )
    if not _is_valid_email(email):
        return JsonResponse(
            {"ok": False, "error": "Please enter a valid email address."}, status=400
        )
    if not order:
        return JsonResponse(
            {"ok": False, "error": "Please describe what you would like made."}, status=400
        )

    # Honeypot: if filled, treat as spam and still return success
    if data.get("_gotcha"):
        return JsonResponse({
            "ok": True,
            "message": "Thank you! We'll be in touch within 5 business days."
        })

    # Build full order text (selected items + details) for DB and email
    order_lines = []
    if selected_items:
        order_lines.append("Items of interest: " + ", ".join(selected_items))
    if order:
        order_lines.append("")
        order_lines.append("Details / request:")
        order_lines.append(order)
    order_text_full = "\n".join(order_lines) if order_lines else order or "(no details)"

    # Save to database
    CustomOrder.objects.create(
        first_name=first_name,
        last_name=last_name,
        email=email,
        order_text=order_text_full,
    )

    # Email if using SMTP (BCN_EMAIL_APP_PASSWORD set)
    if settings.EMAIL_BACKEND == "django.core.mail.backends.smtp.EmailBackend":
        subject = "New Custom Order — Bryonna's Crochet Nook"
        body = f"""A new custom order was submitted from the website.

Name: {first_name} {last_name}
Email: {email}

"""
        if selected_items:
            body += "Items of interest: " + ", ".join(selected_items) + "\n\n"
        body += f"""Order details / request:
{order}

—
Reply to this email to contact the customer.
"""
        to_email = getattr(settings, "ORDER_TO_EMAIL", "bcn.shop24@gmail.com")
        from_email = getattr(settings, "EMAIL_FROM", to_email)
        try:
            msg = EmailMessage(subject, body, from_email, [to_email], reply_to=[email])
            msg.send(fail_silently=False)
        except Exception:
            return JsonResponse(
                {"ok": False, "error": "Email could not be sent. Please try again or contact us at bcn.shop24@gmail.com."},
                status=503,
            )

    return JsonResponse({
        "ok": True,
        "message": "Thank you! Your request has been sent. We'll contact you within 5 business days (Monday–Friday)."
    })
