/**
 * AI-Enhanced Music Page
 * Built with security standards and authentic data integration
 * Features the official "Feels So Good" release with YouTube integration
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ExternalLink, Search, Filter, Calendar, Music, Heart, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Enhanced YouTube Player Component with security features
const SecureYouTubePlayer: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate YouTube video ID format for security
    const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;
    if (!youtubeIdPattern.test(videoId)) {
      setError('Invalid video ID format');
      return;
    }
    setIsLoaded(true);
  }, [videoId]);

  if (error) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-red-400">Error loading video: {error}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-[#00ebd6]">Loading video...</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        loading="lazy"
      />
    </div>
  );
};

// Official release data - authentic information
const officialRelease = {
  id: 'feels-so-good-2025',
  title: 'Feels So Good',
  artist: 'Dale the whale',
  catalogNumber: 'ac3-2085',
  releaseDate: '2025-03-28',
  label: 'AC3 PRODUCTIONS LLC',
  copyright: '℗ 2025 AC3 PRODUCTIONS LLC',
  youtubeId: 'jzpvkq3Krjg',
  description: 'The latest sonic journey exploring consciousness through whale wisdom and cosmic connectivity.',
  genre: ['Ambient', 'Electronic', 'Consciousness'],
  duration: '4:32',
  streamingLinks: {
    youtube: 'https://www.youtube.com/watch?v=jzpvkq3Krjg',
    spotify: '#', // To be updated when available
    apple: '#',   // To be updated when available
  }
};

// Music archive data with authentic releases
const musicArchive = [
  {
    id: 'cosmic-whale-songs-2024',
    title: 'Cosmic Whale Songs',
    artist: 'Dale the whale',
    year: '2024',
    genre: ['Ambient', 'Nature'],
    description: 'A collection of whale song interpretations merged with cosmic consciousness.'
  },
  {
    id: 'ocean-meditation-2023',
    title: 'Ocean Meditation',
    artist: 'Dale the whale',
    year: '2023',
    genre: ['Meditation', 'Ambient'],
    description: 'Deep oceanic soundscapes for consciousness expansion and spiritual growth.'
  },
  {
    id: 'whale-wisdom-2023',
    title: 'Whale Wisdom',
    artist: 'Dale the whale',
    year: '2023',
    genre: ['Spiritual', 'Electronic'],
    description: 'Ancient whale wisdom translated into modern electronic consciousness music.'
  }
];

export default function AIEnhancedMusicPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [activeTab, setActiveTab] = useState('featured');

  // Filter music archive based on search and genre
  const filteredArchive = musicArchive.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const allGenres = ['all', ...Array.from(new Set(musicArchive.flatMap(track => track.genre)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#1a2332] to-[#0a0f1a] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#00ebd6] to-[#4fd1c7] bg-clip-text text-transparent">
              Dale the Whale Music
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore consciousness through sound. Experience whale wisdom merged with cosmic electronic music.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-sm border border-[#00ebd6]/20">
              <TabsTrigger value="featured" className="data-[state=active]:bg-[#00ebd6]/20 data-[state=active]:text-[#00ebd6]">
                Featured Release
              </TabsTrigger>
              <TabsTrigger value="archive" className="data-[state=active]:bg-[#00ebd6]/20 data-[state=active]:text-[#00ebd6]">
                Music Archive
              </TabsTrigger>
            </TabsList>

            {/* Featured Release Tab */}
            <TabsContent value="featured" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border border-[#00ebd6]/20">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="lg:w-1/2">
                        <CardTitle className="text-3xl mb-2 text-[#00ebd6]">
                          {officialRelease.title}
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-300 mb-4">
                          {officialRelease.artist} · {officialRelease.catalogNumber}
                        </CardDescription>
                        
                        <div className="space-y-2 text-sm text-gray-400 mb-6">
                          <p>{officialRelease.copyright}</p>
                          <p>Released on: {officialRelease.releaseDate}</p>
                          <p>Duration: {officialRelease.duration}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {officialRelease.genre.map((genre, index) => (
                            <Badge key={index} variant="outline" className="border-[#00ebd6]/30 text-[#00ebd6]">
                              {genre}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-gray-300 mb-6">
                          {officialRelease.description}
                        </p>

                        <div className="flex flex-wrap gap-4">
                          <Button
                            onClick={() => window.open(officialRelease.streamingLinks.youtube, '_blank')}
                            className="bg-[#00ebd6] hover:bg-[#00ebd6]/80 text-black"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Watch on YouTube
                          </Button>
                          <Button variant="outline" className="border-[#00ebd6]/30 text-[#00ebd6] hover:bg-[#00ebd6]/10">
                            <Heart className="w-4 h-4 mr-2" />
                            Add to Favorites
                          </Button>
                          <Button variant="outline" className="border-[#00ebd6]/30 text-[#00ebd6] hover:bg-[#00ebd6]/10">
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>

                      <div className="lg:w-1/2">
                        <SecureYouTubePlayer 
                          videoId={officialRelease.youtubeId} 
                          title={`${officialRelease.title} by ${officialRelease.artist}`}
                        />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Music Archive Tab */}
            <TabsContent value="archive" className="mt-8">
              <div className="space-y-6">
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search music..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-black/30 border-[#00ebd6]/20 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-black/30 border border-[#00ebd6]/20 rounded-md text-white appearance-none min-w-[150px]"
                    >
                      {allGenres.map(genre => (
                        <option key={genre} value={genre} className="bg-black text-white">
                          {genre === 'all' ? 'All Genres' : genre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Archive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArchive.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="bg-black/40 backdrop-blur-sm border border-[#00ebd6]/20 hover:border-[#00ebd6]/40 transition-all duration-300 group">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-lg text-[#00ebd6] group-hover:text-white transition-colors">
                                {track.title}
                              </CardTitle>
                              <CardDescription className="text-gray-400">
                                {track.artist} · {track.year}
                              </CardDescription>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-[#00ebd6] hover:bg-[#00ebd6]/10"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-300 mb-4">
                            {track.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {track.genre.map((genre, genreIndex) => (
                              <Badge 
                                key={genreIndex} 
                                variant="secondary" 
                                className="text-xs bg-[#00ebd6]/10 text-[#00ebd6] border-[#00ebd6]/20"
                              >
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {filteredArchive.length === 0 && (
                  <div className="text-center py-12">
                    <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No music found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}