'use client';

import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface JobStatus {
  job_id: string;
  status: string;
  progress: number;
  message: string;
  video_url?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30);
  const [language, setLanguage] = useState('hinglish');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [animationStyle, setAnimationStyle] = useState('cartoon');
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReel = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setJobStatus(null);

    try {
      const response = await axios.post(`${API_URL}/api/generate`, {
        prompt,
        duration,
        language,
        voiceSpeed,
        animationStyle
      });

      const job = response.data;
      setJobStatus(job);
      pollJobStatus(job.job_id);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to start generation');
      setLoading(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/api/status/${jobId}`);
        const status = response.data;
        
        setJobStatus(status);

        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          setLoading(false);
        }
      } catch (err) {
        clearInterval(interval);
        setError('Failed to check status');
        setLoading(false);
      }
    }, 2000);
  };

  const downloadVideo = () => {
    if (jobStatus?.video_url) {
      window.open(`${API_URL}${jobStatus.video_url}`, '_blank');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Faceless Reel Generator
            </h1>
            <p className="text-gray-300 text-lg">
              Professional Cartoon Reels with Precise Timing
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl mb-8">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                What's your reel about?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Success ke liye 5 important tips"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 resize-none"
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Language
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setLanguage('hinglish')}
                  disabled={loading}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    language === 'hinglish'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  🇮🇳 Hinglish
                </button>
                <button
                  onClick={() => setLanguage('english')}
                  disabled={loading}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    language === 'english'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Duration: {duration} seconds
              </label>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>15s</span>
                <span>30s</span>
                <span>45s</span>
                <span>60s</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Voice Speed: {voiceSpeed}x
              </label>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(Number(e.target.value))}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Animation Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAnimationStyle('cartoon')}
                  disabled={loading}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    animationStyle === 'cartoon'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  🎨 3D Cartoon
                </button>
                <button
                  onClick={() => setAnimationStyle('anime')}
                  disabled={loading}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    animationStyle === 'anime'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  ⚡ Anime Style
                </button>
              </div>
            </div>

            <button
              onClick={generateReel}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Reel'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-8">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Progress */}
          {jobStatus && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{jobStatus.message}</span>
                  <span className="text-sm text-gray-300">{jobStatus.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${jobStatus.progress}%` }}
                  />
                </div>
              </div>

              {jobStatus.status === 'completed' && (
                <button
                  onClick={downloadVideo}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Video
                </button>
              )}

              {jobStatus.status === 'failed' && (
                <div className="text-red-400 text-center">
                  Generation failed. Please try again.
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="mt-12 text-center text-gray-400 text-sm">
            <p>🎬 3D Cartoon Characters • ⏱️ Precise Timing • 🎙️ Professional TTS</p>
            <p className="mt-2">🎨 Advanced Animations • 🇮🇳 Hinglish Support</p>
          </div>
        </div>
      </div>
    </main>
  );
}
