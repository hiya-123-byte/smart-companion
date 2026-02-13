import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { registerUser } from "../api/backend";

export default function Onboarding() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("🌱");
  const [smallSteps, setSmallSteps] = useState(true);
  const [simpleLanguage, setSimpleLanguage] = useState(true);
  const [animate, setAnimate] = useState(false);

  const avatarOptions = ["👩","👨","🧠","🌱","🎮","⭐","🐼","🐨"];

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

 const handleContinue = async () => {
  if (!email.trim()) return alert("Please enter your email");

  try {
    await registerUser({
      email,
      username,
      avatar,
      small_steps: smallSteps,
      simple_language: simpleLanguage,
    });
  } catch (error) {
    // Agar user already exist karta hai toh ignore kar do
    if (!error.message.includes("already")) {
      alert(error.message);
      return;
    }
  }

  localStorage.setItem("email", email);
  localStorage.setItem("username", username);
  localStorage.setItem("avatar", avatar);

  router.push("/home");
};


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui",
      }}
    >
      {/* Floating Background Blur */}
      <div style={{
        position: "absolute",
        width: 300,
        height: 300,
        background: "#a5d6a7",
        borderRadius: "50%",
        filter: "blur(120px)",
        top: -100,
        left: -100,
        opacity: 0.4
      }} />

      <div style={{
        position: "absolute",
        width: 250,
        height: 250,
        background: "#c8e6c9",
        borderRadius: "50%",
        filter: "blur(120px)",
        bottom: -80,
        right: -80,
        opacity: 0.4
      }} />

      {/* Main Card */}
      <div
        style={{
          width: 420,
          background: "white",
          padding: 40,
          borderRadius: 24,
          boxShadow: "0 25px 60px rgba(0,0,0,0.1)",
          transform: animate ? "translateY(0)" : "translateY(40px)",
          opacity: animate ? 1 : 0,
          transition: "all 0.6s ease",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h1 style={{ marginBottom: 8 }}>Welcome 🌱</h1>
        <p style={{ color: "#666", marginBottom: 30 }}>
          Let’s set up your smart companion
        </p>

        {/* Inputs */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ ...inputStyle, marginTop: 15 }}
        />

        {/* Avatar Grid */}
        <div style={{ marginTop: 25 }}>
          <p style={{ marginBottom: 12 }}>Choose your avatar</p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12
          }}>
            {avatarOptions.map((emoji) => (
              <div
                key={emoji}
                onClick={() => setAvatar(emoji)}
                style={{
                  fontSize: 28,
                  padding: 15,
                  borderRadius: 16,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  transform: avatar === emoji ? "scale(1.1)" : "scale(1)",
                  background: avatar === emoji ? "#e8f5e9" : "#f9f9f9",
                  border: avatar === emoji
                    ? "2px solid #2E7D32"
                    : "1px solid #eee",
                  boxShadow: avatar === emoji
                    ? "0 8px 20px rgba(46,125,50,0.25)"
                    : "none"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    avatar === emoji ? "scale(1.1)" : "scale(1)";
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div style={{ marginTop: 25 }}>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={smallSteps}
              onChange={() => setSmallSteps(!smallSteps)}
            />
            I prefer very small steps
          </label>

          <label style={{ ...checkboxStyle, marginTop: 10 }}>
            <input
              type="checkbox"
              checked={simpleLanguage}
              onChange={() => setSimpleLanguage(!simpleLanguage)}
            />
            Use simple language
          </label>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 16,
            border: "none",
            marginTop: 30,
            background: "linear-gradient(135deg, #2E7D32, #43A047)",
            color: "white",
            fontSize: 16,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 10px 25px rgba(46,125,50,0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 14,
  borderRadius: 14,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};

const checkboxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
};