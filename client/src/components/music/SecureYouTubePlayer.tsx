/**
 * Secure YouTube Player - Complete Security-Compliant Implementation
 * Built according to comprehensive security documentation
 */

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, AlertCircle } from 'lucide-react';

interface SecureYouTubePlayerProps {
  videoId: string;
  title?: string;
  height?: number;
  width?: number;
}

interface VideoMetadata {
  id: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;
  thumbnails: {
    maxres?: { url: string };
    high?: { url: string };
    medium?: { url: string };
  };
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const SecureYouTubePlayer: React.FC<SecureYouTubePlayerProps> = ({
  videoId,
  title,
  height = 390,
  width = 640,
}) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiReady, setApiReady] = useState(false);

  // Validate video ID format for security
  const isValidVideoId = (id: string): boolean => {
    return /^[a-zA-Z0-9_-]{11}$/.test(id);
  };

  // Sanitize input
  const sanitizedVideoId = isValidVideoId(videoId) ? videoId : null;

  // Load video metadata securely
  const loadVideoMetadata = async () => {
    if (!sanitizedVideoId) {
      setError('Invalid video ID format');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/youtube/video/${sanitizedVideoId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('Video not found or not accessible');
      }

      const data = result.data;
      setVideoData({
        id: data.id,
        title: data.snippet.title,
        channelTitle: data.snippet.channelTitle,
        publishedAt: data.snippet.publishedAt,
        viewCount: data.statistics?.viewCount || '0',
        likeCount: data.statistics?.likeCount || '0',
        duration: data.contentDetails?.duration || 'PT0S',
        thumbnails: data.snippet.thumbnails || {}
      });
    } catch (err: any) {
      console.error('Error loading video metadata:', err);
      setError(err.message || 'Failed to load video data');
    } finally {
      setLoading(false);
    }
  };

  // Load YouTube IFrame API securely
  const loadYouTubeAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        setApiReady(true);
        resolve();
        return;
      }

      // Set up global callback
      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
        resolve();
      };

      // Create script with security attributes
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        // API will call onYouTubeIframeAPIReady when ready
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load YouTube API'));
      };

      document.head.appendChild(script);
    });
  };

  // Create YouTube player instance
  const createPlayer = () => {
    if (!playerRef.current || !window.YT || !sanitizedVideoId) return;

    const playerInstance = new window.YT.Player(playerRef.current, {
      height: '100%',
      width: '100%',
      videoId: sanitizedVideoId,
      playerVars: {
        // Security and privacy settings
        origin: window.location.origin,
        enablejsapi: 1,
        rel: 0, // Don't show related videos
        modestbranding: 1, // Minimal YouTube branding
        fs: 1, // Allow fullscreen
        cc_load_policy: 0, // Don't show captions by default
        iv_load_policy: 3, // Hide annotations
        autohide: 1,
        controls: 1,
        disablekb: 0,
        autoplay: 0, // Respect user preference
        mute: 0,
        loop: 0,
        // Use privacy-enhanced mode
        host: 'https://www.youtube-nocookie.com'
      },
      events: {
        onReady: (event: any) => {
          console.log('YouTube player ready');
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
          
          console.log('Player state changed to:', state);
        },
        onError: (event: any) => {
          const errorCodes: Record<number, string> = {
            2: 'Invalid video ID',
            5: 'HTML5 player error',
            100: 'Video not found or private',
            101: 'Embedding not allowed by video owner',
            150: 'Embedding not allowed by video owner'
          };
          
          const errorMessage = errorCodes[event.data] || 'Unknown player error';
          setError(errorMessage);
          console.error('YouTube player error:', errorMessage);
        }
      }
    });

    setPlayer(playerInstance);
  };

  // Initialize on mount
  useEffect(() => {
    loadVideoMetadata();
  }, [sanitizedVideoId]);

  useEffect(() => {
    if (!sanitizedVideoId) return;

    loadYouTubeAPI().catch((err) => {
      setError('Failed to load YouTube API');
      console.error(err);
    });
  }, [sanitizedVideoId]);

  useEffect(() => {
    if (apiReady && !isPlaying && videoData) {
      // Player will be created when user clicks play
    }
  }, [apiReady, videoData]);

  // Format view count
  const formatCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Format duration
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

  // Handle play button click
  const handlePlay = () => {
    if (!apiReady || !videoData) return;
    
    if (!player) {
      createPlayer();
    } else {
      player.playVideo();
    }
    setIsPlaying(true);
  };

  // Handle pause button click
  const handlePause = () => {
    if (player) {
      player.pauseVideo();
    }
    setIsPlaying(false);
  };

  // Security validation failed
  if (!sanitizedVideoId) {
    return (
      <div className="w-full aspect-video bg-red-900/20 rounded-lg flex items-center justify-center border border-red-500/30">
        <div className="text-center text-red-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Invalid video ID format</p>
          <p className="text-sm opacity-70">Security validation failed</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center text-[#00ebd6]">
          <div className="animate-spin w-8 h-8 border-2 border-[#00ebd6] border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Loading video data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full aspect-video bg-red-900/20 rounded-lg flex items-center justify-center border border-red-500/30">
        <div className="text-center text-red-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  // No video data
  if (!videoData) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Video not available</p>
        </div>
      </div>
    );
  }

  const thumbnailUrl = videoData.thumbnails.maxres?.url || 
                      videoData.thumbnails.high?.url || 
                      videoData.thumbnails.medium?.url;

  return (
    <div className="w-full">
      {/* Video player area */}
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        {!isPlaying ? (
          // Thumbnail view with play button
          <>
            {thumbnailUrl && (
              <img 
                src={thumbnailUrl} 
                alt={videoData.title}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Play button overlay - positioned on left */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-start pl-8 group-hover:bg-opacity-30 transition-all">
              <button
                onClick={handlePlay}
                className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all hover:scale-110"
                aria-label="Play video"
              >
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              </button>
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
              {formatDuration(videoData.duration)}
            </div>
          </>
        ) : (
          // YouTube player
          <div ref={playerRef} className="w-full h-full" />
        )}
      </div>

      {/* Video info */}
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-white">{videoData.title}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👁 {formatCount(videoData.viewCount)} views</span>
          <span>👍 {formatCount(videoData.likeCount)} likes</span>
          <span>⏱ {formatDuration(videoData.duration)}</span>
        </div>
        <p className="text-sm text-gray-500">by {videoData.channelTitle}</p>
      </div>
    </div>
  );
};