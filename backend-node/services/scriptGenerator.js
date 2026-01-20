import Groq from 'groq-sdk';

export async function generateScript(prompt, duration) {
  // Initialize Groq client here, not at module level
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
  
  const wordsPerSecond = 2.5;
  const targetWords = Math.floor(duration * wordsPerSecond);
  
  const systemPrompt = `You are a viral Indian social media content creator specializing in faceless reels.
Create an engaging script for a ${duration}-second video reel in HINGLISH (Hindi + English mix).

Requirements:
- Write in Hinglish (mix of Hindi and English) - Example: "Yaar ye trick bahut amazing hai"
- Approximately ${targetWords} words
- Powerful hook in first 3 seconds
- Emotional and relatable content
- Use popular Hinglish phrases
- Call to action at end
- Break into 3-5 scenes with visual descriptions
- Each scene should have word-by-word timing for captions

Return JSON format:
{
    "hook": "Opening line in Hinglish",
    "scenes": [
        {
            "narration": "text in Hinglish", 
            "visual": "description", 
            "duration": seconds,
            "words": ["word1", "word2", "word3"]
        }
    ],
    "full_text": "complete narration in Hinglish"
}`;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create a reel about: ${prompt}` }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });
    
    const scriptData = JSON.parse(response.choices[0].message.content);
    return scriptData;
    
  } catch (error) {
    console.error('Script generation error:', error);
    // Fallback simple script in Hinglish
    return {
      hook: `Dekho yaar, ${prompt} ke baare mein kuch amazing bataata hoon`,
      scenes: [
        {
          narration: `Toh dekho, ${prompt} actually bahut interesting hai. Ye suno carefully.`,
          visual: `Dynamic colorful visuals about ${prompt}`,
          duration: duration / 2,
          words: ['Toh', 'dekho', prompt, 'actually', 'bahut', 'interesting', 'hai', 'Ye', 'suno', 'carefully']
        },
        {
          narration: "Yaar ye game changer hai! Must try karo aur share karo!",
          visual: "Inspiring energetic conclusion scene",
          duration: duration / 2,
          words: ['Yaar', 'ye', 'game', 'changer', 'hai', 'Must', 'try', 'karo', 'aur', 'share', 'karo']
        }
      ],
      full_text: `Dekho yaar, ${prompt} ke baare mein kuch amazing bataata hoon. Toh dekho, ${prompt} actually bahut interesting hai. Ye suno carefully. Yaar ye game changer hai! Must try karo aur share karo!`
    };
  }
}
