import json, time
from channels.generic.websocket import AsyncWebsocketConsumer
from vosk import Model, KaldiRecognizer
from channels.db import database_sync_to_async

class TranscriptionConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        from .models import TranscriptionSession
        self.TranscriptionSession = TranscriptionSession
        self.model = Model("models/vosk-model-small-en-us-0.15")
        self.rec = KaldiRecognizer(self.model, 16000)
        self.final_text = ""
        self.start_time = time.time()

    async def receive(self, bytes_data=None, text_data=None):
        if bytes_data:
            if self.rec.AcceptWaveform(bytes_data):
                result = json.loads(self.rec.Result())
                final = result.get("text", "")
                self.final_text += " " + final

                await self.send(json.dumps({"final": final}))
            else:
                partial = json.loads(self.rec.PartialResult()).get("partial", "")
                await self.send(json.dumps({"partial": partial}))

    async def disconnect(self, close_code):
        duration = time.time() - self.start_time
        words = len(self.final_text.split())
        await self.save_session(
            transcript=self.final_text.strip(),
            duration=duration,
            word_count=words
        )

    @database_sync_to_async
    def save_session(self, transcript, duration, word_count):
        if transcript:
            return self.TranscriptionSession.objects.create(
                transcript=transcript,
                duration=duration,
                word_count=word_count
            )
        else:
            pass
