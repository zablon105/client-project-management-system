from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Project, ProjectMember, ProgressUpdate, ProjectFile
from .serializers import (
    ProjectSerializer, ProjectMemberSerializer,
    ProgressUpdateSerializer, ProjectFileSerializer
)
from .permissions import IsProjectAccessAllowed, IsProjectMemberPermission


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectAccessAllowed]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Project.objects.none()
        if user.is_admin or user.is_staff_member:
            return Project.objects.all().order_by('-created_at')
        if user.is_client:
            return Project.objects.filter(client=user).order_by('-created_at')
        return Project.objects.none()

    def perform_create(self, serializer):
        if self.request.user.is_client:
            serializer.save(client=self.request.user)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def add_update(self, request, pk=None):
        project = self.get_object()
        serializer = ProgressUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_file(self, request, pk=None):
        project = self.get_object()
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        project_file = ProjectFile.objects.create(
            project=project,
            file=file_obj,
            uploaded_by=request.user
        )
        serializer = ProjectFileSerializer(project_file)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProjectMemberViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectMemberSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectMemberPermission]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return ProjectMember.objects.none()
        if user.is_admin or user.is_staff_member:
            return ProjectMember.objects.all()
        if user.is_client:
            return ProjectMember.objects.filter(project__client=user)
        return ProjectMember.objects.none()


class ProgressUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectAccessAllowed]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return ProgressUpdate.objects.none()
        if user.is_admin or user.is_staff_member:
            return ProgressUpdate.objects.all()
        if user.is_client:
            return ProgressUpdate.objects.filter(project__client=user)
        return ProgressUpdate.objects.none()

    def perform_create(self, serializer):
        project = serializer.validated_data.get('project')
        if self.request.user.is_client and project and project.client != self.request.user:
            raise PermissionDenied("You do not have permission to post updates on this project.")
        serializer.save(author=self.request.user)


class ProjectFileViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectFileSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectAccessAllowed]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return ProjectFile.objects.none()
        if user.is_admin or user.is_staff_member:
            return ProjectFile.objects.all()
        if user.is_client:
            return ProjectFile.objects.filter(project__client=user)
        return ProjectFile.objects.none()

    def perform_create(self, serializer):
        project = serializer.validated_data.get('project')
        if self.request.user.is_client and project and project.client != self.request.user:
            raise PermissionDenied("You do not have permission to upload files to this project.")
        serializer.save(uploaded_by=self.request.user)
