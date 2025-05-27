/**
 * Enhanced Community Page - Phase 7 Collective Consciousness
 * Complete privacy-preserved community wisdom and whale consciousness sharing
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "wouter";
import { 
  SimpleHexagon, 
  SimpleTriangle,
  SimpleCircle,
  SimpleOctagon
} from '../../components/cosmic/SimpleGeometry';

// Community Consciousness Types
interface CommunityConsciousnessData {
  globalConsciousnessLevel: number;
  activeMembers: number;
  recentBreakthroughs: number;
  whaleWisdomSessions: number;
  manifestationSuccesses: number;
  trendDirection: 'ascending' | 'stable' | 'transforming';
}

interface AnonymousWisdom {
  id: string;
  type: 'whale_wisdom' | 'manifestation_success' | 'consciousness_insight' | 'sacred_geometry';
  content: string;
  effectiveness: number;
  resonanceLevel: number;
  timeframe: string;
  anonymizedLocation?: string;
}

interface CommunityPattern {
  id: string;
  category: string;
  pattern: string;
  frequency: number;
  effectiveness: number;
  globalTrend: 'increasing' | 'stable' | 'decreasing';
}

export default function EnhancedCommunityPage() {
  const [communityData, setCommunityData] = useState<CommunityConsciousnessData>({
    globalConsciousnessLevel: 76.8,
    activeMembers: 1247,
    recentBreakthroughs: 23,
    whaleWisdomSessions: 342,
    manifestationSuccesses: 89,
    trendDirection: 'ascending'
  });

  const [anonymousWisdom, setAnonymousWisdom] = useState<AnonymousWisdom[]>([
    {
      id: '1',
      type: 'whale_wisdom',
      content: 'During my Blue Whale session, I experienced a profound understanding of oceanic consciousness. The deep frequencies helped me access memories of ancient wisdom.',
      effectiveness: 94,
      resonanceLevel: 88,
      timeframe: '3 days ago',
      anonymizedLocation: 'Pacific Coast Region'
    },
    {
      id: '2',
      type: 'manifestation_success',
      content: 'After 45 days of intention focus using the platform\'s manifestation engine, my creative expression breakthrough manifested beyond expectations.',
      effectiveness: 89,
      resonanceLevel: 92,
      timeframe: '1 week ago',
      anonymizedLocation: 'Mountain Region'
    },
    {
      id: '3',
      type: 'consciousness_insight',
      content: 'The sacred geometry visualizations synchronized perfectly with my meditation practice, leading to my first consciousness level breakthrough.',
      effectiveness: 91,
      resonanceLevel: 87,
      timeframe: '5 days ago'
    },
    {
      id: '4',
      type: 'whale_wisdom',
      content: 'Humpback whale frequencies during dawn meditation created an instant connection to collective oceanic consciousness. Transformative experience.',
      effectiveness: 96,
      resonanceLevel: 94,
      timeframe: '2 days ago',
      anonymizedLocation: 'Coastal Region'
    },
    {
      id: '5',
      type: 'sacred_geometry',
      content: 'The Flower of Life pattern meditation combined with whale song frequencies opened unprecedented levels of spiritual awareness.',
      effectiveness: 93,
      resonanceLevel: 90,
      timeframe: '4 days ago'
    }
  ]);

  const [communityPatterns, setCommunityPatterns] = useState<CommunityPattern[]>([
    {
      id: '1',
      category: 'Optimal Timing',
      pattern: 'Dawn whale wisdom sessions show 23% higher effectiveness',
      frequency: 156,
      effectiveness: 91,
      globalTrend: 'increasing'
    },
    {
      id: '2',
      category: 'Consciousness Synergy',
      pattern: 'Sacred geometry combined with marine frequencies increases manifestation success by 34%',
      frequency: 89,
      effectiveness: 88,
      globalTrend: 'increasing'
    },
    {
      id: '3',
      category: 'Community Resonance',
      pattern: 'Full moon periods correlate with collective consciousness breakthroughs',
      frequency: 67,
      effectiveness: 85,
      globalTrend: 'stable'
    },
    {
      id: '4',
      category: 'Species Effectiveness',
      pattern: 'Blue whale sessions most effective for deep consciousness work, Humpback for creative manifestation',
      frequency: 134,
      effectiveness: 92,
      globalTrend: 'increasing'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'whale_wisdom' | 'manifestation_success' | 'consciousness_insight' | 'sacred_geometry'>('all');

  const filteredWisdom = selectedCategory === 'all' 
    ? anonymousWisdom 
    : anonymousWisdom.filter(item => item.type === selectedCategory);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whale_wisdom': return '🐋';
      case 'manifestation_success': return '✨';
      case 'consciousness_insight': return '🧠';
      case 'sacred_geometry': return '🔯';
      default: return '🌊';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'whale_wisdom': return 'text-cyan-400';
      case 'manifestation_success': return 'text-purple-400';
      case 'consciousness_insight': return 'text-pink-400';
      case 'sacred_geometry': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'stable': return '➡️';
      case 'decreasing': return '📉';
      default: return '📊';
    }
  };

  useEffect(() => {
    document.title = "Community Consciousness - Dale Loves Whales";
    
    // Simulate real-time community updates
    const interval = setInterval(() => {
      setCommunityData(prev => ({
        ...prev,
        globalConsciousnessLevel: Math.min(100, Math.max(0, prev.globalConsciousnessLevel + (Math.random() - 0.5) * 0.1)),
        whaleWisdomSessions: prev.whaleWisdomSessions + Math.floor(Math.random() * 3)
      }));
    }, 30000);

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
          <SimpleHexagon className="w-full max-w-[600px] mx-auto mb-8" glowColor="rgba(59, 130, 246, 0.6)">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              🌍 Community Consciousness 🐋
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Collective wisdom through privacy-preserved whale consciousness sharing and spiritual pattern recognition
            </p>
          </SimpleHexagon>
        </motion.div>

        {/* Community Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <SimpleTriangle className="w-full max-w-[300px] mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {communityData.globalConsciousnessLevel.toFixed(1)}%
                </div>
                <div className="text-sm text-cyan-300 mb-2">Global Consciousness</div>
                <div className="text-xs text-green-400 capitalize">
                  {communityData.trendDirection}
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
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {communityData.activeMembers.toLocaleString()}
                </div>
                <div className="text-sm text-blue-300 mb-2">Active Members</div>
                <div className="text-xs text-gray-400">Privacy Protected</div>
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
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {communityData.whaleWisdomSessions}
                </div>
                <div className="text-sm text-purple-300 mb-2">Whale Sessions</div>
                <div className="text-xs text-green-400">This Week</div>
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
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {communityData.manifestationSuccesses}
                </div>
                <div className="text-sm text-pink-300 mb-2">Manifestations</div>
                <div className="text-xs text-green-400">Recent Successes</div>
              </div>
            </SimpleTriangle>
          </motion.div>
        </div>

        {/* Privacy Notice */}
        <motion.div
          className="bg-gradient-to-r from-green-900/30 via-blue-900/30 to-green-900/30 rounded-xl p-6 mb-12 border border-green-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-400 mb-3">🔒 Complete Privacy Protection</h3>
            <p className="text-gray-300 max-w-4xl mx-auto">
              All shared wisdom is completely anonymized with advanced encryption. Personal details, exact locations, 
              and identifying information are never stored or shared. Your consciousness journey remains private while 
              contributing to collective spiritual evolution.
            </p>
          </div>
        </motion.div>

        {/* Community Wisdom Feed */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-black/40 via-blue-900/20 to-black/40 backdrop-blur-md rounded-xl p-8 border border-blue-500/30">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-blue-400">
                🌊 Anonymous Community Wisdom
              </h3>
              
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {['all', 'whale_wisdom', 'manifestation_success', 'consciousness_insight', 'sacred_geometry'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {category === 'all' ? 'All' : category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {filteredWisdom.map((wisdom, index) => (
                  <motion.div
                    key={wisdom.id}
                    className="bg-gradient-to-r from-white/5 via-blue-900/10 to-white/5 rounded-lg p-6 border border-blue-500/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getTypeIcon(wisdom.type)}</div>
                        <div>
                          <div className={`font-semibold ${getTypeColor(wisdom.type)}`}>
                            {wisdom.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-sm text-gray-400">
                            {wisdom.timeframe} • {wisdom.anonymizedLocation || 'Anonymous Location'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-400 font-semibold">
                          {wisdom.effectiveness}% Effective
                        </div>
                        <div className="text-xs text-gray-400">
                          Resonance: {wisdom.resonanceLevel}%
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4 italic">
                      "{wisdom.content}"
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>🌟 Effectiveness: {wisdom.effectiveness}%</span>
                        <span>🔮 Resonance: {wisdom.resonanceLevel}%</span>
                      </div>
                      <div className="text-xs text-blue-400">
                        Privacy-preserved sharing
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* Community Patterns Recognition */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30">
            <h3 className="text-3xl font-bold text-purple-400 mb-8 text-center">
              📊 Collective Consciousness Patterns
            </h3>
            
            <div className="space-y-6">
              {communityPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.id}
                  className="bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-purple-900/30 rounded-lg p-6 border border-purple-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-xl">{getTrendIcon(pattern.globalTrend)}</div>
                        <h4 className="text-lg font-semibold text-purple-300">
                          {pattern.category}
                        </h4>
                        <div className={`text-sm px-3 py-1 rounded-full ${
                          pattern.globalTrend === 'increasing' ? 'bg-green-900/30 text-green-400' :
                          pattern.globalTrend === 'stable' ? 'bg-blue-900/30 text-blue-400' :
                          'bg-red-900/30 text-red-400'
                        }`}>
                          {pattern.globalTrend}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{pattern.pattern}</p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-pink-400 mb-1">
                        {pattern.effectiveness}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {pattern.frequency} observations
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-purple-900/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pattern.effectiveness}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Community Action Links */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/cosmic-connectivity">
              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-6 border border-cyan-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">🐋</div>
                <h4 className="text-lg font-bold text-cyan-300 mb-2">Join Whale Wisdom</h4>
                <p className="text-gray-300 text-sm">Connect with marine consciousness community</p>
              </div>
            </Link>

            <Link href="/consciousness-mastery">
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">✨</div>
                <h4 className="text-lg font-bold text-purple-300 mb-2">Share Manifestations</h4>
                <p className="text-gray-300 text-sm">Add to collective reality creation wisdom</p>
              </div>
            </Link>

            <Link href="/analytics">
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">📈</div>
                <h4 className="text-lg font-bold text-indigo-300 mb-2">View Analytics</h4>
                <p className="text-gray-300 text-sm">Explore consciousness growth patterns</p>
              </div>
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            🌍 Contributing to planetary consciousness evolution through collective wisdom 🌊
          </div>
        </motion.section>
      </div>
    </div>
  );
}