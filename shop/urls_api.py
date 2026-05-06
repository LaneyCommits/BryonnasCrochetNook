from django.urls import path
from . import views_api

urlpatterns = [
    path("custom-order", views_api.api_custom_order),
]
