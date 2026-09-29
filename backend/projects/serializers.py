from rest_framework import serializers
from accounts.serializers import UserSerializer
from services.serializers import ServiceSerializer
from .models import Project, ProjectMember, ProgressUpdate, ProjectFile


class ProjectMemberSerializer(serializers.ModelSerializer):
    staff_detail = UserSerializer(source='staff', read_only=True)

    class Meta:
        model = ProjectMember
        fields = ['id', 'project', 'staff', 'staff_detail', 'is_lead']


class ProgressUpdateSerializer(serializers.ModelSerializer):
    author_detail = UserSerializer(source='author', read_only=True)

    class Meta:
        model = ProgressUpdate
        fields = ['id', 'project', 'author', 'author_detail', 'note', 'file', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class ProjectFileSerializer(serializers.ModelSerializer):
    uploaded_by_detail = UserSerializer(source='uploaded_by', read_only=True)

    class Meta:
        model = ProjectFile
        fields = ['id', 'project', 'file', 'uploaded_by', 'uploaded_by_detail', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at']


class ProjectSerializer(serializers.ModelSerializer):
    client_detail = UserSerializer(source='client', read_only=True)
    service_detail = ServiceSerializer(source='service', read_only=True)
    members = ProjectMemberSerializer(many=True, read_only=True)
    updates = ProgressUpdateSerializer(many=True, read_only=True)
    files = ProjectFileSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'client', 'client_detail', 'service', 'service_detail',
            'description', 'start_date', 'deadline', 'budget', 'status',
            'progress_percent', 'created_at', 'members', 'updates', 'files'
        ]
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {'client': {'required': False}}
