import express from 'express';
import axios from 'axios';

const router = express.Router();

// Google Maps API base configuration
const MAPS_API_BASE = 'https://maps.googleapis.com/maps/api';

// Helper function to make Google Maps API requests
async function mapsRequest(endpoint: string, params: any = {}) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  try {
    const response = await axios.get(`${MAPS_API_BASE}${endpoint}`, {
      params: {
        ...params,
        key: apiKey
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Google Maps API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error_message || 'Google Maps API request failed');
  }
}

// Search for whale watching locations
router.get('/whale-locations', async (req, res) => {
  try {
    const { location = 'Pacific Ocean', radius = 50000 } = req.query;
    
    const data = await mapsRequest('/place/textsearch/json', {
      query: `whale watching tours near ${location}`,
      radius,
      type: 'tourist_attraction'
    });
    
    res.json({ success: true, locations: data.results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get ocean sanctuaries and marine protected areas
router.get('/ocean-sanctuaries', async (req, res) => {
  try {
    const { location = 'California', radius = 100000 } = req.query;
    
    const data = await mapsRequest('/place/textsearch/json', {
      query: `marine sanctuary ocean preserve ${location}`,
      radius,
      type: 'park'
    });
    
    res.json({ success: true, sanctuaries: data.results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get meditation and retreat centers near water
router.get('/meditation-centers', async (req, res) => {
  try {
    const { location = 'California', radius = 50000 } = req.query;
    
    const data = await mapsRequest('/place/textsearch/json', {
      query: `meditation retreat center near ocean ${location}`,
      radius,
      type: 'spa'
    });
    
    res.json({ success: true, centers: data.results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get place details with photos
router.get('/place/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    
    const data = await mapsRequest('/place/details/json', {
      place_id: placeId,
      fields: 'name,rating,formatted_phone_number,formatted_address,geometry,website,photos,reviews'
    });
    
    if (data.status !== 'OK') {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }
    
    res.json({ success: true, place: data.result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Geocode an address or location
router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ success: false, error: 'Address parameter is required' });
    }
    
    const data = await mapsRequest('/geocode/json', {
      address
    });
    
    res.json({ success: true, results: data.results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get static map image URL
router.get('/static-map', async (req, res) => {
  try {
    const { 
      center = 'Pacific Ocean', 
      zoom = 8, 
      size = '600x400', 
      maptype = 'satellite',
      markers = ''
    } = req.query;
    
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Google Maps API key not configured' });
    }
    
    const mapUrl = `${MAPS_API_BASE}/staticmap?center=${encodeURIComponent(center as string)}&zoom=${zoom}&size=${size}&maptype=${maptype}&markers=${markers}&key=${apiKey}`;
    
    res.json({ success: true, mapUrl });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test Google Maps API connection
router.get('/test', async (req, res) => {
  try {
    const data = await mapsRequest('/geocode/json', {
      address: 'Pacific Ocean'
    });
    
    res.json({ 
      success: true, 
      message: 'Google Maps API connection successful',
      testResult: data.results.length > 0 ? 'Geocoding working' : 'No results found'
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Please check your Google Maps API key configuration'
    });
  }
});

export default router;