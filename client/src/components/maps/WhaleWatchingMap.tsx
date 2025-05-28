import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, RefreshCw } from 'lucide-react';

// Google Maps type declarations
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        InfoWindow: any;
      };
    };
  }
}

interface WhaleLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  bestTime: string;
  whaleTypes: string[];
}

const WhaleWatchingMap: React.FC = () => {
  const [locations, setLocations] = useState<WhaleLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<WhaleLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Hawaiian tour venues data
  const hawaiianVenues = [
    {
      id: '1',
      name: 'Waikiki Beach Shell',
      latitude: 21.2677,
      longitude: -157.8186,
      description: 'Iconic outdoor concert venue with ocean views',
      bestTime: 'Sunset shows year-round',
      whaleTypes: ['Humpback Whales (Winter)', 'Dolphins (Year-round)']
    },
    {
      id: '2', 
      name: 'Hilo Bay Concert Hall',
      latitude: 19.7297,
      longitude: -155.0890,
      description: 'Big Island venue with volcanic backdrop',
      bestTime: 'Evening performances',
      whaleTypes: ['Humpback Whales', 'Pilot Whales', 'Spinner Dolphins']
    },
    {
      id: '3',
      name: 'Maui Ocean Center Amphitheater',
      latitude: 20.7984,
      longitude: -156.4319,
      description: 'Oceanfront amphitheater in Maui',
      bestTime: 'Winter whale season',
      whaleTypes: ['Humpback Whales', 'Whale Watching Tours']
    }
  ];

  useEffect(() => {
    setLocations(hawaiianVenues);
    loadGoogleMapsAPI();
    setLoading(false);
  }, []);

  const loadGoogleMapsAPI = async () => {
    try {
      // Use the new server endpoint to get venue data
      const response = await fetch('/api/maps/venues?location=Hawaii');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setLocations(data.data);
        }
        setMapLoaded(true);
      } else {
        // Fallback to basic map display
        setMapLoaded(true);
      }
    } catch (error) {
      console.error('Error loading map data:', error);
      // Always show the map even if data loading fails
      setMapLoaded(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Loading whale watching locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Interactive Tour Map Container */}
      <div className="relative w-full h-96 bg-cosmic-card rounded-lg overflow-hidden border border-cosmic-primary/20">
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/40 text-white">
          <div className="text-center p-8">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-cosmic-primary" />
            <h3 className="text-2xl font-bold mb-4">Hawaiian Islands Tour Map</h3>
            <p className="text-lg mb-6">Explore Dale's concert venues across the Hawaiian Islands</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-cosmic-primary">Waikiki Beach Shell</h4>
                <p className="text-xs mt-1">Oahu • Ocean Views</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-cosmic-primary">Hilo Bay Concert Hall</h4>
                <p className="text-xs mt-1">Big Island • Volcanic Backdrop</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-cosmic-primary">Maui Ocean Center</h4>
                <p className="text-xs mt-1">Maui • Whale Season</p>
              </div>
            </div>
            <Button
              onClick={() => window.open('https://maps.google.com/maps?q=Hawaii+concert+venues', '_blank')}
              variant="outline"
              className="mt-6 bg-cosmic-primary/20 border-cosmic-primary text-white hover:bg-cosmic-primary/30"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Open Full Map
            </Button>
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          <Button
            onClick={() => {
              setMapLoaded(false);
              setTimeout(() => {
                loadGoogleMapsAPI();
              }, 100);
            }}
            variant="secondary"
            size="sm"
            className="bg-cosmic-primary/90 text-white hover:bg-cosmic-primary"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Locations
          </Button>
        </div>
      </div>

      {/* API-Powered Location Data */}
      {locations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <Card 
              key={location.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedLocation?.id === location.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{location.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">
                        <strong>Best Time:</strong> {location.bestTime}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {location.whaleTypes.map((type, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {selectedLocation.name}
            </h3>
            <p className="text-gray-700 mb-4">{selectedLocation.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Best Viewing Time</p>
                <p className="text-sm text-gray-600">{selectedLocation.bestTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Whale Species</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedLocation.whaleTypes.map((type, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WhaleWatchingMap;