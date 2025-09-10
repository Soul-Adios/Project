from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum
from django.contrib.auth.models import User
from .models import WasteSubmission
from .serializers import WasteSubmissionSerializer, UserSignupSerializer


# Waste Submission CRUD
class WasteSubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = WasteSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Each user only sees their own submissions
        return WasteSubmission.objects.filter(user=self.request.user)


# Signup API
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def signup(request):
    serializer = UserSignupSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data["username"].strip()
        email = serializer.validated_data["email"].strip().lower()

        if User.objects.filter(username__iexact=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email__iexact=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=serializer.validated_data["password"]
        )

        return Response(
            {
                "message": "User created successfully",
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "date_joined": user.date_joined,
            },
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Dashboard API (Authenticated)
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def dashboard(request, user_id):
    if request.user.id != int(user_id):
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    total_weight = WasteSubmission.objects.filter(user=request.user).aggregate(Sum("weight_kg"))["weight_kg__sum"] or 0
    total_points = float(total_weight)
    progress = min((total_points / 300) * 100, 100)

    return Response({
        "totalWeight": float(total_weight),
        "totalPoints": total_points,
        "progress": progress
    })

# Leaderboard API (Authenticated)
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def leaderboard(request):
    users = (
        User.objects.all()
        .annotate(total_weight=Sum("wastesubmission__weight_kg"))
        .annotate(total_points=Sum("wastesubmission__weight_kg"))
        .order_by("-total_points")
    )

    data = []
    rank = 1
    for user in users:
        data.append({
            "userId": user.id,
            "name": user.username,
            "totalPoints": float(user.total_points or 0),
            "totalWeight": float(user.total_weight or 0),
            "rank": rank,
        })
        rank += 1

    return Response(data)


# Optional: Profile API (Authenticated)
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "date_joined": request.user.date_joined,
    })
