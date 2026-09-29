from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ClientProfile, StaffProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Role', {'fields': ('role', 'phone')}),
    )


admin.site.register(ClientProfile)
admin.site.register(StaffProfile)
