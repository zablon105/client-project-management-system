from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        STAFF = 'staff', 'Staff'
        CLIENT = 'client', 'Client'

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.CLIENT)
    phone = models.CharField(max_length=20, blank=True)

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_staff_member(self):
        return self.role == self.Role.STAFF

    @property
    def is_client(self):
        return self.role == self.Role.CLIENT


class DashboardPricing(models.Model):
    min_price = models.IntegerField(default=12000)
    max_price = models.IntegerField(default=24500)
    currency = models.CharField(max_length=10, default='KSh')

    class Meta:
        verbose_name = 'dashboard pricing'
        verbose_name_plural = 'dashboard pricing'

    @classmethod
    def get_instance(cls):
        obj, _ = cls.objects.get_or_create(pk=1, defaults={
            'min_price': 12000,
            'max_price': 24500,
            'currency': 'KSh',
        })
        return obj

    def __str__(self):
        return f'{self.currency} {self.min_price}-{self.max_price}'


class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    company_name = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True, help_text='Internal notes, not visible to the client')

    def __str__(self):
        return self.company_name or self.user.get_full_name()


class StaffProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    title = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.user.get_full_name()
