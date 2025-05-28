import React, { useState, useEffect } from 'react';
import { Music, Archive, Play, Calendar, Clock, Search, Filter } from 'lucide-react';

interface ArchivedTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  releaseYear: number;
  duration: string;
  genre: string;
  description: string;
  streamingLinks: {
    spotify?: string;
    apple?: string;
    youtube?: string;
    soundcloud?: string;
  };
}

interface FilterOptions {
  year: string;
  genre: string;
  sortBy: 'title' | 'year' | 'album';
}

const ArchivedMusicV2: React.FC = () => {
  const [archivedTracks, setArchivedTracks] = useState<ArchivedTrack[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<ArchivedTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    year: 'all',
    genre: 'all',
    sortBy: 'year'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArchivedMusic();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [archivedTracks, searchQuery, filters]);

  const loadArchivedMusic = async () => {
    try {
      // Use your existing archived music API endpoint
      const response = await fetch('/api/music/archived');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.tracks) {
          setArchivedTracks(data.tracks);
        }
      }
    } catch (error) {
      console.error('Error loading archived music:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...archivedTracks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply year filter
    if (filters.year !== 'all') {
      filtered = filtered.filter(track => track.releaseYear.toString() === filters.year);
    }

    // Apply genre filter
    if (filters.genre !== 'all') {
      filtered = filtered.filter(track => track.genre === filters.genre);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'album':
          return a.album.localeCompare(b.album);
        case 'year':
        default:
          return b.releaseYear - a.releaseYear;
      }
    });

    setFilteredTracks(filtered);
  };

  const handleStreamingLink = (platform: string, url: string) => {
    window.open(url, '_blank');
  };

  const getUniqueYears = () => {
    const years = [...new Set(archivedTracks.map(track => track.releaseYear))];
    return years.sort((a, b) => b - a);
  };

  const getUniqueGenres = () => {
    return [...new Set(archivedTracks.map(track => track.genre))].sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-background flex items-center justify-center">
        <div className="text-center text-cosmic-text">
          <Archive className="h-12 w-12 animate-pulse mx-auto mb-4" />
          <p>Loading archived cosmic sounds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-background">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-primary/20 to-cosmic-secondary/20" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-cosmic-text mb-4">
              Archived Cosmic Music
            </h1>
            <p className="text-xl text-cosmic-text/80">
              Journey through Dale's complete discography of consciousness-expanding sounds
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-cosmic-card/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-cosmic-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cosmic-text/50" />
                <input
                  type="text"
                  placeholder="Search tracks, albums, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cosmic-background/50 border border-cosmic-primary/20 rounded-lg text-cosmic-text placeholder-cosmic-text/50 focus:outline-none focus:border-cosmic-primary"
                />
              </div>

              {/* Year Filter */}
              <select
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                className="px-4 py-3 bg-cosmic-background/50 border border-cosmic-primary/20 rounded-lg text-cosmic-text focus:outline-none focus:border-cosmic-primary"
              >
                <option value="all">All Years</option>
                {getUniqueYears().map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>

              {/* Genre Filter */}
              <select
                value={filters.genre}
                onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                className="px-4 py-3 bg-cosmic-background/50 border border-cosmic-primary/20 rounded-lg text-cosmic-text focus:outline-none focus:border-cosmic-primary"
              >
                <option value="all">All Genres</option>
                {getUniqueGenres().map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterOptions['sortBy'] }))}
                className="px-4 py-3 bg-cosmic-background/50 border border-cosmic-primary/20 rounded-lg text-cosmic-text focus:outline-none focus:border-cosmic-primary"
              >
                <option value="year">Sort by Year</option>
                <option value="title">Sort by Title</option>
                <option value="album">Sort by Album</option>
              </select>
            </div>

            <div className="mt-4 text-center text-cosmic-text/60">
              Showing {filteredTracks.length} of {archivedTracks.length} tracks
            </div>
          </div>
        </div>
      </section>

      {/* Track Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {filteredTracks.length === 0 ? (
            <div className="text-center py-16">
              <Music className="h-16 w-16 text-cosmic-text/30 mx-auto mb-4" />
              <p className="text-xl text-cosmic-text/60">No tracks found matching your criteria</p>
              <p className="text-cosmic-text/40 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTracks.map((track) => (
                <div key={track.id} className="bg-cosmic-card/60 backdrop-blur-sm rounded-xl p-6 border border-cosmic-primary/20 hover:border-cosmic-primary/40 transition-all">
                  <div className="aspect-square bg-gradient-to-br from-cosmic-primary/30 to-cosmic-secondary/30 rounded-lg mb-4 flex items-center justify-center">
                    <Music className="h-12 w-12 text-white" />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <h3 className="text-lg font-bold text-cosmic-text line-clamp-1">{track.title}</h3>
                    <p className="text-cosmic-text/70">{track.album}</p>
                    <div className="flex items-center gap-4 text-sm text-cosmic-text/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{track.releaseYear}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{track.duration}</span>
                      </div>
                    </div>
                    <div className="inline-block bg-cosmic-primary/20 text-cosmic-primary px-2 py-1 rounded text-xs">
                      {track.genre}
                    </div>
                  </div>

                  <p className="text-sm text-cosmic-text/60 mb-4 line-clamp-2">{track.description}</p>
                  
                  <div className="space-y-2">
                    {track.streamingLinks.youtube && (
                      <button
                        onClick={() => handleStreamingLink('YouTube', track.streamingLinks.youtube!)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <Play className="h-4 w-4" />
                        YouTube
                      </button>
                    )}
                    {track.streamingLinks.spotify && (
                      <button
                        onClick={() => handleStreamingLink('Spotify', track.streamingLinks.spotify!)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <Play className="h-4 w-4" />
                        Spotify
                      </button>
                    )}
                    {track.streamingLinks.apple && (
                      <button
                        onClick={() => handleStreamingLink('Apple Music', track.streamingLinks.apple!)}
                        className="w-full bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <Play className="h-4 w-4" />
                        Apple Music
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-cosmic-primary/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-cosmic-text mb-4">
            Discover the Complete Journey
          </h2>
          <p className="text-xl text-cosmic-text/70 mb-8">
            Explore decades of consciousness-expanding music and whale wisdom
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-cosmic-primary hover:bg-cosmic-primary/80 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Download Complete Discography
            </button>
            <button className="border border-cosmic-primary text-cosmic-primary hover:bg-cosmic-primary/10 px-8 py-3 rounded-lg font-medium transition-colors">
              Create Custom Playlist
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArchivedMusicV2;