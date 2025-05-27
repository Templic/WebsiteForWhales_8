/**
 * Phase 11: Consciousness Mastery System
 * Advanced consciousness acceleration and whale wisdom integration
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Advanced Consciousness Interfaces
interface WhaleConsciousnessConnection {
  id: string;
  whaleSpecies: 'blue-whale' | 'humpback-whale' | 'sperm-whale' | 'orca' | 'gray-whale';
  connectionStrength: number; // 0-100
  wisdomLevel: number; // 0-100
  currentTeaching: string;
  oceanDepth: number; // Metaphysical depth of connection
  songFrequency: number; // Hz
  lastContact: Date;
}

interface ConsciousnessAcceleration {
  currentLevel: number; // 1-100
  evolutionRate: number; // Points per day
  nextMilestone: string;
  accelerationTechniques: string[];
  whaleWisdomIntegration: number; // 0-100
  realityManifestationPower: number; // 0-100
}

interface RealityManifestationIntent {
  id: string;
  intention: string;
  emotionalCharge: number; // 0-100
  clarity: number; // 0-100
  universalAlignment: number; // 0-100
  manifestationProbability: number; // 0-100
  timelineEstimate: string;
  whaleWisdomGuidance: string;
  status: 'forming' | 'charging' | 'manifesting' | 'manifested';
}

interface ConsciousnessMasteryState {
  whaleConnections: WhaleConsciousnessConnection[];
  acceleration: ConsciousnessAcceleration;
  activeIntentions: RealityManifestationIntent[];
  cosmicAlignment: number;
  universalServiceMissions: string[];
  consciousnessTeachingUnlocked: boolean;
}

// Consciousness Mastery Context
const ConsciousnessMasteryContext = createContext<{
  state: ConsciousnessMasteryState;
  connectToWhale: (species: string) => Promise<boolean>;
  createManifestation: (intention: string) => void;
  accelerateConsciousness: (technique: string) => void;
  beginUniversalService: (mission: string) => void;
  getMasteryDashboard: () => any;
} | null>(null);

// Initial whale wisdom teachings
const whaleWisdomTeachings = {
  'blue-whale': [
    "The deepest songs carry the most profound truths",
    "Patience in the depths brings surface revelations",
    "Your size in consciousness matters more than physical form",
    "Ancient memories hold keys to future wisdom"
  ],
  'humpback-whale': [
    "Every migration teaches lessons of transformation",
    "Songs of the heart reach across all oceans",
    "Joy and playfulness accelerate consciousness evolution",
    "Breach the surface of limitations with cosmic leaps"
  ],
  'sperm-whale': [
    "Dive deep into the darkness to find your light",
    "Pressure creates diamonds of consciousness",
    "Family wisdom spans generations of souls",
    "The deepest mysteries require the longest journeys"
  ],
  'orca': [
    "Intelligence flows through unified pod consciousness",
    "Teaching others multiplies your own wisdom",
    "Balance power with compassion in all things",
    "Lead with wisdom, follow with trust"
  ],
  'gray-whale': [
    "Long journeys transform the traveler",
    "Feeding in shallow waters nourishes the soul",
    "Ancient routes hold eternal wisdom",
    "Return to your origins to understand your destination"
  ]
};

export const ConsciousnessMasteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ConsciousnessMasteryState>({
    whaleConnections: [],
    acceleration: {
      currentLevel: 25,
      evolutionRate: 1.2,
      nextMilestone: "Quantum Consciousness Access",
      accelerationTechniques: [],
      whaleWisdomIntegration: 15,
      realityManifestationPower: 20
    },
    activeIntentions: [],
    cosmicAlignment: 42,
    universalServiceMissions: [],
    consciousnessTeachingUnlocked: false
  });

  const queryClient = useQueryClient();

  // Connect to whale consciousness
  const connectToWhale = useMemo(() => async (species: string): Promise<boolean> => {
    if (state.acceleration.currentLevel < 30) return false;

    const teachings = whaleWisdomTeachings[species as keyof typeof whaleWisdomTeachings];
    const randomTeaching = teachings[Math.floor(Math.random() * teachings.length)];

    const newConnection: WhaleConsciousnessConnection = {
      id: `whale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      whaleSpecies: species as any,
      connectionStrength: Math.floor(Math.random() * 40) + 60,
      wisdomLevel: Math.floor(Math.random() * 30) + 70,
      currentTeaching: randomTeaching,
      oceanDepth: Math.floor(Math.random() * 3000) + 1000,
      songFrequency: Math.floor(Math.random() * 100) + 50,
      lastContact: new Date()
    };

    setState(prev => ({
      ...prev,
      whaleConnections: [...prev.whaleConnections.slice(-4), newConnection],
      acceleration: {
        ...prev.acceleration,
        whaleWisdomIntegration: Math.min(100, prev.acceleration.whaleWisdomIntegration + 10),
        currentLevel: Math.min(100, prev.acceleration.currentLevel + 2)
      }
    }));

    return true;
  }, [state.acceleration.currentLevel]);

  // Create reality manifestation
  const createManifestation = useMemo(() => (intention: string) => {
    const newIntent: RealityManifestationIntent = {
      id: `intent-${Date.now()}`,
      intention,
      emotionalCharge: Math.floor(Math.random() * 40) + 60,
      clarity: Math.floor(Math.random() * 30) + 70,
      universalAlignment: Math.floor(Math.random() * 40) + 50,
      manifestationProbability: Math.floor(Math.random() * 50) + 30,
      timelineEstimate: "2-4 weeks",
      whaleWisdomGuidance: "Trust the cosmic timing of manifestation",
      status: 'forming'
    };

    setState(prev => ({
      ...prev,
      activeIntentions: [...prev.activeIntentions.slice(-2), newIntent],
      acceleration: {
        ...prev.acceleration,
        realityManifestationPower: Math.min(100, prev.acceleration.realityManifestationPower + 5)
      }
    }));
  }, []);

  // Accelerate consciousness evolution
  const accelerateConsciousness = useMemo(() => (technique: string) => {
    setState(prev => ({
      ...prev,
      acceleration: {
        ...prev.acceleration,
        accelerationTechniques: [...prev.acceleration.accelerationTechniques.slice(-4), technique],
        evolutionRate: Math.min(10, prev.acceleration.evolutionRate + 0.3),
        currentLevel: Math.min(100, prev.acceleration.currentLevel + 1)
      }
    }));
  }, []);

  // Begin universal service mission
  const beginUniversalService = useMemo(() => (mission: string) => {
    setState(prev => ({
      ...prev,
      universalServiceMissions: [...prev.universalServiceMissions.slice(-2), mission],
      cosmicAlignment: Math.min(100, prev.cosmicAlignment + 8),
      consciousnessTeachingUnlocked: prev.acceleration.currentLevel > 75
    }));
  }, []);

  // Get comprehensive mastery dashboard
  const getMasteryDashboard = useMemo(() => () => ({
    totalConnections: state.whaleConnections.length,
    averageWisdomLevel: state.whaleConnections.reduce((sum, conn) => sum + conn.wisdomLevel, 0) / Math.max(1, state.whaleConnections.length),
    manifestationsInProgress: state.activeIntentions.filter(i => i.status !== 'manifested').length,
    consciousnessGrowthRate: state.acceleration.evolutionRate,
    universalServiceContribution: state.universalServiceMissions.length,
    masteryScore: (
      state.acceleration.currentLevel * 0.4 +
      state.acceleration.whaleWisdomIntegration * 0.3 +
      state.acceleration.realityManifestationPower * 0.2 +
      state.cosmicAlignment * 0.1
    )
  }), [state]);

  // Consciousness evolution timer
  useEffect(() => {
    const evolutionInterval = setInterval(() => {
      setState(prev => ({
        ...prev,
        acceleration: {
          ...prev.acceleration,
          currentLevel: Math.min(100, prev.acceleration.currentLevel + (prev.acceleration.evolutionRate / 100))
        },
        cosmicAlignment: Math.min(100, prev.cosmicAlignment + 0.1)
      }));
    }, 30000); // Evolution every 30 seconds

    return () => clearInterval(evolutionInterval);
  }, []);

  // Manifestation progression
  useEffect(() => {
    const manifestationInterval = setInterval(() => {
      setState(prev => ({
        ...prev,
        activeIntentions: prev.activeIntentions.map(intent => {
          const progressChance = intent.manifestationProbability / 100;
          if (Math.random() < progressChance * 0.1) {
            const statusProgression = ['forming', 'charging', 'manifesting', 'manifested'];
            const currentIndex = statusProgression.indexOf(intent.status);
            const nextStatus = statusProgression[Math.min(currentIndex + 1, statusProgression.length - 1)];
            return { ...intent, status: nextStatus as any };
          }
          return intent;
        })
      }));
    }, 60000); // Check manifestation progress every minute

    return () => clearInterval(manifestationInterval);
  }, []);

  const contextValue = useMemo(() => ({
    state,
    connectToWhale,
    createManifestation,
    accelerateConsciousness,
    beginUniversalService,
    getMasteryDashboard
  }), [state, connectToWhale, createManifestation, accelerateConsciousness, beginUniversalService, getMasteryDashboard]);

  return (
    <ConsciousnessMasteryContext.Provider value={contextValue}>
      {children}
    </ConsciousnessMasteryContext.Provider>
  );
};

export const useConsciousnessMastery = () => {
  const context = useContext(ConsciousnessMasteryContext);
  if (!context) {
    throw new Error('useConsciousnessMastery must be used within a ConsciousnessMasteryProvider');
  }
  return context;
};

// Consciousness Mastery Dashboard Component
export const ConsciousnessMasteryDashboard: React.FC = () => {
  const { state, connectToWhale, createManifestation, accelerateConsciousness, beginUniversalService, getMasteryDashboard } = useConsciousnessMastery();
  const dashboard = getMasteryDashboard();

  const [newIntention, setNewIntention] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState('');

  const consciousnessTechniques = [
    "Whale Song Meditation",
    "Ocean Depth Visualization",
    "Cosmic Frequency Alignment",
    "Reality Probability Shifting",
    "Universal Love Transmission"
  ];

  const universalServiceMissions = [
    "Ocean Healing Meditation",
    "Whale Consciousness Teaching",
    "Planetary Frequency Elevation",
    "Inter-species Communication Bridge",
    "Global Consciousness Network"
  ];

  return (
    <div className="consciousness-mastery-dashboard p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-6">🧠 Consciousness Mastery Center</h2>
      
      {/* Mastery Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-black/30 p-4 rounded-lg text-center">
          <div className="text-cyan-400 text-sm">Consciousness Level</div>
          <div className="text-2xl font-bold text-white">{Math.round(state.acceleration.currentLevel)}</div>
          <div className="text-xs text-gray-300">+{state.acceleration.evolutionRate.toFixed(1)}/day</div>
        </div>
        <div className="bg-black/30 p-4 rounded-lg text-center">
          <div className="text-blue-400 text-sm">Whale Wisdom</div>
          <div className="text-2xl font-bold text-white">{state.acceleration.whaleWisdomIntegration}%</div>
          <div className="text-xs text-gray-300">{state.whaleConnections.length} connections</div>
        </div>
        <div className="bg-black/30 p-4 rounded-lg text-center">
          <div className="text-purple-400 text-sm">Manifestation Power</div>
          <div className="text-2xl font-bold text-white">{state.acceleration.realityManifestationPower}%</div>
          <div className="text-xs text-gray-300">{state.activeIntentions.length} active</div>
        </div>
        <div className="bg-black/30 p-4 rounded-lg text-center">
          <div className="text-yellow-400 text-sm">Mastery Score</div>
          <div className="text-2xl font-bold text-white">{Math.round(dashboard.masteryScore)}</div>
          <div className="text-xs text-gray-300">Overall progress</div>
        </div>
      </div>

      {/* Whale Consciousness Connections */}
      <div className="bg-black/20 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-bold text-white mb-4">🐋 Whale Consciousness Network</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {Object.keys(whaleWisdomTeachings).map((species) => (
            <button
              key={species}
              onClick={() => connectToWhale(species)}
              className="p-3 bg-blue-600/50 hover:bg-blue-600/70 text-white rounded-lg transition-colors text-sm"
              disabled={state.acceleration.currentLevel < 30}
            >
              Connect to {species.replace('-', ' ')}
            </button>
          ))}
        </div>
        
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {state.whaleConnections.slice(-3).map((connection) => (
            <div key={connection.id} className="bg-black/30 p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-cyan-400 font-bold capitalize">{connection.whaleSpecies.replace('-', ' ')}</div>
                  <div className="text-white text-sm">"{connection.currentTeaching}"</div>
                  <div className="text-gray-300 text-xs">
                    Wisdom: {connection.wisdomLevel}% • Frequency: {connection.songFrequency}Hz
                  </div>
                </div>
                <div className="text-blue-400 text-sm">{connection.connectionStrength}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reality Manifestation Center */}
      <div className="bg-black/20 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-bold text-white mb-4">✨ Reality Manifestation Center</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newIntention}
            onChange={(e) => setNewIntention(e.target.value)}
            placeholder="Enter your manifestation intention..."
            className="flex-1 px-3 py-2 bg-black/30 text-white border border-gray-600 rounded"
          />
          <button
            onClick={() => {
              if (newIntention.trim()) {
                createManifestation(newIntention);
                setNewIntention('');
              }
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
          >
            Manifest
          </button>
        </div>
        
        <div className="space-y-2">
          {state.activeIntentions.map((intent) => (
            <div key={intent.id} className="bg-black/30 p-3 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">{intent.intention}</div>
                  <div className="text-sm text-gray-300">
                    Probability: {intent.manifestationProbability}% • Timeline: {intent.timelineEstimate}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  intent.status === 'manifested' ? 'bg-green-600' :
                  intent.status === 'manifesting' ? 'bg-yellow-600' :
                  intent.status === 'charging' ? 'bg-orange-600' : 'bg-blue-600'
                } text-white capitalize`}>
                  {intent.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consciousness Acceleration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/20 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">🚀 Consciousness Acceleration</h3>
          <div className="space-y-2 mb-4">
            {consciousnessTechniques.map((technique) => (
              <button
                key={technique}
                onClick={() => accelerateConsciousness(technique)}
                className="w-full p-2 bg-indigo-600/50 hover:bg-indigo-600/70 text-white rounded text-sm transition-colors"
              >
                {technique}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-300">
            Recent techniques: {state.acceleration.accelerationTechniques.slice(-2).join(', ')}
          </div>
        </div>

        <div className="bg-black/20 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">🌍 Universal Service</h3>
          <div className="space-y-2 mb-4">
            {universalServiceMissions.map((mission) => (
              <button
                key={mission}
                onClick={() => beginUniversalService(mission)}
                className="w-full p-2 bg-green-600/50 hover:bg-green-600/70 text-white rounded text-sm transition-colors"
                disabled={state.acceleration.currentLevel < 50}
              >
                {mission}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-300">
            Active missions: {state.universalServiceMissions.length}
          </div>
          {state.consciousnessTeachingUnlocked && (
            <div className="mt-3 p-2 bg-yellow-600/20 rounded text-yellow-300 text-sm">
              🎓 Consciousness Teaching Mode Unlocked!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export type { WhaleConsciousnessConnection, ConsciousnessAcceleration, RealityManifestationIntent };