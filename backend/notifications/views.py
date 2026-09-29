from datetime import timedelta

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification, ReportDelivery
from .serializers import NotificationSerializer
from projects.models import Project


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Notification.objects.none()
        return Notification.objects.filter(user=user).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.read_at = timezone.now()
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        notifications = self.get_queryset().filter(read_at__isnull=True)
        notifications.update(read_at=timezone.now())
        return Response({'status': 'all marked as read'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='report-share')
    def report_share(self, request):
        project = self._get_report_project(request)
        delivery = ReportDelivery.objects.create(
            project=project,
            created_by=request.user,
            kind=ReportDelivery.Kind.SHARE,
            status=ReportDelivery.Status.ACTIVE,
            expires_at=timezone.now() + timedelta(days=7),
        )
        return Response({
            'token': delivery.token,
            'url': f'{settings.FRONTEND_URL}/shared-reports/{delivery.token}',
            'expires_at': delivery.expires_at,
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='report-schedule')
    def report_schedule(self, request):
        project = self._get_report_project(request)
        recipient_email = request.data.get('recipient_email', '').strip()
        scheduled_for = request.data.get('scheduled_for')

        if not recipient_email:
            return Response({'error': 'Recipient email is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not scheduled_for:
            return Response({'error': 'Scheduled time is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            scheduled_time = timezone.datetime.fromisoformat(scheduled_for.replace('Z', '+00:00'))
            if timezone.is_naive(scheduled_time):
                scheduled_time = timezone.make_aware(scheduled_time)
        except (TypeError, ValueError):
            return Response({'error': 'Scheduled time must be a valid ISO date'}, status=status.HTTP_400_BAD_REQUEST)

        if scheduled_time <= timezone.now():
            return Response({'error': 'Scheduled time must be in the future'}, status=status.HTTP_400_BAD_REQUEST)

        delivery = ReportDelivery.objects.create(
            project=project,
            created_by=request.user,
            kind=ReportDelivery.Kind.SCHEDULED,
            status=ReportDelivery.Status.SCHEDULED,
            recipient_email=recipient_email,
            scheduled_for=scheduled_time,
        )
        return Response({
            'id': delivery.id,
            'status': delivery.status,
            'recipient_email': delivery.recipient_email,
            'scheduled_for': delivery.scheduled_for,
        }, status=status.HTTP_201_CREATED)

    def _get_report_project(self, request):
        project_id = request.data.get('project')
        if not project_id:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'project': 'Project is required'})

        project = get_object_or_404(Project, pk=project_id)
        if request.user.is_client and project.client_id != request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You do not have access to this project.')
        if not (request.user.is_admin or request.user.is_staff_member or request.user.is_client):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You do not have access to reports.')
        return project


class SharedReportView(APIView):
    permission_classes = []

    def get(self, request, token):
        delivery = get_object_or_404(
            ReportDelivery.objects.select_related('project', 'project__client', 'project__service'),
            token=token,
            kind=ReportDelivery.Kind.SHARE,
            status=ReportDelivery.Status.ACTIVE,
        )
        if delivery.expires_at and delivery.expires_at <= timezone.now():
            delivery.status = ReportDelivery.Status.CANCELLED
            delivery.save(update_fields=['status'])
            return Response({'error': 'This report link has expired.'}, status=status.HTTP_410_GONE)

        return Response({
            'project': {
                'id': delivery.project.id,
                'name': delivery.project.name,
                'description': delivery.project.description,
                'status': delivery.project.status,
                'progress_percent': delivery.project.progress_percent,
                'deadline': delivery.project.deadline,
                'service': delivery.project.service.name,
            },
            'client': delivery.project.client.get_full_name() or delivery.project.client.username,
            'expires_at': delivery.expires_at,
        })
