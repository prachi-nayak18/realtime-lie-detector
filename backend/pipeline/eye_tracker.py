import cv2
import numpy as np

class EyeTracker:
    def __init__(self):
        self.eye_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_eye.xml"
        )
        self.prev_blink = False
        self.blink_count = 0
        self.frame_count = 0

    def analyze(self, frame: np.ndarray) -> dict:
        result = {
            "eye_contact": 0.8,
            "blink_rate": 0.3,
            "gaze_deviation": 0.0,
        }

        try:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            eyes = self.eye_cascade.detectMultiScale(
                gray, scaleFactor=1.1,
                minNeighbors=5, minSize=(20, 20)
            )

            self.frame_count += 1

            if len(eyes) == 0:
                result["eye_contact"] = 0.2
                result["gaze_deviation"] = 0.8
                if not self.prev_blink:
                    self.blink_count += 1
                    self.prev_blink = True
            else:
                self.prev_blink = False
                result["eye_contact"] = min(len(eyes) / 2, 1.0)

                h, w = frame.shape[:2]
                cx = w / 2
                deviations = []
                for (ex, ey, ew, eh) in eyes:
                    eye_cx = ex + ew / 2
                    deviations.append(abs(eye_cx - cx) / cx)
                result["gaze_deviation"] = float(np.mean(deviations))

            if self.frame_count > 0:
                result["blink_rate"] = min(
                    self.blink_count / self.frame_count * 10, 1.0
                )

        except Exception as e:
            print(f"EyeTracker error: {e}")

        return result

eye_tracker = EyeTracker()