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
    <div className={`relative aspect-video rounded-lg overflow-hidden bg-black ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1`}
        title={`${title} - ${artist}`}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        onLoad={() => setError(false)}
        onError={() => setError(true)}
      />
      
      {error && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm opacity-75 mb-4">by {artist}</p>
            <Button
              onClick={handleDirectLink}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Watch on YouTube
            </Button>
          </div>
        </div>
      )}

      {/* Overlay controls for enhanced UX */}
      <div className="absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity">
        <Button
          onClick={handleDirectLink}
          variant="outline"
          size="sm"
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          YouTube
        </Button>
      </div>
    </div>
  );
};

export default EnhancedYouTubePlayer;