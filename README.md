# 🎬 AI Cartoon Reel Generator

> **Professional animated cartoon video generator powered by AI**  
> Create viral-ready faceless reels with 3D cartoon characters, precise timing, and Hinglish support.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## ✨ Features

### 🎨 **Professional Cartoon Animation**
- **3D Cartoon Characters** - Pixar/Disney quality animated characters
- **8 Frames Per Scene** - Smooth animation with varied poses and expressions
- **Advanced Effects** - Zoom, pan, fade, and bounce animations
- **Cinematic Quality** - 1080x1920 (9:16) vertical format

### 🎙️ **Professional Audio**
- **Hinglish & English Support** - Native Hindi-English mix
- **Adjustable Voice Speed** - 0.7x to 1.3x speed control
- **Word-Level Timing** - Precise caption synchronization
- **Professional TTS** - Natural-sounding voiceovers

### 📝 **Smart Content Generation**
- **AI Script Writing** - Groq-powered viral content creation
- **Scene Breakdown** - Automatic scene division with visual descriptions
- **Viral Hooks** - Attention-grabbing opening lines
- **Call-to-Action** - Engagement-optimized endings

### 🎯 **Production Features**
- **Real-Time Progress** - Live status updates during generation
- **Queue System** - Background job processing
- **Error Handling** - Graceful fallbacks and recovery
- **Clean Architecture** - Modular, maintainable codebase

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **FFmpeg** ([Installation Guide](#ffmpeg-installation))
- **Groq API Key** ([Get Free Key](https://console.groq.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-cartoon-reel-generator.git
cd ai-cartoon-reel-generator
```

2. **Install FFmpeg** (Windows)
```bash
.\install-ffmpeg.bat
```

3. **Configure API Keys** (Automated)
```bash
.\setup-env.bat
```
This will prompt you for your Groq API key and configure both backend and frontend.

**OR Manual Setup:**

```bash
# Backend
cd backend-node
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Frontend
cd ../frontend
cp .env.example .env.local
# Edit .env.local if needed
```

4. **Install Dependencies**
```bash
# Backend
cd backend-node
npm install

# Frontend
cd ../frontend
npm install
```

5. **Start Development Servers**

Terminal 1 (Backend):
```bash
cd backend-node
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

6. **Open Application**
```
http://localhost:3000
```

---

## 🔒 Security

**CRITICAL: Never commit API keys to Git!**

### Security Features

✅ All `.env` files are gitignored  
✅ Automated security checks (GitHub Actions)  
✅ Local security check script  
✅ Environment setup wizard  
✅ No keys in client-side code  

### Before Committing

Run security check:
```bash
.\check-security.bat
```

This verifies:
- No API keys in code
- No `.env` files committed
- `.gitignore` properly configured

### Setup API Keys Safely

**Automated (Recommended):**
```bash
.\setup-env.bat
```

**Manual:**
```bash
# Backend
cd backend-node
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Frontend  
cd frontend
cp .env.example .env.local
# Edit .env.local if needed
```

### If You Accidentally Commit Keys

1. **Immediately revoke** at [console.groq.com](https://console.groq.com)
2. **Generate new keys**
3. **Update local `.env` files**
4. **Remove from Git history** (see [SECURITY.md](SECURITY.md))

### Security Resources

- 📖 [SECURITY.md](SECURITY.md) - Detailed security guidelines
- 🔍 [check-security.bat](check-security.bat) - Local security scanner
- 🤖 [GitHub Actions](.github/workflows/security-check.yml) - Automated checks

---

## 📖 Usage

### Creating Your First Reel

1. **Enter Your Prompt**
   ```
   Example: "Success ke liye 5 important tips"
   ```

2. **Configure Settings**
   - **Duration**: 15-60 seconds
   - **Language**: Hinglish or English
   - **Voice Speed**: Slow (0.7x) to Fast (1.3x)
   - **Animation Style**: 3D Cartoon or Anime

3. **Generate**
   - Click "Generate Reel"
   - Wait 3-5 minutes for processing
   - Download your video!

### Example Prompts

**Motivational:**
```
"Life mein success pane ke 3 golden rules"
"Never give up - inspiring story"
```

**Educational:**
```
"AI kya hai? Simple explanation"
"Money management tips for students"
```

**Entertainment:**
```
"Funny facts about India"
"Mind-blowing science tricks"
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   UI/UX      │  │   Controls   │  │   Progress   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────────┐
│                Backend (Node.js/Express)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Job Queue    │  │ API Routes   │  │ File Storage │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
│   Groq AI    │  │  Pollinations│  │   FFmpeg   │
│  (Scripts)   │  │  (Cartoons)  │  │  (Video)   │
└──────────────┘  └──────────────┘  └────────────┘
```

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios

**Backend:**
- Node.js 18+
- Express.js
- FFmpeg (fluent-ffmpeg)
- Sharp (image processing)
- gTTS (text-to-speech)

**AI Services:**
- Groq (Llama 3.1 70B) - Script generation
- Pollinations.ai (Flux) - Cartoon generation
- gTTS - Voice synthesis

---

## 📁 Project Structure

```
ai-cartoon-reel-generator/
├── backend-node/              # Node.js backend
│   ├── services/
│   │   ├── scriptGenerator.js           # AI script creation
│   │   ├── animatedCartoonGenerator.js  # Cartoon frame generation
│   │   ├── professionalTTS.js           # Voice synthesis
│   │   └── advancedVideoComposer.js     # Video assembly
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env                   # Environment variables
│
├── frontend/                  # Next.js frontend
│   ├── app/
│   │   ├── page.tsx          # Main UI
│   │   ├── layout.tsx        # App layout
│   │   └── globals.css       # Global styles
│   ├── package.json
│   └── .env.local            # Frontend config
│
├── install-ffmpeg.ps1        # FFmpeg auto-installer
├── README.md                 # This file
└── .gitignore
```

---

## ⚙️ Configuration

### Environment Variables

**Backend (`backend-node/.env`):**
```env
GROQ_API_KEY=your_groq_api_key_here
FRONTEND_URL=http://localhost:3000
PORT=8000
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### API Keys Setup

#### Groq API (Free)
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up with email
3. Navigate to API Keys
4. Create new key
5. Copy to `.env` file

**Free Tier:**
- 30 requests/minute
- Unlimited usage
- No credit card required

---

## 🎨 Customization

### Modify Animation Style

Edit `backend-node/services/animatedCartoonGenerator.js`:

```javascript
const cartoonPrompt = `${scene.visual}, YOUR_STYLE_HERE, 
  3D cartoon character, pixar style, ...`;
```

**Style Options:**
- `pixar style` - Pixar/Disney quality
- `anime style` - Japanese anime look
- `claymation style` - Stop-motion effect
- `comic book style` - Graphic novel aesthetic

### Adjust Voice Settings

Edit `backend-node/services/professionalTTS.js`:

```javascript
const speech = new gtts(text, ttsLanguage, 0.9); // Speed: 0.5-1.5
```

### Change Video Resolution

Edit `backend-node/services/advancedVideoComposer.js`:

```javascript
.resize(1080, 1920)  // Change to your desired resolution
```

---

## 🚢 Deployment

### Deploy to Production

#### Backend (Render.com)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect repository
5. Configure:
   - **Build Command**: `cd backend-node && npm install`
   - **Start Command**: `cd backend-node && npm start`
   - **Environment**: Add `GROQ_API_KEY`
6. Deploy

#### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `frontend`
   - **Environment Variable**: `NEXT_PUBLIC_API_URL`
4. Deploy

### Production Checklist

- [ ] Set production environment variables
- [ ] Enable CORS for production domain
- [ ] Configure rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Enable HTTPS
- [ ] Configure CDN for video delivery
- [ ] Set up backup storage (S3/R2)
- [ ] Implement user authentication
- [ ] Add analytics tracking

---

## 🔧 Troubleshooting

### Common Issues

**FFmpeg not found**
```bash
# Windows
.\install-ffmpeg.bat

# Verify installation
ffmpeg -version
```

**Port already in use**
```bash
# Change port in backend-node/.env
PORT=8001
```

**Module not found**
```bash
cd backend-node
npm install

cd ../frontend
npm install
```

**Video generation fails**
- Check Groq API key is valid
- Verify FFmpeg is installed
- Check disk space (need ~500MB free)
- Review backend logs for errors

**Slow generation**
- Reduce duration (try 15-30 seconds)
- Check internet connection
- Pollinations.ai may be rate-limited

---

## 📊 Performance

### Generation Times

| Duration | Scenes | Frames | Time    |
|----------|--------|--------|---------|
| 15s      | 2-3    | 16-24  | 2-3 min |
| 30s      | 3-4    | 24-32  | 3-4 min |
| 45s      | 4-5    | 32-40  | 4-5 min |
| 60s      | 5-6    | 40-48  | 5-6 min |

### Resource Usage

- **CPU**: Moderate (FFmpeg encoding)
- **RAM**: ~500MB-1GB
- **Disk**: ~200MB per video (temporary)
- **Network**: ~50-100MB per video

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Groq** - Lightning-fast LLM inference
- **Pollinations.ai** - Free AI image generation
- **FFmpeg** - Video processing powerhouse
- **Next.js** - React framework
- **Vercel** - Deployment platform

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-cartoon-reel-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-cartoon-reel-generator/discussions)
- **Email**: your.email@example.com

---

## 🗺️ Roadmap

- [ ] Multiple voice options (male/female)
- [ ] Background music integration
- [ ] Custom character upload
- [ ] Batch video generation
- [ ] Video templates library
- [ ] Social media auto-posting
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

## 💡 Tips for Best Results

1. **Write Clear Prompts** - Be specific about your topic
2. **Optimal Duration** - 30 seconds works best
3. **Test Voice Speed** - Try different speeds for your content
4. **Use Hinglish** - More engaging for Indian audience
5. **Review Output** - Check first video before bulk generation

---

## 📈 Stats

- **Generation Time**: 3-5 minutes per video
- **Video Quality**: 1080x1920 @ 30fps
- **Audio Quality**: 192kbps AAC
- **Cost**: $0 (100% free with free tier APIs)
- **Monthly Limit**: ~100 videos (Groq free tier)

---

<div align="center">

**Made with ❤️ for content creators**

[⭐ Star this repo](https://github.com/yourusername/ai-cartoon-reel-generator) • [🐛 Report Bug](https://github.com/yourusername/ai-cartoon-reel-generator/issues) • [✨ Request Feature](https://github.com/yourusername/ai-cartoon-reel-generator/issues)

</div>
