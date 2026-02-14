import { useState } from "react";

const steps = [
  "📝 This is where you type your task.",
  "🎤 You can speak instead of typing.",
  "⏳ Each step has a timer.",
  "🤖 Your companion motivates you here.",
  "🎮 Play focus games from here."
];

export default function GuidedTour({ onClose }) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      onClose();
    }
  };

  return (
    <>
      {/* Dark Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          zIndex: 9998,
        }}
      />

      {/* Tour Card */}
      <div
        style={{
          position: "fixed",
          bottom: 100,
          left: "50%",
          transform: "translateX(-50%)",
          background: "white",
          color: "#111",
          padding: 25,
          borderRadius: 20,
          width: 350,
          zIndex: 9999,
          textAlign: "center",
          boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
        }}
      >
        <h3>App Tour</h3>
        <p style={{ margin: "20px 0" }}>{steps[current]}</p>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#666",
              cursor: "pointer"
            }}
          >
            Skip
          </button>

          <button
            onClick={next}
            style={{
              background: "#43A047",
              border: "none",
              padding: "8px 16px",
              borderRadius: 10,
              color: "white",
              cursor: "pointer"
            }}
          >
            {current === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </>
  );
}