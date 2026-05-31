import { useEffect, useRef } from "react";

export default function WebcamFeed({ emotion }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;

    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "#020817";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 - 10;

      // Head
      ctx.beginPath();
      ctx.ellipse(cx, cy, 55, 70, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,255,180,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Eyes
      const eyeOpen = 0.4 + Math.sin(f * 0.08) * 0.3;
      [-20, 20].forEach((dx) => {
        ctx.beginPath();
        ctx.ellipse(cx + dx, cy - 15, 10, eyeOpen * 10, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,200,255,0.8)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx + dx, cy - 15, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,255,180,0.9)";
        ctx.fill();
      });

      // Emotion label
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 11px monospace";
      ctx.fillText("▶ " + (emotion || "NEUTRAL").toUpperCase(), 10, h - 14);

      // Recording dot
      if (Math.floor(f / 30) % 2 === 0) {
        ctx.beginPath();
        ctx.arc(w - 16, 16, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [emotion]);

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
        marginBottom: 8,
        marginTop: 0
      }}>
        📷 FACE TRACKING
      </p>
      <canvas
        ref={canvasRef}
        width={280}
        height={220}
        style={{ width: "100%", borderRadius: 8 }}
      />
    </div>
  );
}