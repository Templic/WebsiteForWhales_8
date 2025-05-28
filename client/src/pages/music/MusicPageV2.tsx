import React, { useState, useEffect } from 'react';
import { Play, Music, Heart, Share2, Download, ExternalLink } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  releaseDate: string;
  youtubeId?: string;
  streamingLinks: {
    spotify?: string;
    apple?: string;
    youtube?: string;
    soundcloud?: string;
  };
  artwork?: string;
}

const MusicPageV2: React.FC = () => {
  const [featuredTrack, setFeaturedTrack] = useState<Track | null>(null);
  const [recentReleases, setRecentReleases] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMusicData();
  }, []);

  const loadMusicData = async () => {
    try {
      // Use your existing music API endpoint
      const response = await fetch('/api/music/tracks');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFeaturedTrack(data.featured);
          setRecentReleases(data.recent || []);
        }
      }
    } catch (error) {
      console.error('Error loading music data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStreamingLink = (platform: string, url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-background flex items-center justify-center">
        <div className="text-center text-cosmic-text">
          <Music className="h-12 w-12 animate-pulse mx-auto mb-4" />
          <p>Loading cosmic sounds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-background">
      {/* Hero Section with Featured Release */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-primary/20 to-cosmic-secondary/20" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-cosmic-text mb-4">
              Dale Loves Whales Music
            </h1>
            <p className="text-xl text-cosmic-text/80">
              Consciousness-expanding sounds from the cosmic ocean
            </p>
          </div>

          {/* Featured Track */}
          {featuredTrack && (
            <div className="bg-cosmic-card/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-cosmic-primary/20">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-80 h-80 bg-gradient-to-br from-cosmic-primary/40 to-cosmic-secondary/40 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Music className="h-20 w-20 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold">{featuredTrack.title}</h3>
                      <p className="text-lg opacity-75">{featuredTrack.artist}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-6">
                    <span className="inline-block bg-cosmic-primary/20 text-cosmic-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                      Latest Release
                    </span>
                    <h2 className="text-4xl font-bold text-cosmic-text mb-2">
                      {featuredTrack.title}
                    </h2>
                    <p className="text-xl text-cosmic-text/70 mb-4">
                      {featuredTrack.album} • {featuredTrack.releaseDate}
                    </p>
                  </div>

                  {/* Streaming Links */}
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    {featuredTrack.streamingLinks.youtube && (
                      <button
                        onClick={() => handleStreamingLink('YouTube', featuredTrack.streamingLinks.youtube!)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Play className="h-5 w-5" />
                        YouTube
                      </button>
                    )}
                    {featuredTrack.streamingLinks.spotify && (
                      <button
                        onClick={() => handleStreamingLink('Spotify', featuredTrack.streamingLinks.spotify!)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Play className="h-5 w-5" />
                        Spotify
                      </button>
                    )}
                    {featuredTrack.streamingLinks.apple && (
                      <button
                        onClick={() => handleStreamingLink('Apple Music', featuredTrack.streamingLinks.apple!)}
                        className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Play className="h-5 w-5" />
                        Apple Music
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recent Releases */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-cosmic-text mb-8 text-center">
            Recent Releases
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReleases.map((track) => (
              <div key={track.id} className="bg-cosmic-card/60 backdrop-blur-sm rounded-xl p-6 border border-cosmic-primary/20 hover:border-cosmic-primary/40 transition-all">
                <div className="aspect-square bg-gradient-to-br from-cosmic-primary/30 to-cosmic-secondary/30 rounded-lg mb-4 flex items-center justify-center">
                  <Music className="h-12 w-12 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-cosmic-text mb-2">{track.title}</h3>
                <p className="text-cosmic-text/70 mb-4">{track.album}</p>
                
                <div className="flex gap-2">
                  {track.streamingLinks.youtube && (
                    <button
                      onClick={() => handleStreamingLink('YouTube', track.streamingLinks.youtube!)}
                      className="bg-cosmic-primary/20 hover:bg-cosmic-primary/30 text-cosmic-primary px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Listen
                    </button>
                  )}
                  <button className="bg-cosmic-card/40 hover:bg-cosmic-card/60 text-cosmic-text px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="bg-cosmic-card/40 hover:bg-cosmic-card/60 text-cosmic-text px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-cosmic-primary/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-cosmic-text mb-4">
            Stay Connected to the Cosmic Sound
          </h2>
          <p className="text-xl text-cosmic-text/70 mb-8">
            Join our community for exclusive releases and whale wisdom updates
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-cosmic-primary hover:bg-cosmic-primary/80 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Subscribe to Updates
            </button>
            <button className="border border-cosmic-primary text-cosmic-primary hover:bg-cosmic-primary/10 px-8 py-3 rounded-lg font-medium transition-colors">
              View All Releases
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MusicPageV2;