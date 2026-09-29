from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from services.models import Service
from projects.models import Project
from milestones.models import Milestone, Task


class MilestonesTests(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user(
            username='staff_ms', email='staff@ms.com', password='Password123!', role=User.Role.STAFF
        )
        self.client_a = User.objects.create_user(
            username='client_a_ms', email='clienta@ms.com', password='Password123!', role=User.Role.CLIENT
        )
        self.client_b = User.objects.create_user(
            username='client_b_ms', email='clientb@ms.com', password='Password123!', role=User.Role.CLIENT
        )

        self.service = Service.objects.create(name='Milestone Service', description='Service')
        self.project_a = Project.objects.create(name='Project MS A', client=self.client_a, service=self.service)
        self.project_b = Project.objects.create(name='Project MS B', client=self.client_b, service=self.service)

        self.milestone_a = Milestone.objects.create(
            project=self.project_a, name='Phase 1 A', order=1, state=Milestone.State.IN_PROGRESS
        )
        self.milestone_b = Milestone.objects.create(
            project=self.project_b, name='Phase 1 B', order=1, state=Milestone.State.NOT_STARTED
        )

        self.task_a = Task.objects.create(
            project=self.project_a, milestone=self.milestone_a, title='Design Mockups', is_done=False
        )

    def test_milestone_and_task_isolation(self):
        self.client.force_authenticate(user=self.client_a)

        # Client A sees milestone A, not B
        ms_resp = self.client.get(reverse('milestone-list'))
        self.assertEqual(ms_resp.status_code, status.HTTP_200_OK)
        results = ms_resp.data['results'] if isinstance(ms_resp.data, dict) and 'results' in ms_resp.data else ms_resp.data
        ms_ids = [m['id'] for m in results]
        self.assertIn(self.milestone_a.id, ms_ids)
        self.assertNotIn(self.milestone_b.id, ms_ids)

        # Client A sees task A
        task_resp = self.client.get(reverse('task-list'))
        self.assertEqual(task_resp.status_code, status.HTTP_200_OK)
        t_results = task_resp.data['results'] if isinstance(task_resp.data, dict) and 'results' in task_resp.data else task_resp.data
        task_ids = [t['id'] for t in t_results]
        self.assertIn(self.task_a.id, task_ids)

    def test_task_completion_and_permissions(self):
        # Client cannot create a milestone
        self.client.force_authenticate(user=self.client_a)
        ms_create = self.client.post(reverse('milestone-list'), {
            'project': self.project_a.id,
            'name': 'Phase 2',
            'order': 2
        })
        self.assertEqual(ms_create.status_code, status.HTTP_403_FORBIDDEN)

        # Staff can create milestone
        self.client.force_authenticate(user=self.staff)
        ms_create_ok = self.client.post(reverse('milestone-list'), {
            'project': self.project_a.id,
            'name': 'Phase 2',
            'order': 2
        })
        self.assertEqual(ms_create_ok.status_code, status.HTTP_201_CREATED)

        # Client can update task completion
        self.client.force_authenticate(user=self.client_a)
        task_url = reverse('task-detail', args=[self.task_a.id])
        patch_resp = self.client.patch(task_url, {'is_done': True})
        self.assertEqual(patch_resp.status_code, status.HTTP_200_OK)
        self.task_a.refresh_from_db()
        self.assertTrue(self.task_a.is_done)
