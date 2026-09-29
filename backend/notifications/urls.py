from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, SharedReportView

router = DefaultRouter(trailing_slash=False)
router.register('notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('shared-reports/<str:token>', SharedReportView.as_view(), name='shared-report'),
    path('', include(router.urls)),
]
