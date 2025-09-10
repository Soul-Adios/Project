from django.contrib import admin

# Register your models here.
# admin.py
from django.contrib import admin
from .models import WasteSubmission

@admin.register(WasteSubmission)
class WasteSubmissionAdmin(admin.ModelAdmin):
    list_display = ("user", "waste_type", "weight_kg", "date", "points")
    list_filter = ("waste_type", "date")
    search_fields = ("user__username",)
