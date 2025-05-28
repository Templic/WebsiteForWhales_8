import React from 'react';
import YouTubeMusicPlayer from '@/components/music/YouTubeMusicPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Headphones, Heart, Star, Download } from 'lucide-react';

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-cosmic-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-primary/20 via-transparent to-cosmic-vivid/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-cosmic-primary/20 backdrop-blur-sm">
              <Music className="h-12 w-12 text-cosmic-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cosmic-primary to-cosmic-vivid bg-clip-text text-transparent mb-6">
            Cosmic Music Journey
          </h1>
          <p className="text-xl text-cosmic-text/80 max-w-3xl mx-auto mb-8">
            Experience consciousness-expanding frequencies, whale songs, and healing soundscapes 
            designed to elevate your vibration and connect you to universal wisdom.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Headphones className="h-4 w-4 mr-2" />
              432Hz Healing Frequencies
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Heart className="h-4 w-4 mr-2" />
              Whale Song Integration
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              Consciousness Activation
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Music Player Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <YouTubeMusicPlayer
            searchQuery="Dale Loves Whales FEELS SO GOOD consciousness music healing"
            maxResults={8}
            title="Latest Release: FEELS SO GOOD"
            description="Our newest consciousness-transforming composition featuring whale wisdom, cosmic frequencies, and healing vibrations designed to elevate your spiritual journey."
          />
        </div>
      </section>

      {/* Music Categories */}
      <section className="py-16 px-4 bg-cosmic-card/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-cosmic-text mb-12">
            Explore by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Whale Songs */}
            <Card className="cosmic-card hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="text-cosmic-primary flex items-center">
                  <Music className="h-5 w-5 mr-2" />
                  Whale Songs & Ocean Sounds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cosmic-text/70 mb-4">
                  Deep underwater recordings and whale communications for meditation and relaxation.
                </p>
                <YouTubeMusicPlayer
                  searchQuery="whale sounds ocean deep underwater meditation"
                  maxResults={3}
                  title=""
                  description=""
                />
              </CardContent>
            </Card>

            {/* Healing Frequencies */}
            <Card className="cosmic-card hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="text-cosmic-primary flex items-center">
                  <Headphones className="h-5 w-5 mr-2" />
                  Healing Frequencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cosmic-text/70 mb-4">
                  Sacred frequencies like 432Hz, 528Hz designed for cellular healing and DNA repair.
                </p>
                <YouTubeMusicPlayer
                  searchQuery="432Hz 528Hz healing frequency meditation solfeggio"
                  maxResults={3}
                  title=""
                  description=""
                />
              </CardContent>
            </Card>

            {/* Cosmic Meditation */}
            <Card className="cosmic-card hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="text-cosmic-primary flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Cosmic Meditation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cosmic-text/70 mb-4">
                  Ambient soundscapes for deep meditation, astral projection, and consciousness expansion.
                </p>
                <YouTubeMusicPlayer
                  searchQuery="cosmic meditation ambient space sounds consciousness"
                  maxResults={3}
                  title=""
                  description=""
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-cosmic-text mb-12">
            Featured Collections
          </h2>
          <div className="space-y-8">
            {/* Sleep & Relaxation */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-2xl text-cosmic-primary">
                  Sleep & Deep Relaxation
                </CardTitle>
                <p className="text-cosmic-text/70">
                  8+ hour long-form compositions for sleep, rest, and restoration
                </p>
              </CardHeader>
              <CardContent>
                <YouTubeMusicPlayer
                  searchQuery="8 hours sleep meditation whale sounds deep relaxation"
                  maxResults={4}
                  title=""
                  description=""
                />
              </CardContent>
            </Card>

            {/* Active Meditation */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-2xl text-cosmic-primary">
                  Active Meditation & Focus
                </CardTitle>
                <p className="text-cosmic-text/70">
                  Energizing frequencies for concentration, creativity, and active meditation
                </p>
              </CardHeader>
              <CardContent>
                <YouTubeMusicPlayer
                  searchQuery="focus meditation concentration binaural beats gamma waves"
                  maxResults={4}
                  title=""
                  description=""
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-cosmic-primary/10 to-cosmic-vivid/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-cosmic-text mb-6">
            Transform Your Consciousness Through Music
          </h2>
          <p className="text-cosmic-text/80 text-lg mb-8">
            Join thousands who have experienced profound shifts in awareness through our 
            consciousness-expanding music and whale wisdom transmissions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-cosmic-primary hover:bg-cosmic-vivid px-8 py-3">
              <Download className="h-5 w-5 mr-2" />
              Download Full Albums
            </Button>
            <Button variant="outline" className="border-cosmic-primary text-cosmic-primary hover:bg-cosmic-primary hover:text-white px-8 py-3">
              Subscribe for Updates
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}