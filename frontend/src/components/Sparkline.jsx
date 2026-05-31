export default function Sparkline({ history = {} }) {
  const items = [
    { label: "Deception", data: history.score || [], color: "#ef4444" },
    { label: "Stress", data: history.stress || [], color: "#f97316" },
    { label: "Confidence", data: history.confidence || [], color: "#22c55e" },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 12,
    }}>
      {items.map(({ label, data, color }) => {
        const max = Math.max(...data, 0.01);
        const len = Math.max(data.length - 1, 1);
        const pts = data
          .map((v, i) => {
            const x = (i / len) * 100;
            const y = 44 - (v / max) * 44;
            return x + "," + y;
          })
          .join(" ");

        return (
          <div key={label} style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 10,
            padding: 12,
          }}>
            <p style={{
              fontSize: 9,
              color: "#475569",
              letterSpacing: "0.1em",
              marginTop: 0,
              marginBottom: 6,
            }}>
              {label.toUpperCase()}
            </p>
            <svg
              width="100%"
              height="44"
              viewBox="0 0 100 44"
              preserveAspectRatio="none"
            >
              {data.length > 1 && (
                <polyline
                  points={pts}
                  fill="none"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
            <p style={{
              fontSize: 16,
              fontWeight: "bold",
              color: color,
              marginTop: 4,
              marginBottom: 0,
              fontFamily: "monospace",
            }}>
              {data.length ? Math.round(data[data.length - 1] * 100) : 0}%
            </p>
          </div>
        );
      })}
    </div>
  );
}