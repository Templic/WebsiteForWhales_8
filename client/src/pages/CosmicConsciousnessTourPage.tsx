import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, ExternalLink, Music, Navigation, Star, 
  Globe, Users, Ticket, Filter, Search, Share2, ChevronLeft, 
  ChevronRight, Sparkles, Brain, Waves, Eye, Heart, Zap
} from 'lucide-react';

interface ConsciousnessTourEvent {
  id: string;
  title: string;
  venue: string;
  location: string;
  city: string;
  country: string;
  date: string;
  time: string;
  description: string;
  ticketUrl?: string;
  venueWebsite?: string;
  capacity?: number;
  price?: string;
  status: 'upcoming' | 'sold-out' | 'cancelled' | 'announced' | 'past';
  coordinates?: {
    lat: number;
    lng: number;
  };
  type: 'concert' | 'meditation' | 'workshop' | 'festival' | 'consciousness-session';
  featured?: boolean;
  consciousnessLevel: number; // 1-10 scale
  whaleWisdomIntensity: number; // 1-10 scale
  cosmicAlignment: string;
  chakraActivations: string[];
  expectedTransformations: string[];
  consciousnessGuidance?: string;
}

interface TourStats {
  totalShows: number;
  citiesVisited: number;
  countriesVisited: number;
  consciousnessAwakenings: number;
  totalSoulsReached: number;
}

const CosmicConsciousnessTourPage: React.FC = () => {
  const [tourEvents, setTourEvents] = useState<ConsciousnessTourEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ConsciousnessTourEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ConsciousnessTourEvent | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TourStats | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [consciousnessInsights, setConsciousnessInsights] = useState<string[]>([]);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        
        // Fetch tour data from API
        const response = await fetch('/api/tour/consciousness-events');
        
        if (!response.ok) {
          // If API is not available, show error message
          throw new Error('Tour data service is not available');
        }
        
        const data = await response.json();
        setTourEvents(data.events || []);
        setStats(data.stats || null);
        setConsciousnessInsights(data.insights || []);
        
      } catch (error) {
        console.error('Failed to fetch consciousness tour data:', error);
        
        // Show user-friendly error message
        setTourEvents([]);
        setStats(null);
        setConsciousnessInsights([
          "The cosmic consciousness tour data portal is currently aligning with higher dimensions.",
          "Please check your connection to the universal consciousness network.",
          "Contact support if you need assistance accessing the tour information."
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = tourEvents;

    if (activeFilter !== 'all') {
      if (activeFilter === 'upcoming') {
        filtered = filtered.filter(event => 
          event.status === 'upcoming' || event.status === 'announced'
        );
      } else if (activeFilter === 'past') {
        filtered = filtered.filter(event => event.status === 'past');
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.cosmicAlignment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [tourEvents, activeFilter, searchQuery]);

  const handleShare = async (event: ConsciousnessTourEvent) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${event.title} - Dale's Consciousness Journey`,
          text: `Join Dale for ${event.title} at ${event.venue} - A cosmic consciousness experience`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Simple notification without external dependencies
        const notification = document.createElement('div');
        notification.textContent = 'Link copied to clipboard!';
        notification.style.cssText = `
          position: fixed; top: 20px; right: 20px; z-index: 1000;
          background: rgba(0, 255, 255, 0.9); color: black; padding: 12px 24px;
          border-radius: 8px; font-weight: bold;
        `;
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  const getConsciousnessLevelColor = (level: number) => {
    if (level >= 8) return 'from-purple-500 to-pink-500';
    if (level >= 6) return 'from-blue-500 to-purple-500';
    if (level >= 4) return 'from-cyan-500 to-blue-500';
    return 'from-green-500 to-cyan-500';
  };

  const featuredEvents = filteredEvents.filter(event => event.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-purple-400/30 rounded-full"></div>
            <div className="absolute inset-2 border-4 border-t-purple-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-cyan-100 text-lg">Aligning with cosmic consciousness frequencies...</p>
          <p className="text-cyan-100/60 text-sm mt-2">Downloading whale wisdom from the ethers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-cyan-900 relative overflow-hidden">
      {/* Animated Cosmic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500" />
        
        {/* Floating consciousness particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Sparkles className="w-16 h-16 text-cyan-400 animate-pulse" />
                <div className="absolute -top-2 -right-2">
                  <Brain className="w-8 h-8 text-purple-400 animate-bounce" />
                </div>
              </div>
            </div>
            
            <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Consciousness Awakening Tour
            </h1>
            <p className="text-xl text-cyan-100/80 max-w-4xl mx-auto mb-8 leading-relaxed">
              Embark on transformative journeys through expanded consciousness, whale wisdom transmissions, 
              and cosmic soundscapes that awaken your inner cosmic nature across sacred venues worldwide
            </p>
            
            {/* Consciousness Insights */}
            {consciousnessInsights.length > 0 && (
              <div className="max-w-3xl mx-auto mb-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6"
                >
                  <div className="flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-cyan-400 mr-2" />
                    <span className="text-cyan-400 font-medium">Cosmic Consciousness Transmission</span>
                  </div>
                  <p className="text-cyan-100/80 italic text-center">
                    "{consciousnessInsights[0]}"
                  </p>
                </motion.div>
              </div>
            )}
            
            {/* Tour Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20">
                  <div className="text-2xl font-bold text-cyan-400">{stats.totalShows}</div>
                  <div className="text-sm text-cyan-100/70">Consciousness Sessions</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">{stats.citiesVisited}</div>
                  <div className="text-sm text-cyan-100/70">Sacred Cities</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-pink-500/20">
                  <div className="text-2xl font-bold text-pink-400">{stats.countriesVisited}</div>
                  <div className="text-sm text-cyan-100/70">Countries</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">{stats.consciousnessAwakenings}</div>
                  <div className="text-sm text-cyan-100/70">Awakenings</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/20">
                  <div className="text-2xl font-bold text-yellow-400">{stats.totalSoulsReached.toLocaleString()}</div>
                  <div className="text-sm text-cyan-100/70">Souls Touched</div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search consciousness sessions, venues, or cosmic alignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-cyan-500/20 rounded-lg text-white placeholder:text-cyan-100/50 focus:outline-none focus:border-cyan-400/40 transition-colors"
              />
            </div>
            
            <div className="flex gap-2">
              {(['all', 'upcoming', 'past'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 ${
                    activeFilter === filter
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                      : 'border border-cyan-500/20 text-cyan-300 hover:bg-cyan-600/20'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Events Display */}
          {filteredEvents.length > 0 ? (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center flex items-center justify-center gap-3">
                <Waves className="w-8 h-8" />
                {activeFilter === 'upcoming' ? 'Upcoming Consciousness Sessions' : 
                 activeFilter === 'past' ? 'Past Awakening Experiences' : 'All Consciousness Events'}
                <Waves className="w-8 h-8" />
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-400/40 transition-all cursor-pointer group h-full rounded-xl overflow-hidden"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'upcoming' ? 'bg-green-600/80 text-white' :
                          event.status === 'sold-out' ? 'bg-red-600/80 text-white' :
                          event.status === 'announced' ? 'bg-blue-600/80 text-white' : 'bg-gray-600/80 text-white'
                        }`}>
                          {event.status.replace('-', ' ').toUpperCase()}
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-medium border border-cyan-500/20 text-cyan-300">
                          {event.type.replace('-', ' ').toUpperCase()}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-3">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-cyan-300 text-sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center text-cyan-300 text-sm">
                          <Navigation className="w-4 h-4 mr-2" />
                          <span>{event.city}, {event.country}</span>
                        </div>
                        <div className="flex items-center text-purple-300 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-purple-300 text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      
                      {/* Consciousness Level Indicator */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-cyan-100/70">Consciousness Level</span>
                          <span className="text-sm font-bold text-cyan-400">{event.consciousnessLevel}/10</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${getConsciousnessLevelColor(event.consciousnessLevel)}`}
                            style={{ width: `${(event.consciousnessLevel / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <p className="text-cyan-100/80 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {event.capacity && (
                            <div className="flex items-center text-cyan-300 text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              <span>{event.capacity}</span>
                            </div>
                          )}
                          {event.price && (
                            <div className="flex items-center text-green-300 text-xs">
                              <Ticket className="w-3 h-3 mr-1" />
                              <span>{event.price}</span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(event);
                          }}
                          className="text-cyan-300 hover:text-white transition-colors p-2 hover:bg-cyan-600/20 rounded-full"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <Brain className="w-20 h-20 text-cyan-400/50" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-8 h-8 text-purple-400/50" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Consciousness Sessions Found</h3>
                <p className="text-cyan-100/60 leading-relaxed">
                  {searchQuery 
                    ? "No consciousness sessions match your search. Try exploring different cosmic alignments or expand your search."
                    : "The cosmic consciousness tour portal is currently integrating with higher dimensional frequencies. New sessions will manifest as universal timing aligns."
                  }
                </p>
              </div>
            </div>
          )}

          {/* Newsletter Signup */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-20 text-center"
          >
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-900/40 to-cyan-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
              <div className="flex justify-center mb-6">
                <Zap className="w-12 h-12 text-cyan-400 animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Join the Cosmic Consciousness Network</h3>
              <p className="text-cyan-100/80 mb-8 leading-relaxed">
                Receive transmissions about new consciousness awakening sessions, whale wisdom gatherings, 
                and exclusive cosmic frequency alignments directly to your consciousness portal
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your consciousness frequency (email)..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-cyan-500/20 rounded-lg text-white placeholder:text-cyan-100/50 focus:outline-none focus:border-cyan-400/40 transition-colors"
                />
                <button className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  Align
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900/95 to-cyan-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-4xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                  <div className="flex gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedEvent.status === 'upcoming' ? 'bg-green-600/80 text-white' :
                      selectedEvent.status === 'sold-out' ? 'bg-red-600/80 text-white' :
                      selectedEvent.status === 'announced' ? 'bg-blue-600/80 text-white' : 'bg-gray-600/80 text-white'
                    }`}>
                      {selectedEvent.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium border border-cyan-500/20 text-cyan-300">
                      {selectedEvent.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-cyan-300 hover:text-white transition-colors text-3xl font-light"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Event Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start text-cyan-300">
                      <Globe className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">{selectedEvent.venue}</div>
                        <div className="text-sm opacity-80">{selectedEvent.location}</div>
                        <div className="text-sm opacity-80">{selectedEvent.city}, {selectedEvent.country}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-purple-300">
                      <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>{new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center text-purple-300">
                      <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    {selectedEvent.capacity && (
                      <div className="flex items-center text-cyan-300">
                        <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span>{selectedEvent.capacity} consciousness vessels</span>
                      </div>
                    )}
                    {selectedEvent.price && (
                      <div className="flex items-center text-green-300">
                        <Ticket className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span>{selectedEvent.price}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Consciousness Experience
                  </h4>
                  
                  {/* Consciousness Level */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cyan-100/70">Consciousness Level</span>
                      <span className="text-sm font-bold text-cyan-400">{selectedEvent.consciousnessLevel}/10</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full bg-gradient-to-r ${getConsciousnessLevelColor(selectedEvent.consciousnessLevel)}`}
                        style={{ width: `${(selectedEvent.consciousnessLevel / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Whale Wisdom Intensity */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cyan-100/70">Whale Wisdom Intensity</span>
                      <span className="text-sm font-bold text-purple-400">{selectedEvent.whaleWisdomIntensity}/10</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${(selectedEvent.whaleWisdomIntensity / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-cyan-400 font-medium">Cosmic Alignment:</span>
                      <span className="text-cyan-100/80 ml-2">{selectedEvent.cosmicAlignment}</span>
                    </div>
                    {selectedEvent.chakraActivations.length > 0 && (
                      <div>
                        <span className="text-cyan-400 font-medium">Chakra Activations:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedEvent.chakraActivations.map((chakra, index) => (
                            <span 
                              key={index}
                              className="text-xs px-2 py-1 bg-purple-600/30 rounded-full text-purple-200"
                            >
                              {chakra}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-xl font-bold text-cyan-400 mb-4">About This Consciousness Experience</h4>
                <p className="text-cyan-100/80 leading-relaxed mb-4">{selectedEvent.description}</p>
                
                {selectedEvent.consciousnessGuidance && (
                  <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/20 rounded-lg p-4">
                    <h5 className="text-cyan-400 font-medium mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Consciousness Guidance from Dale
                    </h5>
                    <p className="text-cyan-100/80 text-sm italic">"{selectedEvent.consciousnessGuidance}"</p>
                  </div>
                )}
              </div>
              
              {selectedEvent.expectedTransformations.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Expected Transformations
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedEvent.expectedTransformations.map((transformation, index) => (
                      <div key={index} className="flex items-center text-cyan-100/80 text-sm">
                        <Zap className="w-3 h-3 mr-2 text-cyan-400 flex-shrink-0" />
                        <span>{transformation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 justify-center">
                {selectedEvent.ticketUrl && (
                  <a 
                    href={selectedEvent.ticketUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                  >
                    <Ticket className="w-4 h-4" />
                    Join This Experience
                  </a>
                )}
                {selectedEvent.venueWebsite && (
                  <a 
                    href={selectedEvent.venueWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-600/20 font-semibold rounded-lg transition-all flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Sacred Venue Info
                  </a>
                )}
                <button 
                  onClick={() => handleShare(selectedEvent)}
                  className="px-6 py-3 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-600/20 font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Consciousness
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CosmicConsciousnessTourPage;