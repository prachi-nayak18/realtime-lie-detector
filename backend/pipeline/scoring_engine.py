from models.schemas import AnalysisResult

class ScoringEngine:
    def compute(self, data: dict) -> dict:
        confidence = data.get("confidence", 0.5)
        stress = data.get("stress", 0.3)
        eye_contact = data.get("eye_contact", 0.7)
        blink_rate = data.get("blink_rate", 0.3)
        pause_ratio = data.get("pause_ratio", 0.2)
        micro_expr = data.get("micro_expr", 0.1)
        voice_tremor = data.get("voice_tremor", 0.15)
        face_symmetry = data.get("face_symmetry", 0.9)

        deception_score = (
            stress * 0.25 +
            (1 - confidence) * 0.20 +
            (1 - eye_contact) * 0.15 +
            pause_ratio * 0.15 +
            micro_expr * 0.10 +
            voice_tremor * 0.10 +
            blink_rate * 0.05
        )

        deception_score = max(0.0, min(1.0, deception_score))

        if deception_score < 0.35:
            verdict = "TRUTHFUL"
        elif deception_score < 0.6:
            verdict = "UNCERTAIN"
        else:
            verdict = "DECEPTIVE"

        return {
            "deception_score": round(deception_score, 3),
            "verdict": verdict,
            "confidence": round(confidence, 3),
            "stress": round(stress, 3),
            "eye_contact": round(eye_contact, 3),
            "blink_rate": round(blink_rate, 3),
            "pause_ratio": round(pause_ratio, 3),
            "voice_tremor": round(voice_tremor, 3),
            "face_symmetry": round(face_symmetry, 3),
        }

scoring_engine = ScoringEngine()