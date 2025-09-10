from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import WasteSubmissionViewSet, signup, dashboard, leaderboard, me

router = DefaultRouter()
router.register(r"submissions", WasteSubmissionViewSet, basename="submission")

urlpatterns = [
    path("", include(router.urls)),

    # Auth
    path("signup/", signup, name="signup"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # User
    path("me/", me, name="me"),

    # Data
    path("dashboard/<int:user_id>/", dashboard, name="dashboard"),
    path("leaderboard/", leaderboard, name="leaderboard"),
]
