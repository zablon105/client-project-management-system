from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User, ClientProfile, StaffProfile


class AccountsAuthAndPermissionTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin_user',
            email='admin@example.com',
            password='Password123!',
            role=User.Role.ADMIN
        )
        self.staff_user = User.objects.create_user(
            username='staff_user',
            email='staff@example.com',
            password='Password123!',
            role=User.Role.STAFF
        )
        self.client_user = User.objects.create_user(
            username='client_user',
            email='client@example.com',
            password='Password123!',
            role=User.Role.CLIENT
        )

    def test_login_and_token_refresh(self):
        login_url = reverse('token_obtain_pair')
        response = self.client.post(login_url, {
            'username': 'client_user',
            'password': 'Password123!'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        refresh_url = reverse('token_refresh')
        refresh_response = self.client.post(refresh_url, {
            'refresh': response.data['refresh']
        })
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_response.data)

    def test_me_view_get_and_patch(self):
        self.client.force_authenticate(user=self.client_user)
        me_url = reverse('auth_me')

        response = self.client.get(me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'client_user')

        patch_response = self.client.patch(me_url, {'phone': '123-456-7890'}, format='json')
        self.assertEqual(patch_response.status_code, status.HTTP_200_OK)
        self.client_user.refresh_from_db()
        self.assertEqual(self.client_user.phone, '123-456-7890')

        role_response = self.client.patch(
            me_url,
            {'role': User.Role.ADMIN},
            format='json',
        )
        self.assertEqual(role_response.status_code, status.HTTP_200_OK)
        self.client_user.refresh_from_db()
        self.assertEqual(self.client_user.role, User.Role.CLIENT)

    def test_public_registration_creates_client_account(self):
        response = self.client.post(reverse('auth_register'), {
            'username': 'new_client',
            'email': 'new_client@example.com',
            'password': 'Password123!',
            'company_name': 'New Client Company',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='new_client')
        self.assertEqual(user.role, User.Role.CLIENT)
        self.assertTrue(user.is_active)
        self.assertTrue(user.check_password('Password123!'))
        self.assertEqual(user.client_profile.company_name, 'New Client Company')

    def test_public_privileged_registration_requires_admin_activation(self):
        for role in (User.Role.STAFF, User.Role.ADMIN):
            with self.subTest(role=role):
                response = self.client.post(reverse('auth_register'), {
                    'username': f'new_{role}',
                    'email': f'new_{role}@example.com',
                    'password': 'Password123!',
                    'role': role,
                }, format='json')

                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
                user = User.objects.get(username=f'new_{role}')
                self.assertEqual(user.role, role)
                self.assertFalse(user.is_active)

                login_response = self.client.post(reverse('token_obtain_pair'), {
                    'username': f'new_{role}',
                    'password': 'Password123!',
                })
                self.assertEqual(login_response.status_code, status.HTTP_401_UNAUTHORIZED)

                self.client.force_authenticate(user=self.staff_user)
                forbidden_response = self.client.patch(
                    reverse('user-detail', kwargs={'pk': user.pk}),
                    {'is_active': True},
                    format='json',
                )
                self.assertEqual(forbidden_response.status_code, status.HTTP_403_FORBIDDEN)

                self.client.force_authenticate(user=self.admin_user)
                activate_response = self.client.patch(
                    reverse('user-detail', kwargs={'pk': user.pk}),
                    {'is_active': True},
                    format='json',
                )
                self.assertEqual(activate_response.status_code, status.HTTP_200_OK)
                user.refresh_from_db()
                self.assertTrue(user.is_active)
                self.client.force_authenticate(user=None)
                activated_login = self.client.post(reverse('token_obtain_pair'), {
                    'username': f'new_{role}',
                    'password': 'Password123!',
                })
                self.assertEqual(activated_login.status_code, status.HTTP_200_OK)

    def test_registration_enforces_password_validators(self):
        response = self.client.post(reverse('auth_register'), {
            'username': 'weak_password',
            'email': 'weak@example.com',
            'password': '123456',
            'role': User.Role.CLIENT,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(username='weak_password').exists())

    def test_user_viewset_permissions(self):
        users_url = reverse('user-list')

        # Client cannot list users
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get(users_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Staff can list users
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(users_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Staff cannot create user
        create_response = self.client.post(users_url, {
            'username': 'new_user',
            'email': 'new@example.com',
            'password': 'Password123!',
            'role': 'client'
        })
        self.assertEqual(create_response.status_code, status.HTTP_403_FORBIDDEN)

        # Admin can create user
        self.client.force_authenticate(user=self.admin_user)
        create_response = self.client.post(users_url, {
            'username': 'new_user',
            'email': 'new@example.com',
            'password': 'Password123!',
            'role': 'client'
        })
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

    def test_dashboard_pricing_admin_access_and_persistence(self):
        pricing_url = reverse('dashboard-pricing')

        self.client.force_authenticate(user=self.client_user)
        get_response = self.client.get(pricing_url)
        self.assertEqual(get_response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin_user)
        get_response = self.client.get(pricing_url)
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(get_response.data['min_price'], 12000)
        self.assertEqual(get_response.data['max_price'], 24500)

        patch_response = self.client.patch(pricing_url, {'min_price': 15000, 'max_price': 30000}, format='json')
        self.assertEqual(patch_response.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_response.data['min_price'], 15000)
        self.assertEqual(patch_response.data['max_price'], 30000)

        refresh_response = self.client.get(pricing_url)
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertEqual(refresh_response.data['min_price'], 15000)
        self.assertEqual(refresh_response.data['max_price'], 30000)
