"use client";

import { useState, useRef } from "react";
import useTranscription from "../utils/useTranscription";

// Convert Float32 PCM → Int16 PCM (Vosk requirement)
function convertFloat32ToInt16(buffer: Float32Array): ArrayBuffer {
  let l = buffer.length;
  const result = new Int16Array(l);

  for (let i = 0; i < l; i++) {
    let s = Math.max(-1, Math.min(1, buffer[i]));
    result[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return result.buffer; // return ArrayBuffer
}

// Define the type of recorderRef (it can be either null or an object with stream, processor, audioContext)
type RecorderRefType = {
  stream: MediaStream;
  processor: ScriptProcessorNode;
  audioContext: AudioContext;
} | null;

export default function Home() {
  const { partial, finalText, sendAudio } = useTranscription();
  const recorderRef = useRef<RecorderRefType>(null); // Set type to RecorderRefType
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        const float32Audio = e.inputBuffer.getChannelData(0);
        const pcm16 = convertFloat32ToInt16(float32Audio);
        sendAudio(pcm16);
      };

      // Assign the values to recorderRef
      recorderRef.current = { stream, processor, audioContext };
      setIsRecording(true);

    } catch (error) {
      console.error("Microphone error:", error);
      alert("Microphone access blocked or unavailable.");
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;

    const rec = recorderRef.current;

    try {
      // Stop the recorder
      rec?.processor.disconnect();
      rec?.audioContext.close();
      rec?.stream.getTracks().forEach((t) => t.stop());
    } catch (error) {
      console.error("Error stopping recording:", error);
    }

    // Reset recorder reference
    recorderRef.current = null;
    setIsRecording(false);

    // Reload the page
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8 border border-gray-200">
        
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          🎙️ Real-Time Speech Transcription
        </h1>

        {/* Recording indicator */}
        <div className="flex justify-center mb-6">
          {isRecording ? (
            <span className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              Recording…
            </span>
          ) : (
            <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full">
              Not Recording
            </span>
          )}
        </div>

        {/* Start / Stop Buttons */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all
                ${isRecording 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            Start Recording
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all
                ${!isRecording 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-red-600 hover:bg-red-700 text-white"}`}
          >
            Stop Recording
          </button>
        </div>

        {/* Live Transcription */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            🟡 Live Transcription
          </h2>
          <div className="min-h-[60px] p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-gray-800">
            {partial || <span className="text-gray-400">Speak into your microphone…</span>}
          </div>
        </div>

        {/* Final Transcription */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            🟢 Final Transcript
          </h2>
          <div className="min-h-[120px] p-4 bg-green-50 border border-green-200 rounded-lg text-gray-800">
            {finalText || <span className="text-gray-400">Your final transcript will appear here.</span>}
          </div>
        </div>

        {/* Word Count */}
        {finalText.trim().length > 0 && (
          <div className="text-center mt-4 text-gray-800">
            📝 Word Count:{" "}
            <span className="bg-gray-200 px-3 py-1 rounded-md font-bold">
              {finalText.trim().split(/\s+/).length}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
