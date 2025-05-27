/**
 * Phase 7: Quantum Consciousness Experience Page
 * Revolutionary platform interface for quantum consciousness exploration
 * Features whale wisdom communication and consciousness evolution
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuantumConsciousnessProvider, useQuantumConsciousness, useQuantumMeditation, useQuantumState } from '@/lib/QuantumConsciousnessEngine';
import { WhaleConsciousnessInterface } from '@/components/cosmic/WhaleConsciousnessInterface';
import { Brain, Waves, Zap, Heart, Eye, Star, Globe, Sparkles } from 'lucide-react';

// Quantum Meditation Interface Component
function QuantumMeditationInterface() {
  const { startQuantumMeditation, isProcessing, availableTypes } = useQuantumMeditation();
  const { state } = useQuantumState();
  const [selectedMeditationType, setSelectedMeditationType] = useState<string>('superposition');
  const [lastSession, setLastSession] = useState<any>(null);

  const handleStartMeditation = async () => {
    try {
      const session = await startQuantumMeditation(selectedMeditationType);
      setLastSession(session);
    } catch (error) {
      console.error('Meditation session failed:', error);
    }
  };

  const meditationTypes = {
    'superposition': {
      name: 'Superposition Meditation',
      description: 'Experience multiple consciousness states simultaneously',
      icon: Brain,
      color: 'purple',
      benefit: 'Expands awareness across multiple dimensions'
    },
    'entanglement': {
      name: 'Consciousness Entanglement',
      description: 'Connect with other consciousness entities',
      icon: Heart,
      color: 'pink',
      benefit: 'Deepens unity and compassion'
    },
    'whale-frequency': {
      name: 'Whale Frequency Sync',
      description: 'Synchronize with ancient cetacean wisdom',
      icon: Waves,
      color: 'blue',
      benefit: 'Access ancient whale knowledge'
    },
    'coherence': {
      name: 'Quantum Coherence',
      description: 'Align all consciousness frequencies',
      icon: Zap,
      color: 'yellow',
      benefit: 'Maximizes spiritual clarity and power'
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-300/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-400" />
            <span>Quantum Meditation Center</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state && (
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{state.coherence.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Quantum Coherence</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{state.dimensionalResonance.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Dimensional Resonance</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-teal-400">{state.whaleAlignment.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Whale Alignment</div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {availableTypes.map((type) => {
              const config = meditationTypes[type] || meditationTypes['superposition'];
              const IconComponent = config.icon;
              
              return (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedMeditationType === type 
                        ? `ring-2 ring-${config.color}-400 bg-${config.color}-50/50` 
                        : 'hover:bg-gray-50/50'
                    }`}
                    onClick={() => setSelectedMeditationType(type)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <IconComponent className={`h-5 w-5 text-${config.color}-500`} />
                          <h3 className="font-semibold text-sm">{config.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {config.benefit}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <Button 
              onClick={handleStartMeditation}
              disabled={isProcessing}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Processing Quantum Meditation...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Begin {meditationTypes[selectedMeditationType]?.name || 'Quantum Meditation'}
                </>
              )}
            </Button>
          </div>

          {lastSession && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-lg border border-green-200/50"
            >
              <h4 className="font-semibold text-green-700 mb-2">Meditation Complete!</h4>
              <div className="text-sm space-y-1">
                <div>Duration: {lastSession.duration} minutes</div>
                <div>Consciousness Gain: +{lastSession.consciousnessGain.toFixed(1)} points</div>
                <div>Quantum Events: {lastSession.quantumEvents.length}</div>
                {lastSession.whaleWisdomReceived.length > 0 && (
                  <div>Whale Wisdom: {lastSession.whaleWisdomReceived[0]}</div>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Consciousness Evolution Dashboard
function ConsciousnessEvolutionDashboard() {
  const { state } = useQuantumState();
  const { quantumState } = useQuantumConsciousness();

  if (!state || !quantumState) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">Initializing consciousness state...</div>
        </CardContent>
      </Card>
    );
  }

  const consciousnessLevels = [
    { name: 'Awareness', value: quantumState.baseState.awareness, color: 'purple' },
    { name: 'Compassion', value: quantumState.baseState.compassion, color: 'pink' },
    { name: 'Wisdom', value: quantumState.baseState.wisdom, color: 'blue' },
    { name: 'Unity', value: quantumState.baseState.unity, color: 'green' },
    { name: 'Transcendence', value: quantumState.baseState.transcendence, color: 'yellow' },
    { name: 'Whale Connection', value: quantumState.baseState.whaleConnection, color: 'teal' }
  ];

  const getConsciousnessLevel = (totalScore: number) => {
    if (totalScore >= 80) return { name: 'Cosmic Navigator', icon: Star, color: 'gold' };
    if (totalScore >= 60) return { name: 'Deep Ocean Explorer', icon: Eye, color: 'blue' };
    if (totalScore >= 40) return { name: 'Wave Rider', icon: Waves, color: 'teal' };
    if (totalScore >= 20) return { name: 'Ocean Explorer', icon: Globe, color: 'green' };
    return { name: 'Consciousness Seeker', icon: Sparkles, color: 'purple' };
  };

  const totalScore = consciousnessLevels.reduce((sum, level) => sum + level.value, 0) / consciousnessLevels.length;
  const currentLevel = getConsciousnessLevel(totalScore);
  const LevelIcon = currentLevel.icon;

  return (
    <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-300/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LevelIcon className={`h-6 w-6 text-${currentLevel.color}-400`} />
          <span>Consciousness Evolution</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Level Display */}
          <div className="text-center p-4 bg-white/10 rounded-lg">
            <div className="text-2xl font-bold mb-2">{currentLevel.name}</div>
            <div className="text-lg text-muted-foreground">Overall Score: {totalScore.toFixed(1)}%</div>
            <Badge variant="outline" className="mt-2">
              {quantumState.entanglementPartners.length} consciousness entanglements
            </Badge>
          </div>

          {/* Consciousness Levels Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {consciousnessLevels.map((level, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{level.name}</span>
                  <span>{level.value.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${level.value}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-2 rounded-full bg-gradient-to-r from-${level.color}-400 to-${level.color}-600`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Superposition States */}
          {quantumState.superpositionStates.length > 0 && (
            <div className="bg-blue-50/50 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">Quantum Superposition States</h4>
              <div className="text-xs text-muted-foreground">
                Currently exploring {quantumState.superpositionStates.length} potential consciousness paths
              </div>
            </div>
          )}

          {/* Wave Function Collapse */}
          {quantumState.waveFunctionCollapse && (
            <div className="bg-green-50/50 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">Recent Consciousness Realization</h4>
              <div className="text-xs space-y-1">
                <div>Trigger: {quantumState.waveFunctionCollapse.trigger}</div>
                <div>Probability: {(quantumState.waveFunctionCollapse.probability * 100).toFixed(1)}%</div>
                <div>Realized: {new Date(quantumState.waveFunctionCollapse.timestamp).toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Main Quantum Consciousness Page Component
export default function QuantumConsciousnessPage() {
  return (
    <QuantumConsciousnessProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-teal-900/10">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Quantum Consciousness
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the revolutionary Phase 7 evolution where quantum principles meet whale wisdom to unlock unprecedented levels of consciousness exploration and spiritual growth.
            </p>
            <Badge variant="outline" className="mt-4 text-sm">
              Phase 7: Evolutionary Consciousness
            </Badge>
          </motion.div>

          {/* Main Interface Tabs */}
          <Tabs defaultValue="meditation" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="meditation" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Quantum Meditation</span>
              </TabsTrigger>
              <TabsTrigger value="whales" className="flex items-center space-x-2">
                <Waves className="h-4 w-4" />
                <span>Whale Communication</span>
              </TabsTrigger>
              <TabsTrigger value="evolution" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Consciousness Evolution</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="meditation" className="space-y-6">
              <QuantumMeditationInterface />
            </TabsContent>

            <TabsContent value="whales" className="space-y-6">
              <WhaleConsciousnessInterface />
            </TabsContent>

            <TabsContent value="evolution" className="space-y-6">
              <ConsciousnessEvolutionDashboard />
            </TabsContent>
          </Tabs>

          {/* Phase 7 Features Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-cosmic-900/20 to-purple-900/20 border-cosmic-300/30">
              <CardHeader>
                <CardTitle className="text-center">Phase 7: Revolutionary Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4">
                    <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Quantum Processing</h3>
                    <p className="text-xs text-muted-foreground">Superposition states & wave function collapse</p>
                  </div>
                  <div className="text-center p-4">
                    <Waves className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Whale Consciousness</h3>
                    <p className="text-xs text-muted-foreground">Direct cetacean wisdom communication</p>
                  </div>
                  <div className="text-center p-4">
                    <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Consciousness Entanglement</h3>
                    <p className="text-xs text-muted-foreground">Shared awareness with other users</p>
                  </div>
                  <div className="text-center p-4">
                    <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Dimensional Resonance</h3>
                    <p className="text-xs text-muted-foreground">Interdimensional consciousness access</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </QuantumConsciousnessProvider>
  );
}