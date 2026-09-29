from django.db import models
from projects.models import Project


class Milestone(models.Model):
    class State(models.TextChoices):
        DONE = 'done', 'Done'
        IN_PROGRESS = 'in_progress', 'In Progress'
        NOT_STARTED = 'not_started', 'Not Started'

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    name = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    state = models.CharField(max_length=20, choices=State.choices, default=State.NOT_STARTED)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.project.name} — {self.name}'


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    milestone = models.ForeignKey(Milestone, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    title = models.CharField(max_length=255)
    is_done = models.BooleanField(default=False)
