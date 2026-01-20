import requests
from pathlib import Path
from PIL import Image
from io import BytesIO
import time


async def generate_images(job_id: str, script: dict, duration: int) -> list:
    """Generate images for each scene using Pollinations.ai"""
    
    image_paths = []
    scenes = script.get("scenes", [])
    
    if not scenes:
        # Fallback: create one image
        scenes = [{"visual": script.get("hook", "inspiring scene")}]
    
    for idx, scene in enumerate(scenes):
        visual_prompt = scene.get("visual", "inspiring background")
        
        # Clean prompt for URL
        prompt = visual_prompt.replace(" ", "%20")
        
        # Pollinations.ai - free, no API key
        url = f"https://image.pollinations.ai/prompt/{prompt}?width=1080&height=1920&nologo=true"
        
        try:
            response = requests.get(url, timeout=30)
            
            if response.status_code == 200:
                img = Image.open(BytesIO(response.content))
                
                # Ensure 9:16 aspect ratio (1080x1920)
                img = img.resize((1080, 1920), Image.Resampling.LANCZOS)
                
                image_path = Path("temp") / f"{job_id}_img_{idx}.jpg"
                img.save(image_path, "JPEG", quality=95)
                image_paths.append(image_path)
            else:
                # Fallback: solid color image
                image_paths.append(create_fallback_image(job_id, idx))
                
        except Exception as e:
            print(f"Image generation failed for scene {idx}: {e}")
            image_paths.append(create_fallback_image(job_id, idx))
        
        # Rate limiting
        time.sleep(1)
    
    return image_paths


def create_fallback_image(job_id: str, idx: int) -> Path:
    """Create a solid color fallback image"""
    from PIL import Image, ImageDraw, ImageFont
    
    img = Image.new('RGB', (1080, 1920), color=(30, 30, 50))
    draw = ImageDraw.Draw(img)
    
    # Add text
    try:
        font = ImageFont.truetype("arial.ttf", 60)
    except:
        font = ImageFont.load_default()
    
    text = f"Scene {idx + 1}"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    position = ((1080 - text_width) // 2, (1920 - text_height) // 2)
    draw.text(position, text, fill=(255, 255, 255), font=font)
    
    image_path = Path("temp") / f"{job_id}_img_{idx}.jpg"
    img.save(image_path, "JPEG")
    
    return image_path
