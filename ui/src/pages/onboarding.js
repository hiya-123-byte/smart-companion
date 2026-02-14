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
  const [launching, setLaunching] = useState(false);

  const avatarOptions = ["👩","👨","🧠","🌱","🎮","⭐","🐼","🐨"];

  useEffect(() => {
    setTimeout(() => setAnimate(true), 200);
  }, []);

  const handleContinue = async () => {
    if (!email.trim()) return alert("Please enter your email");

    setLaunching(true);

    try {
      await registerUser({
        email,
        username,
        avatar,
        small_steps: smallSteps,
        simple_language: simpleLanguage,
      });
    } catch (error) {
      if (!error.message.includes("already")) {
        alert(error.message);
        setLaunching(false);
        return;
      }
    }

    localStorage.setItem("email", email);
    localStorage.setItem("username", username);
    localStorage.setItem("avatar", avatar);

    setTimeout(() => {
      router.push("/home");
    }, 1000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Moving Glow Backgrounds */}
      <div style={glow1}/>
      <div style={glow2}/>

      {/* Main Glass Card */}
      <div
        style={{
          width: 480,
          background: "rgba(30,30,30,0.75)",
          backdropFilter: "blur(20px)",
          borderRadius: 30,
          padding: 45,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          transform: animate ? "translateY(0)" : "translateY(50px)",
          opacity: animate ? 1 : 0,
          transition: "all 0.8s ease",
          animation: "floatCard 6s ease-in-out infinite",
          color: "white",
          position: "relative",
        }}
      >
        <h1 style={{ marginBottom: 8 }}>
          Welcome 🚀
        </h1>

        <p style={{ color: "#aaa", marginBottom: 30 }}>
          Create your focus companion
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ ...inputStyle, marginTop: 15 }}
        />

        {/* Avatar Grid */}
        <div style={{ marginTop: 30 }}>
          <p style={{ marginBottom: 12 }}>Choose your avatar 🎮</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 14,
            }}
          >
            {avatarOptions.map((emoji) => (
              <div
                key={emoji}
                onClick={() => setAvatar(emoji)}
                style={{
                  fontSize: 30,
                  padding: 18,
                  borderRadius: 18,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "0.3s",
                  transform:
                    avatar === emoji ? "scale(1.15)" : "scale(1)",
                  background:
                    avatar === emoji
                      ? "linear-gradient(135deg,#63d1e6,#4fa3f7)"
                      : "rgba(255,255,255,0.05)",
                  boxShadow:
                    avatar === emoji
                      ? "0 0 20px rgba(99,209,230,0.6)"
                      : "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform =
                    avatar === emoji ? "scale(1.15)" : "scale(1)")
                }
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div style={{ marginTop: 30 }}>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={smallSteps}
              onChange={() => setSmallSteps(!smallSteps)}
            />
            Prefer very small steps
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
            padding: 18,
            borderRadius: 20,
            border: "none",
            marginTop: 35,
            background: "linear-gradient(135deg,#63d1e6,#4fa3f7)",
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 12px 30px rgba(99,209,230,0.5)",
            transition: "0.3s",
            transform: launching ? "scale(0.95)" : "scale(1)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-4px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          {launching ? "Launching..." : "🚀 Launch Companion"}
        </button>
      </div>

      <style jsx global>{`
        @keyframes floatCard {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 15,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  outline: "none",
  fontSize: 14,
};

const checkboxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 14,
};

const glow1 = {
  position: "absolute",
  width: 400,
  height: 400,
  background: "radial-gradient(circle, rgba(99,209,230,0.4), transparent)",
  borderRadius: "50%",
  top: -150,
  left: -150,
  animation: "moveGlow 12s infinite alternate",
};

const glow2 = {
  position: "absolute",
  width: 350,
  height: 350,
  background: "radial-gradient(circle, rgba(79,163,247,0.4), transparent)",
  borderRadius: "50%",
  bottom: -120,
  right: -120,
  animation: "moveGlow 14s infinite alternate",
};