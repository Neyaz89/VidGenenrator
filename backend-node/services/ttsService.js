import gtts from 'gtts';
import fs from 'fs';
import path from 'path';

export async function generateAudio(jobId, script) {
  const text = script.full_text || '';
  
  return new Promise((resolve, reject) => {
    const audioPath = path.join('temp', `${jobId}_audio.mp3`);
    
    // Use Hindi language for better Hinglish pronunciation
    const speech = new gtts(text, 'hi');
    
    speech.save(audioPath, (err) => {
      if (err) {
        reject(new Error(`TTS generation failed: ${err.message}`));
      } else {
        resolve(audioPath);
      }
    });
  });
}
