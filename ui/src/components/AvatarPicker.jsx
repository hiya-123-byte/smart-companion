export default function AvatarPicker({ value, onSelect }) {
  const avatars = ["🧠", "🌱", "⭐", "🔥"];

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {avatars.map((a) => (
        <button
          key={a}
          onClick={() => onSelect(a)}
          style={{
            fontSize: "24px",
            border: value === a ? "2px solid black" : "1px solid gray",
          }}
        >
          {a}
        </button>
      ))}
    </div>
  );
}