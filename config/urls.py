"""
URL configuration for Bryonna's Crochet Nook.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("shop.urls_api")),
    path("", include("shop.urls")),
]
