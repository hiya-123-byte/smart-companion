import { useEffect, useState, useRef } from "react";

export default function LeftRightFlow() {
  const [position, setPosition] = useState(0); // 0 to 100
  const [direction, setDirection] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  const audioContextRef = useRef(null);

  // 🎧 Create stereo beep
  const playBeep = (panValue) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const panNode = ctx.createStereoPanner();

    oscillator.type = "sine";
    oscillator.frequency.value = 440;

    panNode.pan.value = panValue; // -1 left, +1 right

    oscillator.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(ctx.destination);

    gainNode.gain.value = 0.1;

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.15);
  };

  // 🔄 Moving light logic
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        let newPos = prev + direction * 2;

        if (newPos >= 100) {
          setDirection(-1);
          playBeep(1); // Right ear
          return 100;
        }

        if (newPos <= 0) {
          setDirection(1);
          playBeep(-1); // Left ear
          return 0;
        }

        return newPos;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isRunning, direction]);

  // ⏱ Timer
  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft === 0) {
      setIsRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isRunning]);

  const startSession = (time) => {
    setSecondsLeft(time);
    setIsRunning(true);
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const resetSession = () => {
    setIsRunning(false);
    setSecondsLeft(60);
    setPosition(0);
    setDirection(1);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Left ↔ Right Flow 🎧</h2>
      <p>Follow the light & listen to the alternating sound</p>

      <h3>{secondsLeft}s</h3>

      {/* Track */}
      <div
        style={{
          marginTop: 40,
          height: 120,
          position: "relative",
          background: "linear-gradient(90deg,#f3f6fa,#e8eef5)",
          borderRadius: 30,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${position}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#6A1B9A",
            boxShadow: "0 0 25px rgba(106,27,154,0.6)",
          }}
        />
      </div>

      {!isRunning ? (
        <div style={{ marginTop: 30 }}>
          <button onClick={() => startSession(60)} style={btn}>
            Start 1 Min
          </button>

          <button
            onClick={() => startSession(120)}
            style={{ ...btn, marginLeft: 10 }}
          >
            Start 2 Min
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 30 }}>
          <button onClick={pauseSession} style={btn}>
            Pause
          </button>

          <button
            onClick={resetSession}
            style={{ ...btn, marginLeft: 10, background: "#D32F2F" }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

const btn = {
  padding: "12px 20px",
  borderRadius: 14,
  border: "none",
  background: "#2E7D32",
  color: "white",
  cursor: "pointer",
  fontWeight: 600,
};