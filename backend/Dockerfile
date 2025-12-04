FROM python:3.10-slim

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

CMD ["daphne", "core.asgi:application", "-b", "0.0.0.0", "-p", "8000"]
