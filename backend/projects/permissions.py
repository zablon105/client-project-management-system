from rest_framework import permissions


class IsProjectAccessAllowed(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_admin or user.is_staff_member:
            return True
        if user.is_client:
            if hasattr(obj, 'client'):
                return obj.client == user
            if hasattr(obj, 'project'):
                return obj.project.client == user
        return False


class IsProjectMemberPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if view.action in ['list', 'retrieve']:
            return True
        return request.user.is_admin or request.user.is_staff_member

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_admin or user.is_staff_member:
            return True
        if view.action in ['retrieve', 'list'] and user.is_client:
            return obj.project.client == user
        return False
