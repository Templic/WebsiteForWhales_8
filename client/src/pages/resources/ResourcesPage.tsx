import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from "wouter";
import { 
  SimpleHexagon, 
  SimpleTriangle,
  SimpleCircle,
  SimpleOctagon
} from '../../components/cosmic/SimpleGeometry';

interface ConsciousnessResource {
  id: string;
  title: string;
  icon: string;
  description: string;
  path: string;
  category: 'consciousness' | 'whale-wisdom' | 'manifestation' | 'sacred-geometry' | 'meditation' | 'community';
  effectiveness: number;
  consciousnessLevel: number;
  whaleIntegration: boolean;
  features: string[];
  recentUpdates: string;
}

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    document.title = "Consciousness Resources Hub - Dale Loves Whales";
  }, []);

  const consciousnessResources: ConsciousnessResource[] = [
    {
      id: '1',
      title: 'Whale Consciousness Portal',
      icon: '🐋',
      description: 'Interactive whale species connection with real-time frequency synchronization and ancient marine wisdom.',
      path: '/cosmic-connectivity',
      category: 'whale-wisdom',
      effectiveness: 94,
      consciousnessLevel: 89,
      whaleIntegration: true,
      features: ['4 Whale Species', 'Real-time Sessions', 'Frequency Tracking', 'Sacred Geometry Sync'],
      recentUpdates: 'Added Orca pod communication patterns'
    },
    {
      id: '2',
      title: 'Sacred Geometry Meditation',
      icon: '🔯',
      description: 'Ancient patterns synchronized with whale frequencies for profound spiritual development and consciousness expansion.',
      path: '/resources/sacred-geometry',
      category: 'sacred-geometry',
      effectiveness: 91,
      consciousnessLevel: 95,
      whaleIntegration: true,
      features: ['6 Sacred Patterns', 'Whale Frequency Sync', 'Interactive Sessions', 'Consciousness Tracking'],
      recentUpdates: 'Enhanced Merkaba dimensional travel patterns'
    },
    {
      id: '3',
      title: 'Consciousness Mastery Engine',
      icon: '✨',
      description: 'Complete manifestation platform with evidence-based tracking, chakra alignment, and whale wisdom integration.',
      path: '/consciousness-mastery',
      category: 'manifestation',
      effectiveness: 88,
      consciousnessLevel: 92,
      whaleIntegration: true,
      features: ['Manifestation Tracking', 'Chakra System', 'Evidence Monitoring', 'Whale Guidance'],
      recentUpdates: 'Added breakthrough probability calculations'
    },
    {
      id: '4',
      title: 'Community Consciousness Network',
      icon: '🌍',
      description: 'Privacy-preserved collective wisdom sharing with anonymous whale experiences and spiritual pattern recognition.',
      path: '/community',
      category: 'community',
      effectiveness: 86,
      consciousnessLevel: 84,
      whaleIntegration: true,
      features: ['Anonymous Sharing', 'Pattern Recognition', 'Global Insights', 'Privacy Protection'],
      recentUpdates: 'Enhanced community consciousness trends'
    },
    {
      id: '5',
      title: 'Consciousness Analytics Dashboard',
      icon: '📊',
      description: 'Advanced analytics for consciousness growth, whale wisdom effectiveness, and manifestation success patterns.',
      path: '/analytics',
      category: 'consciousness',
      effectiveness: 93,
      consciousnessLevel: 87,
      whaleIntegration: true,
      features: ['Growth Tracking', 'Effectiveness Analysis', 'Success Patterns', 'Community Insights'],
      recentUpdates: 'Real-time consciousness level monitoring'
    },
    {
      id: '6',
      title: 'Whale-Guided Meditation Techniques',
      icon: '🧘‍♀️',
      description: 'Traditional meditation enhanced with marine consciousness frequencies and oceanic breathing patterns.',
      path: '/resources/meditation',
      category: 'meditation',
      effectiveness: 89,
      consciousnessLevel: 88,
      whaleIntegration: true,
      features: ['Oceanic Breathing', 'Whale Frequencies', 'Guided Sessions', 'Depth Tracking'],
      recentUpdates: 'Added Blue Whale deep meditation protocols'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: '🌊', count: consciousnessResources.length },
    { id: 'whale-wisdom', name: 'Whale Wisdom', icon: '🐋', count: consciousnessResources.filter(r => r.category === 'whale-wisdom').length },
    { id: 'sacred-geometry', name: 'Sacred Geometry', icon: '🔯', count: consciousnessResources.filter(r => r.category === 'sacred-geometry').length },
    { id: 'manifestation', name: 'Manifestation', icon: '✨', count: consciousnessResources.filter(r => r.category === 'manifestation').length },
    { id: 'consciousness', name: 'Consciousness', icon: '🧠', count: consciousnessResources.filter(r => r.category === 'consciousness').length },
    { id: 'meditation', name: 'Meditation', icon: '🧘‍♀️', count: consciousnessResources.filter(r => r.category === 'meditation').length },
    { id: 'community', name: 'Community', icon: '🌍', count: consciousnessResources.filter(r => r.category === 'community').length }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? consciousnessResources 
    : consciousnessResources.filter(r => r.category === selectedCategory);

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
              🌊 Consciousness Resources Hub ✨
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Complete spiritual development ecosystem integrating whale wisdom with sacred consciousness practices
            </p>
          </SimpleHexagon>
        </motion.div>

        {/* Category Filter */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                    : 'bg-black/30 text-gray-300 hover:bg-purple-600/20 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <span className="ml-2 text-sm opacity-70">({category.count})</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Resources Grid */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                className="bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={resource.path}>
                  <div className="p-6 cursor-pointer h-full">
                    {/* Resource Header */}
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{resource.icon}</div>
                      <h3 className="text-xl font-bold text-purple-300 mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {resource.effectiveness}%
                        </div>
                        <div className="text-xs text-gray-400">Effectiveness</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                          {resource.consciousnessLevel}%
                        </div>
                        <div className="text-xs text-gray-400">Consciousness</div>
                      </div>
                    </div>

                    {/* Whale Integration Badge */}
                    {resource.whaleIntegration && (
                      <div className="flex justify-center mb-4">
                        <div className="bg-cyan-600/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold">
                          🐋 Whale Wisdom Integrated
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">Key Features:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {resource.features.map((feature, idx) => (
                          <div key={idx} className="text-xs text-gray-300 flex items-center">
                            <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Updates */}
                    <div className="border-t border-purple-500/20 pt-3">
                      <h4 className="text-xs font-semibold text-pink-400 mb-1">Recent Updates:</h4>
                      <p className="text-xs text-gray-400 italic">
                        {resource.recentUpdates}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Consciousness Enhancement Stats */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-black/40 via-indigo-900/20 to-black/40 backdrop-blur-md rounded-xl p-8 border border-indigo-500/30">
            <h3 className="text-2xl font-bold text-indigo-400 mb-6 text-center">
              🌟 Platform Consciousness Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {consciousnessResources.length}
                </div>
                <div className="text-sm text-gray-300">Active Resources</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {Math.round(consciousnessResources.reduce((acc, r) => acc + r.effectiveness, 0) / consciousnessResources.length)}%
                </div>
                <div className="text-sm text-gray-300">Avg Effectiveness</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {Math.round(consciousnessResources.reduce((acc, r) => acc + r.consciousnessLevel, 0) / consciousnessResources.length)}%
                </div>
                <div className="text-sm text-gray-300">Consciousness Level</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {consciousnessResources.filter(r => r.whaleIntegration).length}
                </div>
                <div className="text-sm text-gray-300">Whale Integrated</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Getting Started Guide */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-purple-400 mb-6 text-center">
              🚀 Your Consciousness Development Journey
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-4">
                  🌊 Recommended Starting Path
                </h4>
                <ol className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    <div>
                      <strong>Whale Consciousness Portal:</strong> Begin with humpback whale frequency attunement
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    <div>
                      <strong>Sacred Geometry:</strong> Practice with Flower of Life for universal connection
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    <div>
                      <strong>Manifestation Engine:</strong> Set intentions with whale wisdom guidance
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    <div>
                      <strong>Community Network:</strong> Share experiences anonymously for collective growth
                    </div>
                  </li>
                </ol>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-pink-400 mb-4">
                  ✨ Advanced Integration Tips
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Morning Sessions:</strong> Best time for whale consciousness connection (dawn frequencies)</li>
                  <li>• <strong>Sacred Geometry + Whales:</strong> Combine patterns with species frequencies for 34% effectiveness boost</li>
                  <li>• <strong>Manifestation Timing:</strong> Use blue whale deep frequencies for profound intention work</li>
                  <li>• <strong>Community Wisdom:</strong> Anonymous sharing creates collective consciousness field</li>
                  <li>• <strong>Analytics Tracking:</strong> Monitor your consciousness development patterns</li>
                  <li>• <strong>Full Integration:</strong> Use all resources together for maximum spiritual advancement</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Access Navigation */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h3 className="text-xl font-bold text-purple-400 mb-6">
            🌟 Quick Access to Key Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/cosmic-connectivity">
              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-6 border border-cyan-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">🐋</div>
                <h4 className="text-lg font-bold text-cyan-300 mb-2">Whale Portal</h4>
                <p className="text-gray-300 text-sm">Start your consciousness journey</p>
              </div>
            </Link>

            <Link href="/consciousness-mastery">
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">✨</div>
                <h4 className="text-lg font-bold text-purple-300 mb-2">Manifestation</h4>
                <p className="text-gray-300 text-sm">Create your reality with whale wisdom</p>
              </div>
            </Link>

            <Link href="/analytics">
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">📊</div>
                <h4 className="text-lg font-bold text-indigo-300 mb-2">Analytics</h4>
                <p className="text-gray-300 text-sm">Track your spiritual development</p>
              </div>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}