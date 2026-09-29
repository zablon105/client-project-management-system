from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.utils import timezone

from notifications.models import ReportDelivery


class Command(BaseCommand):
    help = 'Send scheduled report deliveries that are due.'

    def handle(self, *args, **options):
        due_deliveries = ReportDelivery.objects.select_related('project').filter(
            kind=ReportDelivery.Kind.SCHEDULED,
            status=ReportDelivery.Status.SCHEDULED,
            scheduled_for__lte=timezone.now(),
        )

        sent_count = 0
        for delivery in due_deliveries:
            report_url = f'{settings.FRONTEND_URL}/shared-reports/{delivery.token}'
            send_mail(
                subject=f'Project report: {delivery.project.name}',
                message=(
                    f'Your scheduled project report is ready.\n\n'
                    f'Project: {delivery.project.name}\n'
                    f'Open report: {report_url}\n'
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[delivery.recipient_email],
                fail_silently=False,
            )
            delivery.status = ReportDelivery.Status.SENT
            delivery.save(update_fields=['status'])
            sent_count += 1

        self.stdout.write(self.style.SUCCESS(f'Sent {sent_count} scheduled report(s).'))
