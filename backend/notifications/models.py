from django.conf import settings
from django.db import models
from django.utils.crypto import get_random_string

from projects.models import Project


class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50)
    payload = models.JSONField(default=dict, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class ReportDelivery(models.Model):
    class Kind(models.TextChoices):
        SHARE = 'share', 'Secure Share'
        SCHEDULED = 'scheduled', 'Scheduled Email'

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        SCHEDULED = 'scheduled', 'Scheduled'
        SENT = 'sent', 'Sent'
        CANCELLED = 'cancelled', 'Cancelled'

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='report_deliveries')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='report_deliveries')
    kind = models.CharField(max_length=20, choices=Kind.choices)
    status = models.CharField(max_length=20, choices=Status.choices)
    token = models.CharField(max_length=64, unique=True, blank=True)
    recipient_email = models.EmailField(blank=True)
    scheduled_for = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = get_random_string(48)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
