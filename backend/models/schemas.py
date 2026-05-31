from pydantic import BaseModel
from typing import Optional

class AnalysisResult(BaseModel):
    deception_score: float
    verdict: str
    confidence: float
    stress: float
    eye_contact: float
    blink_rate: float
    pause_ratio: float
    voice_tremor: float
    face_symmetry: float
    emotion: Optional[str] = "Neutral"
    transcript: Optional[str] = ""

class SessionStart(BaseModel):
    session_id: str

class SessionStop(BaseModel):
    session_id: str
    duration: int