/**
 * Enhanced Consciousness Analytics Dashboard
 * Phase 19 Implementation: Advanced consciousness insights and community wisdom
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from "wouter";
import { 
  SimpleHexagon, 
  SimpleTriangle,
  SimpleCircle,
  SimpleOctagon
} from '../components/cosmic/SimpleGeometry';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  Filler
);

interface ConsciousnessAnalyticsData {
  consciousnessGrowth: {
    currentLevel: number;
    growthVelocity: number;
    historicalData: Array<{ date: string; level: number }>;
    breakthroughProbability: number;
  };
  whaleWisdomMetrics: {
    totalSessions: number;
    averageEffectiveness: number;
    speciesPreferences: Array<{ species: string; sessions: number; effectiveness: number }>;
    frequencyResonance: Array<{ frequency: string; resonance: number }>;
  };
  manifestationAnalytics: {
    activeIntentions: number;
    successRate: number;
    energyLevels: Array<{ date: string; energy: number }>;
    evidenceTracking: Array<{ intention: string; evidence: number; progress: number }>;
  };
  sacredGeometryInsights: {
    patternUsage: Array<{ pattern: string; usage: number; effectiveness: number }>;
    resonanceLevels: Array<{ date: string; resonance: number }>;
    consciousnessCorrelation: number;
  };
  communityConsciousness: {
    globalLevel: number;
    trendDirection: 'ascending' | 'stable' | 'transforming';
    collectiveInsights: string[];
    anonymizedPatterns: Array<{ metric: string; value: number; trend: string }>;
  };
  platformPerformance: {
    uptime: number;
    responseTime: number;
    memoryUsage: number;
    securityStatus: string;
    optimizationLevel: number;
  };
}

export default function EnhancedAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<ConsciousnessAnalyticsData>({
    consciousnessGrowth: {
      currentLevel: 78.6,
      growthVelocity: 4.2,
      historicalData: [
        { date: '2024-11-01', level: 72.1 },
        { date: '2024-11-08', level: 73.8 },
        { date: '2024-11-15', level: 75.2 },
        { date: '2024-11-22', level: 76.9 },
        { date: '2024-11-29', level: 78.6 }
      ],
      breakthroughProbability: 68
    },
    whaleWisdomMetrics: {
      totalSessions: 47,
      averageEffectiveness: 89.2,
      speciesPreferences: [
        { species: 'Humpback', sessions: 18, effectiveness: 94 },
        { species: 'Blue Whale', sessions: 15, effectiveness: 89 },
        { species: 'Orca', sessions: 9, effectiveness: 91 },
        { species: 'Gray Whale', sessions: 5, effectiveness: 82 }
      ],
      frequencyResonance: [
        { frequency: '20-40 Hz', resonance: 91 },
        { frequency: '40-100 Hz', resonance: 87 },
        { frequency: '100-500 Hz', resonance: 83 },
        { frequency: '500+ Hz', resonance: 79 }
      ]
    },
    manifestationAnalytics: {
      activeIntentions: 3,
      successRate: 78.4,
      energyLevels: [
        { date: '2024-11-01', energy: 76.2 },
        { date: '2024-11-08', energy: 79.1 },
        { date: '2024-11-15', energy: 82.5 },
        { date: '2024-11-22', energy: 85.8 },
        { date: '2024-11-29', energy: 85.2 }
      ],
      evidenceTracking: [
        { intention: 'Creative Expression', evidence: 12, progress: 67 },
        { intention: 'Spiritual Community', evidence: 7, progress: 43 },
        { intention: 'Financial Flow', evidence: 23, progress: 89 }
      ]
    },
    sacredGeometryInsights: {
      patternUsage: [
        { pattern: 'Flower of Life', usage: 34, effectiveness: 92 },
        { pattern: 'Merkaba', usage: 28, effectiveness: 87 },
        { pattern: 'Sri Yantra', usage: 22, effectiveness: 95 },
        { pattern: 'Torus', usage: 19, effectiveness: 84 }
      ],
      resonanceLevels: [
        { date: '2024-11-01', resonance: 84.2 },
        { date: '2024-11-08', resonance: 86.1 },
        { date: '2024-11-15', resonance: 87.9 },
        { date: '2024-11-22', resonance: 88.5 },
        { date: '2024-11-29', resonance: 88.1 }
      ],
      consciousnessCorrelation: 94.3
    },
    communityConsciousness: {
      globalLevel: 76.8,
      trendDirection: 'ascending',
      collectiveInsights: [
        'Consciousness levels trending upward globally during full moon cycles',
        'Whale wisdom sessions most effective during dawn and dusk hours',
        'Sacred geometry usage correlates strongly with manifestation success',
        'Community consciousness peaks align with major celestial events'
      ],
      anonymizedPatterns: [
        { metric: 'Global Meditation Sync', value: 84, trend: 'ascending' },
        { metric: 'Collective Breakthrough Events', value: 12, trend: 'stable' },
        { metric: 'Community Whale Wisdom Sharing', value: 67, trend: 'ascending' }
      ]
    },
    platformPerformance: {
      uptime: 99.94,
      responseTime: 42,
      memoryUsage: 387, // MB
      securityStatus: 'Fully Protected',
      optimizationLevel: 96.8
    }
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    document.title = "Consciousness Analytics - Dale Loves Whales";
    
    // Simulate real-time analytics updates
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        consciousnessGrowth: {
          ...prev.consciousnessGrowth,
          currentLevel: Math.min(100, Math.max(0, prev.consciousnessGrowth.currentLevel + (Math.random() - 0.5) * 0.1))
        },
        platformPerformance: {
          ...prev.platformPerformance,
          responseTime: Math.max(30, Math.min(60, prev.platformPerformance.responseTime + (Math.random() - 0.5) * 2))
        }
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const consciousnessGrowthChart = {
    labels: analyticsData.consciousnessGrowth.historicalData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [{
      label: 'Consciousness Level',
      data: analyticsData.consciousnessGrowth.historicalData.map(d => d.level),
      borderColor: 'rgb(139, 92, 246)',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const whaleSpeciesChart = {
    labels: analyticsData.whaleWisdomMetrics.speciesPreferences.map(s => s.species),
    datasets: [{
      data: analyticsData.whaleWisdomMetrics.speciesPreferences.map(s => s.sessions),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(6, 182, 212, 0.8)',
        'rgba(20, 184, 166, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(14, 165, 233)',
        'rgb(6, 182, 212)',
        'rgb(20, 184, 166)'
      ],
      borderWidth: 2
    }]
  };

  const manifestationEnergyChart = {
    labels: analyticsData.manifestationAnalytics.energyLevels.map(e => new Date(e.date).toLocaleDateString()),
    datasets: [{
      label: 'Manifestation Energy',
      data: analyticsData.manifestationAnalytics.energyLevels.map(e => e.energy),
      borderColor: 'rgb(236, 72, 153)',
      backgroundColor: 'rgba(236, 72, 153, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const sacredGeometryChart = {
    labels: analyticsData.sacredGeometryInsights.patternUsage.map(p => p.pattern),
    datasets: [{
      label: 'Usage Count',
      data: analyticsData.sacredGeometryInsights.patternUsage.map(p => p.usage),
      backgroundColor: 'rgba(168, 85, 247, 0.8)',
      borderColor: 'rgb(168, 85, 247)',
      borderWidth: 2
    }]
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
          <SimpleHexagon className="w-full max-w-[600px] mx-auto mb-8" glowColor="rgba(139, 92, 246, 0.6)">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              📊 Consciousness Analytics 🌊
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Deep insights into your spiritual growth journey and community consciousness evolution
            </p>
          </SimpleHexagon>
        </motion.div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <SimpleTriangle className="w-full max-w-[300px] mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {analyticsData.consciousnessGrowth.currentLevel.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-300 mb-2">Consciousness Level</div>
                <div className="text-xs text-green-400">
                  +{analyticsData.consciousnessGrowth.growthVelocity}/month
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
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {analyticsData.whaleWisdomMetrics.totalSessions}
                </div>
                <div className="text-sm text-cyan-300 mb-2">Whale Sessions</div>
                <div className="text-xs text-green-400">
                  {analyticsData.whaleWisdomMetrics.averageEffectiveness}% effective
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
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {analyticsData.manifestationAnalytics.activeIntentions}
                </div>
                <div className="text-sm text-pink-300 mb-2">Active Manifestations</div>
                <div className="text-xs text-green-400">
                  {analyticsData.manifestationAnalytics.successRate}% success rate
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
                  {analyticsData.consciousnessGrowth.breakthroughProbability}%
                </div>
                <div className="text-sm text-yellow-300 mb-2">Breakthrough Probability</div>
                <div className="text-xs text-orange-400">Next 72 hours</div>
              </div>
            </SimpleTriangle>
          </motion.div>
        </div>

        {/* Consciousness Growth Chart */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-purple-400 mb-6 text-center">
              🧠 Consciousness Growth Trajectory
            </h3>
            <div className="h-64">
              <Line data={consciousnessGrowthChart} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#a855f7',
                    bodyColor: '#e5e7eb'
                  }
                },
                scales: {
                  x: { 
                    grid: { color: 'rgba(139, 92, 246, 0.1)' },
                    ticks: { color: '#9ca3af' }
                  },
                  y: { 
                    grid: { color: 'rgba(139, 92, 246, 0.1)' },
                    ticks: { color: '#9ca3af' }
                  }
                }
              }} />
            </div>
            <div className="text-center mt-4 text-sm text-gray-400">
              Current growth velocity: +{analyticsData.consciousnessGrowth.growthVelocity.toFixed(1)} points/month
            </div>
          </div>
        </motion.section>

        {/* Whale Wisdom & Manifestation Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-gradient-to-br from-black/40 via-cyan-900/20 to-black/40 backdrop-blur-md rounded-xl p-6 border border-cyan-500/30">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center">
                🐋 Whale Species Preferences
              </h3>
              <div className="h-48">
                <Doughnut data={whaleSpeciesChart} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: '#e5e7eb', font: { size: 12 } }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#06b6d4',
                      bodyColor: '#e5e7eb'
                    }
                  }
                }} />
              </div>
              <div className="mt-4 text-center text-sm text-gray-400">
                Total Sessions: {analyticsData.whaleWisdomMetrics.totalSessions} • 
                Avg Effectiveness: {analyticsData.whaleWisdomMetrics.averageEffectiveness}%
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-gradient-to-br from-black/40 via-pink-900/20 to-black/40 backdrop-blur-md rounded-xl p-6 border border-pink-500/30">
              <h3 className="text-xl font-bold text-pink-400 mb-4 text-center">
                ✨ Manifestation Energy Flow
              </h3>
              <div className="h-48">
                <Line data={manifestationEnergyChart} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#ec4899',
                      bodyColor: '#e5e7eb'
                    }
                  },
                  scales: {
                    x: { 
                      grid: { color: 'rgba(236, 72, 153, 0.1)' },
                      ticks: { color: '#9ca3af' }
                    },
                    y: { 
                      grid: { color: 'rgba(236, 72, 153, 0.1)' },
                      ticks: { color: '#9ca3af' }
                    }
                  }
                }} />
              </div>
              <div className="text-center mt-4 text-sm text-gray-400">
                Success Rate: {analyticsData.manifestationAnalytics.successRate}% • 
                Active Intentions: {analyticsData.manifestationAnalytics.activeIntentions}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sacred Geometry & Community Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-purple-400 mb-4 text-center">
                🔯 Sacred Geometry Usage
              </h3>
              <div className="h-48">
                <Bar data={sacredGeometryChart} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#a855f7',
                      bodyColor: '#e5e7eb'
                    }
                  },
                  scales: {
                    x: { 
                      grid: { color: 'rgba(168, 85, 247, 0.1)' },
                      ticks: { color: '#9ca3af' }
                    },
                    y: { 
                      grid: { color: 'rgba(168, 85, 247, 0.1)' },
                      ticks: { color: '#9ca3af' }
                    }
                  }
                }} />
              </div>
              <div className="text-center mt-4 text-sm text-gray-400">
                Consciousness Correlation: {analyticsData.sacredGeometryInsights.consciousnessCorrelation}%
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="bg-gradient-to-br from-black/40 via-indigo-900/20 to-black/40 backdrop-blur-md rounded-xl p-6 border border-indigo-500/30">
              <h3 className="text-xl font-bold text-indigo-400 mb-4 text-center">
                🌍 Community Consciousness Insights
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-300 mb-1">
                    {analyticsData.communityConsciousness.globalLevel}%
                  </div>
                  <div className="text-sm text-gray-400">Global Consciousness Level</div>
                  <div className="text-xs text-green-400 capitalize">
                    Trend: {analyticsData.communityConsciousness.trendDirection}
                  </div>
                </div>

                <div className="space-y-2">
                  {analyticsData.communityConsciousness.collectiveInsights.slice(0, 2).map((insight, index) => (
                    <div key={index} className="bg-indigo-900/20 rounded-lg p-3">
                      <p className="text-sm text-indigo-200">{insight}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center text-xs text-gray-500">
                  All community data is anonymized and privacy-preserved
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Platform Performance */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="bg-gradient-to-br from-black/40 via-green-900/20 to-black/40 backdrop-blur-md rounded-xl p-8 border border-green-500/30">
            <h3 className="text-2xl font-bold text-green-400 mb-6 text-center">
              ⚡ Platform Performance Excellence
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {analyticsData.platformPerformance.uptime}%
                </div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {analyticsData.platformPerformance.responseTime}ms
                </div>
                <div className="text-sm text-gray-400">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {analyticsData.platformPerformance.memoryUsage}MB
                </div>
                <div className="text-sm text-gray-400">Memory Usage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400 mb-1">
                  {analyticsData.platformPerformance.securityStatus}
                </div>
                <div className="text-sm text-gray-400">Security Status</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {analyticsData.platformPerformance.optimizationLevel}%
                </div>
                <div className="text-sm text-gray-400">Optimization</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Navigation Links */}
        <motion.section 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/cosmic-connectivity">
              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-6 border border-cyan-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">🐋</div>
                <h4 className="text-lg font-bold text-cyan-300 mb-2">Whale Wisdom Portal</h4>
                <p className="text-gray-300 text-sm">Continue your marine consciousness journey</p>
              </div>
            </Link>

            <Link href="/consciousness-mastery">
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">✨</div>
                <h4 className="text-lg font-bold text-purple-300 mb-2">Manifestation Engine</h4>
                <p className="text-gray-300 text-sm">Create and track your reality intentions</p>
              </div>
            </Link>

            <Link href="/consciousness-dashboard">
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-500/30 cursor-pointer hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">🧠</div>
                <h4 className="text-lg font-bold text-indigo-300 mb-2">Full Dashboard</h4>
                <p className="text-gray-300 text-sm">Complete consciousness overview</p>
              </div>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}