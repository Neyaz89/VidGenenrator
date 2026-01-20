from moviepy.editor import (
    ImageClip, AudioFileClip, CompositeVideoClip,
    TextClip, concatenate_videoclips
)
from pathlib import Path
import os


async def compose_video(job_id: str, audio_path: Path, image_paths: list, script: dict) -> Path:
    """Compose final video with images, audio, and captions"""
    
    # Load audio
    audio = AudioFileClip(str(audio_path))
    total_duration = audio.duration
    
    # Calculate duration per image
    duration_per_image = total_duration / len(image_paths)
    
    # Create video clips from images
    video_clips = []
    
    for img_path in image_paths:
        clip = (ImageClip(str(img_path))
                .set_duration(duration_per_image)
                .resize(height=1920))
        video_clips.append(clip)
    
    # Concatenate all clips
    final_video = concatenate_videoclips(video_clips, method="compose")
    
    # Add audio
    final_video = final_video.set_audio(audio)
    
    # Add captions (optional - can be enhanced)
    full_text = script.get("full_text", "")
    if full_text and len(full_text) < 100:
        try:
            caption = (TextClip(full_text, fontsize=50, color='white',
                               font='Arial-Bold', stroke_color='black',
                               stroke_width=2, method='caption',
                               size=(1000, None))
                      .set_position(('center', 'bottom'))
                      .set_duration(total_duration))
            
            final_video = CompositeVideoClip([final_video, caption])
        except:
            pass  # Skip captions if font issues
    
    # Export
    output_path = Path("output") / f"{job_id}.mp4"
    
    final_video.write_videofile(
        str(output_path),
        fps=30,
        codec='libx264',
        audio_codec='aac',
        temp_audiofile=f'temp/{job_id}_temp_audio.m4a',
        remove_temp=True,
        preset='medium',
        threads=4
    )
    
    # Cleanup temp files
    try:
        audio_path.unlink()
        for img_path in image_paths:
            img_path.unlink()
    except:
        pass
    
    return output_path
