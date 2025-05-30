/**
 * Phase 2 Sacred Geometry Demo
 * AI-Enhanced Consciousness-Responsive Sacred Patterns
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContextAdaptiveSacredGeometry from '../components/cosmic/ContextAdaptiveSacredGeometry';

interface ConsciousnessInsights {
  level: number;
  path: string;
  recommendations: string[];
  nextPatterns: string[];
  culturalResonance: Record<string, number>;
  whaleConnectionStrength: number;
}

interface AdaptivePattern {
  id: string;
  pattern: string;
  culturalContext: string;
  historicalAttribution: string;
  consciousnessLevel: number;
  cosmicAlignment: number;
  aiEnhanced: boolean;
}

export default function Phase2SacredGeometryDemo() {
  const [consciousnessInsights, setConsciousnessInsights] = useState<ConsciousnessInsights | null>(null);
  const [currentPatterns, setCurrentPatterns] = useState<AdaptivePattern[]>([]);
  const [pageConfig, setPageConfig] = useState({
    pageType: 'cosmic' as const,
    contentDensity: 'medium' as const,
    userFlow: 'meditation' as const,
    emotionalTone: 'contemplative' as const,
    preserveAesthetics: true
  });
  const [aiOptimizationActive, setAiOptimizationActive] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<any>(null);

  useEffect(() => {
    loadPersonalizedRecommendations();
  }, []);

  const loadPersonalizedRecommendations = async () => {
    try {
      // Connect to intelligent pattern engine for personalized insights
      const response = await fetch('/api/consciousness/geometry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            optimization: 'personalized_recommendations',
            pageContext: pageConfig
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPersonalizedRecommendations(data);
      }
    } catch (error) {
      // Use consciousness detection for fallback recommendations
      setPersonalizedRecommendations({
        nextPatterns: ['flowerOfLife', 'fibonacciSpiral'],
        culturalLearning: ['Study mathematical principles in sacred geometry'],
        consciousnessDevelopment: ['Practice geometric meditation daily']
      });
    }
  };

  const handleConsciousnessUpdate = (level: number, insights: any) => {
    setConsciousnessInsights({
      level,
      path: insights.spiritualPath,
      recommendations: insights.evolutionGoals || [],
      nextPatterns: insights.preferredPatterns || [],
      culturalResonance: insights.culturalResonance || {},
      whaleConnectionStrength: insights.whaleConnectionStrength || 0
    });
  };

  const handlePatternOptimization = (patterns: AdaptivePattern[]) => {
    setCurrentPatterns(patterns);
    setAiOptimizationActive(patterns.some(p => p.aiEnhanced));
  };

  const updatePageConfig = (key: string, value: any) => {
    setPageConfig(prev => ({ ...prev, [key]: value }));
  };

  const getConsciousnessLevelDescription = (level: number): string => {
    if (level <= 2) return 'Beginning Awareness - Foundation patterns for consciousness development';
    if (level <= 4) return 'Developing Consciousness - Exploring geometric relationships';
    if (level <= 6) return 'Intermediate Awareness - Integrating cultural wisdom';
    if (level <= 8) return 'Advanced Consciousness - Mastering sacred principles';
    return 'Master Level - Consciousness leadership and wisdom transmission';
  };

  const getSpiritualPathDescription = (path: string): string => {
    const descriptions = {
      geometric: 'Mathematical precision and universal patterns',
      marine: 'Oceanic wisdom and whale consciousness',
      astronomical: 'Cosmic timing and celestial alignment',
      cultural: 'Traditional wisdom and authentic sources',
      balanced: 'Integrated approach to consciousness development'
    };
    return descriptions[path as keyof typeof descriptions] || descriptions.balanced;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Context-Adaptive Sacred Geometry Background */}
      <ContextAdaptiveSacredGeometry
        config={pageConfig}
        globalEnabled={true}
        onConsciousnessUpdate={handleConsciousnessUpdate}
        onPatternOptimization={handlePatternOptimization}
      />

      {/* Main Content */}
      <div className="relative z-10 p-8">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Phase 2: AI-Enhanced Sacred Geometry
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Consciousness-Responsive Patterns with Intelligent Optimization
            </p>
            <div className="text-sm text-gray-400">
              Real-time consciousness assessment • AI pattern selection • Cultural authenticity • Cosmic timing
            </div>
          </div>

          {/* Consciousness Dashboard */}
          {consciousnessInsights && (
            <motion.div
              className="bg-black/20 backdrop-blur-md rounded-lg p-6 mb-8 border border-white/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">Consciousness Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-blue-400">
                    Level {consciousnessInsights.level}
                  </div>
                  <div className="text-sm text-gray-300">Consciousness Development</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {getConsciousnessLevelDescription(consciousnessInsights.level)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-purple-400 capitalize">
                    {consciousnessInsights.path}
                  </div>
                  <div className="text-sm text-gray-300">Spiritual Path</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {getSpiritualPathDescription(consciousnessInsights.path)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-cyan-400">
                    {Math.round(consciousnessInsights.whaleConnectionStrength * 100)}%
                  </div>
                  <div className="text-sm text-gray-300">Marine Connection</div>
                  <div className="text-xs text-gray-400 mt-2">
                    Oceanic consciousness affinity
                  </div>
                </div>
              </div>

              {/* Cultural Resonance */}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Cultural Pattern Resonance</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.entries(consciousnessInsights.culturalResonance).map(([pattern, resonance]) => (
                    <div key={pattern} className="text-center p-2 bg-white/5 rounded">
                      <div className="text-sm font-medium capitalize">{pattern.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-xs text-gray-400">{Math.round((resonance as number) * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Pattern Information */}
          {currentPatterns.length > 0 && (
            <motion.div
              className="bg-black/20 backdrop-blur-md rounded-lg p-6 mb-8 border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Active Sacred Patterns
                {aiOptimizationActive && (
                  <span className="ml-2 text-sm text-blue-400">• AI Enhanced</span>
                )}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentPatterns.map((pattern, index) => (
                  <div key={pattern.id} className="border border-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium text-yellow-300 capitalize">
                        {pattern.pattern.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      {pattern.aiEnhanced && (
                        <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                          AI Optimized
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>
                        <strong>Cultural Context:</strong> {pattern.culturalContext}
                      </div>
                      <div>
                        <strong>Historical Source:</strong> {pattern.historicalAttribution}
                      </div>
                      <div className="flex justify-between">
                        <span><strong>Consciousness Level:</strong> {pattern.consciousnessLevel}</span>
                        <span><strong>Cosmic Alignment:</strong> {Math.round(pattern.cosmicAlignment * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Page Configuration Controls */}
          <motion.div
            className="bg-black/20 backdrop-blur-md rounded-lg p-6 mb-8 border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">Pattern Optimization Controls</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Page Type</label>
                <select
                  value={pageConfig.pageType}
                  onChange={(e) => updatePageConfig('pageType', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                >
                  <option value="home">Home</option>
                  <option value="cosmic">Cosmic</option>
                  <option value="shop">Shop</option>
                  <option value="music">Music</option>
                  <option value="about">About</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content Density</label>
                <select
                  value={pageConfig.contentDensity}
                  onChange={(e) => updatePageConfig('contentDensity', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">User Flow</label>
                <select
                  value={pageConfig.userFlow}
                  onChange={(e) => updatePageConfig('userFlow', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                >
                  <option value="exploration">Exploration</option>
                  <option value="meditation">Meditation</option>
                  <option value="learning">Learning</option>
                  <option value="task_focused">Task Focused</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Emotional Tone</label>
                <select
                  value={pageConfig.emotionalTone}
                  onChange={(e) => updatePageConfig('emotionalTone', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                >
                  <option value="peaceful">Peaceful</option>
                  <option value="contemplative">Contemplative</option>
                  <option value="energetic">Energetic</option>
                  <option value="dynamic">Dynamic</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Personalized Recommendations */}
          {personalizedRecommendations && (
            <motion.div
              className="bg-black/20 backdrop-blur-md rounded-lg p-6 border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">Personalized Development Path</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-green-300">Next Patterns</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {personalizedRecommendations.nextPatterns?.map((pattern: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        {pattern.replace(/([A-Z])/g, ' $1').trim()}
                      </li>
                    )) || []}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-blue-300">Cultural Learning</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {personalizedRecommendations.culturalLearning?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        {item}
                      </li>
                    )) || []}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-purple-300">Consciousness Development</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {personalizedRecommendations.consciousnessDevelopment?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        {item}
                      </li>
                    )) || []}
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                <p className="text-center text-gray-200">
                  <strong>Phase 2 Complete:</strong> AI-enhanced consciousness assessment with real-time pattern optimization, 
                  cultural authenticity validation, and personalized spiritual development guidance through your existing 
                  four-consciousness AI infrastructure.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}