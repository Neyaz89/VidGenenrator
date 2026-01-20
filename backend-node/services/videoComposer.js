import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import sharp from 'sharp';

const unlinkAsync = promisify(fs.unlink);

export async function composeVideo(jobId, audioPath, imagePaths, script) {
  return new Promise(async (resolve, reject) => {
    const outputPath = path.join('output', `${jobId}.mp4`);
    
    try {
      // Create enhanced images with gradients and effects
      const enhancedImages = await Promise.all(
        imagePaths.map((imgPath, idx) => enhanceImage(imgPath, idx, jobId))
      );
      
      // Calculate duration per image based on audio
      const audioDuration = await getAudioDuration(audioPath);
      const durationPerImage = audioDuration / enhancedImages.length;
      
      // Create video from images with zoom/pan effects
      const videoWithoutText = path.join('temp', `${jobId}_base.mp4`);
      
      await createBaseVideo(enhancedImages, durationPerImage, videoWithoutText);
      
      // Add animated text overlays
      await addAnimatedText(videoWithoutText, audioPath, script, outputPath);
      
      // Cleanup
      await cleanup([audioPath, videoWithoutText, ...imagePaths, ...enhancedImages]);
      
      resolve(outputPath);
      
    } catch (error) {
      console.error('Video composition error:', error);
      reject(error);
    }
  });
}

async function enhanceImage(imgPath, idx, jobId) {
  const enhancedPath = path.join('temp', `${jobId}_enhanced_${idx}.jpg`);
  
  // Add gradient overlay and enhance colors
  await sharp(imgPath)
    .resize(1080, 1920, { fit: 'cover' })
    .modulate({
      brightness: 1.1,
      saturation: 1.3
    })
    .sharpen()
    .jpeg({ quality: 95 })
    .toFile(enhancedPath);
  
  return enhancedPath;
}

function getAudioDuration(audioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration);
    });
  });
}

function createBaseVideo(imagePaths, duration, outputPath) {
  return new Promise((resolve, reject) => {
    // Create complex filter for zoom and pan effects
    const filters = imagePaths.map((img, idx) => {
      const zoomEffect = idx % 2 === 0 ? 'zoompan=z=\'min(zoom+0.0015,1.5)\':d=' : 'zoompan=z=\'1.5-0.0015*on\':d=';
      return `[${idx}:v]${zoomEffect}${Math.floor(duration * 30)}:s=1080x1920[v${idx}]`;
    }).join(';');
    
    const concat = imagePaths.map((_, idx) => `[v${idx}]`).join('') + `concat=n=${imagePaths.length}:v=1:a=0[outv]`;
    
    const command = ffmpeg();
    
    imagePaths.forEach(img => command.input(img));
    
    command
      .complexFilter([filters, concat])
      .outputOptions([
        '-map [outv]',
        '-c:v libx264',
        '-pix_fmt yuv420p',
        '-r 30',
        '-preset fast'
      ])
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });
}

function addAnimatedText(videoPath, audioPath, script, outputPath) {
  return new Promise((resolve, reject) => {
    const words = script.full_text.split(' ');
    const totalDuration = words.length * 0.4; // Approximate timing
    
    // Create drawtext filter for animated captions
    let textFilters = [];
    let currentTime = 0;
    
    words.forEach((word, idx) => {
      const startTime = currentTime;
      const endTime = currentTime + 0.4;
      
      // Animated text that pops in
      const textFilter = `drawtext=text='${word.replace(/'/g, "\\'")}':` +
        `fontfile=/Windows/Fonts/impact.ttf:fontsize=70:fontcolor=white:` +
        `borderw=4:bordercolor=black:` +
        `x=(w-text_w)/2:y=h-200:` +
        `enable='between(t,${startTime},${endTime})':` +
        `alpha='if(lt(t,${startTime}+0.1),(t-${startTime})*10,if(gt(t,${endTime}-0.1),1-(t-${endTime}+0.1)*10,1))'`;
      
      textFilters.push(textFilter);
      currentTime += 0.35; // Slight overlap
    });
    
    // Combine all text filters
    const combinedFilter = textFilters.join(',');
    
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions([
        '-c:v libx264',
        '-c:a aac',
        '-pix_fmt yuv420p',
        '-shortest',
        '-r 30',
        '-preset fast'
      ])
      .videoFilters(combinedFilter)
      .output(outputPath)
      .on('end', () => {
        console.log('Text overlay complete');
        resolve();
      })
      .on('error', (err) => {
        console.error('Text overlay error:', err);
        // Fallback: create video without text
        ffmpeg()
          .input(videoPath)
          .input(audioPath)
          .outputOptions(['-c:v libx264', '-c:a aac', '-shortest'])
          .output(outputPath)
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .run();
      })
      .run();
  });
}

async function cleanup(files) {
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        await unlinkAsync(file);
      }
    } catch (err) {
      console.error(`Cleanup error for ${file}:`, err);
    }
  }
}
