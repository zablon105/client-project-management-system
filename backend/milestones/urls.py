from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MilestoneViewSet, TaskViewSet

router = DefaultRouter(trailing_slash=False)
router.register('milestones', MilestoneViewSet, basename='milestone')
router.register('tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]
