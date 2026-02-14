import { useEffect, useState } from "react";

export default function SmartCompanion({ 
  isTimerRunning, 
  timeLeft,
  isMusicPlaying   // 👈 add this
}) {
  const [message, setMessage] = useState("Hello buddy 👋 How are you doing today?");
  const [isSpeaking, setIsSpeaking] = useState(false);

  /* ---------------- INTRO MESSAGE ---------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setMessage("Let's do some tasks 💪");
    }, 4000);

    return () => clearTimeout(t);
  }, []);

  /* ---------------- TIMER MOTIVATION ---------------- */
  useEffect(() => {
    if (isTimerRunning) {
      setMessage("You're doing great 🌟 Stay focused!");
    }
  }, [isTimerRunning]);

  /* ---------------- TIMER WARNING + EXPIRE ---------------- */
  useEffect(() => {
    if (timeLeft === 5 && isTimerRunning) {
      setMessage("Task is about to expire ⏳ You got this!");
    }

    if (timeLeft === 0 && isTimerRunning) {
      setMessage("It's okay 💛 Let's relax for a moment.");
    }
  }, [timeLeft, isTimerRunning]);

  /* ---------------- MUSIC MESSAGE ---------------- */
  useEffect(() => {
    if (isMusicPlaying) {
      setMessage("I'm playing some relaxing music for you 🎵✨");
    }
  }, [isMusicPlaying]);

  /* ---------------- SPEAKING ANIMATION ---------------- */
  useEffect(() => {
    setIsSpeaking(true);
    const t = setTimeout(() => setIsSpeaking(false), 2000);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div className="bot-wrapper">
      <div className="chat-bubble">{message}</div>

      <div className="robot">
        <div className="antenna left"></div>
        <div className="antenna right"></div>

        <div className="head">
          <div className="face">
            <div className="eyes">
              <div className="eye"></div>
              <div className="eye"></div>
            </div>

            <div className={`mouth ${isSpeaking ? "talking" : ""}`}></div>
          </div>
        </div>

        <div className="body">
          <div className="screen">HELLO</div>
        </div>

        <div className="legs">
          <div className="leg"></div>
          <div className="leg"></div>
        </div>
      </div>
    </div>
  );
}