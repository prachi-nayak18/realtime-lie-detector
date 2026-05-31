import cv2
import numpy as np
from deepface import DeepFace

class FaceAnalyzer:
    def init(self):
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )

    def analyze(self, frame: np.ndarray) -> dict:
        result = {
            "emotion": "Neutral",
            "confidence": 0.5,
            "face_detected": False,
            "face_symmetry": 0.8,
        }

        try:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(
                gray, scaleFactor=1.1,
                minNeighbors=5, minSize=(30, 30)
            )

            if len(faces) == 0:
                return result

            result["face_detected"] = True

            analysis = DeepFace.analyze(
                frame,
                actions=["emotion"],
                enforce_detection=False,
                silent=True,
            )

            if analysis:
                a = analysis[0]
                emotions = a.get("emotion", {})
                dominant = a.get("dominant_emotion", "neutral")
                result["emotion"] = dominant.capitalize()
                result["confidence"] = emotions.get(dominant, 50) / 100

        except Exception as e:
            print(f"FaceAnalyzer error: {e}")

        return result

face_analyzer = FaceAnalyzer()