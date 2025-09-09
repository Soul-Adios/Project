from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
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
            {"message": "User created successfully", "user_id": user.id},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login API
@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user is not None:
        return Response({
            "message": "Login successful",
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "total_points": WasteSubmission.objects.filter(user=user).aggregate(Sum("weight_kg"))["weight_kg__sum"] or 0,
            "total_weight": WasteSubmission.objects.filter(user=user).aggregate(Sum("weight_kg"))["weight_kg__sum"] or 0,
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)


# Dashboard API
@api_view(["GET"])
def dashboard(request, user_id):
    total_weight = WasteSubmission.objects.filter(user_id=user_id).aggregate(Sum("weight_kg"))["weight_kg__sum"] or 0
    total_points = float(total_weight)
    progress = min((total_points / 300) * 100, 100)
    return Response({
        "total_weight": total_weight,
        "total_points": total_points,
        "progress": progress
    })


# Leaderboard API
@api_view(["GET"])
def leaderboard(request):
    users = User.objects.all()
    leaderboard = []
    for user in users:
        total = WasteSubmission.objects.filter(user=user).aggregate(Sum("weight_kg"))["weight_kg__sum"] or 0
        leaderboard.append({
            "username": user.username,
            "points": float(total)
        })
    leaderboard = sorted(leaderboard, key=lambda x: x["points"], reverse=True)
    return Response(leaderboard)
