import useTTS from "../hooks/useTTS";

export default function VoiceButton({ text }) {
  const { speak } = useTTS();

  return (
    <button
      onClick={() => speak(text)}
      style={{
        marginTop: 15,
        padding: "10px 18px",
        borderRadius: 10,
        border: "none",
        background: "#6A1B9A",
        color: "white",
        cursor: "pointer",
      }}
    >
      🎧 Hear Voice
    </button>
  );
}