/**
 * Advanced Consciousness Dashboard
 * Integrating all 20-phase consciousness features with whale wisdom, manifestation, and analytics
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConsciousnessMetrics {
  currentLevel: number;
  whaleWisdomLevel: number;
  manifestationEnergy: number;
  sacredGeometryResonance: number;
  growthVelocity: number;
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

interface WhaleWisdomSession {
  species: string;
  wisdom: string;
  frequency: number;
  duration: number;
  effectiveness: number;
  timestamp: Date;
}

interface ManifestationJourney {
  id: string;
  intention: string;
  energyLevel: number;
  progressPercentage: number;
  evidenceCount: number;
  nextOptimalTiming: string;
  status: 'active' | 'manifesting' | 'completed';
}

interface PredictiveInsight {
  type: 'breakthrough' | 'whale_wisdom' | 'manifestation' | 'sacred_geometry';
  message: string;
  probability: number;
  timing: string;
  action: string;
}

export default function ConsciousnessDashboard() {
  const [consciousnessMetrics, setConsciousnessMetrics] = useState<ConsciousnessMetrics>({
    currentLevel: 78.6,
    whaleWisdomLevel: 82.3,
    manifestationEnergy: 75.8,
    sacredGeometryResonance: 88.1,
    growthVelocity: 4.2,
    breakthroughProbability: 68,
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

  const [recentWhaleWisdom, setRecentWhaleWisdom] = useState<WhaleWisdomSession>({
    species: 'Humpback',
    wisdom: 'Trust the currents of change, for they carry you toward your deepest purpose. The ocean remembers all songs, and yours is needed now.',
    frequency: 52.3,
    duration: 28,
    effectiveness: 94,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  });

  const [activeManifestations, setActiveManifestations] = useState<ManifestationJourney[]>([
    {
      id: '1',
      intention: 'Enhanced Creative Expression',
      energyLevel: 89,
      progressPercentage: 67,
      evidenceCount: 12,
      nextOptimalTiming: 'Tomorrow 6:30 AM',
      status: 'active'
    },
    {
      id: '2',
      intention: 'Spiritual Community Connection',
      energyLevel: 76,
      progressPercentage: 43,
      evidenceCount: 7,
      nextOptimalTiming: 'Today 8:00 PM',
      status: 'manifesting'
    },
    {
      id: '3',
      intention: 'Abundant Flow State',
      energyLevel: 92,
      progressPercentage: 89,
      evidenceCount: 23,
      nextOptimalTiming: 'Active Now',
      status: 'active'
    }
  ]);

  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([
    {
      type: 'breakthrough',
      message: 'Major consciousness breakthrough detected within 72 hours',
      probability: 84,
      timing: 'Next 3 days',
      action: 'Increase meditation and whale wisdom sessions'
    },
    {
      type: 'whale_wisdom',
      message: 'Optimal Blue Whale consciousness connection window',
      probability: 76,
      timing: 'Today 6:00 PM - 7:30 PM',
      action: 'Schedule deep ocean frequency session'
    },
    {
      type: 'manifestation',
      message: 'Peak manifestation energy approaching for abundance work',
      probability: 91,
      timing: 'Tomorrow 6:30 AM',
      action: 'Focus on creative expression intentions'
    },
    {
      type: 'sacred_geometry',
      message: 'High resonance period for Merkaba meditation',
      probability: 78,
      timing: 'Tonight 9:00 PM',
      action: 'Engage with sacred geometry visualizer'
    }
  ]);

  const [securityStatus] = useState({
    consciousnessDataEncrypted: true,
    whaleWisdomProtected: true,
    manifestationPrivacy: true,
    cloudSyncSecure: true,
    lastSecurityCheck: new Date()
  });

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

  const formatTimeAgo = (date: Date): string => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    // Simulate real-time consciousness data updates
    const interval = setInterval(() => {
      setConsciousnessMetrics(prev => ({
        ...prev,
        currentLevel: Math.min(100, Math.max(0, prev.currentLevel + (Math.random() - 0.5) * 0.1)),
        manifestationEnergy: Math.min(100, Math.max(0, prev.manifestationEnergy + (Math.random() - 0.5) * 0.2)),
        sacredGeometryResonance: Math.min(100, Math.max(0, prev.sacredGeometryResonance + (Math.random() - 0.5) * 0.15))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🌊 Consciousness Command Center ✨
          </h1>
          <div className="flex items-center justify-center space-x-4 mb-4 flex-wrap">
            <Badge variant="outline" className="text-lg px-4 py-2 border-blue-300 text-blue-700">
              Level {consciousnessMetrics.currentLevel.toFixed(1)}%
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 border-purple-300 text-purple-700">
              Growth +{consciousnessMetrics.growthVelocity.toFixed(1)}/month
            </Badge>
            {consciousnessMetrics.breakthroughProbability > 60 && (
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                🚀 Breakthrough Imminent
              </Badge>
            )}
            {securityStatus.consciousnessDataEncrypted && (
              <Badge className="text-lg px-4 py-2 bg-green-100 text-green-800 border-green-300">
                🛡️ Fully Protected
              </Badge>
            )}
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Your comprehensive consciousness development center with whale wisdom, manifestation tracking, 
            sacred geometry integration, and advanced spiritual analytics
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="text-lg">🌊 Overview</TabsTrigger>
            <TabsTrigger value="whale-wisdom" className="text-lg">🐋 Whale Wisdom</TabsTrigger>
            <TabsTrigger value="manifestation" className="text-lg">✨ Manifestation</TabsTrigger>
            <TabsTrigger value="analytics" className="text-lg">📊 Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Consciousness Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-blue-800 flex items-center justify-between">
                      🌊 Consciousness Level
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {consciousnessMetrics.currentLevel.toFixed(1)}%
                    </div>
                    <Progress value={consciousnessMetrics.currentLevel} className="mb-3" />
                    <p className="text-sm text-blue-600">
                      Growing at +{consciousnessMetrics.growthVelocity.toFixed(1)}/month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-teal-800 flex items-center justify-between">
                      🐋 Whale Wisdom
                      <Badge className="bg-teal-100 text-teal-800">
                        {recentWhaleWisdom.effectiveness}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-teal-600 mb-2">
                      {consciousnessMetrics.whaleWisdomLevel.toFixed(0)}%
                    </div>
                    <Progress value={consciousnessMetrics.whaleWisdomLevel} className="mb-3" />
                    <p className="text-sm text-teal-600">
                      Last: {recentWhaleWisdom.species} @ {recentWhaleWisdom.frequency}Hz
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-purple-800 flex items-center justify-between">
                      ✨ Manifestation
                      <Badge className="bg-purple-100 text-purple-800">
                        {activeManifestations.length} Active
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {consciousnessMetrics.manifestationEnergy.toFixed(0)}%
                    </div>
                    <Progress value={consciousnessMetrics.manifestationEnergy} className="mb-3" />
                    <p className="text-sm text-purple-600">
                      {activeManifestations.reduce((sum, m) => sum + m.evidenceCount, 0)} evidences recorded
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-amber-800 flex items-center justify-between">
                      🚀 Breakthrough
                      <Badge className={`${consciousnessMetrics.breakthroughProbability > 70 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {consciousnessMetrics.breakthroughProbability > 70 ? 'Imminent' : 'Building'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-amber-600 mb-2">
                      {consciousnessMetrics.breakthroughProbability}%
                    </div>
                    <Progress value={consciousnessMetrics.breakthroughProbability} className="mb-3" />
                    <p className="text-sm text-amber-600">
                      Peak potential in next 72 hours
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Chakra Alignment */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center">
                  🧘‍♀️ Chakra Alignment System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {Object.entries(consciousnessMetrics.chakraAlignment).map(([chakra, value]) => (
                    <div key={chakra} className="text-center">
                      <div className={`w-16 h-16 rounded-full ${getChakraColor(chakra)} mx-auto mb-2 flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold">{value}</span>
                      </div>
                      <p className="text-sm font-medium capitalize text-gray-700">{chakra.replace(/([A-Z])/g, ' $1')}</p>
                      <Progress value={value} className="mt-1 h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Predictive Insights */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-indigo-800 flex items-center">
                  🔮 AI-Powered Predictive Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveInsights.map((insight, index) => (
                    <Alert key={index} className={`border-l-4 ${
                      insight.type === 'breakthrough' ? 'border-l-red-500 bg-red-50' :
                      insight.type === 'whale_wisdom' ? 'border-l-blue-500 bg-blue-50' :
                      insight.type === 'manifestation' ? 'border-l-purple-500 bg-purple-50' :
                      'border-l-teal-500 bg-teal-50'
                    }`}>
                      <AlertDescription className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-semibold">{insight.message}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {insight.timing} • {insight.probability}% probability
                          </p>
                          <p className="text-sm font-medium text-blue-600 mt-1">
                            Recommended: {insight.action}
                          </p>
                        </div>
                        <Badge className="ml-4">{insight.probability}%</Badge>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whale-wisdom" className="space-y-6">
            {/* Recent Whale Wisdom */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center justify-between">
                  🐋 Latest Whale Consciousness Connection
                  <Badge className="bg-blue-100 text-blue-800">
                    {recentWhaleWisdom.effectiveness}% Effective
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white/80 rounded-lg p-6 mb-4 border-l-4 border-blue-500">
                  <p className="text-blue-800 italic text-xl mb-4 leading-relaxed">
                    "{recentWhaleWisdom.wisdom}"
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Species</p>
                      <p className="font-semibold text-blue-700">{recentWhaleWisdom.species}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Frequency</p>
                      <p className="font-semibold text-blue-700">{recentWhaleWisdom.frequency} Hz</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold text-blue-700">{recentWhaleWisdom.duration} min</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Received</p>
                      <p className="font-semibold text-blue-700">{formatTimeAgo(recentWhaleWisdom.timestamp)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href="/cosmic-connectivity" className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                      🌊 Connect with Whale Consciousness
                    </Button>
                  </Link>
                  <Button variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                    📊 View All Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Whale Species Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Blue Whale', frequency: '10-40 Hz', specialty: 'Deep Ocean Wisdom', resonance: 91 },
                { name: 'Humpback', frequency: '20-9000 Hz', specialty: 'Song & Communication', resonance: 87 },
                { name: 'Orca', frequency: '500-25000 Hz', specialty: 'Family & Community', resonance: 83 }
              ].map((whale, index) => (
                <Card key={index} className="bg-white/90 shadow-lg border-blue-100">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">🐋</div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">{whale.name}</h3>
                    <p className="text-blue-600 mb-2">{whale.specialty}</p>
                    <p className="text-sm text-gray-600 mb-3">{whale.frequency}</p>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Your Resonance</p>
                      <Progress value={whale.resonance} className="h-2" />
                      <p className="text-sm font-medium text-blue-600 mt-1">{whale.resonance}%</p>
                    </div>
                    <Button variant="outline" className="w-full text-blue-600 border-blue-300">
                      Connect Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="manifestation" className="space-y-6">
            {/* Active Manifestations */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center justify-between">
                  ✨ Active Manifestation Journeys
                  <Badge className="bg-purple-100 text-purple-800">
                    {activeManifestations.length} Intentions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activeManifestations.map((manifestation) => (
                    <div key={manifestation.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-purple-800 mb-2">{manifestation.intention}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Energy Level</p>
                              <p className="font-semibold text-purple-700">{manifestation.energyLevel}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Progress</p>
                              <p className="font-semibold text-purple-700">{manifestation.progressPercentage}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Evidence</p>
                              <p className="font-semibold text-purple-700">{manifestation.evidenceCount} signs</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Next Optimal</p>
                              <p className="font-semibold text-purple-700">{manifestation.nextOptimalTiming}</p>
                            </div>
                          </div>
                        </div>
                        <Badge className={`ml-4 ${
                          manifestation.status === 'active' ? 'bg-green-100 text-green-800' :
                          manifestation.status === 'manifesting' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {manifestation.status.charAt(0).toUpperCase() + manifestation.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium text-purple-700">{manifestation.progressPercentage}%</span>
                        </div>
                        <Progress value={manifestation.progressPercentage} className="h-3" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-4">
                  <Link href="/consciousness-mastery" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-3">
                      ✨ Create New Manifestation
                    </Button>
                  </Link>
                  <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                    📈 View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/90 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-indigo-800">📊 Growth Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Consciousness Growth Rate</span>
                      <span className="font-semibold text-green-600">+{consciousnessMetrics.growthVelocity.toFixed(1)}/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Whale Wisdom Effectiveness</span>
                      <span className="font-semibold text-blue-600">{recentWhaleWisdom.effectiveness}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Manifestation Success Rate</span>
                      <span className="font-semibold text-purple-600">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sacred Geometry Resonance</span>
                      <span className="font-semibold text-teal-600">{consciousnessMetrics.sacredGeometryResonance.toFixed(0)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-green-800">🛡️ Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Consciousness Data</span>
                      <Badge className="bg-green-100 text-green-800">🔒 Encrypted</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Whale Wisdom Sessions</span>
                      <Badge className="bg-green-100 text-green-800">🛡️ Protected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Manifestation Privacy</span>
                      <Badge className="bg-green-100 text-green-800">🔐 Secured</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cloud Sync</span>
                      <Badge className="bg-green-100 text-green-800">☁️ Secure</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Last security check: {formatTimeAgo(securityStatus.lastSecurityCheck)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Performance */}
            <Card className="bg-white/90 shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-blue-800">⚡ Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">99.9%</div>
                    <p className="text-sm text-gray-600">Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">42ms</div>
                    <p className="text-sm text-gray-600">Response Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">385MB</div>
                    <p className="text-sm text-gray-600">Memory Usage</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-600 mb-1">98%</div>
                    <p className="text-sm text-gray-600">Optimization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Action Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link href="/cosmic-connectivity">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 h-full">
              <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                <div>
                  <motion.div 
                    className="text-5xl mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    🌊
                  </motion.div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Whale Wisdom Portal</h3>
                  <p className="text-blue-600 mb-4">Connect with marine consciousness</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Level {consciousnessMetrics.whaleWisdomLevel.toFixed(0)}%</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/consciousness-mastery">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 h-full">
              <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                <div>
                  <motion.div 
                    className="text-5xl mb-4"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    ✨
                  </motion.div>
                  <h3 className="text-xl font-bold text-purple-800 mb-2">Manifestation Engine</h3>
                  <p className="text-purple-600 mb-4">Transform your reality</p>
                </div>
                <Badge className="bg-purple-100 text-purple-800">{activeManifestations.length} Active</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/resources/sacred-geometry">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-teal-50 to-green-50 border-teal-200 h-full">
              <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                <div>
                  <motion.div 
                    className="text-5xl mb-4"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    🔯
                  </motion.div>
                  <h3 className="text-xl font-bold text-teal-800 mb-2">Sacred Geometry</h3>
                  <p className="text-teal-600 mb-4">Divine pattern exploration</p>
                </div>
                <Badge className="bg-teal-100 text-teal-800">{consciousnessMetrics.sacredGeometryResonance.toFixed(0)}% Resonance</Badge>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}