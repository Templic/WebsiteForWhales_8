/**
 * Direct YouTube Player - Phase 2 Implementation
 * Simple direct embedding using iframe with security compatibility
 * Bypasses complex YouTube IFrame API that's causing the black box issue
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ExternalLink } from 'lucide-react';

interface DirectYouTubePlayerProps {
  videoId: string;
  consciousnessLevel?: number;
  whaleWisdomRequired?: boolean;
  width?: number;
  height?: number;
}

export const DirectYouTubePlayer: React.FC<DirectYouTubePlayerProps> = ({
  videoId,
  consciousnessLevel = 1,
  whaleWisdomRequired = false,
  width = 560,
  height = 315
}) => {
  const [videoData, setVideoData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  // Load YouTube Data API for metadata
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        console.log('🐋 Fetching video data with whale wisdom...');
        const response = await fetch(`/api/youtube/video/${videoId}`);
        const result = await response.json();
        if (result.success) {
          setVideoData(result.data);
          console.log('🐋 Video metadata loaded successfully:', result.data);
        }
        setLoading(false);
      } catch (err) {
        console.warn('Could not fetch video metadata:', err);
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  // Validate consciousness requirements
  useEffect(() => {
    if (whaleWisdomRequired && consciousnessLevel < 2) {
      setError('Higher consciousness level required for this content');
      setLoading(false);
      return;
    }
  }, [consciousnessLevel, whaleWisdomRequired]);

  const handlePlayClick = () => {
    console.log('🐋 Play button clicked - activating direct YouTube player');
    setShowPlayer(true);
  };

  const openInNewTab = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (error) {
    return (
      <div className="direct-player-error bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Cannot Load Video</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="direct-player-loading bg-gray-100 rounded-lg p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading whale-blessed content...</span>
      </div>
    );
  }

  return (
    <div className="direct-youtube-player relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden shadow-lg">
      {/* Consciousness Level Indicator */}
      <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
        Consciousness Level {consciousnessLevel}
        {whaleWisdomRequired && <span className="ml-1 text-blue-600">🐋</span>}
      </div>

      {/* Video Info Overlay */}
      {videoData && (
        <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 max-w-xs">
          <h4 className="text-sm font-semibold text-gray-800 truncate">
            {videoData.title}
          </h4>
          <p className="text-xs text-gray-600 mb-1">
            {videoData.channelTitle}
          </p>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>{videoData.viewCount?.toLocaleString()} views</span>
            <span>{videoData.likeCount?.toLocaleString()} likes</span>
            <span>{videoData.duration}</span>
          </div>
        </div>
      )}

      {/* Player Container */}
      <div style={{ width, height }} className="relative">
        {!showPlayer ? (
          /* Preview State with Play Button */
          <div 
            className="w-full h-full bg-cover bg-center relative cursor-pointer group"
            style={{
              backgroundImage: `url(${videoData?.thumbnails?.maxres?.url || videoData?.thumbnails?.high?.url || videoData?.thumbnails?.medium?.url})`
            }}
            onClick={handlePlayClick}
          >
            {/* Dark overlay for better contrast */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-200"></div>
            
            {/* Large Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-all duration-200">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
            </div>

            {/* Duration Badge */}
            {videoData?.duration && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {videoData.duration}
              </div>
            )}
          </div>
        ) : (
          /* Active Player State */
          <div className="w-full h-full">
            <iframe
              width={width}
              height={height}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&origin=${encodeURIComponent(window.location.origin)}`}
              title={videoData?.title || 'YouTube Video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!showPlayer && (
              <button
                onClick={handlePlayClick}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
                title="Play Video"
              >
                <Play className="w-4 h-4 text-white" />
              </button>
            )}
            
            <button
              onClick={openInNewTab}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
              title="Open in YouTube"
            >
              <ExternalLink className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Video Stats */}
          {videoData && (
            <div className="text-white text-xs opacity-90">
              {videoData.viewCount?.toLocaleString()} views • {videoData.likeCount?.toLocaleString()} likes
            </div>
          )}
        </div>
      </div>

      {/* Whale Wisdom Blessing */}
      {whaleWisdomRequired && (
        <div className="absolute top-12 left-2 z-10 bg-blue-100/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-blue-800">
          🐋 Blessed by Whale Wisdom
        </div>
      )}
    </div>
  );
};