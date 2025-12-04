
# 🎙️ Real-Time Speech Transcription Web Application (CPU-Only)

This project is a **real-time speech-to-text transcription system** where audio is captured from the browser's microphone, streamed to the backend, and transcribed live. The transcription process uses **Vosk**, a **CPU-only open-source speech recognition model**.

Built with **Next.js** for the frontend and **Django + Channels** for the backend, this system is designed to work **completely offline** and **without GPU acceleration**.

---

## 📌 Features

- **Real-Time Microphone Streaming**: Capture and stream audio from the user's microphone to the backend in real time.
- **Live Transcription**: Partial transcriptions are updated dynamically as the user speaks.
- **Final Transcript**: Full transcription is displayed once the recording stops, with word count.
- **Django + WebSocket Backend**: A Django backend using Channels handles WebSocket connections and transcriptions.
- **CPU-Only Speech Recognition**: Uses **Vosk** (open-source) for speech recognition without requiring a GPU.
- **Word Count Calculation**: Displays the word count of the final transcript.
- **Docker Support**: Easily deployable with Docker for both frontend and backend services.
- **API Support**: Exposes APIs for retrieving transcription session details.

---

## 🧰 Tech Stack

### **Frontend**
- **Next.js** (React-based framework)
- **Web Audio API** (for microphone capture and real-time audio processing)
- **WebSockets** (for real-time communication with backend)

### **Backend**
- **Django** (Python web framework)
- **Django Channels** (for handling WebSockets and asynchronous tasks)
- **Vosk** (offline, CPU-based speech-to-text recognition)
- **SQLite/PostgreSQL** (for session data storage)

### **DevOps**
- **Docker** (for containerization)
- **Django REST Framework** (for API creation)

---

## 📁 Project Structure

```
real-time-transcription/
│
├── backend/
│   ├── core/
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── transcriptions/
│   │   ├── consumers.py
│   │   ├── models.py
│   │   ├── routing.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── tests.py
│   │   └── __init__.py
│   │
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── models/vosk-model-small-en-us-0.15/
│
├── frontend/
│   ├── app/page.js
│   ├── utils/useTranscription.js
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
```

---

## 🧑‍💻 Installation (Local)

To get the application running locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/mhasan05/Real-Time-Speech-Transcription.git
cd Real-Time-Speech-Transcription
```

### 2. Install Backend Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows, use venv\Scripts\activate
pip install -r requirements.txt
```

#### Download Vosk Model (Already exist in project file)

```bash
cd models
wget https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip
unzip vosk-model-small-en-us-0.15.zip
cd ..
```

### 3. Migrate Database

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Run Django Server

```bash
daphne core.asgi:application -b 0.0.0.0 -p 8000
```

---

### 5. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 6. Start Frontend

```bash
npm run dev
```

The frontend should be available at **http://localhost:3000** and the backend at **http://localhost:8000**.

---

## 🚀 Run with Docker

Ensure Docker Desktop is installed. Then, run the application using **Docker Compose**.

```bash
docker-compose up --build
```

Frontend: **http://localhost:3000**  
Backend: **http://localhost:8000**  
WebSocket: **ws://localhost:8000/ws/transcribe/**

---

## 📡 API Documentation

### 📍 GET /sessions/

Retrieve all transcription sessions.

#### Example Response:
```json
[
  {
    "id": "bccef5e5-7e75-4ae8-ac8d-75ac7f894a45",
    "transcript": "hello this is a test",
    "duration": 8.15,
    "word_count": 5,
    "created_at": "2025-01-15T12:54:21.123Z"
  }
]
```

---

### 📍 GET /sessions/{id}/

Retrieve a specific transcription session.

#### Example Response:
```json
{
  "id": "bccef5e5-7e75-4ae8-ac8d-75ac7f894a45",
  "transcript": "hello this is a test",
  "duration": 8.15,
  "word_count": 5,
  "created_at": "2025-01-15T12:54:21.123Z"
}
```

---

## 🔨 How It Works

### ✔ Frontend

1. **Capture Microphone Input** using Web Audio API.
2. **Process the audio** in small chunks (16kHz PCM).
3. **Send audio data via WebSocket** to the backend for transcription.
4. **Display live partial transcription** as the user speaks.
5. **Show final transcription** after the recording stops.

### ✔ Backend

1. **Receive audio chunks** from the frontend using WebSockets.
2. **Use Vosk to transcribe** the audio into text.
3. **Return partial transcription results** in real time.
4. **Save session metadata** (transcript, word count, duration, timestamp).
5. **Store the transcription session** in a database (SQLite/PostgreSQL).

---

## 🧪 Test Commands

To run tests for the Django backend, use:

```bash
cd backend
python manage.py test
```

### Included Tests:
- **Model tests** for `TranscriptionSession`

---

## 🚧 Future Improvements

Here are some future improvements that can be made to the application:

- **Add UI waveform visualization** for better UX.
- **Multi-language transcription support** using other models.
- **User authentication** (to store and manage personal transcription data).
- **Real-time confidence scoring** to improve result quality.
- **Save audio recordings** for auditing and improvement.
- **Backend performance optimization** to handle large-scale transcription.

---


## 🎉 Final Notes

This application demonstrates my ability to:

- **Integrate speech recognition models** (Vosk).
- **Build real-time, scalable systems** using **Django Channels** and **WebSockets**.
- **Develop responsive, interactive UIs** with **Next.js**.
- **Design and implement robust backend systems** with **Django** and **Python**.

---

If you need anything else, feel free to reach out or open an issue in the repo. Thanks for checking out this project! 😊

---

# **The END!**
