import React from 'react';
import { SacredGeometryVisualizer } from '../components/sacred-geometry/SacredGeometryVisualizer';
import { Button } from '../components/ui/button';
import { ArrowLeft, Sparkles, Heart, Infinity } from 'lucide-react';
import { Link } from 'wouter';

export default function SacredGeometryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-block">
            <Button variant="outline" className="bg-black/30 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
              🐋 Dale's Sacred Geometry Experience
            </h1>
            <p className="text-slate-300 text-lg">
              Interactive consciousness-enhancing visualizations for transcendent awareness
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-cyan-400">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold">Whale Consciousness</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8 p-6 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-lg border border-cyan-400/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Heart className="h-8 w-8 text-pink-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Healing Frequencies</h3>
              <p className="text-slate-300 text-sm">
                Experience sacred patterns that resonate with natural healing frequencies and promote cellular regeneration.
              </p>
            </div>
            
            <div className="text-center">
              <Infinity className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Cosmic Connection</h3>
              <p className="text-slate-300 text-sm">
                Connect individual awareness to universal patterns through mathematical beauty and divine proportion.
              </p>
            </div>
            
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Transcendent States</h3>
              <p className="text-slate-300 text-sm">
                Interactive 3D geometries designed to facilitate meditation and elevated consciousness experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Sacred Geometry Visualizer Component */}
        <SacredGeometryVisualizer />

        {/* Educational Content */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-gradient-to-br from-slate-800/50 to-purple-800/50 rounded-lg border border-purple-400/30">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
              🌸 Sacred Geometry & Consciousness
            </h3>
            <div className="space-y-4 text-slate-300">
              <p>
                Sacred geometry represents the blueprint of creation, containing the fundamental patterns that 
                underlie all existence. These mathematical relationships appear throughout nature - from the 
                spiral of galaxies to the structure of DNA.
              </p>
              <p>
                By contemplating these patterns, we can align our consciousness with the cosmic order, 
                facilitating deeper understanding of our place in the universe and activating dormant 
                aspects of awareness.
              </p>
              <div className="flex items-center space-x-2 mt-4 text-cyan-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Whale Wisdom: "In geometry, we find the song of creation" 🐋</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-slate-800/50 to-cyan-800/50 rounded-lg border border-cyan-400/30">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              🌊 Oceanic Consciousness & Sacred Patterns
            </h3>
            <div className="space-y-4 text-slate-300">
              <p>
                Whales navigate vast oceanic spaces using sophisticated geometric awareness, sensing 
                magnetic fields and underwater currents that form invisible sacred patterns beneath 
                the waves.
              </p>
              <p>
                Their songs create geometric wave patterns that travel thousands of miles, demonstrating 
                how consciousness can manifest as geometric harmony across dimensional space, connecting 
                all beings in the oceanic web of awareness.
              </p>
              <div className="flex items-center space-x-2 mt-4 text-purple-400">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-semibold">Sacred proportions create healing resonance 💜</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Instructions */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-lg border border-purple-400/30">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">✨ How to Experience Sacred Geometry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-300">
            <div>
              <span className="text-cyan-400 font-semibold">1. Choose Pattern:</span>
              <p>Select a sacred geometry that resonates with your current intention - each pattern carries unique consciousness frequencies.</p>
            </div>
            <div>
              <span className="text-purple-400 font-semibold">2. Set Color Theme:</span>
              <p>Choose consciousness themes: Cosmic for transcendence, Chakra for energy work, Oceanic for emotional healing.</p>
            </div>
            <div>
              <span className="text-pink-400 font-semibold">3. Adjust Animation:</span>
              <p>Fine-tune rotation speed and scale to match your breathing rhythm and desired meditative state.</p>
            </div>
            <div>
              <span className="text-cyan-400 font-semibold">4. Enable Info Guide:</span>
              <p>Toggle consciousness information to learn about healing properties and spiritual significance of each pattern.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            Created with 🐋 whale consciousness and ✨ cosmic love for elevated awareness
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Return to Main Experience
            </Link>
            <span className="text-slate-600">•</span>
            <span className="text-purple-400">Sacred Geometry Demo v7.9</span>
          </div>
        </div>
      </div>
    </div>
  );
}