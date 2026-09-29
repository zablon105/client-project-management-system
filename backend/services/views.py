from rest_framework import viewsets, permissions
from .models import Service, MilestoneTemplate
from .serializers import ServiceSerializer, MilestoneTemplateSerializer
from accounts.permissions import IsAdminOrReadOnly


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('name')
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrReadOnly]


class MilestoneTemplateViewSet(viewsets.ModelViewSet):
    queryset = MilestoneTemplate.objects.all()
    serializer_class = MilestoneTemplateSerializer
    permission_classes = [IsAdminOrReadOnly]
