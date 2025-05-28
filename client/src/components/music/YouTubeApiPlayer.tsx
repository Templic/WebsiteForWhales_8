import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink, Eye, ThumbsUp } from 'lucide-react';

interface YouTubeVideoData {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      default?: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    publishedAt: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
  };
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
  const [error, setError] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/youtube/video/${videoId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video data');
        }
        const result = await response.json();
        
        if (result.success && result.video) {
          setVideoData(result.video);
          setError('');
        } else {
          throw new Error(result.error || 'Video not found');
        }
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  const handlePlayVideo = () => {
    setShowPlayer(true);
  };

  const handleWatchOnYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return count;
  };

  const formatDuration = (duration: string) => {
    // Convert PT3M33S to 3:33 format
    const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    if (match) {
      const minutes = match[1] || '0';
      const seconds = match[2] || '0';
      return `${minutes}:${seconds.padStart(2, '0')}`;
    }
    return duration;
  };

  if (loading) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-white">Loading video...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-lg flex flex-col items-center justify-center p-6">
        <div className="text-red-400 mb-4">Error loading video: {error}</div>
        <Button onClick={handleWatchOnYouTube} className="bg-red-600 hover:bg-red-700">
          <ExternalLink className="w-4 h-4 mr-2" />
          Watch on YouTube
        </Button>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-white">No video data available</div>
      </div>
    );
  }

  // Get the best available thumbnail
  const getThumbnail = () => {
    const thumbnails = videoData.snippet.thumbnails;
    return thumbnails.maxres?.url || 
           thumbnails.standard?.url || 
           thumbnails.high?.url || 
           thumbnails.medium?.url || 
           thumbnails.default?.url || 
           '';
  };

  return (
    <div className="w-full">
      {!showPlayer ? (
        <div 
          className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
          onClick={handlePlayVideo}
        >
          {/* Thumbnail */}
          <img 
            src={getThumbnail()} 
            alt={videoData.snippet.title}
            className="w-full h-full object-cover"
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
            {formatDuration(videoData.contentDetails.duration)}
          </div>
        </div>
      ) : (
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={videoData.snippet.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      {/* Video info */}
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-white">{videoData.snippet.title}</h3>
        <p className="text-gray-400 text-sm">by {videoData.snippet.channelTitle}</p>
        
        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{formatViewCount(videoData.statistics.viewCount)} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{formatViewCount(videoData.statistics.likeCount)} likes</span>
          </div>
        </div>

        {/* Watch button */}
        <Button 
          onClick={handleWatchOnYouTube}
          className="w-full bg-red-600 hover:bg-red-700 mt-4"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Watch on YouTube
        </Button>
      </div>
    </div>
  );
};