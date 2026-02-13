import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { decomposeTask } from "../api/backend";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const avatarOptions = ["👩", "👨", "🧠", "🌱", "🎮", "⭐", "🐼", "🐨"];

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fontMode, setFontMode] = useState("default");
  const [showWin, setShowWin] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ===============================
  // LOAD USER
  // ===============================
  useEffect(() => {
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");
    const avatar = localStorage.getItem("avatar");

    if (!email) {
      router.push("/onboarding");
      return;
    }

    setUser({ email, username, avatar });
    setNewUsername(username || "");
    setSelectedAvatar(avatar || "👤");
  }, [router]);

  // Load voices properly (fix for Chrome)
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  if (!user) return null;

  // ===============================
  // BACKEND CALL
  // ===============================
  const handleGenerateSteps = async () => {
    if (!taskInput.trim()) return;

    try {
      setLoading(true);
      const result = await decomposeTask(user.email, taskInput);

      if (result && Array.isArray(result.steps)) {
        setSteps(result.steps);
        setCurrentStepIndex(0);
      } else {
        alert("Couldn't load steps properly.");
      }

      setTaskInput("");
    } catch {
      alert("Failed to generate steps");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = steps[currentStepIndex];

  const nextStep = () => {
    if (!currentStep) return;

    if (currentStep.micro_win) {
      setShowWin(true);
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const progress = steps.length
    ? ((currentStepIndex + 1) / steps.length) * 100
    : 0;

  // ===============================
  // FIXED SPEECH FUNCTION
  // ===============================
  const speakStep = (text) => {
    if (typeof window === "undefined") return;

    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis not supported in this browser.");
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    const voices = synth.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  const fontFamily =
    fontMode === "lexend"
      ? "Lexend, sans-serif"
      : fontMode === "dyslexic"
      ? "OpenDyslexic, sans-serif"
      : "system-ui";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily,
        padding: "40px 20px",
        position: "relative",
      }}
    >
      {/* PROFILE ICON */}
      <div
        onClick={() => setShowProfile(!showProfile)}
        style={{
          position: "absolute",
          left: 30,
          top: 30,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#2E7D32",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          color: "white",
          cursor: "pointer",
        }}
      >
        {user?.avatar || "👤"}
      </div>
      {/* PROFILE PANEL */}
{showProfile && (
  <div
    style={{
      position: "absolute",
      left: 30,
      top: 110,
      width: 280,
      background: "white",
      padding: 25,
      borderRadius: 18,
      boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
      zIndex: 50,
      animation: "fadeIn 0.2s ease-in-out",
    }}
  >
    {/* Avatar Big */}
    <div
      style={{
        fontSize: 50,
        textAlign: "center",
        marginBottom: 10,
      }}
    >
      {user?.avatar || "👤"}
    </div>

    <h3 style={{ textAlign: "center", marginBottom: 5 }}>
      {user?.username || "User"}
    </h3>

    <p
      style={{
        fontSize: 12,
        color: "#666",
        textAlign: "center",
        marginBottom: 15,
      }}
    >
      {user?.email}
    </p>

    {/* EDIT BUTTON */}
    <button
      onClick={() => setEditMode(!editMode)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #ccc",
        background: "#f5f5f5",
        cursor: "pointer",
      }}
    >
      {editMode ? "Cancel" : "Edit Profile"}
    </button>

    {/* EDIT MODE */}
    {editMode && (
      <>
        <input
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Change username"
          style={{
            width: "100%",
            marginTop: 15,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />

        <div style={{ marginTop: 15 }}>
          <p style={{ fontSize: 13 }}>Choose Avatar:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {avatarOptions.map((emoji) => (
              <span
                key={emoji}
                onClick={() => setSelectedAvatar(emoji)}
                style={{
                  fontSize: 24,
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 8,
                  background:
                    selectedAvatar === emoji
                      ? "#e0f2f1"
                      : "transparent",
                  border:
                    selectedAvatar === emoji
                      ? "2px solid #2E7D32"
                      : "1px solid #eee",
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.setItem("username", newUsername);
            localStorage.setItem("avatar", selectedAvatar);

            setUser({
              ...user,
              username: newUsername,
              avatar: selectedAvatar,
            });

            setEditMode(false);
          }}
          style={{
            marginTop: 15,
            width: "100%",
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: "#2E7D32",
            color: "white",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </>
    )}

    <hr style={{ margin: "18px 0" }} />

    {/* LOGOUT */}
    <button
      onClick={() => {
        localStorage.clear();
        router.push("/onboarding");
      }}
      style={{
        width: "100%",
        padding: "8px 14px",
        borderRadius: 8,
        border: "none",
        background: "#d32f2f",
        color: "white",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  </div>
)}

      {/* RIGHT MENU */}
      <div
        onClick={() => setIsDrawerOpen(true)}
        style={{
          position: "absolute",
          right: 30,
          top: 35,
          fontSize: 28,
          cursor: "pointer",
        }}
      >
        ☰
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ marginTop: 100 }}>
          Welcome, {user?.username || user?.email}
        </h1>

        <p style={{ color: "#666" }}>One step at a time 🌱</p>

        {steps.length > 0 && (
          <div
            style={{
              marginTop: 30,
              height: 12,
              background: "#eee",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#43A047",
                transition: "0.4s",
              }}
            />
          </div>
        )}

        {currentStep ? (
          <div
            style={{
              marginTop: 40,
              padding: 30,
              borderRadius: 20,
              background: "#FAFAFA",
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            }}
          >
            <h3>Step {currentStep.step}</h3>
            <p style={{ fontSize: 18 }}>{currentStep.text}</p>

            <button
              onClick={() => speakStep(currentStep.text)}
              disabled={isSpeaking}
              aria-label="Hear this step aloud"
              style={{
                marginTop: 15,
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                background: isSpeaking ? "#aaa" : "#6A1B9A",
                color: "white",
                cursor: "pointer",
              }}
            >
              {isSpeaking ? "🔊 Speaking..." : "🎧 Hear Voice"}
            </button>

            {currentStepIndex < steps.length - 1 && (
              <button
                onClick={nextStep}
                style={{
                  marginTop: 15,
                  marginLeft: 10,
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: "#2E7D32",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Next Step →
              </button>
            )}
          </div>
        ) : (
          <div style={{ marginTop: 40 }}>
            <input
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="What do you want to do today?"
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 14,
                border: "1px solid #ddd",
              }}
            />

            <button
              onClick={handleGenerateSteps}
              disabled={loading}
              style={{
                marginTop: 15,
                padding: "12px 20px",
                borderRadius: 14,
                border: "none",
                background: "#1976D2",
                color: "white",
                cursor: "pointer",
              }}
            >
              {loading ? "Generating..." : "Break Into Steps"}
            </button>
          </div>
        )}
      </div>

      {/* ACCESSIBILITY DRAWER - POLISHED */}
      {isDrawerOpen && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            width: 320,
            height: "100vh",
            background: "#f9fafb",
            padding: 30,
            boxShadow: "-6px 0 30px rgba(0,0,0,0.1)",
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        >
          <div
            onClick={() => setIsDrawerOpen(false)}
            style={{
              position: "absolute",
              right: 20,
              top: 20,
              fontSize: 22,
              cursor: "pointer",
              color: "#444",
            }}
          >
            ✕
          </div>

          <h3 style={{ marginBottom: 10 }}>Accessibility</h3>
          <p style={{ fontSize: 13, color: "#666" }}>
            Choose reading style
          </p>

          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => setFontMode("default")}
              style={{
                padding: 10,
                borderRadius: 10,
                border: fontMode === "default" ? "2px solid #1976D2" : "1px solid #ccc",
                background: "white",
                cursor: "pointer",
              }}
            >
              Default
            </button>

            <button
              onClick={() => setFontMode("lexend")}
              style={{
                padding: 10,
                borderRadius: 10,
                border: fontMode === "lexend" ? "2px solid #1976D2" : "1px solid #ccc",
                background: "white",
                cursor: "pointer",
              }}
            >
              Lexend (Focus)
            </button>

            <button
              onClick={() => setFontMode("dyslexic")}
              style={{
                padding: 10,
                borderRadius: 10,
                border: fontMode === "dyslexic" ? "2px solid #1976D2" : "1px solid #ccc",
                background: "white",
                cursor: "pointer",
              }}
            >
              OpenDyslexic
            </button>
          </div>

          <hr style={{ margin: "30px 0" }} />

          <h4>🎮 Game Section</h4>
          <button
            onClick={() => router.push("/games")}
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: "#2E7D32",
              color: "white",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Open Game
          </button>
        </div>
      )}
    </div>
  );
}