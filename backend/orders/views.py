import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import CustomOrder


@require_GET
def health(request):
    return JsonResponse({"status": "ok"})


@csrf_exempt
@require_POST
def create_custom_order(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    required_fields = ["name", "email", "item_type"]
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return JsonResponse(
            {"error": f"Missing required fields: {', '.join(missing)}"},
            status=400,
        )

    order = CustomOrder.objects.create(
        name=payload["name"],
        email=payload["email"],
        item_type=payload["item_type"],
        notes=payload.get("notes", ""),
    )
    return JsonResponse({"message": "Order submitted!", "id": order.id}, status=201)
