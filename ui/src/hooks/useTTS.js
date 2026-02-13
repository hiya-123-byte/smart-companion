import { useCallback } from "react";

export default function useTTS() {
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.85;   // calm
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const calmVoice = voices.find(v =>
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("google")
    );

    if (calmVoice) utterance.voice = calmVoice;

    window.speechSynthesis.cancel(); // prevent overlap
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}