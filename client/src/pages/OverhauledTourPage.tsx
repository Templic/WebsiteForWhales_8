import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, ExternalLink, Music, Navigation, Star, 
  Phone, Globe, Users, Ticket, Filter, Search, Heart, Share2,
  ChevronLeft, ChevronRight, Play, Pause, Volume2, Sparkles,
  Brain, Waves, Eye
} from 'lucide-react';
import { useConsciousnessAI, useAICompanion } from '@/lib/ConsciousnessAI';

interface TourEvent {
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
  image?: string;
  setlist?: string[];
  type: 'concert' | 'meditation' | 'workshop' | 'festival' | 'private';
  featured?: boolean;
  ticketsSold?: number;
  artistNote?: string;
}

interface TourStats {
  totalShows: number;
  citiesVisited: number;
  countriesVisited: number;
  totalAttendance: number;
}

const OverhauledTourPage: React.FC = () => {
  const [tourEvents, setTourEvents] = useState<TourEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TourEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TourEvent | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TourStats | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tour/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch tour data');
        }
        
        const data = await response.json();
        setTourEvents(data.events || []);
        setStats(data.stats || null);
      } catch (error) {
        console.error('Failed to fetch tour data:', error);
        toast({
          title: "Unable to load tour data",
          description: "Please check your connection and try again.",
          variant: "destructive"
        });
        
        // Only show this message, don't use fallback data
        setTourEvents([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [toast]);

  // Filter and search logic
  useEffect(() => {
    let filtered = tourEvents;

    // Apply status filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'upcoming') {
        filtered = filtered.filter(event => 
          event.status === 'upcoming' || event.status === 'announced'
        );
      } else if (activeFilter === 'past') {
        filtered = filtered.filter(event => event.status === 'past');
      }
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [tourEvents, activeFilter, searchQuery]);

  const handleShare = async (event: TourEvent) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${event.title} - Dale Loves Whales`,
          text: `Join Dale for ${event.title} at ${event.venue}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Event link has been copied to clipboard."
      });
    }
  };

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const upcomingEvents = filteredEvents.filter(event => 
    event.status === 'upcoming' || event.status === 'announced'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-100 text-lg">Loading cosmic tour data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-cyan-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Cosmic Journey Tour
            </h1>
            <p className="text-xl text-cyan-100/80 max-w-3xl mx-auto mb-8">
              Embark on transformative journeys through consciousness, whale wisdom, and cosmic soundscapes across sacred venues worldwide
            </p>
            
            {/* Tour Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-cyan-400">{stats.totalShows}</div>
                  <div className="text-sm text-cyan-100/70">Total Shows</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">{stats.citiesVisited}</div>
                  <div className="text-sm text-cyan-100/70">Cities</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-pink-400">{stats.countriesVisited}</div>
                  <div className="text-sm text-cyan-100/70">Countries</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">{stats.totalAttendance.toLocaleString()}</div>
                  <div className="text-sm text-cyan-100/70">Souls Touched</div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <Input
                placeholder="Search venues, cities, or events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-cyan-500/20 text-white placeholder:text-cyan-100/50"
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'upcoming', 'past'].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter as any)}
                  className={`${
                    activeFilter === filter
                      ? 'bg-cyan-600 hover:bg-cyan-700'
                      : 'border-cyan-500/20 text-cyan-300 hover:bg-cyan-600/20'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Events Carousel */}
          {featuredEvents.length > 0 && (
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">Featured Events</h2>
              <div className="relative max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/40 transition-all"
                  >
                    {featuredEvents[currentImageIndex] && (
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                          <Badge className="mb-4 bg-gradient-to-r from-cyan-600 to-purple-600">
                            Featured Event
                          </Badge>
                          <h3 className="text-3xl font-bold text-white mb-4">
                            {featuredEvents[currentImageIndex].title}
                          </h3>
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center text-cyan-300">
                              <MapPin className="w-5 h-5 mr-3" />
                              <span>{featuredEvents[currentImageIndex].venue}, {featuredEvents[currentImageIndex].location}</span>
                            </div>
                            <div className="flex items-center text-purple-300">
                              <Calendar className="w-5 h-5 mr-3" />
                              <span>{new Date(featuredEvents[currentImageIndex].date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center text-purple-300">
                              <Clock className="w-5 h-5 mr-3" />
                              <span>{featuredEvents[currentImageIndex].time}</span>
                            </div>
                          </div>
                          <p className="text-cyan-100/80 mb-6 leading-relaxed">
                            {featuredEvents[currentImageIndex].description}
                          </p>
                          <div className="flex gap-3">
                            {featuredEvents[currentImageIndex].ticketUrl && (
                              <Button 
                                asChild
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                              >
                                <a 
                                  href={featuredEvents[currentImageIndex].ticketUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <Ticket className="w-4 h-4 mr-2" />
                                  Get Tickets
                                </a>
                              </Button>
                            )}
                            <Button 
                              variant="outline"
                              onClick={() => handleShare(featuredEvents[currentImageIndex])}
                              className="border-cyan-500/20 text-cyan-300 hover:bg-cyan-600/20"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                        <div className="relative">
                          {featuredEvents[currentImageIndex].image && (
                            <img
                              src={featuredEvents[currentImageIndex].image}
                              alt={featuredEvents[currentImageIndex].title}
                              className="w-full h-64 object-cover rounded-xl"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                
                {featuredEvents.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 border-cyan-500/20 text-cyan-300 hover:bg-cyan-600/20"
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? featuredEvents.length - 1 : prev - 1
                      )}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 border-cyan-500/20 text-cyan-300 hover:bg-cyan-600/20"
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === featuredEvents.length - 1 ? 0 : prev + 1
                      )}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </motion.section>
          )}

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
                {activeFilter === 'upcoming' ? 'Upcoming Events' : 
                 activeFilter === 'past' ? 'Past Events' : 'All Events'}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/40 transition-all cursor-pointer group h-full"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge 
                            variant={event.status === 'upcoming' ? 'default' : 
                                   event.status === 'sold-out' ? 'destructive' : 'secondary'}
                            className={
                              event.status === 'upcoming' ? 'bg-green-600' :
                              event.status === 'sold-out' ? 'bg-red-600' :
                              event.status === 'announced' ? 'bg-blue-600' : 'bg-gray-600'
                            }
                          >
                            {event.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="border-cyan-500/20 text-cyan-300">
                            {event.type.toUpperCase()}
                          </Badge>
                        </div>
                        <CardTitle className="text-white group-hover:text-cyan-300 transition-colors">
                          {event.title}
                        </CardTitle>
                        <CardDescription>
                          <div className="space-y-1">
                            <div className="flex items-center text-cyan-300">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span className="text-sm">{event.venue}</span>
                            </div>
                            <div className="flex items-center text-cyan-300">
                              <Navigation className="w-4 h-4 mr-2" />
                              <span className="text-sm">{event.city}, {event.country}</span>
                            </div>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center text-purple-300 text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-purple-300 text-sm">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{event.time}</span>
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
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(event);
                            }}
                            className="text-cyan-300 hover:text-white hover:bg-cyan-600/20"
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Music className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
                <p className="text-cyan-100/60">
                  {searchQuery 
                    ? "No events match your search criteria. Try a different search term."
                    : "No tour events are currently available. Check back soon for new announcements!"
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
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-900/40 to-cyan-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-4">Stay in the Cosmic Loop</h3>
              <p className="text-cyan-100/80 mb-6">
                Be the first to know about new tour dates, special consciousness events, and exclusive whale wisdom gatherings
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email for cosmic updates..."
                  className="bg-white/10 border-cyan-500/20 text-white placeholder:text-cyan-100/50"
                />
                <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                  Join
                </Button>
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
                    <Badge 
                      variant={selectedEvent.status === 'upcoming' ? 'default' : 
                             selectedEvent.status === 'sold-out' ? 'destructive' : 'secondary'}
                      className={
                        selectedEvent.status === 'upcoming' ? 'bg-green-600' :
                        selectedEvent.status === 'sold-out' ? 'bg-red-600' :
                        selectedEvent.status === 'announced' ? 'bg-blue-600' : 'bg-gray-600'
                      }
                    >
                      {selectedEvent.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="border-cyan-500/20 text-cyan-300">
                      {selectedEvent.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedEvent(null)}
                  className="text-cyan-300 hover:text-white hover:bg-cyan-600/20"
                >
                  <ExternalLink className="w-6 h-6 rotate-45" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-bold text-cyan-400 mb-4">Event Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-cyan-300">
                      <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{selectedEvent.venue}</div>
                        <div className="text-sm opacity-80">{selectedEvent.location}</div>
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
                        <span>{selectedEvent.capacity} capacity</span>
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
                  <h4 className="text-xl font-bold text-cyan-400 mb-4">About This Experience</h4>
                  <p className="text-cyan-100/80 leading-relaxed mb-4">{selectedEvent.description}</p>
                  
                  {selectedEvent.artistNote && (
                    <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/20 rounded-lg p-4">
                      <h5 className="text-cyan-400 font-medium mb-2">Note from Dale</h5>
                      <p className="text-cyan-100/80 text-sm italic">"{selectedEvent.artistNote}"</p>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedEvent.setlist && selectedEvent.setlist.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-cyan-400 mb-4">Expected Setlist</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedEvent.setlist.map((song, index) => (
                      <div key={index} className="flex items-center text-cyan-100/80 text-sm">
                        <Music className="w-3 h-3 mr-2 text-cyan-400" />
                        <span>{song}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 justify-center">
                {selectedEvent.ticketUrl && (
                  <Button 
                    asChild
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <a 
                      href={selectedEvent.ticketUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      Get Tickets
                    </a>
                  </Button>
                )}
                {selectedEvent.venueWebsite && (
                  <Button 
                    variant="outline"
                    asChild
                    className="border-cyan-500/20 text-cyan-300 hover:bg-cyan-600/20"
                  >
                    <a 
                      href={selectedEvent.venueWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Venue Info
                    </a>
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => handleShare(selectedEvent)}
                  className="border-cyan-500/20 text-cyan-300 hover:bg-cyan-600/20"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Event
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OverhauledTourPage;