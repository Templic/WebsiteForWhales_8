import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Users, ExternalLink, Navigation } from 'lucide-react';

interface TourVenue {
  id: string;
  name: string;
  location: string;
  address: string;
  date: string;
  time: string;
  capacity: number;
  ticketUrl?: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
}

const TourPageV2: React.FC = () => {
  const [venues, setVenues] = useState<TourVenue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<TourVenue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTourData();
  }, []);

  const loadTourData = async () => {
    try {
      // Use your existing tour/venues API endpoint
      const response = await fetch('/api/tours/venues?location=Hawaii');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.venues) {
          setVenues(data.venues);
        } else {
          // Use hardcoded Hawaiian venues as fallback
          setVenues(defaultHawaiianVenues);
        }
      } else {
        setVenues(defaultHawaiianVenues);
      }
    } catch (error) {
      console.error('Error loading tour data:', error);
      setVenues(defaultHawaiianVenues);
    } finally {
      setLoading(false);
    }
  };

  const defaultHawaiianVenues: TourVenue[] = [
    {
      id: '1',
      name: 'Waikiki Beach Shell',
      location: 'Honolulu, Oahu',
      address: '2805 Monsarrat Ave, Honolulu, HI 96815',
      date: '2024-07-15',
      time: '7:30 PM',
      capacity: 2500,
      description: 'Iconic outdoor concert venue with ocean views and sunset performances',
      coordinates: { lat: 21.2677, lng: -157.8157 },
      amenities: ['Ocean Views', 'Outdoor Seating', 'Food Vendors', 'Parking'],
      ticketUrl: 'https://tickets.example.com/waikiki-shell'
    },
    {
      id: '2',
      name: 'Hilo Bay Concert Hall',
      location: 'Hilo, Big Island',
      address: '141 Kalanianaole Ave, Hilo, HI 96720',
      date: '2024-07-20',
      time: '8:00 PM',
      capacity: 1800,
      description: 'Intimate venue with volcanic backdrop and exceptional acoustics',
      coordinates: { lat: 19.7241, lng: -155.0868 },
      amenities: ['Volcanic Views', 'Premium Sound', 'VIP Seating', 'Local Art'],
      ticketUrl: 'https://tickets.example.com/hilo-concert-hall'
    },
    {
      id: '3',
      name: 'Maui Ocean Center Amphitheater',
      location: 'Maui',
      address: '192 Maalaea Rd, Wailuku, HI 96793',
      date: '2024-07-25',
      time: '6:45 PM',
      capacity: 3000,
      description: 'Unique amphitheater overlooking the Pacific during whale season',
      coordinates: { lat: 20.7984, lng: -156.5164 },
      amenities: ['Whale Watching', 'Ocean Breeze', 'Sunset Views', 'Marine Education'],
      ticketUrl: 'https://tickets.example.com/maui-ocean-center'
    }
  ];

  const handleDirections = (venue: TourVenue) => {
    const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(venue.address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleTickets = (venue: TourVenue) => {
    if (venue.ticketUrl) {
      window.open(venue.ticketUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-background flex items-center justify-center">
        <div className="text-center text-cosmic-text">
          <MapPin className="h-12 w-12 animate-pulse mx-auto mb-4" />
          <p>Loading Hawaiian Islands tour...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-background">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-cosmic-text mb-4">
              Hawaiian Islands Tour 2024
            </h1>
            <p className="text-xl text-cosmic-text/80">
              Experience Dale's cosmic sounds across the most beautiful venues in Hawaii
            </p>
          </div>

          {/* Interactive Map Section */}
          <div className="bg-cosmic-card/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-cosmic-primary/20">
            <h2 className="text-2xl font-bold text-cosmic-text mb-6 text-center">Tour Locations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  onClick={() => setSelectedVenue(venue)}
                  className={`bg-cosmic-card/60 backdrop-blur-sm rounded-xl p-6 border cursor-pointer transition-all hover:scale-105 ${
                    selectedVenue?.id === venue.id 
                      ? 'border-cosmic-primary bg-cosmic-primary/10' 
                      : 'border-cosmic-primary/20 hover:border-cosmic-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <MapPin className="h-8 w-8 text-cosmic-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-cosmic-text mb-1">{venue.name}</h3>
                      <p className="text-cosmic-text/70 text-sm mb-2">{venue.location}</p>
                      <div className="flex items-center gap-2 text-cosmic-text/60 text-xs mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(venue.date).toLocaleDateString()}</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{venue.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-cosmic-text/60 text-xs">
                        <Users className="h-4 w-4" />
                        <span>Capacity: {venue.capacity.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* External Map Link */}
            <div className="text-center">
              <button
                onClick={() => window.open('https://maps.google.com/maps?q=Hawaii+concert+venues', '_blank')}
                className="bg-cosmic-primary hover:bg-cosmic-primary/80 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <Navigation className="h-5 w-5" />
                View Full Hawaii Tour Map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Details */}
      {selectedVenue && (
        <section className="py-16 bg-cosmic-primary/5">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-cosmic-card/80 backdrop-blur-sm rounded-2xl p-8 border border-cosmic-primary/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-cosmic-text mb-2">{selectedVenue.name}</h2>
                <p className="text-xl text-cosmic-text/70">{selectedVenue.location}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-cosmic-text mb-4">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-cosmic-primary" />
                      <span className="text-cosmic-text">{new Date(selectedVenue.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-cosmic-primary" />
                      <span className="text-cosmic-text">{selectedVenue.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-cosmic-primary" />
                      <span className="text-cosmic-text">{selectedVenue.capacity.toLocaleString()} capacity</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-cosmic-primary flex-shrink-0 mt-0.5" />
                      <span className="text-cosmic-text">{selectedVenue.address}</span>
                    </div>
                  </div>

                  <p className="text-cosmic-text/70 mt-6">{selectedVenue.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-cosmic-text mb-4">Venue Amenities</h3>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {selectedVenue.amenities.map((amenity, index) => (
                      <div key={index} className="bg-cosmic-primary/10 text-cosmic-primary px-3 py-2 rounded-lg text-sm text-center">
                        {amenity}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleDirections(selectedVenue)}
                      className="w-full bg-cosmic-primary hover:bg-cosmic-primary/80 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Navigation className="h-5 w-5" />
                      Get Directions
                    </button>
                    {selectedVenue.ticketUrl && (
                      <button
                        onClick={() => handleTickets(selectedVenue)}
                        className="w-full border border-cosmic-primary text-cosmic-primary hover:bg-cosmic-primary/10 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-5 w-5" />
                        Buy Tickets
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tour Information */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-cosmic-text mb-8">
            Join the Cosmic Journey Through Paradise
          </h2>
          <p className="text-xl text-cosmic-text/70 mb-8">
            Experience consciousness-expanding music in Hawaii's most breathtaking venues, 
            where whale wisdom meets cosmic sound under starlit Pacific skies.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-cosmic-primary hover:bg-cosmic-primary/80 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Join Mailing List
            </button>
            <button className="border border-cosmic-primary text-cosmic-primary hover:bg-cosmic-primary/10 px-8 py-3 rounded-lg font-medium transition-colors">
              Download Tour Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourPageV2;