from rest_framework import serializers
from .models import Service, MilestoneTemplate


class MilestoneTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MilestoneTemplate
        fields = ['id', 'service', 'name', 'order']


class ServiceSerializer(serializers.ModelSerializer):
    milestone_templates = MilestoneTemplateSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'is_active', 'milestone_templates']
