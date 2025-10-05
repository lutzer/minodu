from typing import Any, Optional
from fastapi import FastAPI, UploadFile, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from fastapi import Form
import tempfile

import os
import tempfile
import io

from .rag.rag import RAG
from .rag.document_store import DocumentStore

from .weather.llm import WeatherLLM

from .stt.stt_transcriber import SttTranscriber
from .tts.speech_generator import SpeechGenerator

api_prefix = os.getenv('API_PREFIX', "/services")

# Initialize FastAPI app with root_path prefix
app = FastAPI(root_path=api_prefix)

@app.get("/")
async def root():
    return {"message": "Minodu Service API"}

### RAG API ###

class RagRequest(BaseModel):
    conversation: str
    language: str
    question: str

@app.post("/rag/ask")
async def rag_ask(request: RagRequest):
    rag = RAG(language=request.language)

    def generate_stream():
        data = RAG.RagRequestData(request.question, request.conversation)
        for chunk in rag.ask_streaming(data):
            yield chunk

    return StreamingResponse(
        generate_stream(),
        media_type="text/plain"
    )

class RagSourceRequest(BaseModel):
    query: str
    language: str

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

class RagDocumentRequest(BaseModel):
    document: Optional[Any]
    score: float

@app.post("/rag/documents/")
async def add_document(file: UploadFile, language: str = Form(...), source_id: int = Form(...)):
    rag = RAG(language=language)
    store = DocumentStore(rag.vectorstore, rag.chroma_client)

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
            store.add_file(temp_file_path, source_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not add document: {str(e)}")
    
    finally:
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
    return "Document added"

@app.delete("/rag/documents/{language}/{source_id}")
async def delete_documents(source_id: int, language: str):
    rag = RAG(language=language)

    store = DocumentStore(rag.vectorstore, rag.chroma_client)

    try:
        store.delete_document_by_id(source_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not add document: {str(e)}")

    return "Document deleted"

### WEATHER LLM ###

class WeatherRequest(BaseModel):
    temperature: float
    humidity: float
    language: str


@app.post("/weather/text")
async def weather_text(request: WeatherRequest):
    weather_llm = WeatherLLM(language=request.language)

    def generate_stream():
        sensorData = WeatherLLM.SensorData(request.temperature, request.humidity)
        for chunk in weather_llm.ask_streaming(sensorData):
            yield chunk

    return StreamingResponse(
        generate_stream(),
        media_type="text/plain"
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
    language: str
    text: str
    return_header: bool = True
    format: str = "wav"

@app.post("/tts/synthesize")
async def synthesize_speech(request: TtsRequest):
    try:
        generator = SpeechGenerator(request.language)
        
        if request.format == "wav":
            def generate_audio():
                if request.return_header:
                    header = SpeechGenerator.create_wav_header(generator.samplerate(), generator.channels())
                    yield header

                for audio_chunk in generator.synthesize(request.text):
                    yield audio_chunk
            
            return StreamingResponse(
                generate_audio(),
                media_type="audio/wav",
                headers={
                    "Content-Disposition": "attachment; filename=speech.wav",
                    "X-Sample-Rate": str(generator.samplerate()),
                    "X-Channels": str(generator.channels())
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
                    "Content-Disposition": "attachment; filename=speech.mp3"
                }
            )
        else:
            raise Exception("Unsupported format, only supports: wav and mp3")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech synthesis failed: {str(e)}")