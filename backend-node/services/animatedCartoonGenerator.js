import axios from 'axios';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function generateAnimatedCartoonFrames(jobId, scene, sceneIndex) {
  const frames = [];
  const numFrames = 8; // Generate 8 frames per scene for smooth animation
  
  console.log(`Generating ${numFrames} animated frames for scene ${sceneIndex + 1}...`);
  
  for (let frameIdx = 0; frameIdx < numFrames; frameIdx++) {
    const animationPhase = frameIdx / numFrames;
    
    // Create varied prompts for animation effect
    const movements = [
      'character looking forward',
      'character slight smile',
      'character nodding',
      'character gesturing',
      'character excited expression',
      'character talking',
      'character pointing',
      'character happy pose'
    ];
    
    const movement = movements[frameIdx % movements.length];
    
    const cartoonPrompt = `${scene.visual}, ${movement}, 3D cartoon character, pixar style, disney quality, expressive animated character, colorful, professional animation, high detail, vibrant colors, studio lighting, animated movie frame`;
    
    const encodedPrompt = encodeURIComponent(cartoonPrompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1920&model=flux&nologo=true&enhance=true&seed=${sceneIndex * 100 + frameIdx}`;
    
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 45000
      });
      
      if (response.status === 200) {
        const frameBuffer = await sharp(response.data)
          .resize(1080, 1920, { 
            fit: 'cover',
            position: 'center'
          })
          .modulate({
            brightness: 1.15,
            saturation: 1.4
          })
          .sharpen({ sigma: 1.5 })
          .jpeg({ quality: 98 })
          .toBuffer();
        
        const framePath = path.join('temp', `${jobId}_scene${sceneIndex}_frame${frameIdx}.jpg`);
        fs.writeFileSync(framePath, frameBuffer);
        frames.push(framePath);
        
        console.log(`Frame ${frameIdx + 1}/${numFrames} generated`);
      } else {
        frames.push(await createCartoonFrame(jobId, sceneIndex, frameIdx));
      }
    } catch (error) {
      console.error(`Frame generation failed:`, error.message);
      frames.push(await createCartoonFrame(jobId, sceneIndex, frameIdx));
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  return frames;
}

async function createCartoonFrame(jobId, sceneIdx, frameIdx) {
  const framePath = path.join('temp', `${jobId}_scene${sceneIdx}_frame${frameIdx}.jpg`);
  
  const gradients = [
    { start: '#FF6B6B', end: '#4ECDC4' },
    { start: '#A8E6CF', end: '#FFD3B6' },
    { start: '#FFA07A', end: '#98D8C8' },
    { start: '#F7DC6F', end: '#BB8FCE' }
  ];
  
  const gradient = gradients[sceneIdx % gradients.length];
  const offset = (frameIdx / 8) * 100;
  
  const svg = `
    <svg width="1080" height="1920">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="${offset}%" style="stop-color:${gradient.start};stop-opacity:1" />
          <stop offset="${100 - offset}%" style="stop-color:${gradient.end};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#grad)" />
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 95 })
    .toFile(framePath);
  
  return framePath;
}

export async function generateFullAnimatedCartoon(jobId, script) {
  const allFrames = [];
  const scenes = script.scenes || [];
  
  for (let sceneIdx = 0; sceneIdx < scenes.length; sceneIdx++) {
    const scene = scenes[sceneIdx];
    const frames = await generateAnimatedCartoonFrames(jobId, scene, sceneIdx);
    allFrames.push(...frames);
  }
  
  return allFrames;
}
