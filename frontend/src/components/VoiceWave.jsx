import { useEffect, useRef } from "react";

export default function VoiceWave({ isActive, stress = 0.3 }) {
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

      if (!isActive) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const bars = 60;
      const barW = w / bars - 1;

      for (let i = 0; i < bars; i++) {
        const phase = (i / bars) * Math.PI * 4 + f * 0.08;
        const noise =
          Math.sin(phase) * 0.5 +
          Math.sin(phase * 2.3 + 1) * 0.3 +
          Math.sin(phase * 0.7) * 0.2;
        const amp = (0.2 + stress * 0.6) * (h * 0.35);
        const barH = Math.abs(noise) * amp + 4;
        const x = i * (barW + 1);
        const y = (h - barH) / 2;
        const intensity = Math.abs(noise);

        ctx.fillStyle =
          stress > 0.6
            ? `rgba(239,68,68,${0.4 + intensity * 0.6})`
            : `rgba(0,255,180,${0.3 + intensity * 0.7})`;

        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [isActive, stress]);

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
        🎤 VOICE ANALYSIS
      </p>
      <canvas
        ref={canvasRef}
        width={400}
        height={60}
        style={{ width: "100%", borderRadius: 6 }}
      />
    </div>
  );
}