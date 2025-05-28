import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

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

  useEffect(() => {
    loadWhaleLocations();
  }, []);

  const loadWhaleLocations = async () => {
    setLoading(true);
    try {
      const result = await apiClient.getWhaleLocations('Hawaii');
      if (result.success && result.data) {
        setLocations(result.data);
      }
    } catch (error) {
      console.error('Error loading whale locations:', error);
    } finally {
      setLoading(false);
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
      {/* Interactive Map Container */}
      <div className="relative w-full h-96 bg-black/20 rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2663525.3112356835!2d-161.67382492051866!3d21.476153723897597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1682970147321!5m2!1sen!2sus"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hawaiian Islands Whale Watching Map"
        />
        
        <div className="absolute top-4 right-4">
          <Button
            onClick={loadWhaleLocations}
            variant="secondary"
            size="sm"
            className="bg-white/90 text-gray-800 hover:bg-white"
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