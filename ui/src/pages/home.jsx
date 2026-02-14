import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { decomposeTask } from "../api/backend";
import useSTT from "../hooks/useSTT";
import confetti from "canvas-confetti";
import SmartCompanion from "../components/SmartCompanion";
import { useRef } from "react";
import GuidedTour from "../components/GuidedTour";

export default function Home() {
  const router = useRouter();
  const { startListening } = useSTT();
  const [showTour, setShowTour] = useState(false);
  const startTour = () => {
  alert("Tour started! 🚀");
};
  

  const [user, setUser] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [fontMode, setFontMode] = useState("default");
  const [darkMode, setDarkMode] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [stepTimeLimit, setStepTimeLimit] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [badge, setBadge] = useState(null);
  const [expiredTasks, setExpiredTasks] = useState([]);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const avatarOptions = ["👩","👨","🧠","🌱","🎮","⭐","🐼","🐨"];
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => {
  if (isMusicPlaying) {
    audioRef.current?.play();
  } else {
    audioRef.current?.pause();
  }
}, [isMusicPlaying]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");
    const avatar = localStorage.getItem("avatar");
    const savedDark = localStorage.getItem("darkMode");

    if (!email) {
      router.push("/onboarding");
      return;
    }

    setUser({ email, username, avatar });
    setNewUsername(username || "");
    setSelectedAvatar(avatar || "👤");
    if (savedDark === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleGenerateSteps = async () => {
    if (!taskInput.trim()) return;
    const result = await decomposeTask(user.email, taskInput);
    if (result?.steps) {
      setSteps(result.steps);
      setCurrentStepIndex(0);
    }
    setTaskInput("");
  };

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (!currentStep) return;
    let limit = 30;
    if (currentStep.text.length < 40) limit = 20;
    if (currentStep.text.length < 25) limit = 15;
    setStepTimeLimit(limit);
    setTimeLeft(limit);
    setIsTimerRunning(true); 
  }, [currentStepIndex, currentStep]);

  useEffect(() => {
    if (!currentStep || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setExpiredTasks((old) => [...old, { text: currentStep.text }]);
          setIsMusicPlaying(true);
          setIsTimerRunning(false); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, currentStep]);

  const nextStep = () => {
    const ratio = timeLeft / stepTimeLimit;
    if (ratio > 0.5) {
      setBadge("gold");
      confetti({ particleCount: 120, spread: 70 });
    } else {
      setBadge("silver");
    }
    setShowWinModal(true);

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const speakStep = (text) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    synth.speak(new SpeechSynthesisUtterance(text));
  };

  if (!user) return null;

  const fontFamily =
    fontMode === "lexend"
      ? "Lexend, sans-serif"
      : fontMode === "dyslexic"
      ? "OpenDyslexic, sans-serif"
      : "system-ui";

  const buttonPrimary = {
    padding: "10px 18px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg,#2E7D32,#66BB6A)",
    color: "#fff",
    fontWeight: 600,
  };

  const buttonSecondary = {
    padding: "10px 18px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    background: darkMode ? "#333" : "#f1f1f1",
    color: darkMode ? "#fff" : "#000",
  };

  const progress =
    steps.length > 0
      ? ((currentStepIndex + 1) / steps.length) * 100
      : 0;
      

  return (
    <div
  style={{
    minHeight: "100vh",
    background: darkMode
      ? "linear-gradient(135deg,#0f2027,#203a43,#2c5364)"
      : "linear-gradient(135deg,#e0f7fa,#f1f8ff)",
    color: darkMode ? "#fff" : "#111",
    fontFamily: "system-ui",
    padding: "60px 20px",
    position: "relative",
  }}
>
      {/* PROFILE CARD - TOP LEFT */}
<div
  style={{
    background: "linear-gradient(135deg, rgba(30,30,30,0.9), rgba(60,60,60,0.9))",
    backdropFilter: "blur(12px)",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 320,
    margin: 0,
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* Glow */}
  <div
    style={{
      position: "absolute",
      top: -40,
      right: -40,
      width: 100,
      height: 100,
      background: "radial-gradient(circle, rgba(99,209,230,0.4), transparent)",
      borderRadius: "50%",
    }}
  />

  {/* Top Row */}
  <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
    <div
      style={{
        width: 70,
        height: 70,
        borderRadius: "50%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        boxShadow: "0 0 15px rgba(99,209,230,0.6)",
      }}
    >
      🐼
    </div>

    <div>
      <h3 style={{ margin: 0, color: "white" }}>
        {user?.username}
      </h3>
      <p style={{ margin: "4px 0 0 0", color: "#bbb", fontSize: 12 }}>
        Smart Companion Explorer 🚀
      </p>
    </div>
  </div>

  {/* Stats */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginTop: 18,
      padding: "10px 0",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      color: "white",
      fontSize: 13,
    }}
  >
    <div>
      <strong>12</strong>
      <div style={{ fontSize: 11, color: "#aaa" }}>Tasks</div>
    </div>

    <div>
      <strong>3🔥</strong>
      <div style={{ fontSize: 11, color: "#aaa" }}>Streak</div>
    </div>

    <div>
      <strong>85%</strong>
      <div style={{ fontSize: 11, color: "#aaa" }}>Focus</div>
    </div>
  </div>

  <button
    onClick={() => setShowProfile(true)}
    style={{
      marginTop: 15,
      width: "100%",
      padding: "10px",
      borderRadius: 12,
      border: "none",
      background: "linear-gradient(135deg, #63d1e6, #4fa3f7)",
      color: "white",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      boxShadow: "0 6px 15px rgba(99,209,230,0.4)",
    }}
  >
    ✏️ Edit
  </button>
</div>
<button
  onClick={() => router.push("/help")}
  style={{
    position: "absolute",
    top: 30,
    right: 90,
    padding: "8px 14px",
    borderRadius: 20,
    border: "none",
    background: "#43A047",
    color: "white",
    cursor: "pointer",
    fontSize: 14,
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
  }}
>
  ❓ Help
</button>
<button
  onClick={() => setShowTour(true)}
  style={{
    position: "absolute",
    top: 30,
    right: 160,
    padding: "8px 14px",
    borderRadius: 20,
    border: "none",
    background: "#43A047",
    color: "white",
    cursor: "pointer",
    fontSize: 14,
  }}
>
  🚀 Start Tour
</button>
      {/* DRAWER BUTTON */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        style={{
          position: "absolute",
          right: 30,
          top: 30,
          fontSize: 26,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      {/* DRAWER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 300,
          height: "100vh",
          background: darkMode ? "#1e1e1e" : "#fff",
          padding: 20,
          transform: isDrawerOpen
            ? "translateX(0)"
            : "translateX(100%)",
          transition: "0.3s ease",
          zIndex: 1000,
        }}
      >
        <button style={buttonSecondary} onClick={() => setIsDrawerOpen(false)}>
          Close
        </button>

        <h3>Accessibility</h3>

        {["default","lexend","dyslexic"].map((mode) => (
          <button
            key={mode}
            style={{ ...buttonSecondary, marginTop: 10 }}
            onClick={() => setFontMode(mode)}
          >
            {mode}
          </button>
        ))}

        <button
          style={{ ...buttonSecondary, marginTop: 10 }}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {expiredTasks.length > 0 && (
          <button
            style={{ ...buttonSecondary, marginTop: 10 }}
            onClick={() => setShowExpiredModal(true)}
          >
            Expired Tasks ({expiredTasks.length})
          </button>
        )}

        <button
          style={{ ...buttonPrimary, marginTop: 20 }}
          onClick={() => router.push("/games")}
        >
          🚀 Open Game
        </button>
      </div>

      {/* MAIN CONTENT CENTER */}
      <div
  style={{
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start", // change here
    paddingTop: "80px",           // adjust this value
    textAlign: "center",
    maxWidth: 700,
    margin: "0 auto",
    marginTop: "-120px",
  }}
>
        <h1>Welcome, {user.username}</h1>

        {steps.length > 0 && (
          <div style={{ height: 12, background: "#ccc", borderRadius: 20, width: "100%", marginTop: 20 }}>
            <div style={{
              width: `${progress}%`,
              height: "100%",
              background: "#43A047",
            }} />
          </div>
        )}

        {currentStep ? (
          <div style={{
            marginTop: 30,
            padding: 30,
            borderRadius: 20,
            background: darkMode ? "#1e1e1e" : "#fff",
            width: "100%",
          }}>
            <h3>{currentStep.text}</h3>
            {isMusicPlaying && (
  <div style={{ marginTop: 20 }}>
    <button
      onClick={() => setIsMusicPlaying(false)}
      style={{
        padding: "10px 18px",
        borderRadius: 12,
        border: "none",
        background: "#ff6b6b",
        color: "white",
        cursor: "pointer"
      }}
    >
      Stop Music 🎵
    </button>
  </div>
)}

            <div style={{ margin: 20 }}>
              <div style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: `conic-gradient(#43A047 ${(timeLeft / stepTimeLimit) * 360}deg,#ddd 0deg)`,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: darkMode ? "#1e1e1e" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {timeLeft}s
                </div>
              </div>
            </div>

            <button style={buttonSecondary} onClick={() => speakStep(currentStep.text)}>
              🔊 Hear
            </button>

            <button style={{ ...buttonPrimary, marginLeft: 10 }} onClick={nextStep}>
              Next 🚀
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 40, width: "100%" }}>
            <input
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="What do you want to do?"
              style={{ width: "100%", padding: 12 }}
            />
            <div style={{ marginTop: 10 }}>
              <button style={buttonSecondary} onClick={() => startListening((t) => setTaskInput(t))}>
                🎙️ Speak
              </button>
              <button style={{ ...buttonPrimary, marginLeft: 10 }} onClick={handleGenerateSteps}>
                Break Into Steps
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MICRO WIN MODAL */}
      {showWinModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            background: darkMode ? "#1e1e1e" : "#fff",
            padding: 30,
            borderRadius: 20,
            textAlign: "center",
          }}>
            <h2>🎉 Micro Win!</h2>
            <h3>
              {badge === "gold" ? "🥇 Gold Badge!" : "🥈 Silver Badge!"}
            </h3>
            <button style={buttonPrimary} onClick={() => setShowWinModal(false)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* EXPIRED MODAL */}
      {showExpiredModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            background: darkMode ? "#1e1e1e" : "#fff",
            padding: 30,
            borderRadius: 20,
            width: 350,
          }}>
            <h3>Expired Tasks</h3>
            {expiredTasks.length === 0 ? (
              <p>No expired tasks yet 🎉</p>
            ) : (
              expiredTasks.map((t, i) => (
                <p key={i}>• {t.text}</p>
              ))
            )}
            <button style={buttonPrimary} onClick={() => setShowExpiredModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      <SmartCompanion 
  isTimerRunning={isTimerRunning}
  timeLeft={timeLeft}
   isMusicPlaying={isMusicPlaying}
/>
<audio ref={audioRef} loop>
  <source src="/music1.mp3" type="audio/mpeg" />
</audio>
{showTour && (
  <GuidedTour onClose={() => setShowTour(false)} />
)}
    </div>
  );
}