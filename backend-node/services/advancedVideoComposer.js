import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { getWordTimings } from './professionalTTS.js';

const unlinkAsync = promisify(fs.unlink);

export async function composeCartoonVideo(jobId, audioPath, cartoonPaths, script, duration) {
  return new Promise(async (resolve, reject) => {
    const outputPath = path.join('output', `${jobId}.mp4`);
    
    try {
      console.log('Starting advanced video composition...');
      
      // Get precise audio duration
      const audioDuration = await getAudioDuration(audioPath);
      const actualDuration = Math.min(audioDuration, duration);
      
      // Calculate exact timing per scene
      const durationPerScene = actualDuration / cartoonPaths.length;
      
      // Step 1: Create base video with cartoon scenes and animations
      const baseVideo = path.join('temp', `${jobId}_base.mp4`);
      await createAnimatedCartoonVideo(cartoonPaths, durationPerScene, baseVideo);
      
      // Step 2: Get word timings for captions
      const wordTimings = getWordTimings(script);
      
      // Step 3: Add animated captions with precise timing
      await addPreciseAnimatedCaptions(baseVideo, audioPath, wordTimings, outputPath);
      
      // Cleanup
      await cleanup([audioPath, baseVideo, ...cartoonPaths]);
      
      console.log('Video composition complete!');
      resolve(outputPath);
      
    } catch (error) {
      console.error('Advanced video composition error:', error);
      reject(error);
    }
  });
}

function getAudioDuration(audioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration);
    });
  });
}

async function createAnimatedCartoonVideo(cartoonPaths, duration, outputPath) {
  return new Promise((resolve, reject) => {
    console.log('Creating animated cartoon base video...');
    
    // Create advanced animation filters
    const filters = [];
    
    cartoonPaths.forEach((img, idx) => {
      const totalFrames = Math.floor(duration * 30);
      
      // Alternate between zoom in and zoom out
      const zoomType = idx % 2 === 0 ? 'in' : 'out';
      const zoomFilter = zoomType === 'in' 
        ? `zoompan=z='min(zoom+0.002,1.3)':d=${totalFrames}:s=1080x1920:fps=30`
        : `zoompan=z='if(lte(zoom,1.0),1.3,max(1.0,zoom-0.002))':d=${totalFrames}:s=1080x1920:fps=30`;
      
      // Add fade in/out
      const fadeFilter = `fade=t=in:st=0:d=0.5,fade=t=out:st=${duration - 0.5}:d=0.5`;
      
      filters.push(`[${idx}:v]${zoomFilter},${fadeFilter}[v${idx}]`);
    });
    
    const concat = cartoonPaths.map((_, idx) => `[v${idx}]`).join('') + 
                   `concat=n=${cartoonPaths.length}:v=1:a=0[outv]`;
    
    const command = ffmpeg();
    cartoonPaths.forEach(img => command.input(img));
    
    command
      .complexFilter([...filters, concat])
      .outputOptions([
        '-map [outv]',
        '-c:v libx264',
        '-pix_fmt yuv420p',
        '-r 30',
        '-preset medium',
        '-crf 18'
      ])
      .output(outputPath)
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Animation progress: ${Math.floor(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log('Base animation complete');
        resolve();
      })
      .on('error', (err) => {
        console.error('Animation error:', err);
        reject(err);
      })
      .run();
  });
}

async function addPreciseAnimatedCaptions(videoPath, audioPath, wordTimings, outputPath) {
  return new Promise((resolve, reject) => {
    console.log('Adding precise animated captions...');
    
    // Create drawtext filters for each word with exact timing
    const textFilters = wordTimings.map((timing, idx) => {
      const word = timing.word.replace(/'/g, "\\'").replace(/"/g, '\\"');
      const startTime = timing.start;
      const endTime = timing.end;
      const duration = endTime - startTime;
      
      // Animated text with bounce effect
      const yPosition = `h-250+20*sin(2*PI*t)`;
      const scale = `1+0.2*sin(10*PI*(t-${startTime}))`;
      
      return `drawtext=text='${word}':` +
        `fontfile=/Windows/Fonts/impact.ttf:fontsize=80:fontcolor=white:` +
        `borderw=5:bordercolor=black:` +
        `shadowcolor=black@0.5:shadowx=3:shadowy=3:` +
        `x=(w-text_w)/2:y=${yPosition}:` +
        `enable='between(t,${startTime},${endTime})':` +
        `alpha='if(lt(t,${startTime}+0.1),(t-${startTime})*10,if(gt(t,${endTime}-0.1),10*(${endTime}-t),1))'`;
    });
    
    // Combine all text filters
    const combinedFilter = textFilters.join(',');
    
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions([
        '-c:v libx264',
        '-c:a aac',
        '-b:a 192k',
        '-pix_fmt yuv420p',
        '-shortest',
        '-r 30',
        '-preset medium',
        '-crf 18'
      ])
      .videoFilters(combinedFilter)
      .output(outputPath)
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Caption progress: ${Math.floor(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log('Captions added successfully');
        resolve();
      })
      .on('error', (err) => {
        console.error('Caption error:', err);
        // Fallback: simple video without advanced captions
        console.log('Falling back to simple composition...');
        ffmpeg()
          .input(videoPath)
          .input(audioPath)
          .outputOptions([
            '-c:v libx264',
            '-c:a aac',
            '-shortest',
            '-preset fast'
          ])
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
      console.error(`Cleanup error:`, err.message);
    }
  }
}
