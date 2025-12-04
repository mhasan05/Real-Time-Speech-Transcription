from django.contrib import admin
from django.urls import path
from transcriptions.views import SessionListAPIView, SessionDetailAPIView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("sessions/", SessionListAPIView.as_view()),
    path("sessions/<uuid:pk>/", SessionDetailAPIView.as_view()),
]
