import { useEffect, useRef, useState } from "react";

export default function useTranscription() {
  const ws = useRef(null);
  const [partial, setPartial] = useState("");
  const [finalText, setFinalText] = useState("");

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws/transcribe/");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.partial) setPartial(data.partial);
      if (data.final) setFinalText((prev) => prev + " " + data.final);
    };

    return () => ws.current?.close();
  }, []);

  const sendAudio = (buffer) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(buffer);
    }
  };

  return { partial, finalText, sendAudio };
}
