import { useEffect, useState, useRef } from "react";

export default function VisualDot() {
  const areaRef = useRef(null);

  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [target, setTarget] = useState({ x: 80, y: 40 });

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  // Generate random target
  const generateNewTarget = () => {
    setTarget({
      x: Math.random() * 90,
      y: Math.random() * 80,
    });
  };

  // Smooth movement toward target
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // If reached target → generate new one
        if (distance < 1) {
          generateNewTarget();
          return prev;
        }

        return {
          x: prev.x + dx * 0.05,
          y: prev.y + dy * 0.05,
        };
      });
    }, 16); // 60fps smooth

    return () => clearInterval(interval);
  }, [isRunning, target]);

  // Timer
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
    generateNewTarget();
  };

  const stopSession = () => {
    setIsRunning(false);
  };

  const resetSession = () => {
    setIsRunning(false);
    setSecondsLeft(60);
    setPosition({ x: 50, y: 50 });
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Visual Dot Focus 🔵</h2>
      <p>Follow the dot with your eyes only</p>

      <h3 style={{ marginTop: 10 }}>{secondsLeft}s</h3>

      {/* Large Focus Area */}
      <div
        ref={areaRef}
        style={{
          position: "relative",
          height: 400,
          marginTop: 40,
          background: "linear-gradient(135deg, #f8fafc, #eef2f7)",
          borderRadius: 25,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${position.y}%`,
            left: `${position.x}%`,
            transform: "translate(-50%, -50%)",
            width: 35,
            height: 35,
            borderRadius: "50%",
            background: "#1976D2",
            boxShadow: "0 0 25px rgba(25,118,210,0.5)",
          }}
        />
      </div>

      {/* Controls */}
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
          <button onClick={stopSession} style={btn}>
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