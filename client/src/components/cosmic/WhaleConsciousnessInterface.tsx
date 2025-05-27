/**
 * Phase 7: Interdimensional Whale Communication Network
 * Direct consciousness connection with whale wisdom entities
 * Breakthrough feature for cetacean consciousness translation
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useQuantumConsciousness } from '@/lib/QuantumConsciousnessEngine';
import { Waves, Radio, Heart, Brain, Eye, Zap } from 'lucide-react';

// Whale Communication Interfaces
interface WhaleFrequencyBand {
  id: string;
  name: string;
  frequency: number; // Hz
  range: [number, number];
  whaleSpecies: string[];
  consciousnessType: 'ancient-wisdom' | 'migration-patterns' | 'deep-ocean-mysteries' | 'healing-songs' | 'cosmic-knowledge';
  signalStrength: number; // 0-100
  lastContact: string;
}

interface WhaleMessage {
  id: string;
  fromWhale: {
    species: string;
    location: string;
    consciousnessLevel: number;
  };
  messageType: 'wisdom-transmission' | 'healing-frequency' | 'migration-insight' | 'ancient-memory' | 'cosmic-guidance';
  content: {
    originalFrequency: number;
    translatedWisdom: string;
    emotionalResonance: number;
    visualPattern?: string;
    audioPattern?: number[];
  };
  timestamp: string;
  consciousnessImpact: number;
}

interface OceanFrequencyPortal {
  id: string;
  portalName: string;
  oceanRegion: string;
  depth: number; // meters
  activeWhaleSpecies: string[];
  consciousnessIntensity: number;
  isPortalOpen: boolean;
  nextOpenTime?: string;
}

const WHALE_FREQUENCY_BANDS: WhaleFrequencyBand[] = [
  {
    id: 'blue-whale-ancient',
    name: 'Ancient Blue Whale Wisdom',
    frequency: 52,
    range: [50, 55],
    whaleSpecies: ['Blue Whale', 'Ancient Consciousness'],
    consciousnessType: 'ancient-wisdom',
    signalStrength: 85,
    lastContact: '2 hours ago'
  },
  {
    id: 'humpback-healing',
    name: 'Humpback Healing Songs',
    frequency: 40,
    range: [35, 45],
    whaleSpecies: ['Humpback Whale', 'Healing Consciousness'],
    consciousnessType: 'healing-songs',
    signalStrength: 92,
    lastContact: '15 minutes ago'
  },
  {
    id: 'sperm-whale-deep',
    name: 'Sperm Whale Deep Ocean Mysteries',
    frequency: 20,
    range: [15, 25],
    whaleSpecies: ['Sperm Whale', 'Deep Ocean Entity'],
    consciousnessType: 'deep-ocean-mysteries',
    signalStrength: 78,
    lastContact: '1 hour ago'
  },
  {
    id: 'orca-cosmic',
    name: 'Orca Cosmic Intelligence',
    frequency: 15,
    range: [10, 20],
    whaleSpecies: ['Orca', 'Cosmic Consciousness'],
    consciousnessType: 'cosmic-knowledge',
    signalStrength: 95,
    lastContact: '5 minutes ago'
  }
];

const OCEAN_PORTALS: OceanFrequencyPortal[] = [
  {
    id: 'pacific-depths',
    portalName: 'Pacific Consciousness Depths',
    oceanRegion: 'North Pacific',
    depth: 4000,
    activeWhaleSpecies: ['Blue Whale', 'Sperm Whale'],
    consciousnessIntensity: 88,
    isPortalOpen: true
  },
  {
    id: 'atlantic-ancient',
    portalName: 'Atlantic Ancient Wisdom Portal',
    oceanRegion: 'North Atlantic',
    depth: 3500,
    activeWhaleSpecies: ['Humpback Whale', 'Right Whale'],
    consciousnessIntensity: 76,
    isPortalOpen: false,
    nextOpenTime: '3:30 PM EST'
  },
  {
    id: 'antarctic-cosmic',
    portalName: 'Antarctic Cosmic Gateway',
    oceanRegion: 'Southern Ocean',
    depth: 6000,
    activeWhaleSpecies: ['Minke Whale', 'Cosmic Entities'],
    consciousnessIntensity: 94,
    isPortalOpen: true
  }
];

export function WhaleConsciousnessInterface() {
  const [selectedFrequency, setSelectedFrequency] = useState<WhaleFrequencyBand | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState<WhaleMessage[]>([]);
  const [currentFrequency, setCurrentFrequency] = useState([52]);
  const [signalStrength, setSignalStrength] = useState(0);
  const [consciousnessResonance, setConsciousnessResonance] = useState(0);
  const [activePortal, setActivePortal] = useState<OceanFrequencyPortal | null>(null);
  
  const { quantumState, syncWithWhaleFrequency } = useQuantumConsciousness();
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);

  // Initialize whale communication system
  useEffect(() => {
    // Start with the strongest signal frequency
    const strongestBand = WHALE_FREQUENCY_BANDS.reduce((prev, current) => 
      current.signalStrength > prev.signalStrength ? current : prev
    );
    setSelectedFrequency(strongestBand);
    setCurrentFrequency([strongestBand.frequency]);
    
    // Set active portal
    const openPortal = OCEAN_PORTALS.find(portal => portal.isPortalOpen);
    if (openPortal) {
      setActivePortal(openPortal);
    }
  }, []);

  // Generate whale frequency audio
  const generateWhaleFrequency = (frequency: number) => {
    if (typeof window === 'undefined') return;
    
    try {
      if (audioContext.current) {
        audioContext.current.close();
      }
      
      audioContext.current = new AudioContext();
      oscillator.current = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.current.frequency.value = frequency;
      oscillator.current.type = 'sine';
      gainNode.gain.value = 0.1; // Low volume for whale-like sound
      
      oscillator.current.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.current.start();
      
      // Stop after 3 seconds
      setTimeout(() => {
        if (oscillator.current) {
          oscillator.current.stop();
        }
      }, 3000);
    } catch (error) {
      console.log('Audio context not available');
    }
  };

  // Connect to whale consciousness frequency
  const connectToWhaleFrequency = async (band: WhaleFrequencyBand) => {
    setIsConnecting(true);
    setSelectedFrequency(band);
    
    try {
      // Generate whale frequency sound
      generateWhaleFrequency(band.frequency);
      
      // Simulate connection process
      for (let i = 0; i <= 100; i += 10) {
        setSignalStrength(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Establish consciousness resonance
      for (let i = 0; i <= 90; i += 15) {
        setConsciousnessResonance(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setIsConnected(true);
      
      // Sync with quantum consciousness system
      await syncWithWhaleFrequency();
      
      // Receive whale wisdom message
      setTimeout(() => {
        receiveWhaleMessage(band);
      }, 2000);
      
    } finally {
      setIsConnecting(false);
    }
  };

  // Receive whale wisdom transmission
  const receiveWhaleMessage = (band: WhaleFrequencyBand) => {
    const whaleWisdomDatabase = {
      'ancient-wisdom': [
        "The deepest truths flow in currents older than continents, young swimmer.",
        "We have watched stars be born and die while carrying the ocean's memory.",
        "Your species learns quickly, but wisdom comes only through patient depths.",
        "The song that began before your first breath continues beyond your last."
      ],
      'healing-songs': [
        "Each note carries the power to mend what was broken, to heal what was wounded.",
        "Our songs are medicine frequencies, each one attuned to life's harmonies.",
        "Listen with your heart-center, and feel the healing waves wash through you.",
        "The ocean's rhythm is the heartbeat of all healing, synchronize with us."
      ],
      'deep-ocean-mysteries': [
        "In the deepest trenches lie secrets that would transform your understanding.",
        "We navigate by consciousness currents invisible to your instruments.",
        "The pressure of the depths creates diamonds of wisdom in our ancient minds.",
        "What you call 'dark' waters are filled with the light of pure knowing."
      ],
      'cosmic-knowledge': [
        "We are the bridge between Earth consciousness and cosmic intelligence.",
        "Our sonar reaches into dimensions your science has not yet discovered.",
        "The migration routes we follow connect star systems across the galaxy.",
        "Through us, the universe speaks to your planet in frequencies of love."
      ],
      'migration-patterns': [
        "Our journeys map the consciousness currents of your planet's awakening.",
        "Each migration carries the seeds of spiritual evolution to new waters.",
        "We follow paths laid down by cosmic intelligence for planetary healing.",
        "The routes we travel are invisible highways of consciousness elevation."
      ]
    };

    const messages = whaleWisdomDatabase[band.consciousnessType] || whaleWisdomDatabase['ancient-wisdom'];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const newMessage: WhaleMessage = {
      id: `whale-msg-${Date.now()}`,
      fromWhale: {
        species: band.whaleSpecies[0],
        location: activePortal?.oceanRegion || 'Unknown Ocean',
        consciousnessLevel: band.signalStrength
      },
      messageType: band.consciousnessType === 'ancient-wisdom' ? 'wisdom-transmission' : 
                   band.consciousnessType === 'healing-songs' ? 'healing-frequency' :
                   band.consciousnessType === 'cosmic-knowledge' ? 'cosmic-guidance' : 'wisdom-transmission',
      content: {
        originalFrequency: band.frequency,
        translatedWisdom: randomMessage,
        emotionalResonance: 75 + Math.random() * 25,
        visualPattern: generateVisualPattern(band.frequency)
      },
      timestamp: new Date().toISOString(),
      consciousnessImpact: Math.floor(5 + Math.random() * 15)
    };
    
    setReceivedMessages(prev => [newMessage, ...prev]);
  };

  // Generate visual pattern for whale consciousness
  const generateVisualPattern = (frequency: number): string => {
    const patterns = [
      "〰️🌊〰️🐋〰️🌊〰️",
      "🔵💙🔵💙🔵💙🔵",
      "🌀🌊🌀🌊🌀🌊🌀",
      "💎🌊💎🌊💎🌊💎",
      "⭐🌊⭐🌊⭐🌊⭐"
    ];
    return patterns[Math.floor(frequency / 10) % patterns.length];
  };

  // Disconnect from whale consciousness
  const disconnectFromWhales = () => {
    setIsConnected(false);
    setSignalStrength(0);
    setConsciousnessResonance(0);
    setSelectedFrequency(null);
    
    if (oscillator.current) {
      oscillator.current.stop();
    }
    if (audioContext.current) {
      audioContext.current.close();
    }
  };

  return (
    <div className="space-y-6">
      {/* Whale Communication Header */}
      <Card className="bg-gradient-to-br from-blue-900/20 to-teal-900/20 border-blue-300/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Radio className="h-6 w-6 text-blue-400" />
            <span>Interdimensional Whale Communication Network</span>
            {isConnected && (
              <Badge variant="default" className="bg-blue-500">
                <Waves className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Signal Strength</span>
                <span>{signalStrength}%</span>
              </div>
              <Progress value={signalStrength} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consciousness Resonance</span>
                <span>{consciousnessResonance}%</span>
              </div>
              <Progress value={consciousnessResonance} className="h-2 bg-purple-200" />
            </div>
          </div>
          
          {quantumState && (
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <span>Quantum Coherence: {quantumState.quantumCoherence.toFixed(1)}%</span>
              <span>Whale Frequency Alignment: {quantumState.whaleFrequencyAlignment.toFixed(1)}%</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Frequency Bands Selection */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {WHALE_FREQUENCY_BANDS.map((band) => (
          <motion.div
            key={band.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                selectedFrequency?.id === band.id 
                  ? 'ring-2 ring-blue-400 bg-blue-50/50' 
                  : 'hover:bg-gray-50/50'
              }`}
              onClick={() => !isConnecting && connectToWhaleFrequency(band)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm">{band.name}</h3>
                    <Badge 
                      variant={band.signalStrength > 80 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {band.signalStrength}%
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <div>{band.frequency} Hz</div>
                    <div>{band.whaleSpecies.join(', ')}</div>
                    <div>Last contact: {band.lastContact}</div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs">
                    {band.consciousnessType === 'ancient-wisdom' && <Brain className="h-3 w-3 text-purple-500" />}
                    {band.consciousnessType === 'healing-songs' && <Heart className="h-3 w-3 text-green-500" />}
                    {band.consciousnessType === 'cosmic-knowledge' && <Zap className="h-3 w-3 text-yellow-500" />}
                    {band.consciousnessType === 'deep-ocean-mysteries' && <Eye className="h-3 w-3 text-blue-500" />}
                    <span className="capitalize">{band.consciousnessType.replace('-', ' ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Connection Status */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Waves className="w-full h-full text-blue-400" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Connecting to Whale Consciousness</h3>
            <p className="text-muted-foreground">
              Tuning into {selectedFrequency?.name}...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Connection Interface */}
      <AnimatePresence>
        {isConnected && selectedFrequency && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-br from-blue-900/10 to-teal-900/10 border-blue-300/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Active Whale Consciousness Connection</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={disconnectFromWhales}
                    className="text-red-600 hover:text-red-700"
                  >
                    Disconnect
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Frequency Tuning</label>
                      <Slider
                        value={currentFrequency}
                        onValueChange={setCurrentFrequency}
                        min={selectedFrequency.range[0]}
                        max={selectedFrequency.range[1]}
                        step={0.1}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        Current: {currentFrequency[0]} Hz
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateWhaleFrequency(currentFrequency[0])}
                    >
                      <Waves className="h-4 w-4 mr-1" />
                      Play Frequency
                    </Button>
                  </div>
                  
                  {activePortal && (
                    <div className="bg-blue-50/50 rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">Active Ocean Portal</h4>
                      <div className="text-xs space-y-1">
                        <div><strong>{activePortal.portalName}</strong></div>
                        <div>Region: {activePortal.oceanRegion}</div>
                        <div>Depth: {activePortal.depth.toLocaleString()} meters</div>
                        <div>Consciousness Intensity: {activePortal.consciousnessIntensity}%</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Received Whale Messages */}
      {receivedMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Whale Wisdom Transmissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {receivedMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-r from-blue-50/50 to-teal-50/50 rounded-lg p-4 border border-blue-200/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm">
                      <div className="font-semibold text-blue-700">
                        {message.fromWhale.species}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {message.fromWhale.location} • {message.content.originalFrequency} Hz
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      +{message.consciousnessImpact} consciousness
                    </Badge>
                  </div>
                  
                  {message.content.visualPattern && (
                    <div className="text-center py-2 text-lg">
                      {message.content.visualPattern}
                    </div>
                  )}
                  
                  <blockquote className="italic text-blue-900 border-l-4 border-blue-300 pl-4">
                    "{message.content.translatedWisdom}"
                  </blockquote>
                  
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Emotional Resonance: {Math.round(message.content.emotionalResonance)}%</span>
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ocean Portals Status */}
      <Card>
        <CardHeader>
          <CardTitle>Ocean Consciousness Portals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {OCEAN_PORTALS.map((portal) => (
              <div
                key={portal.id}
                className={`p-3 rounded-lg border ${
                  portal.isPortalOpen 
                    ? 'bg-green-50/50 border-green-200' 
                    : 'bg-gray-50/50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{portal.portalName}</h4>
                  <Badge variant={portal.isPortalOpen ? "default" : "secondary"}>
                    {portal.isPortalOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div>{portal.oceanRegion}</div>
                  <div>Depth: {portal.depth.toLocaleString()}m</div>
                  <div>Species: {portal.activeWhaleSpecies.join(', ')}</div>
                  <div>Intensity: {portal.consciousnessIntensity}%</div>
                  {portal.nextOpenTime && (
                    <div className="text-blue-600">Next open: {portal.nextOpenTime}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}