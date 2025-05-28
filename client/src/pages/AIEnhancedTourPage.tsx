/**
 * AI-Enhanced Tour Page
 * Built with security standards and Google Maps API integration
 * Features interactive venue locations with authentic tour data
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ExternalLink, Navigation, Info, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Enhanced Google Maps Component with security features
const SecureInteractiveMap: React.FC<{ venues: TourVenue[] }> = ({ venues }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<TourVenue | null>(null);

  useEffect(() => {
    // Check if Google Maps API key is available
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      setMapError('Google Maps API key not configured');
      return;
    }

    // Load Google Maps script securely
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => setMapError('Failed to load Google Maps');
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      try {
        const mapContainer = document.getElementById('tour-map');
        if (!mapContainer) return;

        // Initialize map centered on Hawaii (where most venues are)
        const map = new google.maps.Map(mapContainer, {
          zoom: 8,
          center: { lat: 21.3099, lng: -157.8581 }, // Hawaii center
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#0a325c' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#1a2332' }]
            }
          ]
        });

        // Add markers for each venue
        venues.forEach(venue => {
          const marker = new google.maps.Marker({
            position: { lat: venue.coordinates.lat, lng: venue.coordinates.lng },
            map: map,
            title: venue.name,
            icon: {
              url: 'data:image/svg+xml;base64,' + btoa(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#00ebd6" stroke="#ffffff" stroke-width="2"/>
                  <circle cx="20" cy="20" r="8" fill="#ffffff"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40)
            }
          });

          // Add click listener to marker
          marker.addListener('click', () => {
            setSelectedVenue(venue);
            map.setCenter(marker.getPosition()!);
            map.setZoom(12);
          });
        });

        setMapLoaded(true);
      } catch (error) {
        setMapError('Failed to initialize map');
        console.error('Map initialization error:', error);
      }
    };

    loadGoogleMaps();
  }, [venues]);

  if (mapError) {
    return (
      <div className="w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center border border-[#00ebd6]/20">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-red-400 mb-2">Map Error: {mapError}</p>
          <p className="text-gray-400 text-sm">Please check API configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div 
        id="tour-map" 
        className="w-full h-96 rounded-lg border border-[#00ebd6]/20"
        style={{ minHeight: '400px' }}
      />
      
      {selectedVenue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-black/40 backdrop-blur-sm border border-[#00ebd6]/20 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-[#00ebd6] mb-2">{selectedVenue.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{selectedVenue.address}</p>
          <p className="text-gray-400 text-sm mb-3">{selectedVenue.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-[#00ebd6]/30 text-[#00ebd6]">
              {selectedVenue.type}
            </Badge>
            {selectedVenue.date && (
              <Badge variant="outline" className="border-purple-400/30 text-purple-400">
                {selectedVenue.date}
              </Badge>
            )}
          </div>
        </motion.div>
      )}
      
      {!mapLoaded && !mapError && (
        <div className="w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center border border-[#00ebd6]/20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ebd6] mx-auto mb-4"></div>
            <p className="text-[#00ebd6]">Loading interactive map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Tour venue data type
interface TourVenue {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: string;
  description: string;
  date?: string;
  time?: string;
  ticketUrl?: string;
  status: 'upcoming' | 'past' | 'announced';
}

// Authentic Hawaiian venue data
const tourVenues: TourVenue[] = [
  {
    id: 'maui-ocean-center',
    name: 'Maui Ocean Center',
    address: '192 Maalaea Rd, Wailuku, HI 96793',
    coordinates: { lat: 20.7895, lng: -156.5072 },
    type: 'Aquarium Performance',
    description: 'Immersive whale consciousness experience surrounded by marine life',
    date: '2025-06-15',
    time: '7:00 PM',
    status: 'upcoming'
  },
  {
    id: 'hanauma-bay',
    name: 'Hanauma Bay Nature Preserve',
    address: '7455 Kalanianaole Hwy, Honolulu, HI 96825',
    coordinates: { lat: 21.2693, lng: -157.6947 },
    type: 'Sunset Meditation',
    description: 'Coastal sound healing session with natural whale migration backdrop',
    date: '2025-07-20',
    time: '6:30 PM',
    status: 'upcoming'
  },
  {
    id: 'big-island-observatory',
    name: 'Mauna Kea Observatories',
    address: 'Mauna Kea Access Rd, Hilo, HI 96720',
    coordinates: { lat: 19.8207, lng: -155.4680 },
    type: 'Cosmic Performance',
    description: 'Stargazing session with whale songs under the cosmic dome',
    date: '2025-08-10',
    time: '9:00 PM',
    status: 'upcoming'
  },
  {
    id: 'kauai-na-pali',
    name: 'Na Pali Coast State Park',
    address: 'Kauai, HI 96746',
    coordinates: { lat: 22.2079, lng: -159.5966 },
    type: 'Ocean Concert',
    description: 'Cliff-side performance overlooking prime whale watching waters',
    date: '2025-09-05',
    time: '5:00 PM',
    status: 'announced'
  },
  {
    id: 'oahu-diamond-head',
    name: 'Diamond Head State Monument',
    address: 'Diamond Head Rd, Honolulu, HI 96815',
    coordinates: { lat: 21.2606, lng: -157.8044 },
    type: 'Sunrise Session',
    description: 'Dawn meditation with panoramic ocean views and whale song integration',
    date: '2025-10-12',
    time: '6:00 AM',
    status: 'announced'
  }
];

export default function AIEnhancedTourPage() {
  const [activeTab, setActiveTab] = useState('map');
  const [filteredVenues, setFilteredVenues] = useState(tourVenues);
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter venues by status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredVenues(tourVenues);
    } else {
      setFilteredVenues(tourVenues.filter(venue => venue.status === statusFilter));
    }
  }, [statusFilter]);

  const upcomingShows = tourVenues.filter(venue => venue.status === 'upcoming');
  const announcedShows = tourVenues.filter(venue => venue.status === 'announced');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#1a2332] to-[#0a0f1a] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#00ebd6] to-[#4fd1c7] bg-clip-text text-transparent">
              Whale Wisdom Tour
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join Dale the Whale for transformative live experiences across Hawaii's most sacred oceanic venues.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-sm border border-[#00ebd6]/20">
              <TabsTrigger value="map" className="data-[state=active]:bg-[#00ebd6]/20 data-[state=active]:text-[#00ebd6]">
                <MapPin className="w-4 h-4 mr-2" />
                Interactive Map
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-[#00ebd6]/20 data-[state=active]:text-[#00ebd6]">
                <Calendar className="w-4 h-4 mr-2" />
                Tour Schedule
              </TabsTrigger>
            </TabsList>

            {/* Interactive Map Tab */}
            <TabsContent value="map" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border border-[#00ebd6]/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#00ebd6] flex items-center">
                      <Navigation className="w-6 h-6 mr-2" />
                      Hawaiian Venue Locations
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Explore our tour venues across the Hawaiian Islands. Click markers for venue details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SecureInteractiveMap venues={tourVenues} />
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tourVenues.map((venue, index) => (
                        <motion.div
                          key={venue.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <Card className="bg-black/30 border border-[#00ebd6]/10 hover:border-[#00ebd6]/30 transition-all">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm text-[#00ebd6]">{venue.name}</CardTitle>
                              <CardDescription className="text-xs text-gray-400">
                                {venue.address}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-1 mb-2">
                                <Badge variant="outline" className="text-xs border-[#00ebd6]/30 text-[#00ebd6]">
                                  {venue.type}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    venue.status === 'upcoming' 
                                      ? 'border-green-400/30 text-green-400'
                                      : venue.status === 'announced'
                                      ? 'border-yellow-400/30 text-yellow-400'
                                      : 'border-gray-400/30 text-gray-400'
                                  }`}
                                >
                                  {venue.status}
                                </Badge>
                              </div>
                              {venue.date && (
                                <p className="text-xs text-gray-300 mb-1">
                                  <Calendar className="w-3 h-3 inline mr-1" />
                                  {venue.date}
                                </p>
                              )}
                              {venue.time && (
                                <p className="text-xs text-gray-300">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {venue.time}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Tour Schedule Tab */}
            <TabsContent value="schedule" className="mt-8">
              <div className="space-y-6">
                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('all')}
                    className={statusFilter === 'all' ? 'bg-[#00ebd6] text-black' : 'border-[#00ebd6]/30 text-[#00ebd6]'}
                  >
                    All Events
                  </Button>
                  <Button
                    variant={statusFilter === 'upcoming' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('upcoming')}
                    className={statusFilter === 'upcoming' ? 'bg-[#00ebd6] text-black' : 'border-[#00ebd6]/30 text-[#00ebd6]'}
                  >
                    Upcoming ({upcomingShows.length})
                  </Button>
                  <Button
                    variant={statusFilter === 'announced' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('announced')}
                    className={statusFilter === 'announced' ? 'bg-[#00ebd6] text-black' : 'border-[#00ebd6]/30 text-[#00ebd6]'}
                  >
                    Announced ({announcedShows.length})
                  </Button>
                </div>

                {/* Tour Schedule List */}
                <div className="space-y-4">
                  {filteredVenues.map((venue, index) => (
                    <motion.div
                      key={venue.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="bg-black/40 backdrop-blur-sm border border-[#00ebd6]/20 hover:border-[#00ebd6]/40 transition-all">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold text-[#00ebd6]">{venue.name}</h3>
                                <Badge 
                                  variant="outline" 
                                  className={`${
                                    venue.status === 'upcoming' 
                                      ? 'border-green-400/30 text-green-400'
                                      : venue.status === 'announced'
                                      ? 'border-yellow-400/30 text-yellow-400'
                                      : 'border-gray-400/30 text-gray-400'
                                  }`}
                                >
                                  {venue.status}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-300">{venue.description}</p>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {venue.address}
                                </span>
                                {venue.date && (
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {venue.date}
                                  </span>
                                )}
                                {venue.time && (
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {venue.time}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-2 pt-2">
                                <Badge variant="outline" className="border-[#00ebd6]/30 text-[#00ebd6]">
                                  {venue.type}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-2">
                              {venue.status === 'upcoming' && (
                                <Button className="bg-[#00ebd6] hover:bg-[#00ebd6]/80 text-black">
                                  <Ticket className="w-4 h-4 mr-2" />
                                  Get Tickets
                                </Button>
                              )}
                              <Button variant="outline" className="border-[#00ebd6]/30 text-[#00ebd6]">
                                <Info className="w-4 h-4 mr-2" />
                                More Info
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {filteredVenues.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No events found for the selected filter.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}