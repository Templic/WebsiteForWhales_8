import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';

interface YouTubeVideoData {
  title: string;
  description: string;
  thumbnails: {
    high: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    default: { url: string; width: number; height: number };
  };
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
}

interface YouTubeApiPlayerProps {
  videoId: string;
  title: string;
  artist: string;
}

export const YouTubeApiPlayer: React.FC<YouTubeApiPlayerProps> = ({ 
  videoId, 
  title, 
  artist 
}) => {
  const [videoData, setVideoData] = useState<YouTubeVideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`/api/youtube-api/video/${videoId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video data');
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch video data');
        }
        const data = result.video;
        setVideoData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  const handleWatchOnYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="w-full aspect-video rounded-lg bg-gray-900 border border-[#00ebd6]/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ebd6] mx-auto mb-2"></div>
          <p className="text-[#00ebd6] text-sm">Loading video data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video rounded-lg bg-gray-900 border border-red-500/20 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-400 mb-4">Error loading video: {error}</p>
          <Button 
            onClick={handleWatchOnYouTube}
            className="bg-[#FF0000] hover:bg-[#CC0000] text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Watch on YouTube
          </Button>
        </div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="w-full aspect-video rounded-lg bg-gray-900 border border-[#00ebd6]/20 flex items-center justify-center">
        <p className="text-gray-400">No video data available</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-900 border border-[#00ebd6]/20 relative group">
      {/* Video Thumbnail */}
      <div 
        className="w-full h-full bg-cover bg-center relative cursor-pointer"
        style={{ 
          backgroundImage: `url(${videoData.thumbnails.high?.url || videoData.thumbnails.medium?.url})` 
        }}
        onClick={handleWatchOnYouTube}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#FF0000] hover:bg-[#CC0000] rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300 cursor-pointer">
            <Play className="w-8 h-8 text-white fill-current ml-1" />
          </div>
        </div>

        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-medium text-sm mb-1">{videoData.title}</h3>
          <p className="text-gray-300 text-xs">{videoData.channelTitle}</p>
          {videoData.viewCount && (
            <p className="text-gray-400 text-xs mt-1">
              {parseInt(videoData.viewCount).toLocaleString()} views
            </p>
          )}
        </div>
      </div>

      {/* External Link Button */}
      <div className="absolute top-4 right-4">
        <Button
          size="sm"
          onClick={handleWatchOnYouTube}
          className="bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          YouTube
        </Button>
      </div>
    </div>
  );
};