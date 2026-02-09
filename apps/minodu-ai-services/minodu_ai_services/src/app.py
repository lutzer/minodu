import asyncio
from dataclasses import asdict
from enum import Enum
import json
from typing import Any, Optional
from fastapi import FastAPI, UploadFile, HTTPException, Request
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from fastapi import Form, Query
import tempfile
import logging

import os
import tempfile
import io

from .rag.rag import RAG
from .rag.document_store import DocumentStore, DocumentStoreException

from .weather.llm import WeatherLLM

from .stt.stt_transcriber import SttTranscriber
from .tts.speech_generator import SpeechGenerator

from .vars import LanguageEnum

api_prefix = os.getenv('API_PREFIX', "/api/services")

logger = logging.getLogger(__name__)

# Initialize FastAPI app with root_path prefix
app = FastAPI(root_path=api_prefix)


@app.get("/")
async def root():
    return {"message": "Minodu Service API"}

### RAG API ###


class RagRequest(BaseModel):
    conversation: str
    language: LanguageEnum
    question: str


@app.post("/rag/ask")
async def rag_ask(request: RagRequest):
    rag = RAG(language=request.language)

    def generate_stream():
        data = RAG.RagRequestData(request.question, request.conversation)
        try:
            for chunk in rag.ask_streaming(data):
                yield chunk
        except Exception as e:
            logging.error(f"Error in RAG streaming: {e}", exc_info=True)
            yield f"\n\n[ERROR: {str(e)}]"

    return StreamingResponse(
        generate_stream(),
        media_type="text/plain; charset=utf-8",
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Transfer-Encoding': 'chunked'
        }
    )


class RagSourceRequest(BaseModel):
    query: str
    language: LanguageEnum


class RagSourceResponse(BaseModel):
    document: Optional[Any]
    score: float


@app.post("/rag/sources", response_model=RagSourceResponse)
async def extract_sources(request: RagSourceRequest):
    rag = RAG(language=request.language)

    document, score = rag.find_sources_for_text(request.query)

    return RagSourceResponse(
        document=document,
        score=score
    )

class WelcomeResponse(BaseModel):
    text: str


@app.get("/rag/welcome/{language}/", response_model=WelcomeResponse)
async def get_welcome_message(language: LanguageEnum):
    welcome = "Welcome to the Minodu Chatbot. You can ask any questions about x,y,z"
    return WelcomeResponse(text=welcome)


@app.get("/rag/welcome/{language}/{source_id}/", response_model=WelcomeResponse)
async def get_welcome_message_with_source(source_id: int, language: LanguageEnum):
    welcome = "Welcome to the Minodu Chatbot. You can ask any questions about source: " + str(source_id)
    return WelcomeResponse(text=welcome)

class DocumentSummaryResponse(BaseModel):
    source_id: int
    summary: Optional[str] = None

@app.get("/rag/documents/{language}/{source_id}/summary", response_model=DocumentSummaryResponse)
async def get_document_summary(source_id: int, language: LanguageEnum):
    rag = RAG(language=language)
    store = DocumentStore(rag.vectorstore, rag.chroma_client)
    summary = store.get_document_summary(source_id)
    return DocumentSummaryResponse(source_id=source_id, summary=summary)

### WEATHER LLM ###


class WeatherRequest(BaseModel):
    language: LanguageEnum
    sensor_data: WeatherLLM.SensorData


@app.post("/weather/text")
async def weather_text(request: WeatherRequest):
    weather_llm = WeatherLLM(language=request.language)

    def generate_stream():
        sensorData = WeatherLLM.SensorData(**request.dict()['sensor_data'])
        try:
            for chunk in weather_llm.ask_streaming(sensorData):
                yield chunk
        except Exception as e:
            logging.error(f"Error in RAG streaming: {e}", exc_info=True)
            yield f"\n\n[ERROR: {str(e)}]"

    return StreamingResponse(
        generate_stream(),
        media_type="text/plain; charset=utf-8",
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Transfer-Encoding': 'chunked'
        }
    )

### SPEECH TO TEXT API ###


class SttResponse(BaseModel):
    text: str
    confidence: float


@app.post("/stt/transcribe", response_model=SttResponse)
async def stt_transcribe(file: UploadFile, language: str = Form(...)):
    transcriber = SttTranscriber(language=language)

    content = await file.read()

    data = io.BytesIO(content)

    result = transcriber.transcribe_file_buffer(data, file.filename)

    return SttResponse(
        text=result.text,
        confidence=result.confidence
    )


### TEXT TO SPEECH API ###

class TtsRequest(BaseModel):
    language: LanguageEnum
    text: str
    return_header: bool = True
    format: str = "wav"


@app.post("/tts/synthesize")
async def synthesize_speech(request: TtsRequest):
    try:
        generator = SpeechGenerator(request.language)

        if request.format == "wav":
            def generate_audio():
                try:
                    if request.return_header:
                        header = SpeechGenerator.create_wav_header(generator.samplerate(), generator.channels())
                        yield header

                    for audio_chunk in generator.synthesize(request.text):
                        yield audio_chunk
                except Exception as e:
                    logging.error(f"Error in tts streaming: {e}", exc_info=True)
                    yield f"\n\n[ERROR: {str(e)}]"

            return StreamingResponse(
                generate_audio(),
                media_type="audio/wav",
                headers={
                    "Content-Disposition": "attachment; filename=speech.wav",
                    "X-Sample-Rate": str(generator.samplerate()),
                    "X-Channels": str(generator.channels()),
                    'Cache-Control': 'no-cache',
                    'X-Accel-Buffering': 'no',
                    'Transfer-Encoding': 'chunked'
                }
            )
        elif request.format == "mp3":
            def generate_audio():
                for audio_chunk in generator.synthesize(request.text, SpeechGenerator.AudioFormat.MP3):
                    yield audio_chunk

            return StreamingResponse(
                generate_audio(),
                media_type="audio/mpeg",
                headers={
                    "Content-Disposition": "attachment; filename=speech.mp3",
                    'Cache-Control': 'no-cache',
                    'X-Accel-Buffering': 'no',
                    'Transfer-Encoding': 'chunked'
                }
            )
        else:
            raise Exception("Unsupported format, only supports: wav and mp3")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech synthesis failed: {str(e)}")
