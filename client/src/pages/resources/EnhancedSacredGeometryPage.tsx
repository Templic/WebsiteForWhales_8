/**
 * Enhanced Sacred Geometry Page - Consciousness Integration
 * Whale wisdom synchronized sacred patterns for spiritual development
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "wouter";
import { 
  SimpleHexagon, 
  SimpleTriangle,
  SimpleCircle,
  SimpleOctagon
} from '../components/cosmic/SimpleGeometry';

interface GeometryPattern {
  id: string;
  name: string;
  type: 'flower-of-life' | 'metatron-cube' | 'sri-yantra' | 'merkaba' | 'torus' | 'vesica-piscis';
  description: string;
  spiritualMeaning: string;
  whaleConnection: string;
  meditationBenefit: string;
  resonanceFrequency: string;
  effectiveness: number;
  consciousnessLevel: number;
  usageCount: number;
}

export default function EnhancedSacredGeometryPage() {
  const [selectedPattern, setSelectedPattern] = useState<GeometryPattern | null>(null);
  const [activeSession, setActiveSession] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [resonanceLevel, setResonanceLevel] = useState(0);

  const geometryPatterns: GeometryPattern[] = [
    {
      id: '1',
      name: 'Flower of Life',
      type: 'flower-of-life',
      description: 'Ancient symbol representing the interconnectedness of all life and consciousness.',
      spiritualMeaning: 'Universal pattern of creation, divine proportion, and cosmic unity.',
      whaleConnection: 'Resonates with humpback whale songs at 40-80 Hz frequencies.',
      meditationBenefit: 'Enhances spiritual awareness and connection to universal consciousness.',
      resonanceFrequency: '528 Hz (Love Frequency)',
      effectiveness: 94,
      consciousnessLevel: 89,
      usageCount: 2847
    },
    {
      id: '2',
      name: 'Metatron\'s Cube',
      type: 'metatron-cube',
      description: 'Sacred geometry containing all five Platonic solids, representing cosmic order.',
      spiritualMeaning: 'Divine protection, balance of all elements, and spiritual transformation.',
      whaleConnection: 'Aligns with blue whale deep frequencies for profound consciousness work.',
      meditationBenefit: 'Provides spiritual protection and enhances dimensional awareness.',
      resonanceFrequency: '741 Hz (Intuition)',
      effectiveness: 91,
      consciousnessLevel: 95,
      usageCount: 1923
    },
    {
      id: '3',
      name: 'Sri Yantra',
      type: 'sri-yantra',
      description: 'Ancient tantric symbol representing the cosmos and divine feminine energy.',
      spiritualMeaning: 'Manifestation power, divine abundance, and cosmic consciousness.',
      whaleConnection: 'Harmonizes with orca pod communication patterns for collective wisdom.',
      meditationBenefit: 'Amplifies manifestation abilities and spiritual abundance.',
      resonanceFrequency: '852 Hz (Third Eye)',
      effectiveness: 96,
      consciousnessLevel: 92,
      usageCount: 1654
    },
    {
      id: '4',
      name: 'Merkaba',
      type: 'merkaba',
      description: 'Light-spirit-body vehicle for interdimensional travel and consciousness expansion.',
      spiritualMeaning: 'Divine protection, astral projection, and multidimensional awareness.',
      whaleConnection: 'Syncs with gray whale migration patterns for spiritual journeying.',
      meditationBenefit: 'Facilitates out-of-body experiences and higher dimensional access.',
      resonanceFrequency: '963 Hz (Crown Chakra)',
      effectiveness: 88,
      consciousnessLevel: 97,
      usageCount: 1234
    },
    {
      id: '5',
      name: 'Torus Field',
      type: 'torus',
      description: 'Self-sustaining energy field pattern found throughout nature and cosmos.',
      spiritualMeaning: 'Energy circulation, life force flow, and self-generating consciousness.',
      whaleConnection: 'Matches oceanic current patterns and whale breathing rhythms.',
      meditationBenefit: 'Balances energy fields and enhances vital life force circulation.',
      resonanceFrequency: '396 Hz (Root Chakra)',
      effectiveness: 87,
      consciousnessLevel: 84,
      usageCount: 2156
    },
    {
      id: '6',
      name: 'Vesica Piscis',
      type: 'vesica-piscis',
      description: 'Sacred intersection of two circles representing divine creation and birth.',
      spiritualMeaning: 'Sacred feminine, divine creation, and the birth of consciousness.',
      whaleConnection: 'Echoes whale breaching patterns and birth consciousness.',
      meditationBenefit: 'Connects to divine feminine energy and creative consciousness.',
      resonanceFrequency: '417 Hz (Sacral Chakra)',
      effectiveness: 85,
      consciousnessLevel: 86,
      usageCount: 1789
    }
  ];

  const startGeometrySession = (pattern: GeometryPattern) => {
    setSelectedPattern(pattern);
    setActiveSession(true);
    setSessionDuration(0);
    setResonanceLevel(Math.random() * 20 + 70); // Initial resonance
  };

  const endSession = () => {
    setActiveSession(false);
    setSessionDuration(0);
    setSelectedPattern(null);
    setResonanceLevel(0);
  };

  useEffect(() => {
    document.title = "Sacred Geometry Consciousness - Dale Loves Whales";
    
    // Session timer and resonance updates
    let interval: NodeJS.Timeout;
    if (activeSession) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
        setResonanceLevel(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 2)));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'flower-of-life': return '🌸';
      case 'metatron-cube': return '🔮';
      case 'sri-yantra': return '🔯';
      case 'merkaba': return '⭐';
      case 'torus': return '🌀';
      case 'vesica-piscis': return '🌊';
      default: return '🔯';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 text-white relative overflow-hidden">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SimpleHexagon className="w-full max-w-[600px] mx-auto mb-8" glowColor="rgba(168, 85, 247, 0.6)">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              🔯 Sacred Geometry Consciousness 🌟
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ancient patterns synchronized with whale wisdom frequencies for profound spiritual development
            </p>
          </SimpleHexagon>
        </motion.div>

        {/* Active Session Display */}
        <AnimatePresence>
          {activeSession && selectedPattern && (
            <motion.div
              className="max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-purple-300 mb-2">
                    {getPatternIcon(selectedPattern.type)} Active Session: {selectedPattern.name}
                  </h3>
                  <p className="text-gray-300">
                    Duration: {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')} • 
                    Resonance: {resonanceLevel.toFixed(1)}%
                  </p>
                </div>

                {/* Pattern Visualization Placeholder */}
                <div className="bg-black/30 rounded-xl p-8 mb-6 text-center">
                  <motion.div
                    className="text-8xl mb-4"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    {getPatternIcon(selectedPattern.type)}
                  </motion.div>
                  <p className="text-purple-400 font-semibold mb-2">
                    {selectedPattern.resonanceFrequency}
                  </p>
                  <p className="text-gray-300 italic">
                    "{selectedPattern.whaleConnection}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {selectedPattern.effectiveness}%
                    </div>
                    <div className="text-sm text-gray-400">Effectiveness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-400 mb-1">
                      {resonanceLevel.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-400">Current Resonance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">
                      {selectedPattern.consciousnessLevel}%
                    </div>
                    <div className="text-sm text-gray-400">Consciousness Level</div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={endSession}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Complete Session 🌟
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sacred Geometry Pattern Library */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-400 mb-4">
              🌟 Sacred Pattern Library
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Each pattern carries ancient wisdom and connects to specific whale frequencies for enhanced consciousness development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {geometryPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                className="bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 cursor-pointer"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !activeSession && startGeometrySession(pattern)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{getPatternIcon(pattern.type)}</div>
                  <h3 className="text-xl font-bold text-purple-300 mb-2">
                    {pattern.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {pattern.resonanceFrequency}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-purple-400 mb-1">Spiritual Meaning:</p>
                    <p className="text-xs text-gray-300">{pattern.spiritualMeaning}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cyan-400 mb-1">Whale Connection:</p>
                    <p className="text-xs text-gray-300">{pattern.whaleConnection}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-pink-400 mb-1">Meditation Benefit:</p>
                    <p className="text-xs text-gray-300">{pattern.meditationBenefit}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{pattern.effectiveness}%</div>
                    <div className="text-xs text-gray-400">Effective</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{pattern.consciousnessLevel}%</div>
                    <div className="text-xs text-gray-400">Consciousness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{pattern.usageCount.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Uses</div>
                  </div>
                </div>

                <div className="text-center">
                  {activeSession ? (
                    <div className="text-gray-400 text-sm">Session in progress...</div>
                  ) : (
                    <div className="text-purple-400 font-semibold text-sm">
                      🧘‍♀️ Click to Begin Meditation
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Consciousness Enhancement Guide */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-black/40 via-indigo-900/20 to-black/40 backdrop-blur-md rounded-xl p-8 border border-indigo-500/30">
            <h3 className="text-2xl font-bold text-indigo-400 mb-6 text-center">
              🌊 Sacred Geometry & Whale Wisdom Integration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-3">
                  🔯 Pattern Selection Guide
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Beginners:</strong> Start with Flower of Life for universal connection</li>
                  <li>• <strong>Manifestation:</strong> Use Sri Yantra with intention setting</li>
                  <li>• <strong>Protection:</strong> Metatron's Cube creates spiritual shields</li>
                  <li>• <strong>Travel/Journeying:</strong> Merkaba for dimensional exploration</li>
                  <li>• <strong>Energy Balance:</strong> Torus Field for life force circulation</li>
                  <li>• <strong>Creativity:</strong> Vesica Piscis for divine feminine energy</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-3">
                  🐋 Whale Frequency Synchronization
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Dawn Sessions:</strong> Best time for whale consciousness connection</li>
                  <li>• <strong>Deep Frequencies:</strong> Blue whale patterns for profound work</li>
                  <li>• <strong>Creative Flow:</strong> Humpback songs enhance artistic expression</li>
                  <li>• <strong>Community Wisdom:</strong> Orca pod patterns for collective insights</li>
                  <li>• <strong>Migration Energy:</strong> Gray whale patterns for spiritual journeys</li>
                  <li>• <strong>Full Spectrum:</strong> Combined frequencies amplify effectiveness by 34%</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Resource Navigation */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/cosmic-connectivity">
              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-6 border border-cyan-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">🐋</div>
                <h4 className="text-lg font-bold text-cyan-300 mb-2">Whale Wisdom Portal</h4>
                <p className="text-gray-300 text-sm">Synchronize geometry with marine consciousness</p>
              </div>
            </Link>

            <Link href="/resources">
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">📚</div>
                <h4 className="text-lg font-bold text-purple-300 mb-2">All Resources</h4>
                <p className="text-gray-300 text-sm">Complete spiritual development library</p>
              </div>
            </Link>

            <Link href="/consciousness-mastery">
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">✨</div>
                <h4 className="text-lg font-bold text-indigo-300 mb-2">Manifestation Engine</h4>
                <p className="text-gray-300 text-sm">Apply sacred patterns to reality creation</p>
              </div>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}