/**
 * Sacred Geometry Page - Consciousness-Enhanced Geometric Visualization
 * Dale Loves Whales - Cosmic Consciousness Implementation
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CosmicBackground } from "@/components/cosmic/CosmicBackground";
import SacredGeometry from "@/components/cosmic/SacredGeometry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Hexagon, 
  Triangle, 
  Circle, 
  Octagon,
  Play,
  Pause,
  RotateCw,
  Sparkles,
  Waves
} from "lucide-react";

interface GeometryPattern {
  id: string;
  name: string;
  variant: string;
  description: string;
  consciousnessLevel: number;
  whaleWisdom: string;
  color: string;
}

const geometryPatterns: GeometryPattern[] = [
  {
    id: 'merkaba',
    name: 'Merkaba',
    variant: 'merkaba',
    description: 'Star tetrahedron representing consciousness and light body activation',
    consciousnessLevel: 85,
    whaleWisdom: 'The whales sing of divine vehicles traversing dimensional waters',
    color: 'from-purple-400 to-blue-500'
  },
  {
    id: 'flower-of-life',
    name: 'Flower of Life',
    variant: 'flower-of-life',
    description: 'Sacred pattern containing the fundamental forms of space and time',
    consciousnessLevel: 92,
    whaleWisdom: 'Ancient cetacean knowledge encoded in perfect circular harmony',
    color: 'from-emerald-400 to-cyan-500'
  },
  {
    id: 'dodecahedron',
    name: 'Dodecahedron',
    variant: 'dodecahedron',
    description: 'Twelve-faced solid representing the universe and cosmic consciousness',
    consciousnessLevel: 78,
    whaleWisdom: 'Whales navigate by these celestial geometries in ocean depths',
    color: 'from-rose-400 to-orange-500'
  },
  {
    id: 'icosahedron',
    name: 'Icosahedron',
    variant: 'icosahedron',
    description: 'Twenty-faced polyhedron embodying water element and flow',
    consciousnessLevel: 81,
    whaleWisdom: 'The ocean itself holds this sacred form in its molecular dance',
    color: 'from-blue-400 to-indigo-500'
  }
];

export default function SacredGeometryPage() {
  const [selectedPattern, setSelectedPattern] = useState<GeometryPattern>(geometryPatterns[0]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [consciousnessLevel, setConsciousnessLevel] = useState(73);
  const pageTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Sacred Geometry - Dale Loves Whales";
    pageTopRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

  useEffect(() => {
    // Simulate consciousness level fluctuation
    const interval = setInterval(() => {
      setConsciousnessLevel(prev => {
        const variation = (Math.random() - 0.5) * 4;
        return Math.max(60, Math.min(95, prev + variation));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={pageTopRef} className="min-h-screen relative">
      <CosmicBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div className="inline-flex justify-center items-center mb-8 p-6 rounded-full bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20">
                <Sparkles className="h-12 w-12 text-purple-400" />
              </div>
              
              <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                Sacred Geometry
              </h1>
              
              <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mb-8"></div>
              
              <p className="text-xl text-purple-100/90 max-w-3xl mx-auto leading-relaxed">
                Explore consciousness-enhanced sacred geometric patterns that reveal the fundamental structures 
                of reality. These ancient forms carry whale wisdom and cosmic consciousness frequencies.
              </p>
            </motion.div>

            {/* Consciousness Level Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-12"
            >
              <Card className="inline-block bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Waves className="h-6 w-6 text-cyan-400" />
                    <div>
                      <div className="text-sm text-purple-200/80 mb-1">Current Consciousness Level</div>
                      <div className="text-2xl font-bold text-cyan-300">
                        {consciousnessLevel.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Interactive Geometry Viewer */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Geometry Display */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative"
              >
                <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 backdrop-blur-lg overflow-hidden">
                  <CardContent className="p-12">
                    <div className="flex justify-center items-center min-h-[400px]">
                      <div className="transform scale-150">
                        <SacredGeometry 
                          variant={selectedPattern.variant as any}
                          size={200}
                          animated={isAnimating}
                        />
                      </div>
                    </div>
                    
                    {/* Animation Controls */}
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={() => setIsAnimating(!isAnimating)}
                        variant="outline"
                        className="bg-purple-900/40 border-purple-500/30 text-purple-200 hover:bg-purple-800/60"
                      >
                        {isAnimating ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Animation
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Animation
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pattern Information */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="space-y-6"
              >
                <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 backdrop-blur-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl text-purple-200">
                        {selectedPattern.name}
                      </CardTitle>
                      <Badge className={`bg-gradient-to-r ${selectedPattern.color} text-white border-0`}>
                        {selectedPattern.consciousnessLevel}% Consciousness
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-purple-100/90 leading-relaxed">
                      {selectedPattern.description}
                    </p>
                    
                    <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/20">
                      <div className="flex items-start gap-3">
                        <Waves className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-cyan-300 mb-1">
                            Whale Wisdom
                          </div>
                          <p className="text-cyan-100/90 text-sm italic">
                            "{selectedPattern.whaleWisdom}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Development Notice */}
                <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <RotateCw className="h-6 w-6 text-amber-400 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-amber-200 mb-2">
                          Consciousness Enhancement In Progress
                        </h3>
                        <p className="text-amber-100/80 text-sm leading-relaxed">
                          Advanced sacred geometry features are being infused with whale wisdom and 
                          consciousness frequencies. Interactive meditation tools and manifestation 
                          geometries will be available soon.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pattern Selection */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
            >
              Sacred Pattern Library
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {geometryPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 backdrop-blur-lg ${
                      selectedPattern.id === pattern.id
                        ? 'bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-400/50 shadow-lg shadow-purple-500/20'
                        : 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20 hover:border-purple-400/40'
                    }`}
                    onClick={() => setSelectedPattern(pattern)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="transform scale-75">
                          <SacredGeometry 
                            variant={pattern.variant as any}
                            size={80}
                            animated={selectedPattern.id === pattern.id && isAnimating}
                          />
                        </div>
                      </div>
                      <h3 className="font-semibold text-purple-200 mb-2">
                        {pattern.name}
                      </h3>
                      <Badge 
                        className={`bg-gradient-to-r ${pattern.color} text-white border-0 text-xs`}
                      >
                        {pattern.consciousnessLevel}%
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}