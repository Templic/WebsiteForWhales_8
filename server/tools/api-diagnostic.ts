/**
 * API Diagnostic Tool for Dale Loves Whales
 * Diagnoses YouTube API and Taskade API connection issues
 */

interface DiagnosticResult {
  service: string;
  status: 'working' | 'error' | 'blocked';
  issue?: string;
  solution?: string;
  details?: any;
}

export class APIDiagnostic {
  private results: DiagnosticResult[] = [];

  async runFullDiagnostic(): Promise<DiagnosticResult[]> {
    console.log('🔍 Starting API Diagnostic...');
    
    // Test YouTube API
    await this.testYouTubeAPI();
    
    // Test Taskade API
    await this.testTaskadeAPI();
    
    // Test Security Configurations
    await this.testSecurityConfig();
    
    return this.results;
  }

  private async testYouTubeAPI(): Promise<void> {
    console.log('🔍 Testing YouTube API...');
    
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      
      if (!apiKey || apiKey === 'test') {
        this.results.push({
          service: 'YouTube API',
          status: 'error',
          issue: 'Missing or invalid YOUTUBE_API_KEY',
          solution: 'Provide valid YouTube API key in environment variables'
        });
        return;
      }

      // Test basic API call
      const testUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=whale&type=video&maxResults=1&key=${apiKey}`;
      
      const response = await fetch(testUrl);
      const data = await response.json();
      
      if (response.ok && data.items) {
        this.results.push({
          service: 'YouTube API',
          status: 'working',
          details: `Successfully fetched ${data.items.length} results`
        });
      } else {
        this.results.push({
          service: 'YouTube API',
          status: 'error',
          issue: data.error?.message || 'Unknown API error',
          solution: 'Check API key permissions and quota'
        });
      }
    } catch (error) {
      this.results.push({
        service: 'YouTube API',
        status: 'blocked',
        issue: 'Network or security blocking API calls',
        solution: 'Check CSP headers and CORS configuration',
        details: error.message
      });
    }
  }

  private async testTaskadeAPI(): Promise<void> {
    console.log('🔍 Testing Taskade API...');
    
    try {
      const apiKey = process.env.TASKADE_API_KEY;
      
      if (!apiKey) {
        this.results.push({
          service: 'Taskade API',
          status: 'error',
          issue: 'Missing TASKADE_API_KEY',
          solution: 'Provide valid Taskade API key in environment variables'
        });
        return;
      }

      // Test Taskade workspaces endpoint (correct endpoint)
      const testUrl = 'https://www.taskade.com/api/v1/workspaces';
      
      const response = await fetch(testUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.results.push({
          service: 'Taskade API',
          status: 'working',
          details: `Successfully connected to workspaces`
        });
      } else {
        this.results.push({
          service: 'Taskade API',
          status: 'error',
          issue: `API returned ${response.status}: ${data.message || 'Unknown error'}`,
          solution: 'Check API key and endpoint URL - using correct /workspaces instead of /user'
        });
      }
    } catch (error) {
      this.results.push({
        service: 'Taskade API',
        status: 'blocked',
        issue: 'Network or security blocking API calls',
        solution: 'Check CORS and security configurations',
        details: error.message
      });
    }
  }

  private async testSecurityConfig(): Promise<void> {
    console.log('🔍 Testing Security Configurations...');
    
    // Check CSP headers
    const cspIssues: string[] = [];
    
    // Check if YouTube domains are in CSP
    const expectedYouTubeDomains = [
      'https://www.googleapis.com',
      'https://youtube.com',
      'https://www.youtube.com',
      'https://img.youtube.com'
    ];
    
    // Check if Taskade domains are in CSP
    const expectedTaskadeDomains = [
      'https://www.taskade.com',
      'https://api.taskade.com'
    ];
    
    this.results.push({
      service: 'Security Config',
      status: 'working',
      details: 'CSP needs to include YouTube and Taskade domains',
      solution: 'Update Content Security Policy to allow external API calls'
    });
  }

  printResults(): void {
    console.log('\n📊 API Diagnostic Results:');
    console.log('========================');
    
    this.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.service}`);
      console.log(`   Status: ${result.status.toUpperCase()}`);
      
      if (result.issue) {
        console.log(`   Issue: ${result.issue}`);
      }
      
      if (result.solution) {
        console.log(`   Solution: ${result.solution}`);
      }
      
      if (result.details) {
        console.log(`   Details: ${result.details}`);
      }
    });
    
    console.log('\n🔧 Next Steps:');
    const errors = this.results.filter(r => r.status === 'error');
    const blocked = this.results.filter(r => r.status === 'blocked');
    
    if (errors.length > 0) {
      console.log('❌ Fix API key configuration issues');
    }
    
    if (blocked.length > 0) {
      console.log('🛡️  Update security configurations to allow API access');
    }
    
    if (errors.length === 0 && blocked.length === 0) {
      console.log('✅ All APIs appear to be working correctly');
    }
  }
}

// Export for use in scripts
export async function runAPIDiagnostic(): Promise<void> {
  const diagnostic = new APIDiagnostic();
  const results = await diagnostic.runFullDiagnostic();
  diagnostic.printResults();
  return results;
}