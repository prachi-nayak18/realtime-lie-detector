function SingleBar({ label, value = 0, color = "#22c55e" }) {
  const pct = Math.round(value * 100);
  const barColor = value > 0.7 ? "#ef4444" : value > 0.4 ? "#f59e0b" : color;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "5px 0",
      borderBottom: "1px solid #0f172a"
    }}>
      <span style={{
        fontSize: 11,
        color: "#94a3b8",
        minWidth: 80,
        fontFamily: "monospace"
      }}>
        {label}
      </span>
      <div style={{
        flex: 1,
        height: 4,
        background: "#1e293b",
        borderRadius: 2,
        margin: "0 8px",
        overflow: "hidden"
      }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: barColor,
          borderRadius: 2,
          transition: "width 0.4s ease"
        }} />
      </div>
      <span style={{
        fontSize: 11,
        color: barColor,
        minWidth: 36,
        textAlign: "right",
        fontFamily: "monospace"
      }}>
        {pct}%
      </span>
    </div>
  );
}

export default function MetricBar({ metrics = {} }) {
  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid #1e293b",
      borderRadius: 10,
      padding: 16
    }}>
      <p style={{
        fontSize: 10,
        color: "#475569",
        letterSpacing: "0.15em",
        marginTop: 0,
        marginBottom: 12
      }}>
        📈 DETAIL METRICS
      </p>
      <SingleBar label="Confidence"  value={metrics.confidence}  color="#22c55e" />
      <SingleBar label="Stress"      value={metrics.stress}      color="#22c55e" />
      <SingleBar label="Eye Contact" value={metrics.eyeContact}  color="#22c55e" />
      <SingleBar label="Voice Tremor"value={metrics.voiceTremor} color="#22c55e" />
      <SingleBar label="Pause Ratio" value={metrics.pauseRatio}  color="#22c55e" />
    </div>
  );
}