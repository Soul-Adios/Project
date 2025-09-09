from django.db import models
from django.contrib.auth.models import User

class WasteSubmission(models.Model):
    WASTE_TYPES = [
        ("plastic", "Plastic"),
        ("organic", "Organic"),
        ("textile", "Textile"),
        ("ewaste", "E-Waste"),
        ("other", "Other"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    waste_type = models.CharField(max_length=20, choices=WASTE_TYPES)
    weight_kg = models.DecimalField(max_digits=6, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    @property
    def points(self):
        return float(self.weight_kg)  # 1kg = 1 point
