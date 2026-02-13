import { useEffect, useState } from "react";

export default function BreathingCircle() {
  const [phase, setPhase] = useState("inhale");
  const [scale, setScale] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  // Breathing cycle
  useEffect(() => {
    if (!isRunning) return;

    let timeout;

    if (phase === "inhale") {
      setScale(1.6);
      timeout = setTimeout(() => setPhase("hold"), 4000);
    }

    if (phase === "hold") {
      timeout = setTimeout(() => setPhase("exhale"), 2000);
    }

    if (phase === "exhale") {
      setScale(1);
      timeout = setTimeout(() => setPhase("inhale"), 4000);
    }

    return () => clearTimeout(timeout);
  }, [phase, isRunning]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft === 0) {
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, isRunning]);

  const startSession = (time) => {
    setSecondsLeft(time);
    setIsRunning(true);
    setPhase("inhale");
  };

  const resetSession = () => {
    setIsRunning(false);
    setSecondsLeft(60);
    setScale(1);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Breathing Circle 🌿</h2>

      {/* Timer Display */}
      <h3 style={{ marginTop: 10 }}>
        {secondsLeft}s
      </h3>

      {/* Animated Circle */}
      <div
        style={{
          width: 200,
          height: 200,
          margin: "30px auto",
          borderRadius: "50%",
          background: "#43A047",
          transform: `scale(${scale})`,
          transition: "transform 4s ease-in-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        {isRunning ? phase.toUpperCase() : "READY"}
      </div>

      {/* Controls */}
      {!isRunning ? (
        <div>
          <button
            onClick={() => startSession(60)}
            style={buttonStyle}
          >
            Start 1 Min
          </button>

          <button
            onClick={() => startSession(180)}
            style={{ ...buttonStyle, marginLeft: 10 }}
          >
            Start 3 Min
          </button>
        </div>
      ) : (
        <button
          onClick={resetSession}
          style={buttonStyle}
        >
          Stop
        </button>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: 12,
  border: "none",
  background: "#2E7D32",
  color: "white",
  cursor: "pointer",
  fontWeight: 600,
};