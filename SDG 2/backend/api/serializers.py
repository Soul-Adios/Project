from rest_framework import serializers
from django.contrib.auth.models import User
from .models import WasteSubmission

# Waste Submission Serializer
class WasteSubmissionSerializer(serializers.ModelSerializer):
    points = serializers.ReadOnlyField()

    class Meta:
        model = WasteSubmission
        fields = ["id", "waste_type", "weight_kg", "date", "points"]

    # user is assigned automatically in the view
    def create(self, validated_data):
        user = self.context["request"].user
        return WasteSubmission.objects.create(user=user, **validated_data)


# User Signup Serializer
class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user
