import { useState } from "react";
import { useRouter } from "next/router";

import BreathingCircle from "../games/BreathingCircle";
import LeftRightFlow from "../games/LeftRightFlow";
import LetterPath from "../games/LetterPath";
import VisualDot from "../games/VisualDot";

export default function Games() {
  const router = useRouter();
  const [activeGame, setActiveGame] = useState(null);

  const GameButton = ({ title, value, color }) => (
    <div
      onClick={() => setActiveGame(value)}
      style={{
        padding: "20px",
        borderRadius: "18px",
        background: color,
        marginBottom: "20px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "16px",
        backdropFilter: "blur(8px)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {title}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f3d47, #2f5f69)",
        padding: "60px 20px",
        position: "relative",
        fontFamily: "system-ui",
        color: "white",
      }}
    >
      {/* CLOSE BUTTON */}
      <div
        onClick={() => router.push("/home")}
        style={{
          position: "absolute",
          right: 30,
          top: 30,
          fontSize: "22px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        ✕
      </div>

      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          textAlign: "center",
          background: "rgba(255,255,255,0.08)",
          padding: "40px",
          borderRadius: "25px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ marginBottom: 8 }}>Mini Games 🎮</h1>
        <p style={{ color: "#ddd", marginBottom: 40 }}>
          Choose one activity to focus on
        </p>

        {!activeGame && (
          <>
            <GameButton
              title="🫁 Breathing Circle"
              value="breathing"
              color="rgba(255,255,255,0.2)"
            />
            <GameButton
              title="↔️ Left-Right Flow"
              value="flow"
              color="rgba(255,255,255,0.15)"
            />
            <GameButton
              title="🔤 Letter Path"
              value="letter"
              color="rgba(255,255,255,0.2)"
            />
            <GameButton
              title="🔵 Visual Dot Focus"
              value="dot"
              color="rgba(255,255,255,0.15)"
            />
          </>
        )}

        {activeGame === "breathing" && <BreathingCircle />}
        {activeGame === "flow" && <LeftRightFlow />}
        {activeGame === "letter" && <LetterPath />}
        {activeGame === "dot" && <VisualDot />}

        {activeGame && (
          <button
            onClick={() => setActiveGame(null)}
            style={{
              marginTop: 40,
              padding: "12px 22px",
              borderRadius: 14,
              border: "none",
              background: "#4CAF50",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            }}
          >
            Back to Games
          </button>
        )}
      </div>
    </div>
  );
}