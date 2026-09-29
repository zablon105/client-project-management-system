from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from notifications.models import Notification
from projects.models import Project
from services.models import Service


class NotificationsTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            username='user_a_notif', email='usera@notif.com', password='Password123!', role=User.Role.CLIENT
        )
        self.user_b = User.objects.create_user(
            username='user_b_notif', email='userb@notif.com', password='Password123!', role=User.Role.CLIENT
        )

        self.notif_a = Notification.objects.create(
            user=self.user_a,
            type='project_update',
            payload={'message': 'Project A updated'}
        )
        self.notif_b = Notification.objects.create(
            user=self.user_b,
            type='payment_received',
            payload={'message': 'Payment received'}
        )
        self.service = Service.objects.create(name='Reports Service')
        self.project_a = Project.objects.create(name='Report Project A', client=self.user_a, service=self.service)

    def test_notification_ownership_and_isolation(self):
        self.client.force_authenticate(user=self.user_a)

        # User A sees notification A, not notification B
        response = self.client.get(reverse('notification-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results'] if isinstance(response.data, dict) and 'results' in response.data else response.data
        notif_ids = [n['id'] for n in results]
        self.assertIn(self.notif_a.id, notif_ids)
        self.assertNotIn(self.notif_b.id, notif_ids)

        # User A cannot directly access notification B detail
        detail_url = reverse('notification-detail', args=[self.notif_b.id])
        detail_resp = self.client.get(detail_url)
        self.assertEqual(detail_resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_mark_read_and_mark_all_read(self):
        self.client.force_authenticate(user=self.user_a)

        # Mark single notification read
        mark_url = reverse('notification-mark-read', args=[self.notif_a.id])
        mark_resp = self.client.post(mark_url)
        self.assertEqual(mark_resp.status_code, status.HTTP_200_OK)
        self.notif_a.refresh_from_db()
        self.assertIsNotNone(self.notif_a.read_at)

        # Create another unread notification and mark all read
        notif_a2 = Notification.objects.create(
            user=self.user_a,
            type='system',
            payload={'message': 'System alert'}
        )
        mark_all_url = reverse('notification-mark-all-read')
        mark_all_resp = self.client.post(mark_all_url)
        self.assertEqual(mark_all_resp.status_code, status.HTTP_200_OK)
        notif_a2.refresh_from_db()
        self.assertIsNotNone(notif_a2.read_at)

    def test_report_share_and_schedule(self):
        self.client.force_authenticate(user=self.user_a)

        share_response = self.client.post(reverse('notification-report-share'), {'project': self.project_a.id})
        self.assertEqual(share_response.status_code, status.HTTP_201_CREATED)
        self.assertIn('/shared-reports/', share_response.data['url'])

        schedule_response = self.client.post(reverse('notification-report-schedule'), {
            'project': self.project_a.id,
            'recipient_email': 'client@example.com',
            'scheduled_for': '2099-01-01T12:00:00Z',
        })
        self.assertEqual(schedule_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(schedule_response.data['status'], 'scheduled')

    def test_report_schedule_rejects_past_time(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.post(reverse('notification-report-schedule'), {
            'project': self.project_a.id,
            'recipient_email': 'client@example.com',
            'scheduled_for': '2020-01-01T12:00:00Z',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_shared_report_token_is_public_and_expires(self):
        self.client.force_authenticate(user=self.user_a)
        share_response = self.client.post(reverse('notification-report-share'), {'project': self.project_a.id})
        token = share_response.data['token']
        self.client.force_authenticate(user=None)

        public_response = self.client.get(reverse('shared-report', args=[token]))
        self.assertEqual(public_response.status_code, status.HTTP_200_OK)
        self.assertEqual(public_response.data['project']['id'], self.project_a.id)
