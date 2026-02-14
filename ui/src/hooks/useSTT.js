import { useState, useRef } from "react";

export default function useSTT() {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = (onResult) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US"; // change if needed
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      console.log("🎤 Listening started");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      console.log("Transcript:", transcript);
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error("STT Error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      console.log("🎤 Listening ended");
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return { startListening, listening };
}