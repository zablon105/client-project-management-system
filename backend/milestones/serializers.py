from rest_framework import serializers
from .models import Milestone, Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'project', 'milestone', 'title', 'is_done']


class MilestoneSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Milestone
        fields = ['id', 'project', 'name', 'order', 'state', 'completed_at', 'tasks']
