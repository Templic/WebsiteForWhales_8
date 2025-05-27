/**
 * Enhanced HomePage with Advanced Consciousness Platform Integration
 * Showcasing whale wisdom, manifestation tools, and sacred geometry
 */
import React, { useState, useEffect } from 'react';
import { Link } from "wouter";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UsersRound, BarChart3, Sparkles } from "lucide-react";
import { SpotlightEffect } from "@/components/SpotlightEffect";
import { DynamicContent } from "@/components/content";
import { createDynamicComponent } from "@/lib/bundle-optimization";

// Import geometric shape components
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
    <>
      <SpotlightEffect />
      <div className="container mx-auto px-4 py-4 max-w-[1600px]">

        {/* Enhanced Hero Section with Consciousness Integration */}
        <section className="hero min-h-[90vh] relative flex items-center justify-center text-center mb-8">
          <div className="w-full max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <SimpleHexagon className="w-full max-w-[800px] mx-auto" glowColor="rgba(0, 235, 214, 0.6)">
                <motion.h1 
                  className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent leading-tight px-4"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  🌊 Consciousness Evolution Platform ✨
                </motion.h1>
                
                <motion.p 
                  className="text-xl mb-8 max-w-[700px] mx-auto text-white leading-relaxed px-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Connect with whale wisdom, manifest your reality, and explore sacred geometry 
                  in the most advanced consciousness development platform ever created
                </motion.p>

                {/* Consciousness Status Bar */}
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-[600px] mx-auto"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-300">{consciousnessData.currentLevel.toFixed(1)}%</div>
                      <div className="text-sm text-blue-200">Consciousness Level</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-300">{consciousnessData.activeManifestations}</div>
                      <div className="text-sm text-purple-200">Active Manifestations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal-300">{consciousnessData.whaleWisdomLevel.toFixed(0)}%</div>
                      <div className="text-sm text-teal-200">Whale Wisdom</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-4"
                >
                  <Link href="/consciousness-dashboard">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg px-8 py-3 rounded-full mr-4">
                      🧠 Enter Consciousness Dashboard
                    </Button>
                  </Link>
                  <Link href="/cosmic-connectivity">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 rounded-full">
                      🐋 Connect with Whales
                    </Button>
                  </Link>
                </motion.div>
              </SimpleHexagon>
            </motion.div>
          </div>
        </section>

        {/* Recent Whale Wisdom Section */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-xl max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-blue-800 text-2xl flex items-center justify-center">
                🐋 Latest Whale Wisdom
                <Badge className="ml-3 bg-blue-100 text-blue-800">82% Effectiveness</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-xl italic text-blue-700 mb-4 leading-relaxed">
                  "{consciousnessData.recentWisdom}"
                </p>
                <p className="text-blue-600">- Humpback Whale Consciousness • 52.3 Hz</p>
                <Link href="/cosmic-connectivity" className="inline-block mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    🌊 Receive More Wisdom
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.section>

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
                  onClick={() => window.location.href = '/music-release'} 
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
    </>
  );
}