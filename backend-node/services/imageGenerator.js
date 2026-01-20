import axios from 'axios';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function generateImages(jobId, script, duration) {
  const imagePaths = [];
  const scenes = script.scenes || [{ visual: script.hook || 'inspiring scene' }];
  
  for (let idx = 0; idx < scenes.length; idx++) {
    const scene = scenes[idx];
    const visualPrompt = scene.visual || 'inspiring background';
    
    // Enhanced prompt for better graphics
    const enhancedPrompt = `${visualPrompt}, vibrant colors, cinematic lighting, high quality, dramatic, 4k, professional photography`;
    const prompt = encodeURIComponent(enhancedPrompt);
    
    // Pollinations.ai with enhanced parameters
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=1080&height=1920&nologo=true&enhance=true`;
    
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000
      });
      
      if (response.status === 200) {
        // Resize and enhance to 1080x1920 (9:16 aspect ratio)
        const imageBuffer = await sharp(response.data)
          .resize(1080, 1920, { fit: 'cover' })
          .modulate({
            brightness: 1.1,
            saturation: 1.2
          })
          .sharpen()
          .jpeg({ quality: 95 })
          .toBuffer();
        
        const imagePath = path.join('temp', `${jobId}_img_${idx}.jpg`);
        fs.writeFileSync(imagePath, imageBuffer);
        imagePaths.push(imagePath);
      } else {
        imagePaths.push(await createFallbackImage(jobId, idx));
      }
      
    } catch (error) {
      console.error(`Image generation failed for scene ${idx}:`, error.message);
      imagePaths.push(await createFallbackImage(jobId, idx));
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return imagePaths;
}

async function createFallbackImage(jobId, idx) {
  const imagePath = path.join('temp', `${jobId}_img_${idx}.jpg`);
  
  // Create vibrant gradient background
  const colors = [
    { r: 138, g: 43, b: 226 },  // Purple
    { r: 255, g: 20, b: 147 },  // Pink
    { r: 255, g: 140, b: 0 },   // Orange
    { r: 0, g: 191, b: 255 }    // Blue
  ];
  
  const color = colors[idx % colors.length];
  
  // Create gradient using SVG
  const svg = `
    <svg width="1080" height="1920">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(${color.r},${color.g},${color.b});stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(${Math.floor(color.r*0.5)},${Math.floor(color.g*0.5)},${Math.floor(color.b*0.5)});stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#grad)" />
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .jpeg()
    .toFile(imagePath);
  
  return imagePath;
}
