import os
import requests
from pathlib import Path
from gtts import gTTS


async def generate_audio(job_id: str, script: dict) -> Path:
    """Generate audio from script using gTTS (Google Text-to-Speech)"""
    
    text = script.get("full_text", "")
    
    try:
        # Using gTTS - free and simple
        tts = gTTS(text=text, lang='en', slow=False)
        
        audio_path = Path("temp") / f"{job_id}_audio.mp3"
        tts.save(str(audio_path))
        
        return audio_path
        
    except Exception as e:
        raise Exception(f"TTS generation failed: {str(e)}")
