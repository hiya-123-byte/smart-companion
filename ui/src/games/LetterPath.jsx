import { useState, useEffect, useRef } from "react";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function LetterPath() {
  const [letters, setLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [level, setLevel] = useState("easy");
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [completed, setCompleted] = useState(false);

  const correctSound = useRef(null);
  const wrongSound = useRef(null);

  const levelConfig = {
    easy: { count: 8, time: 60 },
    medium: { count: 12, time: 50 },
    hard: { count: 18, time: 40 },
  };

  const generateLetters = () => {
    const count = levelConfig[level].count;

    const shuffled = alphabet
      .slice(0, count)
      .sort(() => 0.5 - Math.random())
      .map((letter) => ({
        letter,
        top: Math.random() * 80 + "%",
        left: Math.random() * 80 + "%",
      }));

    setLetters(shuffled);
    setCurrentIndex(0);
    setCompleted(false);
  };

  useEffect(() => {
    generateLetters();
  }, [level]);

  // TIMER
  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft === 0) {
      setIsRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isRunning]);

  const handleClick = (letter) => {
    if (!isRunning) return;

    if (letter === alphabet[currentIndex]) {
      correctSound.current.play();
      setCurrentIndex((prev) => prev + 1);
      setScore((prev) => prev + 10);

      if (currentIndex + 1 === levelConfig[level].count) {
        setCompleted(true);
        setIsRunning(false);
        setScore((prev) => prev + 50);
      }
    } else {
      wrongSound.current.play();
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setScore((prev) => Math.max(prev - 5, 0));
    }
  };

  const startGame = () => {
    generateLetters();
    setSecondsLeft(levelConfig[level].time);
    setScore(0);
    setIsRunning(true);
    setCompleted(false);
  };

  const progress =
    (currentIndex / levelConfig[level].count) * 100;

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Letter Path Pro 🧠✨</h2>

      {/* LEVEL SELECT */}
      {!isRunning && (
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setLevel("easy")}>Easy</button>
          <button onClick={() => setLevel("medium")} style={{ marginLeft: 8 }}>
            Medium
          </button>
          <button onClick={() => setLevel("hard")} style={{ marginLeft: 8 }}>
            Hard
          </button>
        </div>
      )}

      <h3>⏳ {secondsLeft}s</h3>
      <h3>⭐ Score: {score}</h3>

      {/* PROGRESS BAR */}
      <div
        style={{
          width: 300,
          height: 10,
          background: "#eee",
          margin: "10px auto",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#43A047",
            borderRadius: 6,
            transition: "0.3s",
          }}
        />
      </div>

      {/* GAME BOARD */}
      <div
        style={{
          position: "relative",
          margin: "30px auto",
          width: 420,
          height: 420,
          background: "#F9FAFB",
          borderRadius: 24,
          border: shake ? "3px solid red" : "2px solid #ddd",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        {letters.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item.letter)}
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              width: 55,
              height: 55,
              borderRadius: "50%",
              background:
                item.letter === alphabet[currentIndex]
                  ? "#2E7D32"
                  : "#1976D2",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 18,
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            {item.letter}
          </div>
        ))}

        {/* COMPLETED SCREEN */}
        {completed && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            🎉 Level Complete!
            <button
              onClick={startGame}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                borderRadius: 12,
                border: "none",
                background: "#43A047",
                color: "white",
                cursor: "pointer",
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {!isRunning && !completed && (
        <button
          onClick={startGame}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "none",
            background: "#2E7D32",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Start Game
        </button>
      )}

      {/* AUDIO */}
      <audio
        ref={correctSound}
        src="https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3"
      />
      <audio
        ref={wrongSound}
        src="https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-game-over-213.mp3"
      />
    </div>
  );
}