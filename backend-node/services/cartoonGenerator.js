import axios from 'axios';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function generateCartoonScenes(jobId, script) {
  const cartoonPaths = [];
  const scenes = script.scenes || [];
  
  for (let idx = 0; idx < scenes.length; idx++) {
    const scene = scenes[idx];
    
    // Enhanced cartoon prompt
    const cartoonPrompt = `${scene.visual}, 3D cartoon character, pixar style, animated movie quality, colorful, expressive face, professional animation, high detail, vibrant colors, studio lighting`;
    
    const encodedPrompt = encodeURIComponent(cartoonPrompt);
    
    // Try multiple AI image services for better cartoon quality
    const urls = [
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1920&model=flux&nologo=true&enhance=true`,
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1920&nologo=true&enhance=true`
    ];
    
    let success = false;
    
    for (const url of urls) {
      try {
        console.log(`Generating cartoon scene ${idx + 1}/${scenes.length}...`);
        
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          timeout: 45000
        });
        
        if (response.status === 200) {
          // Process and enhance the cartoon image
          const cartoonBuffer = await sharp(response.data)
            .resize(1080, 1920, { 
              fit: 'cover',
              position: 'center'
            })
            .modulate({
              brightness: 1.15,
              saturation: 1.4,
              hue: 0
            })
            .sharpen({ sigma: 1.5 })
            .jpeg({ quality: 98 })
            .toBuffer();
          
          const cartoonPath = path.join('temp', `${jobId}_cartoon_${idx}.jpg`);
          fs.writeFileSync(cartoonPath, cartoonBuffer);
          cartoonPaths.push(cartoonPath);
          success = true;
          break;
        }
      } catch (error) {
        console.error(`Cartoon generation attempt failed:`, error.message);
      }
    }
    
    if (!success) {
      // Fallback: create vibrant cartoon-style gradient
      cartoonPaths.push(await createCartoonFallback(jobId, idx));
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return cartoonPaths;
}

async function createCartoonFallback(jobId, idx) {
  const cartoonPath = path.join('temp', `${jobId}_cartoon_${idx}.jpg`);
  
  // Vibrant cartoon-style gradients
  const gradients = [
    { start: '#FF6B6B', end: '#4ECDC4' },
    { start: '#A8E6CF', end: '#FFD3B6' },
    { start: '#FFA07A', end: '#98D8C8' },
    { start: '#F7DC6F', end: '#BB8FCE' }
  ];
  
  const gradient = gradients[idx % gradients.length];
  
  const svg = `
    <svg width="1080" height="1920">
      <defs>
        <linearGradient id="grad${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${gradient.start};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${gradient.end};stop-opacity:1" />
        </linearGradient>
        <radialGradient id="radial${idx}">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#grad${idx})" />
      <circle cx="540" cy="960" r="400" fill="url(#radial${idx})" />
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 95 })
    .toFile(cartoonPath);
  
  return cartoonPath;
}
