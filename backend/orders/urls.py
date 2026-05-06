from django.urls import path

from .views import create_custom_order, health

urlpatterns = [
    path("health/", health, name="health"),
    path("custom-orders/", create_custom_order, name="create-custom-order"),
]
