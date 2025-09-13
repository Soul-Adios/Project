from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),   # FIXED: admin at /admin
    path("api/", include("api.urls")), # API stays at /api
]
