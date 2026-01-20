from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


async def generate_script(prompt: str, duration: int) -> dict:
    """Generate video script using Groq"""
    
    words_per_second = 2.5
    target_words = int(duration * words_per_second)
    
    system_prompt = f"""You are a viral social media content creator specializing in faceless reels.
Create an engaging script for a {duration}-second video reel.

Requirements:
- Approximately {target_words} words
- Hook in first 3 seconds
- Clear narrative structure
- Emotional impact
- Call to action at end
- Break into 3-5 scenes with visual descriptions

Return JSON format:
{{
    "hook": "Opening line",
    "scenes": [
        {{"narration": "text", "visual": "description", "duration": seconds}},
        ...
    ],
    "full_text": "complete narration"
}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Create a reel about: {prompt}"}
            ],
            temperature=0.8,
            max_tokens=1000
        )
        
        import json
        script_data = json.loads(response.choices[0].message.content)
        return script_data
        
    except Exception as e:
        # Fallback simple script
        return {
            "hook": f"Here's something amazing about {prompt}",
            "scenes": [
                {
                    "narration": f"Let me tell you about {prompt}. This is incredible.",
                    "visual": f"Dynamic visuals about {prompt}",
                    "duration": duration / 2
                },
                {
                    "narration": "This changes everything. Don't miss out!",
                    "visual": "Inspiring conclusion scene",
                    "duration": duration / 2
                }
            ],
            "full_text": f"Let me tell you about {prompt}. This is incredible. This changes everything. Don't miss out!"
        }
