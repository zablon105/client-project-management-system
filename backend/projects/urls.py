from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, ProjectMemberViewSet,
    ProgressUpdateViewSet, ProjectFileViewSet
)

router = DefaultRouter(trailing_slash=False)
router.register('projects', ProjectViewSet, basename='project')
router.register('project-members', ProjectMemberViewSet, basename='project-member')
router.register('progress-updates', ProgressUpdateViewSet, basename='progress-update')
router.register('project-files', ProjectFileViewSet, basename='project-file')

urlpatterns = [
    path('', include(router.urls)),
]
