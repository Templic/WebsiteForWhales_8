import express from 'express';
import axios from 'axios';

const router = express.Router();

// YouTube API base configuration
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Helper function to make YouTube API requests
async function youtubeRequest(endpoint: string, params: any = {}) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  try {
    const response = await axios.get(`${YOUTUBE_API_BASE}${endpoint}`, {
      params: {
        ...params,
        key: apiKey
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || 'YouTube API request failed');
  }
}

// Search for whale consciousness and ocean videos
router.get('/search', async (req, res) => {
  try {
    const { q = 'whale consciousness meditation', maxResults = 12, order = 'relevance' } = req.query;
    
    const data = await youtubeRequest('/search', {
      part: 'snippet',
      q,
      type: 'video',
      maxResults,
      order,
      safeSearch: 'strict',
      videoEmbeddable: 'true'
    });
    
    res.json({ success: true, videos: data.items });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get whale consciousness playlists
router.get('/playlists', async (req, res) => {
  try {
    const { q = 'whale songs meditation cosmic consciousness', maxResults = 10 } = req.query;
    
    const data = await youtubeRequest('/search', {
      part: 'snippet',
      q,
      type: 'playlist',
      maxResults,
      order: 'relevance'
    });
    
    res.json({ success: true, playlists: data.items });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific video details
router.get('/video/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const data = await youtubeRequest('/videos', {
      part: 'snippet,statistics,contentDetails',
      id: videoId
    });
    
    if (data.items.length === 0) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }
    
    res.json({ success: true, video: data.items[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get curated whale consciousness content
router.get('/curated', async (req, res) => {
  try {
    const queries = [
      'whale songs meditation',
      'ocean consciousness',
      'cosmic whale wisdom',
      'deep sea meditation',
      'whale communication sounds'
    ];
    
    const results = await Promise.all(
      queries.map(async (query) => {
        try {
          const data = await youtubeRequest('/search', {
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: 3,
            order: 'relevance',
            safeSearch: 'strict',
            videoEmbeddable: 'true'
          });
          return { query, videos: data.items };
        } catch (error) {
          return { query, videos: [], error: error.message };
        }
      })
    );
    
    res.json({ success: true, categories: results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test YouTube API connection
router.get('/test', async (req, res) => {
  try {
    const data = await youtubeRequest('/search', {
      part: 'snippet',
      q: 'whale',
      type: 'video',
      maxResults: 1
    });
    
    res.json({ 
      success: true, 
      message: 'YouTube API connection successful',
      testResult: data.items.length > 0 ? 'Found videos' : 'No videos found'
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Please check your YouTube API key configuration'
    });
  }
});

export default router;