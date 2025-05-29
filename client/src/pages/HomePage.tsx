/**
 * Enhanced HomePage with Advanced Consciousness Platform Integration
 * Showcasing whale wisdom, manifestation tools, and sacred geometry
 */
import React, { useState, useEffect } from 'react';
import { Link } from "wouter";
import { motion } from 'framer-motion';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { UsersRound, BarChart3, Sparkles } from "lucide-react";
import { SpotlightEffect } from "../components/SpotlightEffect";
import { DynamicContent } from "../components/content";

// Import enhanced responsive sacred geometry components
import { 
  SacredGeometryLayout, 
  GeometricTextContainer,
  ResponsiveSacredGeometry 
} from '../components/ui/responsive-sacred-geometry';
import { 
  SimpleHexagon, 
  SimpleTriangle,
  SimpleInvertedTriangle,
  SimpleCircle,
  SimpleOctagon
} from '../components/cosmic/SimpleGeometry';

interface ConsciousnessOverview {
  currentLevel: number;
  whaleWisdomLevel: number;
  manifestationEnergy: number;
  activeManifestations: number;
  recentWisdom: string;
  breakthroughProbability: number;
}

export default function HomePage() {
  const [consciousnessData, setConsciousnessData] = useState<ConsciousnessOverview>({
    currentLevel: 78.6,
    whaleWisdomLevel: 82.3,
    manifestationEnergy: 75.8,
    activeManifestations: 3,
    recentWisdom: "Trust the currents of change, for they carry you toward your deepest purpose",
    breakthroughProbability: 68
  });

  useEffect(() => {
    document.title = "Home - Dale Loves Whales | Consciousness Platform";
    
    // Simulate real-time consciousness updates
    const interval = setInterval(() => {
      setConsciousnessData(prev => ({
        ...prev,
        currentLevel: Math.min(100, Math.max(0, prev.currentLevel + (Math.random() - 0.5) * 0.1)),
        manifestationEnergy: Math.min(100, Math.max(0, prev.manifestationEnergy + (Math.random() - 0.5) * 0.2))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SacredGeometryLayout className="min-h-screen">
      <SpotlightEffect />
      <div className="container mx-auto px-4 py-4 max-w-[1600px]">

        {/* Enhanced Cosmic Hero Section with Responsive Sacred Geometry */}
        <section className="hero min-h-[90vh] relative flex items-center justify-center text-center text-white mb-8">
          <div className="w-full max-w-[1200px] mx-auto">
            <GeometricTextContainer 
              variant="hexagon" 
              className="w-full max-w-[800px] mx-auto" 
              glowColor="rgba(255, 65, 105, 0.6)"
              backgroundBlur={true}
            >
              <motion.h1 
                className="cosmic-heading-responsive-lg mb-6 text-shadow shadow-[#fe0064] animate-cosmic font-almendra leading-tight px-4 whitespace-normal text-[#e15554]"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                🌊 Consciousness Evolution Portal 🌌
              </motion.h1>
              
              <motion.p 
                className="cosmic-text-responsive mb-8 max-w-[800px] mx-auto leading-relaxed font-cormorant px-4 whitespace-normal text-[#00ebd6]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                🐋 Where Ancient Ocean Wisdom Meets Modern Consciousness Evolution 🎵 
                Experience deep whale frequencies, manifest your reality, and explore sacred geometry ✨
              </motion.p>

              {/* Interactive Consciousness Orb */}
              <motion.div
                className="relative inline-block mb-8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer shadow-lg"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(0, 235, 214, 0.8)" }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(0, 235, 214, 0.5)",
                      "0 0 30px rgba(255, 65, 105, 0.5)",
                      "0 0 20px rgba(0, 235, 214, 0.5)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {consciousnessData.currentLevel.toFixed(0)}%
                </motion.div>
                <p className="text-sm mt-2 text-[#00ebd6]">Consciousness Level</p>
              </motion.div>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-x-4"
              >
                <button 
                  onClick={() => window.location.href = '/cosmic-connectivity'} 
                  className="bg-[#00ebd6] text-[#303436] hover:bg-[#fe0064] hover:text-white rounded px-6 py-3 font-semibold transition-all duration-300"
                >
                  🐋 Begin Consciousness Journey
                </button>
              </motion.div>
            </GeometricTextContainer>
          </div>
        </section>

        {/* How Consciousness Evolution Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
              ✨ How Consciousness Evolution Works ✨
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ancient wisdom meets quantum science in three transformative practices
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
            {/* Whale Wisdom Explanation */}
            <div className="w-full">
              <SimpleTriangle className="w-full max-w-[350px] mx-auto">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-5xl mb-4">🐋</div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">Whale Wisdom</h3>
                  <p className="text-blue-600 mb-6 leading-relaxed">
                    Ancient ocean frequencies carry transformative wisdom to expand your awareness. 
                    Connect with humpback, blue whale, orca, and gray whale consciousness.
                  </p>
                  <div className="space-y-2 text-sm text-blue-500">
                    <div>🎵 Real whale song frequencies</div>
                    <div>🧠 Consciousness expansion</div>
                    <div>💫 Ancient marine wisdom</div>
                  </div>
                </motion.div>
              </SimpleTriangle>
            </div>

            {/* Manifestation Explanation */}
            <div className="w-full">
              <SimpleOctagon className="w-full max-w-[350px] mx-auto">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="text-2xl font-bold text-purple-800 mb-4">Reality Manifestation</h3>
                  <p className="text-purple-600 mb-6 leading-relaxed">
                    Quantum intention aligns cosmic energies with your deepest desires. 
                    Track your manifestation journey with evidence-based progress.
                  </p>
                  <div className="space-y-2 text-sm text-purple-500">
                    <div>⚡ Quantum energy alignment</div>
                    <div>📈 Evidence tracking</div>
                    <div>🎯 Intention optimization</div>
                  </div>
                </motion.div>
              </SimpleOctagon>
            </div>

            {/* Sacred Geometry Explanation */}
            <div className="w-full">
              <SimpleCircle className="w-full max-w-[350px] mx-auto">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-5xl mb-4">🔯</div>
                  <h3 className="text-2xl font-bold text-teal-800 mb-4">Sacred Geometry</h3>
                  <p className="text-teal-600 mb-6 leading-relaxed">
                    Divine patterns harmonize consciousness with universal frequencies, 
                    creating profound spiritual resonance and visual meditation.
                  </p>
                  <div className="space-y-2 text-sm text-teal-500">
                    <div>🌸 Flower of Life patterns</div>
                    <div>🔺 Merkaba meditation</div>
                    <div>🎼 Frequency synchronization</div>
                  </div>
                </motion.div>
              </SimpleCircle>
            </div>
          </div>
        </section>

        {/* Interactive Consciousness Preview */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-300/30"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🌊 Your Consciousness Journey Preview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <div className="text-2xl font-bold text-blue-400 mb-2">Latest Wisdom</div>
                  <p className="text-sm text-blue-300 italic">
                    "{consciousnessData.recentWisdom.substring(0, 60)}..."
                  </p>
                  <p className="text-xs text-blue-200 mt-2">- Humpback • 52.3 Hz</p>
                </motion.div>

                <motion.div 
                  className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <div className="text-2xl font-bold text-purple-400 mb-2">Manifestations</div>
                  <p className="text-sm text-purple-300">
                    {consciousnessData.activeManifestations} active intentions
                  </p>
                  <p className="text-xs text-purple-200 mt-2">Energy: {consciousnessData.manifestationEnergy.toFixed(0)}%</p>
                </motion.div>

                <motion.div 
                  className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <div className="text-2xl font-bold text-teal-400 mb-2">Sacred Flow</div>
                  <p className="text-sm text-teal-300">
                    Geometric resonance active
                  </p>
                  <p className="text-xs text-teal-200 mt-2">Patterns: Flower of Life</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* About Section */}
            <div className="w-full">
              <SimpleTriangle className="w-full max-w-[350px] mx-auto">
                <h3>
                  <DynamicContent 
                    contentKey="home-activity-title" 
                    fallback="Ideal Activity"
                    page="home"
                    section="activity" 
                  />
                </h3>
                <p>
                  <DynamicContent 
                    contentKey="home-activity-description" 
                    fallback="🌟 Dale Loves Whales blends cosmic rhythms with tropical soul 🌴 Dive deep into his musical journey that bridges the stars with the ocean's depths 🌊"
                    page="home"
                    section="activity" 
                  />
                </p>
                <button 
                  onClick={() => window.location.href = '/about'} 
                  className="bg-blue-500 hover:bg-blue-700 text-white rounded"
                >
                  Learn More
                </button>
              </SimpleTriangle>
            </div>

            {/* Vibes Section */}
            <div className="w-full">
              <SimpleOctagon className="w-full max-w-[350px] mx-auto">
                <h3>
                  <DynamicContent 
                    contentKey="home-vibes-title" 
                    fallback="Cosmic Sound Vibes"
                    page="home"
                    section="vibes" 
                  />
                </h3>
                <p>
                  <DynamicContent 
                    contentKey="home-vibes-description" 
                    fallback="From live performances to collaborative projects, Dale brings a unique sound experience infused with retro-futuristic beats, fluid tropical notes, and immersive visuals."
                    page="home"
                    section="vibes" 
                  />
                </p>
                <button 
                  onClick={() => window.location.href = '/immersive'} 
                  className="bg-purple-500 hover:bg-purple-700 text-white rounded"
                >
                  Explore
                </button>
              </SimpleOctagon>
            </div>



            {/* Journey Section */}
            <div className="w-full">
              <SimpleCircle className="w-full max-w-[350px] mx-auto">
                <h3>
                  <DynamicContent 
                    contentKey="home-journey-title" 
                    fallback="Explore The Journey"
                    page="home"
                    section="journey" 
                  />
                </h3>
                <p>
                  <DynamicContent 
                    contentKey="home-journey-description" 
                    fallback="💫 Join the cosmic voyage and become part of the ever-growing community of cosmic explorers and music lovers 💖"
                    page="home"
                    section="journey" 
                  />
                </p>
                <button 
                  onClick={() => window.location.href = '/cosmic-connectivity'} 
                  className="bg-teal-500 hover:bg-teal-700 text-white rounded"
                >
                  <DynamicContent 
                    contentKey="home-journey-button-cosmic" 
                    fallback="Cosmic Experience"
                    page="home"
                    section="journey" 
                  />
                </button>
              </SimpleCircle>
            </div>
          </div>

          {/* Additional Links Section */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <div className="w-[200px]">
              <SimpleInvertedTriangle className="w-full">
                <h3>New Music</h3>
                <p>Experience our latest sonic creations and explore new sound journeys.</p>
                <button 
                  onClick={() => window.location.href = '/music'} 
                  className="bg-green-500 hover:bg-green-700 text-white rounded"
                >
                  <DynamicContent 
                    contentKey="home-journey-button-music" 
                    fallback="New Music"
                    page="home"
                    section="journey" 
                  />
                </button>
              </SimpleInvertedTriangle>
            </div>
            
            <div className="w-[200px]">
              <SimpleInvertedTriangle className="w-full">
                <h3>Tour Dates</h3>
                <p>Find out when and where you can experience our cosmic performances live.</p>
                <button 
                  onClick={() => window.location.href = '/tour'} 
                  className="bg-amber-500 hover:bg-amber-700 text-white rounded"
                >
                  <DynamicContent 
                    contentKey="home-journey-button-tour" 
                    fallback="Tour Dates"
                    page="home"
                    section="journey" 
                  />
                </button>
              </SimpleInvertedTriangle>
            </div>
          </div>
        </main>
      </div>
    </SacredGeometryLayout>
  );
}