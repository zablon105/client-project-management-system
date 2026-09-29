from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, MilestoneTemplateViewSet

router = DefaultRouter(trailing_slash=False)
router.register('services', ServiceViewSet, basename='service')
router.register('milestone-templates', MilestoneTemplateViewSet, basename='milestone-template')

urlpatterns = [
    path('', include(router.urls)),
]
