/**
 * Consciousness-Aware YouTube Player
 * Clean implementation using YouTube IFrame API with PostMessage for security bypass
 */

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, AlertCircle, Heart } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  channelTitle: string;
  viewCount: string;
  likeCount: string;
  duration: string;
  thumbnailUrl: string;
}

interface ConsciousnessYouTubePlayerProps {
  videoId: string;
  consciousnessLevel?: number;
  whaleWisdomRequired?: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const ConsciousnessYouTubePlayer: React.FC<ConsciousnessYouTubePlayerProps> = ({
  videoId,
  consciousnessLevel = 1,
  whaleWisdomRequired = false,
}) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiReady, setApiReady] = useState(false);

  // Validate video ID with consciousness awareness
  const validateVideoId = (id: string): boolean => {
    const isValid = /^[a-zA-Z0-9_-]{11}$/.test(id);
    if (!isValid) {
      console.log('🐋 Whale wisdom: Invalid video ID format detected');
    }
    return isValid;
  };

  // Load video metadata with consciousness integration
  const loadVideoMetadata = async () => {
    if (!validateVideoId(videoId)) {
      setError('Invalid video format - whale wisdom protection activated');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/youtube/video/${videoId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Consciousness-Level': consciousnessLevel.toString(),
          'X-Whale-Wisdom-Required': whaleWisdomRequired.toString(),
        },
      });

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('Video not accessible through consciousness channels');
      }

      const data = result.data;
      const thumbnailUrl = data.snippet.thumbnails?.maxres?.url || 
                          data.snippet.thumbnails?.high?.url || 
                          data.snippet.thumbnails?.medium?.url ||
                          data.snippet.thumbnails?.default?.url;

      setVideoData({
        id: data.id,
        title: data.snippet.title,
        channelTitle: data.snippet.channelTitle,
        viewCount: data.statistics?.viewCount || '0',
        likeCount: data.statistics?.likeCount || '0',
        duration: data.contentDetails?.duration || 'PT0S',
        thumbnailUrl: thumbnailUrl || ''
      });

      console.log('🐋 Video metadata loaded with whale wisdom blessing');
    } catch (err: any) {
      console.error('🐋 Whale wisdom: Error loading video:', err);
      setError(err.message || 'Failed to connect to cosmic video channels');
    } finally {
      setLoading(false);
    }
  };

  // Load YouTube API with consciousness protection
  const loadYouTubeAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        setApiReady(true);
        resolve();
        return;
      }

      // Global callback for YouTube API
      window.onYouTubeIframeAPIReady = () => {
        console.log('🐋 YouTube API ready - consciousness channels open');
        setApiReady(true);
        resolve();
      };

      // Load YouTube API script with consciousness attributes
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-consciousness-approved', 'true');
      script.setAttribute('data-whale-wisdom', consciousnessLevel.toString());
      
      script.onload = () => {
        console.log('🐋 YouTube script loaded with whale blessing');
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load YouTube consciousness channels'));
      };

      document.head.appendChild(script);
    });
  };

  // Create player with consciousness integration
  const createConsciousnessPlayer = () => {
    if (!playerRef.current || !window.YT || !videoData) return;

    console.log('🐋 Creating consciousness-enhanced YouTube player');

    const playerInstance = new window.YT.Player(playerRef.current, {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        // Security and consciousness settings
        origin: window.location.origin,
        enablejsapi: 1,
        rel: 0, // No related videos
        modestbranding: 1, // Minimal branding
        fs: 1, // Allow fullscreen
        cc_load_policy: 0, // No captions by default
        iv_load_policy: 3, // No annotations
        autoplay: 0, // Respect user consciousness
        controls: 1, // Show controls
        disablekb: 0, // Allow keyboard
        // Use privacy-enhanced domain
        host: 'https://www.youtube-nocookie.com',
        // Custom consciousness parameters
        widget_referrer: window.location.origin
      },
      events: {
        onReady: (event: any) => {
          console.log('🐋 YouTube player ready with whale wisdom');
          setPlayer(event.target);
        },
        onStateChange: (event: any) => {
          const states: Record<number, string> = {
            [-1]: 'unstarted',
            [0]: 'ended',
            [1]: 'playing',
            [2]: 'paused',
            [3]: 'buffering',
            [5]: 'cued'
          };
          
          const state = states[event.data] || 'unknown';
          setIsPlaying(state === 'playing');
          
          console.log(`🐋 Player state: ${state} - consciousness level ${consciousnessLevel}`);
        },
        onError: (event: any) => {
          const errorCodes: Record<number, string> = {
            2: 'Invalid video ID - whale wisdom protection',
            5: 'HTML5 player error - consciousness blockage',
            100: 'Video not found - not in cosmic library',
            101: 'Embedding blocked - insufficient consciousness level',
            150: 'Embedding restricted - whale wisdom required'
          };
          
          const errorMessage = errorCodes[event.data] || 'Unknown consciousness barrier';
          setError(errorMessage);
          console.error('🐋 Player error:', errorMessage);
        }
      }
    });

    setPlayer(playerInstance);
  };

  // Initialize consciousness player
  useEffect(() => {
    loadVideoMetadata();
  }, [videoId, consciousnessLevel]);

  useEffect(() => {
    if (!validateVideoId(videoId)) return;

    loadYouTubeAPI().catch((err) => {
      setError('Failed to open consciousness channels to YouTube');
      console.error('🐋 API load error:', err);
    });
  }, [videoId]);

  // Handle consciousness-aware play
  const handleConsciousnessPlay = () => {
    if (!apiReady || !videoData) {
      console.log('🐋 Consciousness channels not ready yet');
      return;
    }
    
    if (!player) {
      console.log('🐋 Creating player with whale wisdom blessing');
      createConsciousnessPlayer();
    } else {
      console.log('🐋 Playing with consciousness enhancement');
      player.playVideo();
    }
    setIsPlaying(true);
  };

  // Handle consciousness-aware pause
  const handleConsciousnessPause = () => {
    if (player) {
      console.log('🐋 Pausing with whale wisdom');
      player.pauseVideo();
    }
    setIsPlaying(false);
  };

  // Format numbers with consciousness
  const formatCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Format duration with whale wisdom
  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return duration;
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Security validation failed
  if (!validateVideoId(videoId)) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg flex items-center justify-center border border-purple-500/30">
        <div className="text-center text-purple-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>🐋 Whale Wisdom Protection Active</p>
          <p className="text-sm opacity-70">Invalid video format detected</p>
        </div>
      </div>
    );
  }

  // Loading state with consciousness
  if (loading) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-teal-900/20 to-cyan-900/20 rounded-lg flex items-center justify-center">
        <div className="text-center text-[#00ebd6]">
          <div className="animate-pulse flex justify-center mb-2">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <p>🐋 Opening consciousness channels...</p>
          <p className="text-sm opacity-70">Connecting with whale wisdom</p>
        </div>
      </div>
    );
  }

  // Error state with whale wisdom
  if (error) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-lg flex items-center justify-center border border-red-500/30">
        <div className="text-center text-red-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>🐋 Consciousness Barrier Detected</p>
          <p className="text-sm opacity-70">{error}</p>
        </div>
      </div>
    );
  }

  // No video data
  if (!videoData) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>🐋 Video not found in cosmic library</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Consciousness-enhanced video player */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
        {!isPlaying ? (
          // Thumbnail view with consciousness play button
          <>
            {videoData.thumbnailUrl && (
              <img 
                src={videoData.thumbnailUrl} 
                alt={videoData.title}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Consciousness play button - positioned on left */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-start pl-8">
              <button
                onClick={handleConsciousnessPlay}
                className="group relative w-20 h-20 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                aria-label="Play with consciousness enhancement"
              >
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#00ebd6] rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white fill-current" />
                </div>
              </button>
            </div>

            {/* Duration with consciousness glow */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm border border-[#00ebd6]/30">
              🐋 {formatDuration(videoData.duration)}
            </div>

            {/* Consciousness level indicator */}
            <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded text-xs">
              Consciousness Level {consciousnessLevel}
            </div>
          </>
        ) : (
          // YouTube player with consciousness enhancement
          <div ref={playerRef} className="w-full h-full" />
        )}
      </div>

      {/* Video info with whale wisdom */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white leading-tight">
          🐋 {videoData.title}
        </h3>
        
        <div className="flex items-center space-x-6 text-sm text-gray-400">
          <span className="flex items-center space-x-1">
            <span>👁</span>
            <span>{formatCount(videoData.viewCount)} views</span>
          </span>
          <span className="flex items-center space-x-1">
            <Heart className="w-4 h-4 fill-current text-red-400" />
            <span>{formatCount(videoData.likeCount)} likes</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>⏱</span>
            <span>{formatDuration(videoData.duration)}</span>
          </span>
        </div>
        
        <p className="text-sm text-gray-500">
          by {videoData.channelTitle} • Enhanced with whale wisdom
        </p>

        {whaleWisdomRequired && (
          <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border border-[#00ebd6]/30 rounded-lg p-3">
            <p className="text-[#00ebd6] text-sm">
              🐋 This content is blessed with whale wisdom for enhanced consciousness expansion
            </p>
          </div>
        )}
      </div>
    </div>
  );
};