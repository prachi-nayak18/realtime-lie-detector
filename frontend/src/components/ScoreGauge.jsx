export default function ScoreGauge({ score = 0 }) {
  const r = 48;
  const cx = 60;
  const cy = 60;
  const circ = 2 * Math.PI * r;
  const dash = score * circ;
  const color = score < 0.35 ? "#22c55e" : score < 0.6 ? "#f59e0b" : "#ef4444";
  const label = score < 0.35 ? "TRUTHFUL" : score < 0.6 ? "UNCERTAIN" : "DECEPTIVE";

  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid #1e293b",
      borderRadius: 10,
      padding: 16,
      textAlign: "center"
    }}>
      <p style={{
        fontSize: 10,
        color: "#475569",
        letterSpacing: "0.15em",
        marginTop: 0,
        marginBottom: 12
      }}>
        🎯 DECEPTION INDEX
      </p>

      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r}
          fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle cx={cx} cy={cy} r={r}
          fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        <text x={cx} y={cy - 6}
          textAnchor="middle"
          fill={color}
          fontSize="22"
          fontWeight="bold"
          fontFamily="monospace">
          {Math.round(score * 100)}
        </text>
        <text x={cx} y={cy + 14}
          textAnchor="middle"
          fill="#475569"
          fontSize="9"
          fontFamily="monospace">
          SCORE
        </text>
      </svg>

      <div style={{
        marginTop: 10,
        padding: "8px 12px",
        borderRadius: 6,
        background: color + "22",
        color: color,
        fontSize: 13,
        fontWeight: "bold",
        letterSpacing: "0.15em"
      }}>
        {label}
      </div>
    </div>
  );
}