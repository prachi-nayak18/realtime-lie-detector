# 🧠 Realtime Lie Detector
> Black Mirror-level AI system that detects deception in real-time during interviews 💀



![Demo](https://img.shields.io/badge/Status-Live-green)




![Python](https://img.shields.io/badge/Python-3.11-blue)




![React](https://img.shields.io/badge/React-18-cyan)



## 🎯 What it does
Jab koi interview de raha hota hai — uska chehra, aankhein aur awaaz 
real-time me analyze hoti hai aur AI detect karta hai ki woh 
sach bol raha hai ya jhooth.

## ⚡ Features
- 🎥 Real-time facial emotion detection
- 👁️ Eye contact & blink rate tracking  
- 🎤 Voice tremor & speech pause analysis
- 🧠 ML-powered deception scoring (0-100%)
- 📊 Live dashboard with sparkline charts
- 🔴 Real-time event log with warnings

## 🛠️ Tech Stack
| Frontend | Backend | AI/ML |
|----------|---------|-------|
| React 18 | FastAPI | OpenCV |
| Vite | Python 3.11 | DeepFace |
| WebSockets | Uvicorn | Whisper ASR |

## 📊 How it works
Webcam → OpenCV → DeepFace → Emotion Detection
Voice  → Whisper → Tremor + Pause Analysis
Data   → Scoring Engine → Deception % → Dashboard
## 🚀 Run Locally

### Backend
`bash
conda activate liedetector
cd backend
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev
Open: http://localhost:5173

📁 Project Structure
realtime-lie-detector/
├── backend/
│   ├── main.py
│   ├── api/
│   ├── pipeline/
│   └── core/
└── frontend/
    └── src/
        ├── components/
        └── hooks/
        
🎯 Verdict System
Score
Verdict
0-35%
✅ Truthful
35-60%
⚠️ Uncertain
60-100%
🚨 Deceptive
👩‍💻 Built by
Prachi Nayak — @prachi-nayak18
