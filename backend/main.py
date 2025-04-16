from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from gtts import gTTS
from googletrans import Translator
import whisper
import os
from io import BytesIO
from pydantic import BaseModel
from fastapi.responses import StreamingResponse 

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranslationRequest(BaseModel):
    text: str
    target_lang: str = "en"

class SpeakRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.post("/translate/")
async def translate_text(request: TranslationRequest):
    translator = Translator()
    try:
        translation = translator.translate(request.text, dest=request.target_lang)
        return {"translated_text": translation.text}
    except Exception as e:
        return {"error": str(e)}

@app.post("/speak/")
async def speak_text(request: SpeakRequest, lang: str = 'en'):
    try:
        tts = gTTS(text=request.text, lang=lang)  
        audio_buffer = BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)  
        
        
        print(f"Generated audio for text: {request.text}")
        
        return StreamingResponse(
            audio_buffer,
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=speech.mp3"}
        )
    except Exception as e:
        logging.error(f"TTS Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))