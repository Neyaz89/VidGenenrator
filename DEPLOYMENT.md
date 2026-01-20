# Deployment Guide

## Prerequisites

1. **Groq API Key** (Free)
   - Go to https://console.groq.com
   - Sign up and create API key
   - Free tier: 30 requests/minute

2. **Google Cloud TTS** (Free - 1M chars/month)
   - Go to https://console.cloud.google.com
   - Create new project
   - Enable "Cloud Text-to-Speech API"
   - Create service account
   - Download JSON credentials file

## Backend Deployment (Render)

1. Push code to GitHub

2. Go to https://render.com and sign up

3. Click "New +" → "Web Service"

4. Connect your GitHub repository

5. Configure:
   - Name: `faceless-reel-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Instance Type: Free

6. Add Environment Variables:
   ```
   GROQ_API_KEY=your_groq_api_key
   FRONTEND_URL=https://your-app.vercel.app
   ```

7. Add Secret File:
   - File Name: `google-credentials.json`
   - Contents: Paste your Google Cloud credentials JSON
   
8. Add another Environment Variable:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
   ```

9. Click "Create Web Service"

10. Wait for deployment (5-10 minutes)

11. Copy your Render URL (e.g., `https://faceless-reel-backend.onrender.com`)

## Frontend Deployment (Vercel)

1. Go to https://vercel.com and sign up

2. Click "Add New" → "Project"

3. Import your GitHub repository

4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```
   (Use the Render URL from step 11 above)

6. Click "Deploy"

7. Wait for deployment (2-3 minutes)

8. Your app is live!

## Update Backend with Frontend URL

1. Go back to Render dashboard

2. Open your backend service

3. Go to "Environment" tab

4. Update `FRONTEND_URL` with your Vercel URL

5. Save changes (will trigger redeploy)

## Testing

1. Open your Vercel URL

2. Enter a prompt: "Create a motivational reel about success"

3. Wait 2-3 minutes

4. Download your video!

## Troubleshooting

### Backend Issues

- Check Render logs for errors
- Verify environment variables are set
- Ensure Google credentials file is uploaded correctly

### Frontend Issues

- Check browser console for errors
- Verify API_URL is correct
- Check CORS settings in backend

### Video Generation Fails

- Check Groq API key is valid
- Verify Google Cloud TTS is enabled
- Check Render logs for specific errors

## Free Tier Limits

- **Groq**: 30 requests/minute (enough for 30 reels/minute)
- **Google TTS**: 1M characters/month (~100-200 reels)
- **Pollinations.ai**: Unlimited (rate limited)
- **Render**: 750 hours/month (enough for continuous running)
- **Vercel**: Unlimited deployments

## Cost Estimate

- **0-100 reels/month**: $0 (completely free)
- **100-500 reels/month**: ~$5-10 (Google TTS overage)
- **500+ reels/month**: Consider paid tiers

## Production Enhancements

For scaling beyond 100 reels/month:

1. Add Redis for job queue
2. Use Cloudflare R2 for video storage
3. Add user authentication
4. Implement rate limiting
5. Add webhook notifications
6. Use background workers (Celery)
