from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Feedback, FeedbackResponse
from .serializers import FeedbackSerializer, FeedbackResponseSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Feedback.objects.none()
        if user.is_admin or user.is_staff_member:
            return Feedback.objects.all().order_by('-created_at')
        if user.is_client:
            return Feedback.objects.filter(project__client=user).order_by('-created_at')
        return Feedback.objects.none()

    def perform_create(self, serializer):
        project = serializer.validated_data.get('project')
        if self.request.user.is_client and project and project.client != self.request.user:
            raise PermissionDenied("You can only submit feedback for your own projects.")
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        feedback = self.get_object()
        feedback.status = Feedback.Status.RESOLVED
        feedback.resolved_at = timezone.now()
        feedback.save()
        serializer = self.get_serializer(feedback)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FeedbackResponseViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return FeedbackResponse.objects.none()
        if user.is_admin or user.is_staff_member:
            return FeedbackResponse.objects.all().order_by('created_at')
        if user.is_client:
            return FeedbackResponse.objects.filter(feedback__project__client=user).order_by('created_at')
        return FeedbackResponse.objects.none()

    def perform_create(self, serializer):
        feedback = serializer.validated_data.get('feedback')
        if self.request.user.is_client and feedback and feedback.project.client != self.request.user:
            raise PermissionDenied("You can only respond to feedback on your own projects.")
        serializer.save(responder=self.request.user)
