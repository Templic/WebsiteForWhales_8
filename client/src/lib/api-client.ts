/**
 * API Client for external integrations
 * Handles all multimedia API requests with proper error handling
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class APIClient {
  private baseURL: string;

  constructor() {
    // Use the current origin for API requests
    this.baseURL = window.location.origin;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // YouTube API methods
  async testYouTube(): Promise<APIResponse> {
    return this.makeRequest('/api/youtube/test');
  }

  async searchYouTubeVideos(query = 'whale consciousness meditation', maxResults = 12): Promise<APIResponse> {
    return this.makeRequest(`/api/youtube/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
  }

  async getCuratedContent(): Promise<APIResponse> {
    return this.makeRequest('/api/youtube/curated');
  }

  // Google Maps API methods
  async testMaps(): Promise<APIResponse> {
    return this.makeRequest('/api/maps/test');
  }

  async getWhaleLocations(location = 'Pacific Ocean'): Promise<APIResponse> {
    return this.makeRequest(`/api/maps/whale-locations?location=${encodeURIComponent(location)}`);
  }

  async getOceanSanctuaries(location = 'California'): Promise<APIResponse> {
    return this.makeRequest(`/api/maps/ocean-sanctuaries?location=${encodeURIComponent(location)}`);
  }

  async getMeditationCenters(location = 'California'): Promise<APIResponse> {
    return this.makeRequest(`/api/maps/meditation-centers?location=${encodeURIComponent(location)}`);
  }

  // Taskade API methods
  async testTaskade(): Promise<APIResponse> {
    return this.makeRequest('/api/taskade/test');
  }

  async getTaskadeDashboard(): Promise<APIResponse> {
    return this.makeRequest('/api/taskade/dashboard');
  }

  async chatWithAgent(agentId: string, message: string): Promise<APIResponse> {
    return this.makeRequest(`/api/taskade/agents/${agentId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  // Test all integrations
  async testAllIntegrations(): Promise<{ youtube: APIResponse; maps: APIResponse; taskade: APIResponse }> {
    const [youtube, maps, taskade] = await Promise.all([
      this.testYouTube(),
      this.testMaps(),
      this.testTaskade()
    ]);

    return { youtube, maps, taskade };
  }
}

export const apiClient = new APIClient();
export default apiClient;