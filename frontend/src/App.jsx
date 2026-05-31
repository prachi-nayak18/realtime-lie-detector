import { useState, useEffect, useRef } from "react";
import useAnalysis from "./hooks/useAnalysis";
import useWebcam from "./hooks/useWebcam";
import useWebSocket from "./hooks/useWebSocket";
import WebcamFeed from "./components/WebcamFeed";
import VoiceWave from "./components/VoiceWave";
import ScoreGauge from "./components/ScoreGauge";
import EmotionPanel from "./components/EmotionPanel";
import MetricBar from "./components/MetricBar";
import EventLog from "./components/EventLog";
import Sparkline from "./components/Sparkline";

const QUESTIONS = [
  "Tell me about yourself.",
  "Why do you want this job?",
  "Describe a difficult challenge.",
  "Where do you see yourself in 5 years?",
  "Have you ever made a big mistake?",
  "Why did you leave your last job?",
];

export default function App() {
  const [phase, setPhase] = useState("idle");
  const [qIdx, setQIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const simRef = useRef(null);

  const {
    metrics,
    score,
    emotion,
    history,
    events,
    updateMetrics,
    startSimulation,
    reset,
  } = useAnalysis();

  const { startCamera, stopCamera } = useWebcam();
  const { connect, disconnect } = useWebSocket(updateMetrics);

  const startSession = async () => {
    reset();
    setQIdx(0);
    setElapsed(0);
    await startCamera();
    connect();
    const id = startSimulation();
    simRef.current = id;
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    setPhase("active");
  };

  const stopSession = () => {
    stopCamera();
    disconnect();
    clearInterval(simRef.current);
    clearInterval(timerRef.current);
    setPhase("result");
  };

  const nextQuestion = () => {
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx((q) => q + 1);
    } else {
      stopSession();
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(simRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  const fmt = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return mm + ":" + ss;
  };

  const getColor = () => {
    if (score < 0.35) return "#22c55e";
    if (score < 0.6) return "#f59e0b";
    return "#ef4444";
  };

  const getVerdict = () => {
    if (score < 0.35) return "TRUTHFUL";
    if (score < 0.6) return "UNCERTAIN";
    return "DECEPTIVE";
  };

  const scoreColor = getColor();
  const verdict = getVerdict();

  const s = {
    page: {
      minHeight: "100vh",
      background: "#020817",
      color: "#e2e8f0",
      fontFamily: "monospace",
    },
    center: {
      textAlign: "center",
      paddingTop: 100,
    },
    btn: {
      padding: "14px 40px",
      fontSize: 14,
      borderRadius: 8,
      border: "none",
      background: "#ef4444",
      color: "#fff",
      cursor: "pointer",
      fontFamily: "monospace",
      fontWeight: "bold",
    },
  };

  if (phase === "idle") {
    return (
      <div style={Object.assign({}, s.page, s.center)}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🧠</div>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>VERITASCAN</h1>
        <p style={{ color: "#64748b", marginBottom: 8 }}>
          Real-time AI lie detection system
        </p>
        <p style={{ color: "#334155", fontSize: 12, marginBottom: 48 }}>
          OpenCV · Whisper · DeepFace · FastAPI · WebSockets
        </p>
        <button onClick={startSession} style={s.btn}>
          START SESSION
        </button>
      </div>
    );
  }

  if (phase === "active") {
    return (
      <div style={s.page}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          borderBottom: "1px solid #1e293b",
        }}>
          <span style={{ fontWeight: "bold" }}>🧠 VERITASCAN</span>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{
              padding: "3px 10px",
              border: "1px solid #ef4444",
              color: "#ef4444",
              fontSize: 10,
              borderRadius: 4,
            }}>
              REC {fmt(elapsed)}
            </span>
            <span style={{
              padding: "3px 10px",
              border: "1px solid #475569",
              color: scoreColor,
              fontSize: 10,
              borderRadius: 4,
            }}>
              {verdict}
            </span>
          </div>
        </div>

        <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 10,
            padding: 20,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 10, color: "#6366f1", marginBottom: 8 }}>
              QUESTION {qIdx + 1} / {QUESTIONS.length}
            </div>
            <div style={{ fontSize: 16, marginBottom: 16, lineHeight: 1.6 }}>
              "{QUESTIONS[qIdx]}"
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={nextQuestion} style={{
                padding: "8px 20px",
                borderRadius: 6,
                border: "1px solid #6366f1",
                background: "transparent",
                color: "#6366f1",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: 11,
              }}>
                {qIdx < QUESTIONS.length - 1
                  ? "Next Question"
                  : "End Session"}
              </button>
              <button onClick={stopSession} style={{
                padding: "8px 20px",
                borderRadius: 6,
                border: "1px solid #475569",
                background: "transparent",
                color: "#475569",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: 11,
              }}>
                Stop Early
              </button>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: 16,
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <WebcamFeed emotion={emotion} stress={metrics.stress} />
              <ScoreGauge score={score} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <VoiceWave isActive={true} stress={metrics.stress} />
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}>
                <EmotionPanel emotion={emotion} />
                <MetricBar metrics={metrics} />
              </div>
              <Sparkline history={history} />
            </div>
          </div>

          <EventLog events={events} />
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const emoji = verdict === "TRUTHFUL"
      ? "✅"
      : verdict === "DECEPTIVE"
      ? "🚨"
      : "⚠️";

    return (
      <div style={Object.assign({}, s.page, s.center)}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{emoji}</div>
        <h2 style={{ fontSize: 32, color: scoreColor, marginBottom: 8 }}>
          {verdict}
        </h2>
        <p style={{ color: "#64748b", marginBottom: 48 }}>
          Final Score: {Math.round(score * 100)}% · Duration: {fmt(elapsed)}
        </p>
       <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 48,
          padding: "0 20px",
        }}>
          {[
            ["Confidence", Math.round(metrics.confidence * 100) + "%", "#22c55e"],
            ["Stress", Math.round(metrics.stress * 100) + "%", "#ef4444"],
            ["Eye Contact", Math.round(metrics.eyeContact * 100) + "%", "#3b82f6"],
            ["Tremor", Math.round(metrics.voiceTremor * 100) + "%", "#f97316"],
            ["Warnings", events.filter((e) => e.type === "warn").length, "#a855f7"],
          ].map(([label, val, color]) => (
            <div key={label} style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 10,
              padding: "16px 24px",
              minWidth: 110,
            }}>
              <div style={{ fontSize: 22, fontWeight: "bold", color }}>
                {val}
              </div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <Sparkline history={history} />

        <button
          onClick={() => { reset(); setPhase("idle"); }}
          style={Object.assign({}, s.btn, {
            marginTop: 40,
            background: "#6366f1",
          })}
        >
          NEW SESSION
        </button>
      </div>
    );
  }
} 