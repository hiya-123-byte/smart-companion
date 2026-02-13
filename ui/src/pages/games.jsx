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
        padding: "18px",
        borderRadius: "18px",
        background: color,
        marginBottom: "18px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        transition: "0.3s",
      }}
    >
      {title}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ffffff, #f4f8fb)",
        padding: "50px 20px",
        position: "relative",
        fontFamily: "system-ui",
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

      <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ marginBottom: 8 }}>Mini Games 🎮</h1>
        <p style={{ color: "#666", marginBottom: 40 }}>
          Choose one activity to focus on
        </p>

        {!activeGame && (
          <>
            <GameButton
              title="🫁 Breathing Circle"
              value="breathing"
              color="#E3F2FD"
            />
            <GameButton
              title="↔️ Left-Right Flow"
              value="flow"
              color="#E8F5E9"
            />
            <GameButton
              title="🔤 Letter Path"
              value="letter"
              color="#FFF3E0"
            />
            <GameButton
              title="🔵 Visual Dot Focus"
              value="dot"
              color="#F3E5F5"
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
              padding: "10px 18px",
              borderRadius: 12,
              border: "none",
              background: "#1976D2",
              color: "white",
              cursor: "pointer",
            }}
          >
            Back to Games
          </button>
        )}
      </div>
    </div>
  );
}