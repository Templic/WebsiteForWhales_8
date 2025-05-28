import React, { useState, useEffect } from 'react';
import { Play, Music, Heart, Share2, Download, ExternalLink, Archive, Search, Filter, Calendar, Clock } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  releaseDate: string;
  releaseYear?: number;
  genre?: string;
  description?: string;
  youtubeId?: string;
  streamingLinks: {
    spotify?: string;
    apple?: string;
    youtube?: string;
    soundcloud?: string;
  };
  artwork?: string;
}

interface FilterOptions {
  year: string;
  genre: string;
  sortBy: 'title' | 'year' | 'album';
  showArchived: boolean;
}

const EnhancedMusicPage: React.FC = () => {
  const [featuredTrack, setFeaturedTrack] = useState<Track | null>(null);
  const [recentReleases, setRecentReleases] = useState<Track[]>([]);
  const [archivedTracks, setArchivedTracks] = useState<Track[]>([]);
  const [activeTab, setActiveTab] = useState<'featured' | 'archive'>('featured');
  const [filters, setFilters] = useState<FilterOptions>({
    year: 'all',
    genre: 'all',
    sortBy: 'year',
    showArchived: true
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        // Fetch current releases
        const response = await fetch('/api/music/tracks');
        const data = await response.json() as any;
        setFeaturedTrack(data.featured);
        setRecentReleases(data.recent);

        // Fetch archived music
        const archivedResponse = await fetch('/api/music/archived');
        const archivedData = await archivedResponse.json() as any;
        setArchivedTracks(archivedData.tracks || []);
      } catch (error) {
        console.error('Failed to fetch music data:', error);
      }
    };

    fetchMusicData();
  }, []);

  const filteredTracks = archivedTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filters.year === 'all' || track.releaseYear?.toString() === filters.year;
    const matchesGenre = filters.genre === 'all' || track.genre === filters.genre;
    
    return matchesSearch && matchesYear && matchesGenre;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'title': return a.title.localeCompare(b.title);
      case 'year': return (b.releaseYear || 0) - (a.releaseYear || 0);
      case 'album': return a.album.localeCompare(b.album);
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-cyan-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Dale's Music Universe
          </h1>
          <p className="text-xl text-cyan-100/80 max-w-2xl mx-auto">
            Explore the cosmic soundscapes and whale wisdom through transcendent musical journeys
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'featured'
                  ? 'bg-cyan-600 text-white'
                  : 'text-cyan-300 hover:text-white hover:bg-cyan-600/20'
              }`}
            >
              Featured Releases
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'archive'
                  ? 'bg-purple-600 text-white'
                  : 'text-cyan-300 hover:text-white hover:bg-purple-600/20'
              }`}
            >
              <Archive className="w-4 h-4 inline mr-2" />
              Music Archive
            </button>
          </div>
        </div>

        {activeTab === 'featured' && (
          <>
            {/* Featured Track with YouTube Video */}
            {featuredTrack && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">Featured Release</h2>
                <div className="max-w-6xl mx-auto bg-gradient-to-r from-purple-900/30 to-cyan-900/30 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* YouTube Video Player */}
                    <div className="order-2 lg:order-1">
                      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                        <iframe
                          width="100%"
                          height="100%"
                          src="https://www.youtube.com/embed/jzpvkq3Krjg?rel=0&modestbranding=1"
                          title="Dale The Whale - FEELS SO GOOD"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                    
                    {/* Track Info */}
                    <div className="order-1 lg:order-2">
                      <h3 className="text-4xl font-bold text-white mb-2">{featuredTrack.title}</h3>
                      <p className="text-xl text-cyan-300 mb-4">{featuredTrack.artist}</p>
                      <p className="text-cyan-100/80 mb-6">{featuredTrack.album} • {featuredTrack.releaseDate}</p>
                      
                      <div className="mb-6">
                        <p className="text-cyan-100/70 text-lg leading-relaxed">
                          Experience the transcendent soundscape of cosmic consciousness with this breakthrough release. 
                          Blending whale wisdom with otherworldly frequencies to create a truly transformative listening experience.
                        </p>
                      </div>
                      
                      {/* Streaming Links */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        {featuredTrack.streamingLinks.spotify && (
                          <a href={featuredTrack.streamingLinks.spotify} target="_blank" rel="noopener noreferrer" 
                             className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <Music className="w-4 h-4" />
                            Spotify
                          </a>
                        )}
                        {featuredTrack.streamingLinks.apple && (
                          <a href={featuredTrack.streamingLinks.apple} target="_blank" rel="noopener noreferrer"
                             className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors">
                            <Music className="w-4 h-4" />
                            Apple Music
                          </a>
                        )}
                        {featuredTrack.streamingLinks.youtube && (
                          <a href={featuredTrack.streamingLinks.youtube} target="_blank" rel="noopener noreferrer"
                             className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <ExternalLink className="w-4 h-4" />
                            YouTube
                          </a>
                        )}
                      </div>

                      {/* Social Actions */}
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                          <Heart className="w-4 h-4" />
                          Like
                        </button>
                        <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Releases */}
            <div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">Recent Releases</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentReleases.map((track) => (
                  <div key={track.id} className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all">
                    <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
                      <Music className="w-12 h-12 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
                    <p className="text-cyan-300 mb-2">{track.artist}</p>
                    <p className="text-cyan-100/60 text-sm mb-4">{track.album} • {track.duration}</p>
                    
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded text-sm transition-colors">
                        <Play className="w-3 h-3" />
                        Play
                      </button>
                      <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors">
                        <Heart className="w-3 h-3" />
                        Like
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'archive' && (
          <div>
            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search tracks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/60 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                    className="bg-black/30 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>

                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters({...filters, genre: e.target.value})}
                    className="bg-black/30 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all">All Genres</option>
                    <option value="Cosmic Consciousness">Cosmic Consciousness</option>
                    <option value="Whale Wisdom">Whale Wisdom</option>
                  </select>

                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
                    className="bg-black/30 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="year">Sort by Year</option>
                    <option value="title">Sort by Title</option>
                    <option value="album">Sort by Album</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Archive Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTracks.map((track) => (
                <div key={track.id} className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all">
                  <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
                    <Music className="w-12 h-12 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
                  <p className="text-cyan-300 mb-1">{track.artist}</p>
                  <p className="text-cyan-100/60 text-sm mb-2">{track.album} • {track.releaseYear}</p>
                  {track.genre && (
                    <p className="text-purple-300 text-sm mb-3">{track.genre}</p>
                  )}
                  {track.description && (
                    <p className="text-cyan-100/60 text-sm mb-4 line-clamp-2">{track.description}</p>
                  )}
                  
                  <div className="flex gap-2 flex-wrap">
                    {track.streamingLinks.youtube && (
                      <a href={track.streamingLinks.youtube} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors">
                        <Play className="w-3 h-3" />
                        YouTube
                      </a>
                    )}
                    {track.streamingLinks.spotify && (
                      <a href={track.streamingLinks.spotify} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors">
                        <Music className="w-3 h-3" />
                        Spotify
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMusicPage;