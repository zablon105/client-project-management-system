from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from services.models import Service
from projects.models import Project
from feedback.models import Feedback, FeedbackResponse


class FeedbackTests(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user(
            username='staff_fb', email='staff@fb.com', password='Password123!', role=User.Role.STAFF
        )
        self.client_a = User.objects.create_user(
            username='client_a_fb', email='clienta@fb.com', password='Password123!', role=User.Role.CLIENT
        )
        self.client_b = User.objects.create_user(
            username='client_b_fb', email='clientb@fb.com', password='Password123!', role=User.Role.CLIENT
        )

        self.service = Service.objects.create(name='Feedback Service', description='Service')
        self.project_a = Project.objects.create(name='Project FB A', client=self.client_a, service=self.service)
        self.project_b = Project.objects.create(name='Project FB B', client=self.client_b, service=self.service)

        self.feedback_a = Feedback.objects.create(
            project=self.project_a,
            sender=self.client_a,
            message='Please change font color',
            status=Feedback.Status.PENDING
        )

    def test_feedback_submission_isolation(self):
        # Client A cannot submit feedback for Project B
        self.client.force_authenticate(user=self.client_a)
        fail_resp = self.client.post(reverse('feedback-list'), {
            'project': self.project_b.id,
            'message': 'Test Message'
        })
        self.assertEqual(fail_resp.status_code, status.HTTP_403_FORBIDDEN)

        # Client A can submit feedback for Project A
        ok_resp = self.client.post(reverse('feedback-list'), {
            'project': self.project_a.id,
            'message': 'Valid Message'
        })
        self.assertEqual(ok_resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ok_resp.data['sender'], self.client_a.id)

    def test_feedback_resolution_and_response(self):
        # Staff resolves feedback A
        self.client.force_authenticate(user=self.staff)
        resolve_url = reverse('feedback-resolve', args=[self.feedback_a.id])
        res_resp = self.client.post(resolve_url)
        self.assertEqual(res_resp.status_code, status.HTTP_200_OK)
        self.feedback_a.refresh_from_db()
        self.assertEqual(self.feedback_a.status, Feedback.Status.RESOLVED)

        # Staff responds to feedback A
        resp = self.client.post(reverse('feedback-response-list'), {
            'feedback': self.feedback_a.id,
            'message': 'Font color has been updated.'
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
