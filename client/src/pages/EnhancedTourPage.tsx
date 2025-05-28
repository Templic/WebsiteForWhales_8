import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, ExternalLink, Music, Navigation, Star, Phone, Globe, Users, Ticket } from 'lucide-react';
import WhaleWatchingMap from '@/components/maps/WhaleWatchingMap';

interface TourEvent {
  id: string;
  title: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  description: string;
  ticketUrl?: string;
  venueWebsite?: string;
  capacity?: number;
  price?: string;
  status: 'upcoming' | 'sold-out' | 'cancelled';
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const EnhancedTourPage: React.FC = () => {
  const [tourEvents, setTourEvents] = useState<TourEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TourEvent | null>(null);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await fetch('/api/tour/events');
        const data = await response.json() as any;
        setTourEvents(data.events || []);
      } catch (error) {
        console.error('Failed to fetch tour data:', error);
        // Set some sample events for demonstration
        setTourEvents([
          {
            id: '1',
            title: 'Cosmic Consciousness Concert',
            venue: 'Hawaiian Cultural Center',
            location: 'Honolulu, Hawaii',
            date: '2024-07-15',
            time: '7:00 PM HST',
            description: 'An immersive journey through cosmic soundscapes and whale wisdom',
            ticketUrl: 'https://example.com/tickets',
            venueWebsite: 'https://example.com/venue',
            capacity: 500,
            price: '$35-75',
            status: 'upcoming',
            coordinates: { lat: 21.3099, lng: -157.8581 }
          },
          {
            id: '2',
            title: 'Whale Song Meditation',
            venue: 'Mauna Kea Beach',
            location: 'Big Island, Hawaii',
            date: '2024-07-20',
            time: '6:00 AM HST',
            description: 'Dawn meditation with live whale song recordings',
            capacity: 50,
            price: '$25',
            status: 'upcoming',
            coordinates: { lat: 19.8968, lng: -155.5828 }
          }
        ]);
      }
    };

    fetchTourData();
  }, []);

  const upcomingEvents = tourEvents.filter(event => event.status === 'upcoming');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-cyan-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Dale's Cosmic Tour
          </h1>
          <p className="text-xl text-cyan-100/80 max-w-2xl mx-auto">
            Join Dale on transcendent journeys through cosmic consciousness and whale wisdom
          </p>
        </div>

        {/* Map Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-1">
            <button
              onClick={() => setShowMap(true)}
              className={`px-4 py-2 rounded-lg transition-all ${
                showMap
                  ? 'bg-cyan-600 text-white'
                  : 'text-cyan-300 hover:text-white hover:bg-cyan-600/20'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Map View
            </button>
            <button
              onClick={() => setShowMap(false)}
              className={`px-4 py-2 rounded-lg transition-all ${
                !showMap
                  ? 'bg-purple-600 text-white'
                  : 'text-cyan-300 hover:text-white hover:bg-purple-600/20'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              List View
            </button>
          </div>
        </div>

        {showMap && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">Interactive Tour Map</h2>
            <div className="max-w-6xl mx-auto bg-gradient-to-r from-purple-900/30 to-cyan-900/30 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
              <div className="h-96 rounded-xl overflow-hidden">
                <WhaleWatchingMap />
              </div>
              <div className="mt-4 text-center">
                <p className="text-cyan-100/70">
                  Explore venues across the Hawaiian Islands where Dale shares cosmic consciousness through music and meditation
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">Upcoming Events</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                    <div className="flex items-center text-cyan-300 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center text-cyan-300 mb-2">
                      <Navigation className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-purple-300 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-purple-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>

                <p className="text-cyan-100/80 mb-4">{event.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {event.capacity && (
                      <div className="flex items-center text-cyan-300 text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{event.capacity} capacity</span>
                      </div>
                    )}
                    {event.price && (
                      <div className="flex items-center text-green-300 text-sm">
                        <Ticket className="w-4 h-4 mr-1" />
                        <span>{event.price}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {event.ticketUrl && (
                      <a 
                        href={event.ticketUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Ticket className="w-3 h-3" />
                        Tickets
                      </a>
                    )}
                    {event.venueWebsite && (
                      <a 
                        href={event.venueWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="w-3 h-3" />
                        Venue
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900/90 to-cyan-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-3xl font-bold text-white">{selectedEvent.title}</h3>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-cyan-300 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xl font-bold text-cyan-400 mb-3">Event Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-cyan-300">
                      <MapPin className="w-4 h-4 mr-3" />
                      <span>{selectedEvent.venue}</span>
                    </div>
                    <div className="flex items-center text-cyan-300">
                      <Navigation className="w-4 h-4 mr-3" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center text-purple-300">
                      <Calendar className="w-4 h-4 mr-3" />
                      <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-purple-300">
                      <Clock className="w-4 h-4 mr-3" />
                      <span>{selectedEvent.time}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-cyan-400 mb-3">Additional Info</h4>
                  <div className="space-y-2">
                    {selectedEvent.capacity && (
                      <div className="flex items-center text-cyan-300">
                        <Users className="w-4 h-4 mr-3" />
                        <span>{selectedEvent.capacity} capacity</span>
                      </div>
                    )}
                    {selectedEvent.price && (
                      <div className="flex items-center text-green-300">
                        <Ticket className="w-4 h-4 mr-3" />
                        <span>{selectedEvent.price}</span>
                      </div>
                    )}
                    <div className="flex items-center text-yellow-300">
                      <Star className="w-4 h-4 mr-3" />
                      <span className="capitalize">{selectedEvent.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xl font-bold text-cyan-400 mb-3">About This Event</h4>
                <p className="text-cyan-100/80 leading-relaxed">{selectedEvent.description}</p>
              </div>
              
              <div className="flex gap-3 justify-center">
                {selectedEvent.ticketUrl && (
                  <a 
                    href={selectedEvent.ticketUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Ticket className="w-4 h-4" />
                    Get Tickets
                  </a>
                )}
                {selectedEvent.venueWebsite && (
                  <a 
                    href={selectedEvent.venueWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Venue Info
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-900/40 to-cyan-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated on Tour Dates</h3>
            <p className="text-cyan-100/80 mb-6">
              Be the first to know about new tour dates and special cosmic consciousness events
            </p>
            <button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
              Join the Cosmic Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTourPage;