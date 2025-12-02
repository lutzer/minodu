from dataclasses import dataclass
import os
import json
from typing import Generator
import wave
import vosk
import json
from pydub import AudioSegment
import tempfile
import io
from functools import reduce

from ..vars import LanguageEnum

@dataclass
class SttResult():
    text: str
    confidence: float

class SttTranscriber:


    def __init__(self, language=LanguageEnum):
        script_dir = os.path.dirname(os.path.abspath(__file__))

        match language:
            case LanguageEnum.en:
                model_path = "../../models/stt_models/vosk-model-small-en-us-0.15"
            case LanguageEnum.fr:
                model_path = "../../models/stt_models/vosk-model-small-fr-0.22"
            case _:
                raise Exception("No Model for language:" + str(language))
            
        model_path = os.path.join(script_dir, model_path)
        if not os.path.exists(model_path):
            print(f"Model '{model_path}' was not found. Please check the path.")
            exit(1)

        vosk.SetLogLevel(-1)

        self.model = vosk.Model(model_path)


    def transcribe_stream(self, stream : Generator[bytes, None, None], sample_rate : int = 16000) -> Generator[str, None, None]:
        recognizer = vosk.KaldiRecognizer(self.model, sample_rate)  # 16000 Hz sample rate

        for chunk in stream:
            if not chunk:
                continue

            if recognizer.AcceptWaveform(chunk):
                # Final result for this utterance
                result = json.loads(recognizer.Result())
                yield result.get('text', '')

        result = json.loads(recognizer.FinalResult())
        yield result.get('text', '')

    def transcribe_raw(self, wav_buffer: io.BytesIO) -> SttResult:
        """method to process raw wav data with Vosk"""
        wav_buffer.seek(0)

        with wave.open(wav_buffer, "rb") as wf:
            framerate = wf.getframerate()
        
            recognizer = vosk.KaldiRecognizer(self.model, framerate)
            recognizer.SetWords(True)
            recognizer.SetPartialWords(True)
        
            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    break
                recognizer.AcceptWaveform(data)
            
            result = json.loads(recognizer.FinalResult())
            if not "result" in result:
                return SttResult(
                    text = result["text"],
                    confidence = 0
                ) 
            else:
                confidenceLen = len(result["result"])
                confidenceSum = reduce(lambda acc, curr: acc + curr["conf"], result["result"], 0.0)
                return SttResult(
                    text = result["text"],
                    confidence = confidenceSum / confidenceLen if (confidenceLen > 0 ) else 0
                )
    
    def transcribe_file_buffer(self, file_buffer, filename) -> SttResult:
        if filename.lower().endswith(".mp3"):
            audio = AudioSegment.from_mp3(file_buffer)
            audio = audio.set_channels(1).set_sample_width(2)

            wav_io = io.BytesIO()
            audio.export(wav_io, format="wav")
            return self.transcribe_raw(wav_io)

        elif filename.lower().endswith(".wav"):
            audio = AudioSegment.from_wav(file_buffer)

            if audio.channels != 1:
                audio = audio.set_channels(1).set_sample_width(2)
                wav_io = io.BytesIO()
                audio.export(wav_io, format="wav")
                return self.transcribe_raw(wav_io)
            else:
                # Already mono
                return self.transcribe_raw(file_buffer)
        elif filename.lower().endswith(".webm"):
            audio = AudioSegment.from_file(file_buffer, format="webm")
            audio = audio.set_channels(1).set_sample_width(2)

            wav_io = io.BytesIO()
            audio.export(wav_io, format="wav")
            return self.transcribe_raw(wav_io)
        else:
            raise Exception("Audio file must be WAV or MP3 format.")

    def transcribe_file(self, file) -> SttResult:
        buffer = io.BytesIO(file.read())
        filename = file.name
        return self.transcribe_file_buffer(buffer, filename)