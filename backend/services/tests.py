from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from services.models import Service, MilestoneTemplate


class ServicesTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin_serv', email='admin@serv.com', password='Password123!', role=User.Role.ADMIN
        )
        self.client_user = User.objects.create_user(
            username='client_serv', email='client@serv.com', password='Password123!', role=User.Role.CLIENT
        )

        self.service = Service.objects.create(
            name='Web Development',
            description='Full stack web dev'
        )

    def test_services_read_and_admin_write(self):
        # Client can read services
        self.client.force_authenticate(user=self.client_user)
        list_resp = self.client.get(reverse('service-list'))
        self.assertEqual(list_resp.status_code, status.HTTP_200_OK)

        # Client cannot create service
        create_resp = self.client.post(reverse('service-list'), {
            'name': 'Mobile App Dev',
            'description': 'Mobile dev service'
        })
        self.assertEqual(create_resp.status_code, status.HTTP_403_FORBIDDEN)

        # Admin can create service
        self.client.force_authenticate(user=self.admin)
        admin_create = self.client.post(reverse('service-list'), {
            'name': 'Mobile App Dev',
            'description': 'Mobile dev service'
        })
        self.assertEqual(admin_create.status_code, status.HTTP_201_CREATED)
