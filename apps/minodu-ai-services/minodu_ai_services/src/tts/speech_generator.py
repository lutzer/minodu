from enum import Enum
import wave
from piper import PiperVoice
import os
import io
import struct
from pydub import AudioSegment

from ..vars import LanguageEnum

class SpeechGenerator:

    class AudioFormat(Enum):
        WAV = 1
        MP3 = 2

    def __init__(self, language : LanguageEnum):

        script_dir = os.path.dirname(os.path.abspath(__file__))

        match language:
            case LanguageEnum.en:
                model_path = "../../models/tts_models/en_GB-cori-medium.onnx"
            case LanguageEnum.fr:
                model_path = "../../models/tts_models/fr_FR-upmc-medium.onnx"
            case _:
                raise Exception("No Model for language:" + str(language))

        model_path = os.path.join(script_dir, model_path)
        self.voice = PiperVoice.load(model_path)

        print(self.voice)

    def samplerate(self) -> int:
        return self.voice.config.sample_rate
    
    def channels(self) -> int:
        return 1
        
    def synthesize(self, text: str, format : AudioFormat = AudioFormat.WAV):
        if format == SpeechGenerator.AudioFormat.WAV:
            for chunk in self.voice.synthesize(text):
                yield chunk.audio_int16_bytes
        elif format == SpeechGenerator.AudioFormat.MP3:
            mp3_buffer = io.BytesIO()
            for chunk in self.voice.synthesize(text):

                audio = AudioSegment(
                    data=chunk.audio_int16_bytes,
                    sample_width=2,
                    frame_rate=self.samplerate(),
                    channels=self.channels()
                )
                
                # Export as MP3 to bytes buffer
                mp3_buffer = io.BytesIO()
                audio.export(mp3_buffer, format="mp3", bitrate="128k")
                mp3_buffer.seek(0)
                
                # Yield MP3 bytes
                yield mp3_buffer.read()
    def generate_mp3(audio_chunks, channels, samplerate, samplewidth=2) -> io.BytesIO:
        combined_chunks = b''.join(audio_chunks)

        audio = AudioSegment(
            data=combined_chunks,
            sample_width=samplewidth,
            frame_rate=samplerate,
            channels=channels
        )

        mp3_buffer = io.BytesIO()
        audio.export(mp3_buffer, format="mp3", bitrate="128k")
        mp3_buffer.seek(0)

        return mp3_buffer

    def generate_wav(audio_chunks, channels, samplerate, samplewidth=2) -> io.BytesIO:
        """Generate WAV file as BytesIO object"""
        buffer = io.BytesIO()

        with wave.open(buffer, 'wb') as wav_file:
            wav_file.setnchannels(channels)
            wav_file.setsampwidth(samplewidth)
            wav_file.setframerate(samplerate)
            wav_file.setnframes(len(audio_chunks))

            for chunk in audio_chunks:
                wav_file.writeframes(chunk)

            wav_file.close()
        
        buffer.seek(0)  # Reset to beginning for reading
        return buffer
    
    def create_wav_header(sample_rate=44100, num_channels=2, bits_per_sample=16, data_size=0xFFFFFFFF - 36):
        """Create a WAV file header for raw audio data."""
        byte_rate = sample_rate * num_channels * bits_per_sample // 8
        block_align = num_channels * bits_per_sample // 8
        
        header = struct.pack('<4sI4s',
                            b'RIFF',
                            36 + data_size,
                            b'WAVE')
        
        header += struct.pack('<4sIHHIIHH',
                            b'fmt ',
                            16,
                            1,
                            num_channels,
                            sample_rate,
                            byte_rate,
                            block_align,
                            bits_per_sample)
        
        header += struct.pack('<4sI',
                            b'data',
                            data_size)
        
        return header