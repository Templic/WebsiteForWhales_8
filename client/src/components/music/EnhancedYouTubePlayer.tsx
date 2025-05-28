import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink, Loader2 } from 'lucide-react';

interface EnhancedYouTubePlayerProps {
  videoId: string;
  title?: string;
  artist?: string;
  className?: string;
}

const EnhancedYouTubePlayer: React.FC<EnhancedYouTubePlayerProps> = ({
  videoId,
  title = "Music Video",
  artist = "Dale The Whale",
  className = ""
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [videoId]);

  const handleDirectLink = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className={`relative aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center ${className}`}>
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading {title}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/80 to-blue-900/80 ${className}`}>
      <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
        <div className="text-center">
          <Play className="h-16 w-16 mx-auto mb-4 text-cosmic-primary" />
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-lg opacity-75 mb-6">by {artist}</p>
          <div className="space-y-4">
            <Button
              onClick={handleDirectLink}
              variant="outline"
              className="bg-cosmic-primary/20 border-cosmic-primary text-white hover:bg-cosmic-primary/30"
            >
              <Play className="h-4 w-4 mr-2" />
              Watch on YouTube
            </Button>
            <div className="text-sm opacity-60">
              <p>New Release • Available Now</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Album artwork background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-primary/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default EnhancedYouTubePlayer;