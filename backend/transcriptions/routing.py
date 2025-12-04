from django.urls import path
from .consumers import TranscriptionConsumer

websocket_urlpatterns = [
    path("ws/transcribe/", TranscriptionConsumer.as_asgi()),
]
