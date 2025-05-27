import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CosmicBackground } from "@/components/features/cosmic/CosmicBackground";
import { SacredGeometryDemo } from "@/components/cosmic/SacredGeometryDemo";
import { SacredGeometryVisualizer } from "@/components/cosmic/SacredGeometryVisualizer";
import { FrequencyAttunementChamber } from "@/components/immersive/FrequencyAttunementChamber";
import { BreathSynchronizationCeremony } from "@/components/immersive/BreathSynchronizationCeremony";
import { MultidimensionalSoundJourney } from "@/components/immersive/MultidimensionalSoundJourney";
import { BreathSyncPlayer } from "@/components/features/audio/BreathSyncPlayer";
import { BinauralBeatGenerator } from "@/components/features/audio/BinauralBeatGenerator";
import { CosmicButton } from "@/components/features/cosmic/CosmicButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Music,
  Infinity,
  Waves,
  ArrowRight,
  Globe,
  Zap,
  Star,
  Play,
  Pause,
  Volume2,
} from "lucide-react";

interface WhaleSpecies {
  id: string;
  name: string;
  frequency: string;
  wisdom: string;
  resonance: number;
  consciousness: string;
  currentWisdom: string;
  effectiveness: number;
}

interface ConsciousnessSession {
  isActive: boolean;
  species: string;
  duration: number;
  resonanceLevel: number;
  wisdomReceived: string;
  frequency: number;
}

export default function CosmicConnectivityPage() {
  const [tracks, setTracks] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Enhanced whale wisdom state
  const [selectedWhale, setSelectedWhale] = useState<string>('');
  const [consciousnessSession, setConsciousnessSession] = useState<ConsciousnessSession>({
    isActive: false,
    species: '',
    duration: 0,
    resonanceLevel: 0,
    wisdomReceived: '',
    frequency: 0
  });
  
  const [whaleSpecies] = useState<WhaleSpecies[]>([
    {
      id: 'humpback',
      name: 'Humpback Whale',
      frequency: '20-9000 Hz',
      wisdom: 'Communication & Song Mastery',
      resonance: 87,
      consciousness: 'Ancient ocean melodies that bridge dimensions',
      currentWisdom: 'Trust the currents of change, for they carry you toward your deepest purpose',
      effectiveness: 94
    },
    {
      id: 'blue',
      name: 'Blue Whale',
      frequency: '10-40 Hz',
      wisdom: 'Deep Ocean Consciousness',
      resonance: 91,
      consciousness: 'Profound depths of infinite awareness',
      currentWisdom: 'In the silence between heartbeats lies the wisdom of eternity',
      effectiveness: 89
    },
    {
      id: 'orca',
      name: 'Orca Whale',
      frequency: '500-25000 Hz',
      wisdom: 'Family & Community Bonds',
      resonance: 83,
      consciousness: 'Collective intelligence and social harmony',
      currentWisdom: 'Together we are stronger than the sum of our individual gifts',
      effectiveness: 91
    },
    {
      id: 'gray',
      name: 'Gray Whale',
      frequency: '20-200 Hz',
      wisdom: 'Ancient Migration Memory',
      resonance: 79,
      consciousness: 'Timeless wisdom of countless journeys',
      currentWisdom: 'Every ending is a doorway to a more magnificent beginning',
      effectiveness: 86
    }
  ]);

  const [sessionHistory, setSessionHistory] = useState([
    { species: 'Humpback', duration: 28, effectiveness: 94, timestamp: '2 hours ago' },
    { species: 'Blue Whale', duration: 35, effectiveness: 89, timestamp: '1 day ago' },
    { species: 'Orca', duration: 22, effectiveness: 91, timestamp: '3 days ago' }
  ]);

  const startWhaleSession = (whaleId: string) => {
    const whale = whaleSpecies.find(w => w.id === whaleId);
    if (!whale) return;

    setSelectedWhale(whaleId);
    setConsciousnessSession({
      isActive: true,
      species: whale.name,
      duration: 0,
      resonanceLevel: whale.resonance,
      wisdomReceived: whale.currentWisdom,
      frequency: parseFloat(whale.frequency.split('-')[0])
    });

    toast({
      title: `🐋 Connecting with ${whale.name}`,
      description: `Tuning to ${whale.frequency} consciousness frequency`,
      duration: 3000,
    });
  };

  const endWhaleSession = () => {
    setConsciousnessSession(prev => ({ ...prev, isActive: false }));
    setSelectedWhale('');
    
    toast({
      title: "🌊 Session Complete",
      description: "Whale wisdom integrated into your consciousness",
      duration: 3000,
    });
  };

  useEffect(() => {
    setTracks([]);

    toast({
      title: "🌊 Welcome to Whale Consciousness Portal",
      description: "Connect with ancient marine wisdom and expand your awareness",
      duration: 5000,
    });
  }, [toast]);

  // Simulate session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (consciousnessSession.isActive) {
      interval = setInterval(() => {
        setConsciousnessSession(prev => ({
          ...prev,
          duration: prev.duration + 1,
          resonanceLevel: Math.min(100, prev.resonanceLevel + Math.random() * 0.5)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [consciousnessSession.isActive]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950/20 to-purple-950/30 text-white relative">
      {/* Dynamic Background with cosmic purple, cyan, and red theme */}
      <CosmicBackground
        color="dark-purple"
        nebulaEffect={true}
        particleCount={200}
        opacity={0.7}
      />

      {/* Header */}
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-red-400 to-purple-500">
            Cosmic Connectivity
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Explore the integrated cosmic sound healing experience that connects
            your consciousness to healing frequencies through advanced
            personalization, breath synchronization, and multidimensional sound
            journeys.
          </p>
        </div>

        {/* Album Cover - Dale the Whale's "Feels So Good" Integration */}
        <div className="max-w-lg mx-auto mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-red-500/10 to-purple-500/10 rounded-xl backdrop-blur-sm z-0"></div>
          <div className="relative z-10 p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg shadow-purple-500/20 border border-white/10">
              {/* Album cover image would go here - using a gradient placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-cyan-500 via-purple-500 to-red-500 flex items-center justify-center">
                <Star className="h-12 w-12 text-white/80" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-medium text-white mb-1">
                Powered by the Frequencies from
              </h3>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
                "Feels So Good"
              </h2>
              <p className="text-sm text-gray-300 mt-2">
                Immerse yourself in the healing vibrations of Dale the Whale's
                consciousness-expanding soundscapes
              </p>
            </div>
          </div>
        </div>

        {/* Whale Consciousness Portal Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-400 to-cyan-300">
            🐋 Whale Consciousness Portal 🌊
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-xl">
            Connect with ancient marine wisdom through authentic whale frequencies. 
            Experience consciousness expansion guided by the ocean's most profound teachers.
          </p>
        </motion.div>

        {/* Active Session Status */}
        <AnimatePresence>
          {consciousnessSession.isActive && (
            <motion.div
              className="max-w-4xl mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-teal-900/40 backdrop-blur-md rounded-xl p-6 border border-cyan-500/30">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-2">
                    🌊 Active Connection: {consciousnessSession.species}
                  </h3>
                  <p className="text-gray-300">Session Duration: {Math.floor(consciousnessSession.duration / 60)}:{(consciousnessSession.duration % 60).toString().padStart(2, '0')}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{consciousnessSession.frequency}Hz</div>
                    <p className="text-sm text-gray-400">Frequency</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{consciousnessSession.resonanceLevel.toFixed(1)}%</div>
                    <p className="text-sm text-gray-400">Resonance</p>
                  </div>
                  <div className="text-center">
                    <motion.div 
                      className="text-3xl font-bold text-teal-400"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ACTIVE
                    </motion.div>
                    <p className="text-sm text-gray-400">Status</p>
                  </div>
                </div>

                {consciousnessSession.wisdomReceived && (
                  <div className="bg-white/10 rounded-lg p-4 mb-6">
                    <p className="text-cyan-300 italic text-lg text-center">
                      "{consciousnessSession.wisdomReceived}"
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <Button 
                    onClick={endWhaleSession}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Complete Session 🌊
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Whale Species Selection */}
        {!consciousnessSession.isActive && (
          <motion.div 
            className="max-w-6xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                🐋 Choose Your Whale Consciousness Guide
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Each whale species offers unique wisdom and frequency patterns. Select the consciousness that resonates with your current spiritual journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whaleSpecies.map((whale, index) => (
                <motion.div
                  key={whale.id}
                  className="bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-md rounded-xl p-6 border border-cyan-500/20 cursor-pointer hover:border-cyan-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startWhaleSession(whale.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-cyan-300 mb-2">{whale.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{whale.wisdom}</p>
                      <p className="text-purple-400 text-sm">Frequency: {whale.frequency}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-400">{whale.resonance}%</div>
                      <p className="text-xs text-gray-400">Resonance</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Progress value={whale.resonance} className="h-2 mb-2" />
                    <p className="text-sm text-gray-300 italic">"{whale.consciousness}"</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <Badge className="bg-blue-100 text-blue-800">
                      {whale.effectiveness}% Effective
                    </Badge>
                    <div className="text-cyan-400 text-sm">
                      🎵 Click to Connect
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sacred Geometry Whale Synchronization */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-black/80 via-purple-900/30 to-black/80 backdrop-blur-md rounded-xl p-8 shadow-xl border border-cyan-500/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-400 to-cyan-300">
                🔯 Sacred Geometry Whale Synchronization
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                Watch sacred patterns respond to whale frequencies in real-time. 
                The geometry harmonizes with consciousness energy, creating profound spiritual resonance.
              </p>
            </div>
            <SacredGeometryVisualizer className="mx-auto max-w-5xl" />
            <div className="text-center mt-6">
              <div className="text-sm text-cyan-400 mb-2">
                🐋 Patterns sync with whale consciousness frequencies • Geometry responds to your spiritual resonance 🌊
              </div>
              {consciousnessSession.isActive && (
                <div className="text-purple-400 font-semibold">
                  Currently synchronized with {consciousnessSession.species} at {consciousnessSession.frequency}Hz
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Session History & Analytics */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-black/60 via-indigo-900/20 to-black/60 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-2xl font-bold text-purple-400 mb-6 text-center">
              🌊 Recent Whale Wisdom Sessions
            </h3>
            
            <div className="space-y-4">
              {sessionHistory.map((session, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-cyan-300">{session.species}</div>
                    <div className="text-sm text-gray-400">{session.timestamp}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-400">{session.duration}min</div>
                    <div className="text-xs text-gray-400">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-teal-400">{session.effectiveness}%</div>
                    <div className="text-xs text-gray-400">Effectiveness</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Cosmic Tabs */}
        <Tabs defaultValue="frequency" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/30 backdrop-blur-sm border border-white/5 rounded-xl">
            <TabsTrigger value="frequency">
              <Zap className="h-4 w-4 mr-2" />
              Frequency Attunement
            </TabsTrigger>
            <TabsTrigger value="breath">
              <Waves className="h-4 w-4 mr-2" />
              Breath Synchronization
            </TabsTrigger>
            <TabsTrigger value="sound">
              <Music className="h-4 w-4 mr-2" />
              Sound Journey
            </TabsTrigger>
          </TabsList>

          {/* Frequency Attunement Tab */}
          <TabsContent value="frequency" className="space-y-8">
            <div className="bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-cyan-500/10">
              <h2 className="text-2xl font-semibold mb-6 text-white">
                Frequency Attunement Chamber
              </h2>
              <FrequencyAttunementChamber />
              <div className="mt-4 text-center">
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Attune your consciousness to specific vibrational states. The
                  chamber adapts to your energetic needs and allows you to blend
                  environmental resonances for a more immersive experience.
                </p>
              </div>
            </div>

            {/* Binaural Beat Generator */}
            <div className="bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-cyan-500/10">
              <h2 className="text-2xl font-semibold mb-4">
                Binaural Beat Generator
              </h2>
              <p className="text-gray-300 mb-6">
                Generate custom binaural beats to induce specific states of
                consciousness. Binaural beats occur when two slightly different
                frequencies are played separately in each ear, creating a third
                "beat" frequency that can influence brain waves.
              </p>
              <BinauralBeatGenerator />
            </div>
          </TabsContent>

          {/* Breath Synchronization Tab */}
          <TabsContent value="breath" className="space-y-8">
            <div className="bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-red-500/10">
              <h2 className="text-2xl font-semibold mb-6 text-white">
                Breath Synchronization Ceremony
              </h2>
              <BreathSynchronizationCeremony />
              <div className="mt-4 text-center">
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Harmonize your life force with cosmic rhythms. Choose from
                  ancient breathing patterns or create your own sacred rhythm to
                  deepen your connection with universal consciousness.
                </p>
              </div>
            </div>

            {/* Synchronized Breath & Music Player */}
            <div className="bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-red-500/10">
              <h2 className="text-2xl font-semibold mb-4">
                Synchronized Breath & Music Player
              </h2>
              <p className="text-gray-300 mb-6">
                This player synchronizes breathing patterns with music playback,
                creating a deeply immersive experience. Select different
                breathing patterns and follow the visual cues to synchronize
                your breath.
              </p>
              <BreathSyncPlayer tracks={tracks} />
            </div>
          </TabsContent>

          {/* Sound Journey Tab */}
          <TabsContent value="sound" className="space-y-8">
            <div className="bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-purple-500/10">
              <h2 className="text-2xl font-semibold mb-6 text-white">
                Multidimensional Sound Journey
              </h2>
              <MultidimensionalSoundJourney />
              <div className="mt-4 text-center">
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Experience healing frequencies across dimensions. Sound
                  spirals around your consciousness, creating a portal to deeper
                  states of awareness and cosmic connection.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto py-10 md:py-12 px-4">
        <div className="bg-gradient-to-r from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
          <div className="grid gap-4 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-white">
                Begin Your Transformation
              </h2>
              <p className="text-gray-300">
                Experience a comprehensive journey through cosmic consciousness
                technologies with our integrated tools designed to elevate your
                vibrational state and connect you with universal energy.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
              <Link href="/shop">
                <CosmicButton
                  variant="secondary"
                  className="bg-gradient-to-r from-cyan-700/80 to-cyan-900/80 hover:from-cyan-600/80 hover:to-cyan-800/80"
                >
                  Explore Products
                </CosmicButton>
              </Link>
              <Link href="/music-release">
                <CosmicButton
                  variant="primary"
                  icon={<ArrowRight className="h-4 w-4" />}
                  className="bg-gradient-to-r from-purple-700/80 to-purple-900/80 hover:from-purple-600/80 hover:to-purple-800/80"
                >
                  Listen to Music
                </CosmicButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12"></div>
    </div>
  );
}