from django.contrib.auth.password_validation import validate_password as validate_django_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, ClientProfile, StaffProfile, DashboardPricing


class DashboardPricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardPricing
        fields = ['id', 'min_price', 'max_price', 'currency']
        read_only_fields = ['id', 'currency']


class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = ['id', 'company_name', 'notes']


class StaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = ['id', 'title']


class UserSerializer(serializers.ModelSerializer):
    client_profile = ClientProfileSerializer(read_only=True)
    staff_profile = StaffProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'is_active', 'client_profile', 'staff_profile'
        ]
        read_only_fields = ['id', 'role']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    company_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    title = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'username', 'password', 'email', 'first_name', 'last_name',
            'role', 'phone', 'company_name', 'title'
        ]

    def validate(self, attrs):
        user = User(
            username=attrs.get('username', ''),
            email=attrs.get('email', ''),
            first_name=attrs.get('first_name', ''),
            last_name=attrs.get('last_name', ''),
        )
        try:
            validate_django_password(attrs['password'], user=user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'password': exc.messages})
        return attrs

    def create(self, validated_data):
        company_name = validated_data.pop('company_name', '')
        title = validated_data.pop('title', '')
        password = validated_data.pop('password')
        role = validated_data.get('role', User.Role.CLIENT)
        validated_data['is_active'] = role == User.Role.CLIENT
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        if user.role == User.Role.CLIENT:
            ClientProfile.objects.get_or_create(user=user, defaults={'company_name': company_name})
        elif user.role == User.Role.STAFF:
            StaffProfile.objects.get_or_create(user=user, defaults={'title': title or 'Project Specialist'})

        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        token['email'] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user_serializer = UserSerializer(self.user)
        data['user'] = user_serializer.data
        return data
