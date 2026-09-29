from rest_framework import viewsets, permissions
from .models import Milestone, Task
from .serializers import MilestoneSerializer, TaskSerializer
from accounts.permissions import IsStaff


class MilestoneViewSet(viewsets.ModelViewSet):
    serializer_class = MilestoneSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsStaff()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Milestone.objects.none()

        if user.is_admin or user.is_staff_member:
            queryset = Milestone.objects.all().order_by('order')
        elif user.is_client:
            queryset = Milestone.objects.filter(project__client=user).order_by('order')
        else:
            queryset = Milestone.objects.none()

        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'partial_update', 'update']:
            return [permissions.IsAuthenticated()]
        return [IsStaff()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Task.objects.none()

        if user.is_admin or user.is_staff_member:
            queryset = Task.objects.all().order_by('id')
        elif user.is_client:
            queryset = Task.objects.filter(milestone__project__client=user).order_by('id')
        else:
            queryset = Task.objects.none()

        project_id = self.request.query_params.get('project')
        milestone_id = self.request.query_params.get('milestone')
        if project_id:
            queryset = queryset.filter(milestone__project_id=project_id)
        if milestone_id:
            queryset = queryset.filter(milestone_id=milestone_id)
        return queryset
