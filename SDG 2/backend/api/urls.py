from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WasteSubmissionViewSet, signup, login, dashboard, leaderboard

router = DefaultRouter()
router.register(r"submissions", WasteSubmissionViewSet, basename="submissions")

urlpatterns = [
    path("", include(router.urls)),
    path("signup/", signup, name="signup"),
    path("login/", login, name="login"),
    path("dashboard/<int:user_id>/", dashboard, name="dashboard"),
    path("leaderboard/", leaderboard, name="leaderboard"),
    
]
