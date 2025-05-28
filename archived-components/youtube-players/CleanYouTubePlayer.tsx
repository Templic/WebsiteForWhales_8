/**
 * Clean YouTube Player - Holistic Security-Compliant Solution
 * Uses YouTube Data API v3 + JavaScript API for seamless embedding
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  views: string;
  likes: string;
  duration: string;
  thumbnail: string;
  publishedAt: string;
}

interface YouTubePlayerProps {
  videoId: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function CleanYouTubePlayer({ videoId }: YouTubePlayerProps) {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        setIsApiReady(true);
        return;
      }

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    };

    loadYouTubeAPI();
  }, []);

  // Fetch video data from our API
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`/api/youtube/video/${videoId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setVideoData({
              id: videoId,
              title: result.data.snippet.title,
              views: result.data.statistics.viewCount,
              likes: result.data.statistics.likeCount,
              duration: result.data.contentDetails.duration,
              thumbnail: result.data.snippet.thumbnails.maxres?.url || 
                        result.data.snippet.thumbnails.high?.url ||
                        result.data.snippet.thumbnails.medium?.url,
              publishedAt: result.data.snippet.publishedAt
            });
          }
        }
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideoData();
  }, [videoId]);

  // Initialize YouTube player when API is ready
  useEffect(() => {
    if (isApiReady && isPlaying && playerRef.current && !player) {
      const ytPlayer = new window.YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          fs: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            console.log('YouTube player ready');
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            // Handle player state changes
            const playerState = event.data;
            if (playerState === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (playerState === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          }
        }
      });
      setPlayer(ytPlayer);
    }
  }, [isApiReady, isPlaying, videoId, player]);

  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDuration = (duration: string) => {
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

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  if (!videoData) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-white">Loading video data...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isPlaying ? (
        // Thumbnail view with play button
        <div 
          className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
          onClick={handlePlayClick}
        >
          <img 
            src={videoData.thumbnail} 
            alt={videoData.title}
            className="w-full h-full object-cover"
          />
          
          {/* Play button - positioned left to not cover album art */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-start pl-8 group-hover:bg-opacity-30 transition-all">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
            {formatDuration(videoData.duration)}
          </div>
        </div>
      ) : (
        // YouTube player view
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
          <div ref={playerRef} className="w-full h-full" />
        </div>
      )}

      {/* Video info */}
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-white">{videoData.title}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👁 {formatViewCount(videoData.views)} views</span>
          <span>👍 {formatViewCount(videoData.likes)} likes</span>
          <span>⏱ {formatDuration(videoData.duration)}</span>
        </div>
      </div>
    </div>
  );
}