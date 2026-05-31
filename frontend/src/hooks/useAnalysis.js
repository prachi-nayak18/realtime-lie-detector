import { useState, useCallback } from "react";

const rand = (lo, hi) => Math.random() * (hi - lo) + lo;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const EMOTIONS = [
  "Neutral", "Stressed", "Confident",
  "Deceptive", "Anxious", "Focused"
];

function pickEmotion(m) {
  if (m.stress > 0.7 && m.voiceTremor > 0.5) return "Deceptive";
  if (m.stress > 0.6) return "Stressed";
  if (m.confidence > 0.75 && m.eyeContact > 0.7) return "Confident";
  if (m.pauseRatio > 0.5) return "Anxious";
  if (m.eyeContact > 0.8) return "Focused";
  return "Neutral";
}

function computeScore(m) {
  return clamp(
    m.stress * 0.25 +
    (1 - m.confidence) * 0.20 +
    (1 - m.eyeContact) * 0.15 +
    m.pauseRatio * 0.15 +
    m.microExpr * 0.10 +
    m.voiceTremor * 0.10 +
    m.blinkRate * 0.05,
    0, 1
  );
}

const INIT = {
  confidence: 0.7,
  stress: 0.2,
  eyeContact: 0.8,
  blinkRate: 0.3,
  pauseRatio: 0.2,
  microExpr: 0.1,
  voiceTremor: 0.15,
  faceSymmetry: 0.9,
};

export default function useAnalysis() {
  const [metrics, setMetrics] = useState(INIT);
  const [score, setScore] = useState(0);
  const [emotion, setEmotion] = useState("Neutral");
  const [history, setHistory] = useState({
    score: [],
    stress: [],
    confidence: [],
  });
  const [events, setEvents] = useState([]);

  const addEvent = (text, type = "info") => {
    setEvents((prev) => [
      { text, type, t: Date.now() },
      ...prev.slice(0, 19),
    ]);
  };

  const tick = useCallback(() => {
    setMetrics((prev) => {
      const drift = (v, lo, hi) =>
        clamp(v + rand(-0.15, 0.15) * (hi - lo), lo, hi);

      const next = {
        confidence:   drift(prev.confidence,   0.1, 1.0),
        stress:       drift(prev.stress,        0.0, 1.0),
        eyeContact:   drift(prev.eyeContact,    0.2, 1.0),
        blinkRate:    drift(prev.blinkRate,     0.0, 1.0),
        pauseRatio:   drift(prev.pauseRatio,    0.0, 0.8),
        microExpr:    drift(prev.microExpr,     0.0, 1.0),
        voiceTremor:  drift(prev.voiceTremor,   0.0, 0.9),
        faceSymmetry: drift(prev.faceSymmetry,  0.5, 1.0),
      };

      const s = computeScore(next);
      const em = pickEmotion(next);

      setScore(s);
      setEmotion(em);

      setHistory((h) => ({
        score:      [...h.score.slice(-40), s],
        stress:     [...h.stress.slice(-40), next.stress],
        confidence: [...h.confidence.slice(-40), next.confidence],
      }));

      if (em === "Deceptive" && Math.random() < 0.2) {
        addEvent("⚠ Deceptive micro-expression detected", "warn");
      }
      if (next.voiceTremor > 0.7 && Math.random() < 0.15) {
        addEvent("⚠ Voice tremor spike detected", "warn");
      }
      if (next.eyeContact < 0.35 && Math.random() < 0.15) {
        addEvent("👁 Low eye contact — gaze deviation", "warn");
      }

      return next;
    });
  }, []);

  const updateMetrics = useCallback((data) => {
    setMetrics(data);
    const s = computeScore(data);
    const em = pickEmotion(data);
    setScore(s);
    setEmotion(em);
  }, []);

  const startSimulation = useCallback(() => {
    addEvent("Session started — face tracking active", "success");
    addEvent("Whisper ASR pipeline initialized", "info");
    addEvent("Emotion detection model loaded", "info");
    const id = setInterval(tick, 800);
    return id;
  }, [tick]);

  const reset = useCallback(() => {
    setMetrics(INIT);
    setScore(0);
    setEmotion("Neutral");
    setHistory({ score: [], stress: [], confidence: [] });
    setEvents([]);
  }, []);

  return {
    metrics,
    score,
    emotion,
    history,
    events,
    updateMetrics,
    startSimulation,
    reset,
  };
}