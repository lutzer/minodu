import pytest
from fastapi.testclient import TestClient
import os
import json
import wave
import httpx

from minodu_ai_services.src.app import app
from minodu_ai_services.src.stt.stt_transcriber import SttTranscriber
from minodu_ai_services.src.vars import LanguageEnum

# Create test client
client = TestClient(app)

script_dir = os.path.dirname(os.path.abspath(__file__))


class TestSttAPI:

    def test_transcribe_mono(self):
        file_path = os.path.join(script_dir, "audio/english_sample_mono.wav")
        with open(file_path, "rb") as f:
            response = client.post(
                "/stt/transcribe",
                files={"file": (os.path.basename(file_path), f, "audio/wav")},
                data={"language": "en"}
            )
    
        assert response.status_code == 200
        data = response.json()
        assert(len(data["text"]) > 0)
    
    def test_transcribe_stereo(self):
        file_path = os.path.join(script_dir, "audio/english_sample_stereo.wav")
        with open(file_path, "rb") as f:
            response = client.post(
                "/stt/transcribe",
                files={"file": (os.path.basename(file_path), f, "audio/wav")},
                data={"language": "en"}
            )
    
        assert response.status_code == 200
        data = response.json()
        assert(len(data["text"]) > 0)

    def test_transcribe_mp3(self):
        file_path = os.path.join(script_dir, "audio/french_sample.mp3")
        with open(file_path, "rb") as f:
            response = client.post(
                "/stt/transcribe",
                files={"file": (os.path.basename(file_path), f, "audio/mpeg")},
                data={"language": "fr"}
            )
    
        assert response.status_code == 200
        data = response.json()
        assert(len(data["text"]) > 0)

    def test_transcribe_webm(self):
        file_path = os.path.join(script_dir, "audio/english_sample_webm.webm")
        with open(file_path, "rb") as f:
            response = client.post(
                "/stt/transcribe",
                files={"file": (os.path.basename(file_path), f, "audio/webm")},
                data={"language": "en"}
            )
    
        assert response.status_code == 200
        data = response.json()
        assert(len(data["text"]) > 0)

    def test_transcribe_empty(self):
        file_path = os.path.join(script_dir, "audio/empty.wav")
        with open(file_path, "rb") as f:
            response = client.post(
                "/stt/transcribe",
                files={"file": (os.path.basename(file_path), f, "audio/wav")},
                data={"language": "en"}
            )
    
        assert response.status_code == 200
        data = response.json()
        assert(len(data["text"]) == 0)

class TestStt:

    def test_transcribe_english_mono(self):
        transcriber = SttTranscriber(language="en")
        with open(os.path.join(script_dir, "audio/english_sample_mono.wav"), "rb") as file:
            result = transcriber.transcribe_file(file)
        
        assert(len(result.text) > 0)
        assert(result.confidence > 0.8)

    def test_transcribe_english_stereo(self):
        transcriber = SttTranscriber(language="en")
        with open(os.path.join(script_dir, "audio/english_sample_stereo.wav"), "rb") as file:
            result = transcriber.transcribe_file(file)
        assert(len(result.text) > 0)
        assert(result.confidence > 0.8)
    
    def test_transcribe_french_mp3(self):
        transcriber = SttTranscriber(language="fr")
        with open(os.path.join(script_dir, "audio/french_sample.mp3"), "rb") as file:
            result = transcriber.transcribe_file(file)
        assert(len(result.text) > 0)
        assert(result.confidence > 0.8)

    def test_transcribe_kabye_should_be_empty(self):
        transcriber = SttTranscriber(language="fr")
        with open(os.path.join(script_dir, "audio/kabye_sample_short.mp3"), "rb") as file:
            result = transcriber.transcribe_file(file)
        assert(len(result.text) > 0)
        assert(result.confidence < 0.8)
    
    def test_transcribe_english_webm(self):
        transcriber = SttTranscriber(language="en")
        with open(os.path.join(script_dir, "audio/english_sample_webm.webm"), "rb") as file:
            result = transcriber.transcribe_file(file)
        assert(len(result.text) > 0)
        assert(result.confidence > 0.8)

    def test_transcribe_audio_stream(self):

        def generate_chunks(path, chunk_size=1024):
            with wave.open(path, "rb") as wf:
                while True:
                    data = wf.readframes(chunk_size // wf.getsampwidth())
                    if not data:
                        break
                    yield data

        file_path = os.path.join(script_dir, "audio/english_sample_mono.wav")
        transcriber = SttTranscriber(language="en")
        results = list(transcriber.transcribe_stream(generate_chunks(file_path)))
        
        assert len(results) > 0
        assert any(map(lambda x : len(x) > 0, results))


