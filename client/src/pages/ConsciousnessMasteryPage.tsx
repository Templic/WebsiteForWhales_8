/**
 * Enhanced Consciousness Mastery Page
 * Complete manifestation engine and consciousness development platform
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  SimpleHexagon, 
  SimpleTriangle,
  SimpleCircle,
  SimpleOctagon
} from '../components/cosmic/SimpleGeometry';

interface ManifestationJourney {
  id: string;
  intention: string;
  energyLevel: number;
  progressPercentage: number;
  evidenceCount: number;
  nextOptimalTiming: string;
  status: 'creating' | 'manifesting' | 'evidence_gathering' | 'completed';
  createdAt: Date;
  targetDate: Date;
  whaleWisdomGuidance?: string;
}

interface ConsciousnessMetrics {
  currentLevel: number;
  manifestationEnergy: number;
  whaleWisdomIntegration: number;
  sacredGeometryResonance: number;
  breakthroughProbability: number;
  chakraAlignment: {
    root: number;
    sacral: number;
    solarPlexus: number;
    heart: number;
    throat: number;
    thirdEye: number;
    crown: number;
  };
}

export default function ConsciousnessMasteryPage() {
  const [consciousnessMetrics, setConsciousnessMetrics] = useState<ConsciousnessMetrics>({
    currentLevel: 78.6,
    manifestationEnergy: 85.2,
    whaleWisdomIntegration: 82.3,
    sacredGeometryResonance: 88.1,
    breakthroughProbability: 73,
    chakraAlignment: {
      root: 85,
      sacral: 78,
      solarPlexus: 82,
      heart: 91,
      throat: 76,
      thirdEye: 89,
      crown: 94
    }
  });

  const [activeManifestations, setActiveManifestations] = useState<ManifestationJourney[]>([
    {
      id: '1',
      intention: 'Enhanced Creative Expression & Artistic Flow',
      energyLevel: 92,
      progressPercentage: 67,
      evidenceCount: 12,
      nextOptimalTiming: 'Tomorrow 6:30 AM',
      status: 'manifesting',
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      whaleWisdomGuidance: 'Trust the currents of change, for they carry you toward your deepest purpose'
    },
    {
      id: '2',
      intention: 'Spiritual Community & Consciousness Connections',
      energyLevel: 76,
      progressPercentage: 43,
      evidenceCount: 7,
      nextOptimalTiming: 'Today 8:00 PM',
      status: 'creating',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      intention: 'Abundant Financial Flow & Prosperity',
      energyLevel: 88,
      progressPercentage: 89,
      evidenceCount: 23,
      nextOptimalTiming: 'Active Now',
      status: 'evidence_gathering',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [newIntention, setNewIntention] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const createNewManifestation = () => {
    if (!newIntention.trim()) return;

    const newManifestation: ManifestationJourney = {
      id: Date.now().toString(),
      intention: newIntention,
      energyLevel: Math.random() * 30 + 70,
      progressPercentage: 5,
      evidenceCount: 0,
      nextOptimalTiming: 'Within 24 hours',
      status: 'creating',
      createdAt: new Date(),
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    };

    setActiveManifestations(prev => [...prev, newManifestation]);
    setNewIntention('');
    setShowCreateForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'creating': return 'text-blue-400';
      case 'manifesting': return 'text-purple-400';
      case 'evidence_gathering': return 'text-green-400';
      case 'completed': return 'text-teal-400';
      default: return 'text-gray-400';
    }
  };

  const getChakraColor = (chakraName: string): string => {
    const colors = {
      root: 'bg-red-500',
      sacral: 'bg-orange-500',
      solarPlexus: 'bg-yellow-500',
      heart: 'bg-green-500',
      throat: 'bg-blue-500',
      thirdEye: 'bg-indigo-500',
      crown: 'bg-purple-500'
    };
    return colors[chakraName as keyof typeof colors] || 'bg-gray-500';
  };

  useEffect(() => {
    document.title = "Consciousness Mastery - Dale Loves Whales";
    
    // Simulate real-time consciousness updates
    const interval = setInterval(() => {
      setConsciousnessMetrics(prev => ({
        ...prev,
        manifestationEnergy: Math.min(100, Math.max(0, prev.manifestationEnergy + (Math.random() - 0.5) * 0.3)),
        breakthroughProbability: Math.min(100, Math.max(0, prev.breakthroughProbability + (Math.random() - 0.5) * 0.2))
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

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
          <SimpleHexagon className="w-full max-w-[600px] mx-auto mb-8" glowColor="rgba(147, 51, 234, 0.6)">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              ✨ Consciousness Mastery Portal 🧠
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transform your reality through quantum intention, whale wisdom integration, and consciousness evolution
            </p>
          </SimpleHexagon>
        </motion.div>

        {/* Consciousness Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <SimpleTriangle className="w-full max-w-[300px] mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {consciousnessMetrics.currentLevel.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-300">Consciousness Level</div>
                <div className="w-full bg-purple-900/30 rounded-full h-2 mt-3">
                  <div 
                    className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${consciousnessMetrics.currentLevel}%` }}
                  ></div>
                </div>
              </div>
            </SimpleTriangle>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SimpleCircle className="w-full max-w-[300px] mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {consciousnessMetrics.manifestationEnergy.toFixed(1)}%
                </div>
                <div className="text-sm text-pink-300">Manifestation Energy</div>
                <div className="w-full bg-pink-900/30 rounded-full h-2 mt-3">
                  <div 
                    className="bg-pink-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${consciousnessMetrics.manifestationEnergy}%` }}
                  ></div>
                </div>
              </div>
            </SimpleCircle>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <SimpleOctagon className="w-full max-w-[300px] mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {consciousnessMetrics.whaleWisdomIntegration.toFixed(0)}%
                </div>
                <div className="text-sm text-cyan-300">Whale Wisdom</div>
                <div className="w-full bg-cyan-900/30 rounded-full h-2 mt-3">
                  <div 
                    className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${consciousnessMetrics.whaleWisdomIntegration}%` }}
                  ></div>
                </div>
              </div>
            </SimpleOctagon>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SimpleTriangle className="w-full max-w-[300px] mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {consciousnessMetrics.breakthroughProbability}%
                </div>
                <div className="text-sm text-yellow-300">Breakthrough</div>
                <div className="w-full bg-yellow-900/30 rounded-full h-2 mt-3">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${consciousnessMetrics.breakthroughProbability}%` }}
                  ></div>
                </div>
              </div>
            </SimpleTriangle>
          </motion.div>
        </div>

        {/* Chakra Alignment System */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30">
            <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🧘‍♀️ Chakra Alignment Consciousness System
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {Object.entries(consciousnessMetrics.chakraAlignment).map(([chakra, value]) => (
                <motion.div 
                  key={chakra} 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-16 h-16 rounded-full ${getChakraColor(chakra)} mx-auto mb-2 flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold">{value}</span>
                  </div>
                  <p className="text-sm font-medium capitalize text-gray-300 mb-2">
                    {chakra.replace(/([A-Z])/g, ' $1')}
                  </p>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getChakraColor(chakra)}`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Active Manifestations */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-black/40 via-indigo-900/20 to-black/40 backdrop-blur-md rounded-xl p-8 border border-indigo-500/30">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                ✨ Active Manifestation Journeys
              </h3>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                + Create New Intention
              </button>
            </div>

            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  className="bg-purple-900/30 rounded-lg p-6 mb-6 border border-purple-500/30"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h4 className="text-xl font-semibold mb-4 text-purple-300">🌟 Create New Manifestation</h4>
                  <div className="space-y-4">
                    <textarea
                      value={newIntention}
                      onChange={(e) => setNewIntention(e.target.value)}
                      placeholder="Describe your intention with clarity and positive emotion..."
                      className="w-full p-4 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 resize-none h-24"
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={createNewManifestation}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-semibold transition-all duration-300"
                      >
                        ✨ Begin Manifestation Journey
                      </button>
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="px-6 py-3 border border-gray-500 rounded-lg hover:bg-gray-800/30 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              {activeManifestations.map((manifestation, index) => (
                <motion.div
                  key={manifestation.id}
                  className="bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-purple-900/30 rounded-lg p-6 border border-purple-500/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-purple-300 mb-2">
                        {manifestation.intention}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Energy Level</p>
                          <p className="font-semibold text-pink-400">{manifestation.energyLevel.toFixed(0)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Progress</p>
                          <p className="font-semibold text-purple-400">{manifestation.progressPercentage}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Evidence Count</p>
                          <p className="font-semibold text-green-400">{manifestation.evidenceCount} signs</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Next Optimal</p>
                          <p className="font-semibold text-cyan-400">{manifestation.nextOptimalTiming}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-center">
                      <div className={`text-lg font-bold ${getStatusColor(manifestation.status)} mb-1`}>
                        {manifestation.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400">Manifestation Progress</span>
                      <span className="text-sm font-medium text-purple-400">{manifestation.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-purple-900/30 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${manifestation.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {manifestation.whaleWisdomGuidance && (
                    <div className="bg-cyan-900/20 rounded-lg p-4 border-l-4 border-cyan-400">
                      <p className="text-cyan-300 italic">
                        🐋 Whale Wisdom: "{manifestation.whaleWisdomGuidance}"
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Consciousness Enhancement Tools */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-4">
              🌊 Consciousness Enhancement Tools
            </h3>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Integrate whale wisdom, sacred geometry, and cosmic consciousness for accelerated manifestation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/cosmic-connectivity">
              <motion.div
                className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-6 border border-cyan-500/30 cursor-pointer"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">🐋</div>
                  <h4 className="text-xl font-bold text-cyan-300 mb-3">Whale Wisdom Portal</h4>
                  <p className="text-gray-300 mb-4">
                    Connect with marine consciousness to enhance your manifestation energy
                  </p>
                  <div className="text-cyan-400 font-semibold">
                    Integration: {consciousnessMetrics.whaleWisdomIntegration.toFixed(0)}%
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link href="/resources/sacred-geometry">
              <motion.div
                className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30 cursor-pointer"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">🔯</div>
                  <h4 className="text-xl font-bold text-purple-300 mb-3">Sacred Geometry</h4>
                  <p className="text-gray-300 mb-4">
                    Align with divine patterns to amplify manifestation frequencies
                  </p>
                  <div className="text-purple-400 font-semibold">
                    Resonance: {consciousnessMetrics.sacredGeometryResonance.toFixed(0)}%
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link href="/consciousness-dashboard">
              <motion.div
                className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-500/30 cursor-pointer"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">📊</div>
                  <h4 className="text-xl font-bold text-indigo-300 mb-3">Analytics Dashboard</h4>
                  <p className="text-gray-300 mb-4">
                    Track consciousness growth and manifestation success patterns
                  </p>
                  <div className="text-indigo-400 font-semibold">
                    Breakthrough: {consciousnessMetrics.breakthroughProbability}%
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}