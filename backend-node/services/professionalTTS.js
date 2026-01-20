import axios from 'axios';
import fs from 'fs';
import path from 'path';
import gtts from 'gtts';

export async function generateProfessionalAudio(jobId, script, language = 'hinglish') {
  const text = script.full_text || '';
  const audioPath = path.join('temp', `${jobId}_audio.mp3`);
  
  // Try ElevenLabs-style TTS (free alternatives)
  try {
    // Option 1: Try Coqui TTS API (if available)
    // Option 2: Use gTTS with better settings
    
    const ttsLanguage = language === 'hinglish' ? 'hi' : 'en';
    
    return new Promise((resolve, reject) => {
      const speech = new gtts(text, ttsLanguage, 0.9); // Slower speed for clarity
      
      speech.save(audioPath, (err) => {
        if (err) {
          reject(new Error(`TTS generation failed: ${err.message}`));
        } else {
          console.log('Professional TTS audio generated');
          resolve(audioPath);
        }
      });
    });
    
  } catch (error) {
    throw new Error(`Professional TTS failed: ${error.message}`);
  }
}

// Get word-level timestamps for precise caption timing
export function getWordTimings(script) {
  const words = script.full_text.split(' ');
  const timings = [];
  
  // Average speaking rate: 2.5 words per second
  const wordsPerSecond = 2.5;
  const secondsPerWord = 1 / wordsPerSecond;
  
  let currentTime = 0;
  
  words.forEach((word, idx) => {
    // Adjust timing based on word length
    const wordDuration = Math.max(0.3, word.length * 0.05);
    
    timings.push({
      word: word,
      start: currentTime,
      end: currentTime + wordDuration,
      index: idx
    });
    
    currentTime += wordDuration + 0.05; // Small gap between words
  });
  
  return timings;
}
