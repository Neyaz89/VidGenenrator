# Quick Setup Guide

## Local Development

### Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Add your API keys to `.env`:
```
GROQ_API_KEY=your_groq_key_here
GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
FRONTEND_URL=http://localhost:3000
PORT=8000
```

6. Add Google Cloud credentials:
   - Download JSON from Google Cloud Console
   - Save as `google-credentials.json` in backend folder

7. Run backend:
```bash
python main.py
```

Backend will run on http://localhost:8000

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

5. Run frontend:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Getting API Keys

### Groq (Free)
1. Visit https://console.groq.com
2. Sign up with email
3. Go to API Keys section
4. Create new key
5. Copy and paste into `.env`

### Google Cloud TTS (Free - 1M chars/month)
1. Visit https://console.cloud.google.com
2. Create new project
3. Enable "Cloud Text-to-Speech API"
4. Go to "Credentials"
5. Create Service Account
6. Download JSON key
7. Save as `google-credentials.json` in backend folder

## Testing Locally

1. Open http://localhost:3000
2. Enter prompt: "Create a motivational reel about never giving up"
3. Set duration: 30 seconds
4. Click "Generate Reel"
5. Wait 2-3 minutes
6. Download your video!

## Deployment

See DEPLOYMENT.md for detailed deployment instructions to Render + Vercel.

## Troubleshooting

### "Module not found" errors
```bash
pip install -r requirements.txt
```

### FFmpeg not found
- **Windows**: Download from https://ffmpeg.org/download.html
- **Mac**: `brew install ffmpeg`
- **Linux**: `sudo apt-get install ffmpeg`

### Google credentials error
- Ensure `google-credentials.json` is in backend folder
- Check `GOOGLE_APPLICATION_CREDENTIALS` path in `.env`

### CORS errors
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check browser console for specific error

## Project Structure

```
.
├── backend/
│   ├── services/
│   │   ├── script_generator.py    # Groq script generation
│   │   ├── tts_service.py         # Google TTS
│   │   ├── image_generator.py     # Pollinations.ai images
│   │   └── video_composer.py      # FFmpeg video assembly
│   ├── main.py                    # FastAPI app
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Main UI
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── package.json
│   └── .env.local
├── README.md
├── DEPLOYMENT.md
└── SETUP.md
```
