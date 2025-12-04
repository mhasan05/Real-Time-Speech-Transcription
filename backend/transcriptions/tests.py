from django.test import TestCase
from .models import TranscriptionSession

class TestSession(TestCase):
    def test_create_session(self):
        s = TranscriptionSession.objects.create(
            transcript="test transcript",
            duration=10.5,
            word_count=2
        )

        self.assertEqual(s.word_count, 2)
        self.assertIn("test transcript", s.transcript)
