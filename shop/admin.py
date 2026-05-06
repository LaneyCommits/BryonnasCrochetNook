from django.contrib import admin
from .models import CustomOrder


@admin.register(CustomOrder)
class CustomOrderAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "email", "created_at")
    list_filter = ("created_at",)
    search_fields = ("first_name", "last_name", "email", "order_text")
    readonly_fields = ("created_at",)
