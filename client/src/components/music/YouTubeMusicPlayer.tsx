import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, ExternalLink, Music, Volume2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

interface YouTubeMusicPlayerProps {
  searchQuery?: string;
  maxResults?: number;
  featuredVideoId?: string;
  title?: string;
  description?: string;
}

export default function YouTubeMusicPlayer({ 
  searchQuery = "Dale Loves Whales FEELS SO GOOD",
  maxResults = 6,
  featuredVideoId = "jzpvkq3Krjg",
  title = "Consciousness-Transforming Music",
  description = "Explore our collection of consciousness-transforming music, healing frequencies, and guided meditations designed to elevate your vibration."
}: YouTubeMusicPlayerProps) {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch YouTube videos using our working API
  const { data: musicData, isLoading, error } = useQuery({
    queryKey: ['youtube-music', searchQuery],
    queryFn: async () => {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}&maxResults=${maxResults}`);
      if (!response.ok) {
        throw new Error('Failed to fetch music videos');
      }
      return response.json();
    }
  });

  // Set featured video if provided
  useEffect(() => {
    if (featuredVideoId && musicData?.videos) {
      const featured = musicData.videos.find((video: YouTubeVideo) => video.id.videoId === featuredVideoId);
      if (featured) {
        setSelectedVideo(featured);
      }
    } else if (musicData?.videos && musicData.videos.length > 0) {
      // Auto-select first video if no featured video
      setSelectedVideo(musicData.videos[0]);
    }
  }, [musicData, featuredVideoId]);

  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const openInYouTube = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <Card className="cosmic-card">
        <CardContent className="p-6">
          <div className="text-center text-cosmic-text">
            <Music className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Unable to load music content at this time.</p>
            <p className="text-sm text-muted-foreground mt-2">Please check your connection and try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cosmic-primary to-cosmic-vivid bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-cosmic-text max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Featured Release */}
      <Card className="cosmic-card border-cosmic-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-cosmic-primary">New Release: FEELS SO GOOD</CardTitle>
              <Badge variant="secondary" className="mt-2">
                Latest Release
              </Badge>
            </div>
            <Volume2 className="h-8 w-8 text-cosmic-primary" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="aspect-video bg-cosmic-muted rounded-lg"></div>
              <div className="h-4 bg-cosmic-muted rounded w-3/4"></div>
              <div className="h-3 bg-cosmic-muted rounded w-1/2"></div>
            </div>
          ) : selectedVideo ? (
            <div className="space-y-4">
              {/* Video Player */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1`}
                    title={selectedVideo.snippet.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full group cursor-pointer" onClick={togglePlayPause}>
                    <img
                      src={selectedVideo.snippet.thumbnails.high.url}
                      alt={selectedVideo.snippet.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Button
                        size="lg"
                        className="h-16 w-16 rounded-full bg-cosmic-primary hover:bg-cosmic-vivid"
                      >
                        <Play className="h-8 w-8 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-cosmic-text">
                  {selectedVideo.snippet.title}
                </h3>
                <p className="text-cosmic-text/70 text-sm">
                  Released: {formatDate(selectedVideo.snippet.publishedAt)}
                </p>
                <p className="text-cosmic-text/80 line-clamp-3">
                  {selectedVideo.snippet.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={togglePlayPause}
                  className="bg-cosmic-primary hover:bg-cosmic-vivid"
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openInYouTube(selectedVideo.id.videoId)}
                  className="border-cosmic-primary text-cosmic-primary hover:bg-cosmic-primary hover:text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in YouTube
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Music Collection Grid */}
      {musicData?.videos && musicData.videos.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-cosmic-text mb-6">Music Collection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicData.videos.map((video: YouTubeVideo) => (
              <Card
                key={video.id.videoId}
                className={`cosmic-card cursor-pointer transition-all hover:scale-105 ${
                  selectedVideo?.id.videoId === video.id.videoId
                    ? 'ring-2 ring-cosmic-primary'
                    : ''
                }`}
                onClick={() => handleVideoSelect(video)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Video Info */}
                    <div>
                      <h4 className="font-medium text-cosmic-text line-clamp-2 mb-1">
                        {video.snippet.title}
                      </h4>
                      <p className="text-xs text-cosmic-text/60">
                        {formatDate(video.snippet.publishedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <Card className="cosmic-card bg-gradient-to-r from-cosmic-primary/10 to-cosmic-vivid/10 border-cosmic-primary/30">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-cosmic-text mb-2">
            Experience Consciousness-Expanding Music
          </h3>
          <p className="text-cosmic-text/70 mb-4">
            Join thousands who have transformed their consciousness through our healing frequencies and whale wisdom.
          </p>
          <Button className="bg-cosmic-primary hover:bg-cosmic-vivid">
            Explore Full Collection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}