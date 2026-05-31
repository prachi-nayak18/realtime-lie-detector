export default function EventLog({ events = [] }) {
  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid #1e293b",
      borderRadius: 10,
      padding: 12
    }}>
      <p style={{
        fontSize: 10,
        color: "#475569",
        letterSpacing: "0.15em",
        marginTop: 0,
        marginBottom: 8
      }}>
        📋 PIPELINE EVENT LOG
      </p>
      <div style={{
        background: "#020817",
        borderRadius: 6,
        padding: 10, 
        height: 140,
        overflowY: "auto"
      }}>
        {events.length === 0 && (
          <p style={{
            fontSize: 10,
            color: "#1e293b",
            fontFamily: "monospace"
          }}>
            Waiting for events...
          </p>
        )}
        {events.map((e, i) => (
          <p key={i} style={{
            fontSize: 10,
            fontFamily: "monospace",
            margin: "2px 0",
            color: e.type === "warn"
              ? "#f97316"
              : e.type === "success"
              ? "#22c55e"
              : "#475569"
          }}>
            {e.text}
          </p>
        ))}
      </div>
    </div>
  );
}