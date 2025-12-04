from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TranscriptionSession
from .serializers import SessionSerializer

class SessionListAPIView(APIView):
    def get(self, request):
        sessions = TranscriptionSession.objects.all().order_by('-created_at')
        return Response({"status": 'success', "data": SessionSerializer(sessions, many=True).data}, status=status.HTTP_200_OK)

class SessionDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            session = TranscriptionSession.objects.get(pk=pk)
        except TranscriptionSession.DoesNotExist:
            return Response({"error": "Not Found"}, status=404)
        return Response({"status": 'success', "data": SessionSerializer(session).data}, status=status.HTTP_200_OK)
