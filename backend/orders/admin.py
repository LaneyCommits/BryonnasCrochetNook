from django.contrib import admin
from .models import CustomOrder


@admin.register(CustomOrder)
class CustomOrderAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "item_type", "created_at")
    search_fields = ("name", "email", "item_type")
