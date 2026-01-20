# Start Here - Node.js Version (No Python Needed!)

Your reel generator is ready! Everything runs on Node.js - no Python installation required.

## Step 1: Install FFmpeg (Required for video processing)

**Windows:**
1. Download from: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
2. Extract to `C:\ffmpeg`
3. Add to PATH:
   - Search "Environment Variables" in Windows
   - Edit "Path" variable
   - Add: `C:\ffmpeg\bin`
4. Restart terminal and verify: `ffmpeg -version`

**Or use Chocolatey (easier):**
```bash
choco install ffmpeg
```

## Step 2: Install Backend Dependencies

```bash
cd backend-node
npm install
```

This installs all Node.js packages (takes 1-2 minutes).

## Step 3: Start Backend Server

```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:8000
```

Keep this terminal open!

## Step 4: Install Frontend Dependencies

Open a NEW terminal:

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

1. Open: http://localhost:3000
2. Enter: "Create a motivational reel about never giving up"
3. Duration: 30 seconds
4. Click "Generate Reel"
5. Wait 2-3 minutes
6. Download your video!

## Troubleshooting

### "FFmpeg not found"
- Make sure FFmpeg is installed and in PATH
- Restart your terminal after adding to PATH
- Test with: `ffmpeg -version`

### "Port 8000 already in use"
- Change port in `backend-node/.env`:
  ```
  PORT=8001
  ```
- Update frontend `.env.local`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8001
  ```

### "Cannot find module"
```bash
cd backend-node
npm install
```

## What's Different?

- ✅ No Python needed
- ✅ Everything runs on Node.js
- ✅ Same features, same quality
- ✅ Your Groq API key is already configured

## File Structure

```
backend-node/          ← Node.js backend (use this!)
  ├── services/
  │   ├── scriptGenerator.js
  │   ├── ttsService.js
  │   ├── imageGenerator.js
  │   └── videoComposer.js
  ├── server.js
  └── .env             ← Your API keys

frontend/              ← React frontend
  └── app/page.tsx

backend/               ← Python version (ignore this)
```

## Ready to Deploy?

Once it works locally, you can deploy:
- Backend → Render.com (supports Node.js)
- Frontend → Vercel

See DEPLOYMENT.md for instructions.
