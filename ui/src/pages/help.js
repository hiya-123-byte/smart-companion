import { useRouter } from "next/router";

export default function Help() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px 20px",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        color: "white",
        fontFamily: "system-ui"
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => router.push("/home")}
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          padding: "8px 14px",
          borderRadius: 20,
          border: "none",
          background: "#43A047",
          color: "white",
          cursor: "pointer"
        }}
      >
        ← Back
      </button>

      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 20 }}>How To Use Smart Companion 🤖</h1>

        <div style={{ lineHeight: 1.8, fontSize: 16 }}>
          <p>📝 1. Type your task and click "Break Into Steps".</p>
          <p>🎤 2. You can also use voice input.</p>
          <p>⏳ 3. Complete each step before timer ends.</p>
          <p>🎵 4. If you miss a step, relaxing music will play.</p>
          <p>🤖 5. Your bot motivates and guides you.</p>
          <p>🎮 6. Use Mini Games to improve focus.</p>
          <p>🏆 7. Micro wins celebrate small achievements.</p>
        </div>
      </div>
    </div>
  );
}