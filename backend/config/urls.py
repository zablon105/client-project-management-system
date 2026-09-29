from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth Endpoints
    path('api/v1/auth/login', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App API Endpoints
    path('api/v1/', include('accounts.urls')),
    path('api/v1/', include('services.urls')),
    path('api/v1/', include('projects.urls')),
    path('api/v1/', include('milestones.urls')),
    path('api/v1/', include('invoices.urls')),
    path('api/v1/', include('notifications.urls')),
    path('api/v1/', include('feedback.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
