from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ClientProfileViewSet, StaffProfileViewSet, MeView,
    DashboardPricingView, RegisterView
)

router = DefaultRouter(trailing_slash=False)
router.register('users', UserViewSet, basename='user')
router.register('clients', ClientProfileViewSet, basename='client-profile')
router.register('staff', StaffProfileViewSet, basename='staff-profile')

urlpatterns = [
    path('auth/me', MeView.as_view(), name='auth_me'),
    path('auth/register', RegisterView.as_view(), name='auth_register'),
    path('dashboard-pricing', DashboardPricingView.as_view(), name='dashboard-pricing'),
    path('', include(router.urls)),
]
