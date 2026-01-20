"""Quick test script to verify API keys work"""
import os
from dotenv import load_dotenv

load_dotenv()

print("Testing API Keys...\n")

# Test Groq
print("1. Testing Groq API...")
try:
    from groq import Groq
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    response = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[{"role": "user", "content": "Say 'Groq API works!'"}],
        max_tokens=20
    )
    
    print(f"✓ Groq API: {response.choices[0].message.content}")
except Exception as e:
    print(f"✗ Groq API failed: {e}")

# Test gTTS
print("\n2. Testing Text-to-Speech...")
try:
    from gtts import gTTS
    tts = gTTS(text="Testing TTS", lang='en')
    tts.save("temp/test_audio.mp3")
    print("✓ TTS works! Audio saved to temp/test_audio.mp3")
except Exception as e:
    print(f"✗ TTS failed: {e}")

# Test Image Generation
print("\n3. Testing Image Generation...")
try:
    import requests
    url = "https://image.pollinations.ai/prompt/test?width=100&height=100"
    response = requests.get(url, timeout=10)
    if response.status_code == 200:
        print("✓ Image generation API works!")
    else:
        print(f"✗ Image API returned status {response.status_code}")
except Exception as e:
    print(f"✗ Image generation failed: {e}")

print("\n✅ All tests complete!")
