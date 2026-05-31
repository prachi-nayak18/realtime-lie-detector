import whisper
import numpy as np
import torch

class VoiceAnalyzer:
    def init(self):
        print("Loading Whisper model...")
        self.model = whisper.load_model("base")
        print("Whisper loaded!")

    def analyze_chunk(self, audio_data: np.ndarray, sr: int = 16000) -> dict:
        result = {
            "voice_tremor": 0.0,
            "pause_ratio": 0.0,
            "transcript": "",
            "speech_rate": 0.0,
        }

        try:
            if len(audio_data) == 0:
                return result

            # Tremor — frequency variation
            fft = np.fft.fft(audio_data)
            freqs = np.fft.fftfreq(len(fft), 1 / sr)
            magnitude = np.abs(fft)

            low = np.sum(magnitude[(freqs > 0) & (freqs < 100)])
            high = np.sum(magnitude[(freqs >= 100) & (freqs < 300)])
            total = low + high

            if total > 0:
                result["voice_tremor"] = float(low / total)

            # Pause detection
            energy = audio_data ** 2
            threshold = np.mean(energy) * 0.1
            silent = energy < threshold
            result["pause_ratio"] = float(np.sum(silent) / len(silent))

            # Transcription
            audio_float = audio_data.astype(np.float32)
            transcription = self.model.transcribe(
                audio_float, fp16=False
            )
            result["transcript"] = transcription.get("text", "")

        except Exception as e:
            print(f"VoiceAnalyzer error: {e}")

        return result

voice_analyzer = VoiceAnalyzer()