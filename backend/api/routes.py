from fastapi import APIRouter
from models.schemas import AnalysisResult

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok", "service": "Veritascan"}

@router.get("/session/start")
def start_session():
    return {"message": "Session started", "status": "ok"}

@router.get("/session/stop")
def stop_session():
    return {"message": "Session stopped", "status": "ok"}