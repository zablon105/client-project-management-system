from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Feedback, FeedbackResponse


class FeedbackResponseSerializer(serializers.ModelSerializer):
    responder_detail = UserSerializer(source='responder', read_only=True)

    class Meta:
        model = FeedbackResponse
        fields = ['id', 'feedback', 'responder', 'responder_detail', 'message', 'created_at']
        read_only_fields = ['id', 'responder', 'created_at']


class FeedbackSerializer(serializers.ModelSerializer):
    sender_detail = UserSerializer(source='sender', read_only=True)
    responses = FeedbackResponseSerializer(many=True, read_only=True)
    project_name = serializers.ReadOnlyField(source='project.name')

    class Meta:
        model = Feedback
        fields = [
            'id', 'project', 'project_name', 'sender', 'sender_detail',
            'message', 'attachment', 'status', 'created_at', 'resolved_at', 'responses'
        ]
        read_only_fields = ['id', 'sender', 'created_at', 'resolved_at']
