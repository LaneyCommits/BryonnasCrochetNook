from django.db import models


class CustomOrder(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    item_type = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.item_type}"
