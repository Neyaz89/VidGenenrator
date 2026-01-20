from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import uuid
from pathlib import Path
from services.script_generator import generate_script
from services.tts_service import generate_audio
from services.image_generator import generate_images
from services.video_composer import compose_video
import logging

load_dotenv()

app = FastAPI(title="Faceless Reel Generator API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup directories
OUTPUT_DIR = Path("output")
TEMP_DIR = Path("temp")
OUTPUT_DIR.mkdir(exist_ok=True)
TEMP_DIR.mkdir(exist_ok=True)

# In-memory job storage (use Redis in production)
jobs = {}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ReelRequest(BaseModel):
    prompt: str
    duration: int = 30  # seconds


class JobStatus(BaseModel):
    job_id: str
    status: str
    progress: int
    message: str
    video_url: str = None


@app.get("/")
def read_root():
    return {"message": "Faceless Reel Generator API", "status": "running"}


@app.post("/api/generate", response_model=JobStatus)
async def generate_reel(request: ReelRequest, background_tasks: BackgroundTasks):
    """Start reel generation job"""
    job_id = str(uuid.uuid4())
    
    jobs[job_id] = {
        "status": "queued",
        "progress": 0,
        "message": "Job queued",
        "video_url": None
    }
    
    background_tasks.add_task(process_reel, job_id, request.prompt, request.duration)
    
    return JobStatus(job_id=job_id, **jobs[job_id])


@app.get("/api/status/{job_id}", response_model=JobStatus)
async def get_status(job_id: str):
    """Get job status"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return JobStatus(job_id=job_id, **jobs[job_id])


@app.get("/api/download/{job_id}")
async def download_video(job_id: str):
    """Download generated video"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if jobs[job_id]["status"] != "completed":
        raise HTTPException(status_code=400, detail="Video not ready")
    
    video_path = OUTPUT_DIR / f"{job_id}.mp4"
    
    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Video file not found")
    
    return FileResponse(
        video_path,
        media_type="video/mp4",
        filename=f"reel_{job_id}.mp4"
    )


async def process_reel(job_id: str, prompt: str, duration: int):
    """Background task to process reel generation"""
    try:
        # Update status: Generating script
        jobs[job_id].update({
            "status": "processing",
            "progress": 10,
            "message": "Generating script..."
        })
        logger.info(f"Job {job_id}: Generating script")
        
        script = await generate_script(prompt, duration)
        
        # Update status: Generating voiceover
        jobs[job_id].update({
            "progress": 30,
            "message": "Generating voiceover..."
        })
        logger.info(f"Job {job_id}: Generating voiceover")
        
        audio_path = await generate_audio(job_id, script)
        
        # Update status: Generating images
        jobs[job_id].update({
            "progress": 50,
            "message": "Generating visuals..."
        })
        logger.info(f"Job {job_id}: Generating images")
        
        image_paths = await generate_images(job_id, script, duration)
        
        # Update status: Composing video
        jobs[job_id].update({
            "progress": 80,
            "message": "Composing final video..."
        })
        logger.info(f"Job {job_id}: Composing video")
        
        video_path = await compose_video(job_id, audio_path, image_paths, script)
        
        # Complete
        jobs[job_id].update({
            "status": "completed",
            "progress": 100,
            "message": "Video ready!",
            "video_url": f"/api/download/{job_id}"
        })
        logger.info(f"Job {job_id}: Completed")
        
    except Exception as e:
        logger.error(f"Job {job_id} failed: {str(e)}")
        jobs[job_id].update({
            "status": "failed",
            "progress": 0,
            "message": f"Error: {str(e)}"
        })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
