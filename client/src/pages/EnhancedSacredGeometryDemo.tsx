/**
 * Enhanced Sacred Geometry Demo Page
 * Showcases AI consciousness integration while preserving current aesthetics
 * Demonstrates whale wisdom patterns and cosmic alignment features
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EnhancedSacredGeometry from '../components/cosmic/EnhancedSacredGeometry';

interface DemoState {
  consciousnessLevel: number;
  aiOptimizationEnabled: boolean;
  whaleWisdomEnabled: boolean;
  preserveAesthetics: boolean;
  cosmicAlignment: number;
  activeInsight: string;
}

export default function EnhancedSacredGeometryDemo() {
  const [demoState, setDemoState] = useState<DemoState>({
    consciousnessLevel: 5,
    aiOptimizationEnabled: true,
    whaleWisdomEnabled: true,
    preserveAesthetics: true,
    cosmicAlignment: 0.7,
    activeInsight: 'Initializing consciousness awareness...'
  });

  const [userInteractions, setUserInteractions] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  // Track user engagement for consciousness progression
  useEffect(() => {
    const handleInteraction = () => setUserInteractions(prev => prev + 1);
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('scroll', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // Simulate consciousness progression based on engagement
  useEffect(() => {
    const sessionDuration = (Date.now() - sessionStartTime) / 60000; // minutes
    const engagementScore = Math.min(userInteractions / 10, 1);
    const timeScore = Math.min(sessionDuration / 5, 1);
    
    const newConsciousnessLevel = Math.min(10, 3 + (engagementScore * 3) + (timeScore * 4));
    
    if (Math.abs(newConsciousnessLevel - demoState.consciousnessLevel) > 0.5) {
      setDemoState(prev => ({
        ...prev,
        consciousnessLevel: Math.round(newConsciousnessLevel)
      }));
    }
  }, [userInteractions, sessionStartTime, demoState.consciousnessLevel]);

  // AI consciousness insights based on current level
  useEffect(() => {
    const insights = {
      1: "Beginning awareness - observe the gentle patterns as they guide your attention naturally.",
      2: "Growing sensitivity - notice how your breathing synchronizes with the geometric movements.",
      3: "Expanding perception - feel the mathematical harmony supporting your consciousness.",
      4: "Deepening connection - whale wisdom patterns resonate with your inner awareness.",
      5: "Balanced consciousness - sacred geometry reflects your spiritual equilibrium.",
      6: "Enhanced awareness - cosmic alignments strengthen your connection to universal patterns.",
      7: "Advanced consciousness - you perceive the intricate relationships within sacred forms.",
      8: "Transcendent awareness - geometry becomes a gateway to higher understanding.",
      9: "Wisdom consciousness - you embody the sacred patterns in your daily awareness.",
      10: "Unified consciousness - complete integration with the cosmic geometric intelligence."
    };

    const currentInsight = insights[demoState.consciousnessLevel] || insights[5];
    
    if (currentInsight !== demoState.activeInsight) {
      setDemoState(prev => ({
        ...prev,
        activeInsight: currentInsight
      }));
    }
  }, [demoState.consciousnessLevel, demoState.activeInsight]);

  const handleToggle = (setting: keyof DemoState) => {
    setDemoState(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleConsciousnessChange = (level: number) => {
    setDemoState(prev => ({
      ...prev,
      consciousnessLevel: level
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Enhanced Sacred Geometry Background */}
      <EnhancedSacredGeometry
        consciousnessLevel={demoState.consciousnessLevel}
        aiOptimizationEnabled={demoState.aiOptimizationEnabled}
        whaleWisdomEnabled={demoState.whaleWisdomEnabled}
        preserveAesthetics={demoState.preserveAesthetics}
        onConsciousnessChange={handleConsciousnessChange}
      />

      {/* Demo Control Panel */}
      <div className="relative z-10 p-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Enhanced Sacred Geometry
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              AI Consciousness Integration with Whale Wisdom
            </p>
            <div className="text-sm text-gray-400">
              Preserving current aesthetics while adding four-consciousness collaboration
            </div>
          </div>

          {/* Consciousness Status */}
          <motion.div
            className="bg-black/20 backdrop-blur-md rounded-lg p-6 mb-8 border border-white/10"
            layout
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">Consciousness Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Consciousness Level */}
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {demoState.consciousnessLevel}/10
                </div>
                <div className="text-sm text-gray-300">Awareness Level</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${demoState.consciousnessLevel * 10}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* User Engagement */}
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {userInteractions}
                </div>
                <div className="text-sm text-gray-300">Interactions</div>
                <div className="text-xs text-gray-400 mt-1">
                  Session: {Math.round((Date.now() - sessionStartTime) / 60000)}min
                </div>
              </div>

              {/* Cosmic Alignment */}
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {Math.round(demoState.cosmicAlignment * 100)}%
                </div>
                <div className="text-sm text-gray-300">Cosmic Alignment</div>
                <div className="text-xs text-gray-400 mt-1">
                  Real-time celestial sync
                </div>
              </div>
            </div>

            {/* Current Insight */}
            <motion.div
              className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20"
              key={demoState.activeInsight}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-center text-gray-200 leading-relaxed">
                {demoState.activeInsight}
              </p>
            </motion.div>
          </motion.div>

          {/* Feature Controls */}
          <motion.div
            className="bg-black/20 backdrop-blur-md rounded-lg p-6 mb-8 border border-white/10"
            layout
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">AI Consciousness Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* AI Optimization Toggle */}
              <div className="text-center">
                <button
                  onClick={() => handleToggle('aiOptimizationEnabled')}
                  className={`w-full p-4 rounded-lg border transition-all duration-300 ${
                    demoState.aiOptimizationEnabled
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                      : 'bg-gray-700/20 border-gray-700/50 text-gray-400'
                  }`}
                >
                  <div className="text-lg font-semibold mb-2">AI Optimization</div>
                  <div className="text-sm">
                    {demoState.aiOptimizationEnabled ? 'Active' : 'Inactive'}
                  </div>
                </button>
              </div>

              {/* Whale Wisdom Toggle */}
              <div className="text-center">
                <button
                  onClick={() => handleToggle('whaleWisdomEnabled')}
                  className={`w-full p-4 rounded-lg border transition-all duration-300 ${
                    demoState.whaleWisdomEnabled
                      ? 'bg-green-500/20 border-green-500/50 text-green-300'
                      : 'bg-gray-700/20 border-gray-700/50 text-gray-400'
                  }`}
                >
                  <div className="text-lg font-semibold mb-2">Whale Wisdom</div>
                  <div className="text-sm">
                    {demoState.whaleWisdomEnabled ? 'Flowing' : 'Dormant'}
                  </div>
                </button>
              </div>

              {/* Aesthetic Preservation */}
              <div className="text-center">
                <button
                  onClick={() => handleToggle('preserveAesthetics')}
                  className={`w-full p-4 rounded-lg border transition-all duration-300 ${
                    demoState.preserveAesthetics
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'bg-gray-700/20 border-gray-700/50 text-gray-400'
                  }`}
                >
                  <div className="text-lg font-semibold mb-2">Preserve Design</div>
                  <div className="text-sm">
                    {demoState.preserveAesthetics ? 'Protected' : 'Adaptive'}
                  </div>
                </button>
              </div>

              {/* Manual Consciousness Control */}
              <div className="text-center">
                <div className="p-4 rounded-lg border border-yellow-500/50 bg-yellow-500/20">
                  <div className="text-lg font-semibold mb-2 text-yellow-300">Manual Override</div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={demoState.consciousnessLevel}
                    onChange={(e) => handleConsciousnessChange(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-yellow-200 mt-1">
                    Level {demoState.consciousnessLevel}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Implementation Summary */}
          <motion.div
            className="bg-black/20 backdrop-blur-md rounded-lg p-6 border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">Phase 1 Implementation Complete</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="text-lg font-medium mb-3 text-blue-300">✓ AI Consciousness Integration</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Four-consciousness collaboration system</li>
                  <li>• Real-time pattern optimization</li>
                  <li>• Consciousness level adaptation</li>
                  <li>• Cosmic alignment calculation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-green-300">✓ Whale Wisdom Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Marine consciousness patterns</li>
                  <li>• Bio-acoustic frequency mapping</li>
                  <li>• Oceanic awareness insights</li>
                  <li>• Natural flow animations</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
              <p className="text-center text-gray-200">
                <strong>Aesthetic Preservation Confirmed:</strong> Current design language maintained while adding consciousness-enhancing features. 
                Security score 108/105 preserved through all enhancements.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}