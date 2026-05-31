import asyncio
import cv2
import numpy as np
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from core.websocket_manager import manager
from pipeline.face_analyzer import face_analyzer
from pipeline.eye_tracker import eye_tracker
from pipeline.voice_analyzer import voice_analyzer
from pipeline.scoring_engine import scoring_engine

ws_router = APIRouter()

@ws_router.websocket("/ws/analyze")
async def analyze(ws: WebSocket):
    await manager.connect(ws)
    cap = cv2.VideoCapture(0)

    try:
        while True:
            ret, frame = cap.read()

            if not ret:
                # No camera — send simulated data
                await manager.send(ws, get_simulated())
                await asyncio.sleep(0.8)
                continue

            # Face analysis
            face_data = face_analyzer.analyze(frame)

            # Eye tracking
            eye_data = eye_tracker.analyze(frame)

            # Merge data
            merged = {
                "confidence":    face_data.get("confidence", 0.5),
                "stress":        1 - face_data.get("confidence", 0.5),
                "eye_contact":   eye_data.get("eye_contact", 0.7),
                "blink_rate":    eye_data.get("blink_rate", 0.3),
                "pause_ratio":   0.2,
                "micro_expr":    0.1,
                "voice_tremor":  0.15,
                "face_symmetry": face_data.get("face_symmetry", 0.8),
            }

            # Scoring
            result = scoring_engine.compute(merged)
            result["emotion"] = face_data.get("emotion", "Neutral")

            await manager.send(ws, result)
            await asyncio.sleep(0.8)

    except WebSocketDisconnect:
        manager.disconnect(ws)
        cap.release()

    except Exception as e:
        print(f"WS error: {e}")
        manager.disconnect(ws)
        cap.release()


def get_simulated() -> dict:
    import random
    confidence = random.uniform(0.3, 0.9)
    stress = random.uniform(0.1, 0.8)
    return {
        "confidence":    round(confidence, 3),
        "stress":        round(stress, 3),
        "eye_contact":   round(random.uniform(0.3, 1.0), 3),
        "blink_rate":    round(random.uniform(0.1, 0.7), 3),
        "pause_ratio":   round(random.uniform(0.1, 0.6), 3),
        "micro_expr":    round(random.uniform(0.0, 0.5), 3),
        "voice_tremor":  round(random.uniform(0.1, 0.8), 3),
        "face_symmetry": round(random.uniform(0.6, 1.0), 3),
        "deception_score": round(random.uniform(0.1, 0.9), 3),
        "verdict": random.choice(["TRUTHFUL", "UNCERTAIN", "DECEPTIVE"]),
        "emotion": random.choice([
            "Neutral", "Stressed", "Confident",
            "Deceptive", "Anxious", "Focused"
        ]),
    }