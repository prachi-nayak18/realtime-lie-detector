const EMOTIONS = [
  { name: "Neutral",   color: "#64748b" },
  { name: "Confident", color: "#22c55e" },
  { name: "Stressed",  color: "#f97316" },
  { name: "Deceptive", color: "#ef4444" },
  { name: "Anxious",   color: "#a855f7" },
  { name: "Focused",   color: "#3b82f6" },
];

export default function EmotionPanel({ emotion = "Neutral" }) {
  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid #1e293b",
      borderRadius: 10,
      padding: 16,
    }}>
      <p style={{
        fontSize: 10,
        color: "#475569",
        letterSpacing: "0.15em",
        marginTop: 0,
        marginBottom: 12,
      }}>
        🎭 EMOTION STATE
      </p>

      {EMOTIONS.map((em) => (
        <div
          key={em.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 8px",
            borderRadius: 5,
            marginBottom: 4,
            background: em.name === emotion
              ? em.color + "22"
              : "transparent",
            border: em.name === emotion
              ? "1px solid " + em.color + "44"
              : "1px solid transparent",
            transition: "all 0.3s",
          }}
        >
          <div style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: em.name === emotion
              ? em.color
              : "#1e293b",
          }} />
          <span style={{
            fontSize: 11,
            fontFamily: "monospace",
            color: em.name === emotion
              ? em.color
              : "#475569",
          }}>
            {em.name}
          </span>
        </div>
      ))}
    </div>
  );
}