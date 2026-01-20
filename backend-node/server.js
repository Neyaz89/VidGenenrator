import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateScript } from './services/scriptGenerator.js';
import { generateProfessionalAudio } from './services/professionalTTS.js';
import { generateFullAnimatedCartoon } from './services/animatedCartoonGenerator.js';
import { composeCartoonVideo } from './services/advancedVideoComposer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

// Create directories
const dirs = ['output', 'temp'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// In-memory job storage
const jobs = {};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Faceless Reel Generator API', status: 'running' });
});

app.post('/api/generate', async (req, res) => {
  const { prompt, duration = 30 } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  const jobId = uuidv4();
  
  jobs[jobId] = {
    status: 'queued',
    progress: 0,
    message: 'Job queued',
    video_url: null
  };
  
  // Start processing in background
  processReel(jobId, prompt, duration);
  
  res.json({
    job_id: jobId,
    ...jobs[jobId]
  });
});

app.get('/api/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  
  if (!jobs[jobId]) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  res.json({
    job_id: jobId,
    ...jobs[jobId]
  });
});

app.get('/api/download/:jobId', (req, res) => {
  const { jobId } = req.params;
  
  if (!jobs[jobId]) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  if (jobs[jobId].status !== 'completed') {
    return res.status(400).json({ error: 'Video not ready' });
  }
  
  const videoPath = path.join(__dirname, 'output', `${jobId}.mp4`);
  
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Video file not found' });
  }
  
  res.download(videoPath, `reel_${jobId}.mp4`);
});

// Background processing
async function processReel(jobId, prompt, duration) {
  try {
    // Generate script
    jobs[jobId] = {
      ...jobs[jobId],
      status: 'processing',
      progress: 10,
      message: 'Creating script...'
    };
    console.log(`Job ${jobId}: Generating script`);
    
    const script = await generateScript(prompt, duration);
    
    // Generate professional voiceover
    jobs[jobId].progress = 25;
    jobs[jobId].message = 'Generating professional voiceover...';
    console.log(`Job ${jobId}: Generating professional TTS`);
    
    const audioPath = await generateProfessionalAudio(jobId, script, 'hinglish');
    
    // Generate animated cartoon frames
    jobs[jobId].progress = 40;
    jobs[jobId].message = 'Creating animated cartoon frames...';
    console.log(`Job ${jobId}: Generating animated cartoon`);
    
    const cartoonFrames = await generateFullAnimatedCartoon(jobId, script);
    
    // Compose advanced animated video
    jobs[jobId].progress = 70;
    jobs[jobId].message = 'Adding animations and captions...';
    console.log(`Job ${jobId}: Composing advanced video`);
    
    await composeCartoonVideo(jobId, audioPath, cartoonFrames, script, duration);
    
    // Complete
    jobs[jobId] = {
      ...jobs[jobId],
      status: 'completed',
      progress: 100,
      message: 'Video ready!',
      video_url: `/api/download/${jobId}`
    };
    console.log(`Job ${jobId}: Completed`);
    
  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    jobs[jobId] = {
      ...jobs[jobId],
      status: 'failed',
      progress: 0,
      message: `Error: ${error.message}`
    };
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
