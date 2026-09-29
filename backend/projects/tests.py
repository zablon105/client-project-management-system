from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from services.models import Service
from projects.models import Project, ProjectMember, ProgressUpdate, ProjectFile


class ProjectsTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin_proj', email='admin@proj.com', password='Password123!', role=User.Role.ADMIN
        )
        self.staff = User.objects.create_user(
            username='staff_proj', email='staff@proj.com', password='Password123!', role=User.Role.STAFF
        )
        self.client_a = User.objects.create_user(
            username='client_a', email='clienta@proj.com', password='Password123!', role=User.Role.CLIENT
        )
        self.client_b = User.objects.create_user(
            username='client_b', email='clientb@proj.com', password='Password123!', role=User.Role.CLIENT
        )

        self.service = Service.objects.create(
            name='Web Development',
            description='Web Dev Service'
        )

        self.project_a = Project.objects.create(
            name='Project A',
            client=self.client_a,
            service=self.service,
            status=Project.Status.IN_PROGRESS
        )
        self.project_b = Project.objects.create(
            name='Project B',
            client=self.client_b,
            service=self.service,
            status=Project.Status.IN_PROGRESS
        )

    def test_client_project_isolation(self):
        self.client.force_authenticate(user=self.client_a)
        response = self.client.get(reverse('project-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results'] if isinstance(response.data, dict) and 'results' in response.data else response.data
        project_ids = [p['id'] for p in results]
        self.assertIn(self.project_a.id, project_ids)
        self.assertNotIn(self.project_b.id, project_ids)

        # Client A attempting to get Project B detail directly
        detail_url = reverse('project-detail', args=[self.project_b.id])
        detail_resp = self.client.get(detail_url)
        self.assertEqual(detail_resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_staff_and_admin_project_access(self):
        # Staff can see all projects
        self.client.force_authenticate(user=self.staff)
        response = self.client.get(reverse('project-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results'] if isinstance(response.data, dict) and 'results' in response.data else response.data
        project_ids = [p['id'] for p in results]
        self.assertIn(self.project_a.id, project_ids)
        self.assertIn(self.project_b.id, project_ids)

        # Admin can see all projects
        self.client.force_authenticate(user=self.admin)
        admin_resp = self.client.get(reverse('project-list'))
        self.assertEqual(admin_resp.status_code, status.HTTP_200_OK)

    def test_project_creation_and_member_permissions(self):
        # Client creates a project -> client is set to client_a
        self.client.force_authenticate(user=self.client_a)
        create_resp = self.client.post(reverse('project-list'), {
            'name': 'Client A New Project',
            'service': self.service.id,
            'description': 'Description'
        })
        self.assertEqual(create_resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_resp.data['client'], self.client_a.id)

        # Client cannot add project member
        member_resp = self.client.post(reverse('project-member-list'), {
            'project': self.project_a.id,
            'staff': self.staff.id,
            'is_lead': True
        })
        self.assertEqual(member_resp.status_code, status.HTTP_403_FORBIDDEN)

        # Staff can add project member
        self.client.force_authenticate(user=self.staff)
        member_ok_resp = self.client.post(reverse('project-member-list'), {
            'project': self.project_a.id,
            'staff': self.staff.id,
            'is_lead': True
        })
        self.assertEqual(member_ok_resp.status_code, status.HTTP_201_CREATED)

    def test_progress_update_isolation(self):
        # Client A cannot post update to Project B
        self.client.force_authenticate(user=self.client_a)
        resp = self.client.post(reverse('progress-update-list'), {
            'project': self.project_b.id,
            'note': 'Malicious Update'
        })
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        # Client A can post update to Project A
        ok_resp = self.client.post(reverse('progress-update-list'), {
            'project': self.project_a.id,
            'note': 'Valid Update'
        })
        self.assertEqual(ok_resp.status_code, status.HTTP_201_CREATED)
