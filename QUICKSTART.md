# Quick Start Guide

Your API keys are configured! Here's how to run your reel generator locally.

## Step 1: Install Backend Dependencies

Open terminal in the `backend` folder and run:

```bash
cd backend
pip install -r requirements.txt
```

This installs:
- FastAPI (web framework)
- Groq (AI script generation)
- gTTS (text-to-speech)
- MoviePy (video editing)
- And more...

## Step 2: Test Your API Keys

```bash
python test_apis.py
```

This will verify:
- ✓ Groq API works
- ✓ Text-to-speech works
- ✓ Image generation works

## Step 3: Start Backend Server

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Keep this terminal open!

## Step 4: Install Frontend Dependencies

Open a NEW terminal in the `frontend` folder:

```bash
cd frontend
npm install
```

## Step 5: Start Frontend

```bash
npm run dev
```

You should see:
```
Ready on http://localhost:3000
```

## Step 6: Create Your First Reel!

1. Open browser: http://localhost:3000
2. Enter prompt: "Create a motivational reel about success"
3. Click "Generate Reel"
4. Wait 2-3 minutes
5. Download your video!

## Troubleshooting

### "Module not found" errors
```bash
pip install -r requirements.txt
```

### "FFmpeg not found"
- Windows: Download from https://ffmpeg.org/download.html
- Add to PATH or install via chocolatey: `choco install ffmpeg`

### Port already in use
Change port in backend/.env:
```
PORT=8001
```

### Frontend can't connect to backend
Check backend/.env has:
```
FRONTEND_URL=http://localhost:3000
```

Check frontend/.env.local has:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## What's Next?

Once it works locally, follow DEPLOYMENT.md to deploy to:
- Backend → Render.com (free)
- Frontend → Vercel (free)

Then you can create reels from anywhere!
