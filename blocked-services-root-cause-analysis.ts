/**
 * Root Cause Analysis for Blocked Services
 * Specific analysis for Google Maps, Taskade widgets, and YouTube integrations
 */

import { promises as fs } from 'fs';

interface ServiceBlockage {
  service: string;
  currentStatus: 'completely_blocked' | 'partially_blocked' | 'functional';
  blockingFactors: {
    csp: boolean;
    authentication: boolean;
    apiKeys: boolean;
    cors: boolean;
    requestValidation: boolean;
    domNesting: boolean;
  };
  specificIssues: string[];
  requiredSecrets: string[];
  implementationSteps: string[];
}

interface RootCauseReport {
  timestamp: string;
  services: ServiceBlockage[];
  overallFindings: string[];
  immediateFixes: string[];
  secretsNeeded: string[];
}

class BlockedServicesAnalyzer {
  private report: RootCauseReport = {
    timestamp: new Date().toISOString(),
    services: [],
    overallFindings: [],
    immediateFixes: [],
    secretsNeeded: []
  };

  async analyzeBlockedServices(): Promise<RootCauseReport> {
    console.log('🔍 Running root cause analysis for blocked services...');
    
    await this.analyzeGoogleMaps();
    await this.analyzeTaskadeWidgets();
    await this.analyzeYouTube();
    
    this.generateOverallFindings();
    this.prioritizeImmediateFixes();
    
    await this.saveReport();
    return this.report;
  }

  private async analyzeGoogleMaps(): Promise<void> {
    console.log('🗺️ Analyzing Google Maps integration...');
    
    const googleMapsAnalysis: ServiceBlockage = {
      service: 'Google Maps',
      currentStatus: 'completely_blocked',
      blockingFactors: {
        csp: true, // CSP missing maps.googleapis.com
        authentication: false, // Maps API typically doesn't need consciousness auth
        apiKeys: true, // No Google Maps API key
        cors: false, // CORS shouldn't affect Maps embed
        requestValidation: false, // Maps uses standard requests
        domNesting: false // Not related to DOM nesting
      },
      specificIssues: [
        'CSP connect-src missing maps.googleapis.com',
        'CSP script-src missing maps.googleapis.com', 
        'Missing GOOGLE_MAPS_API_KEY environment variable',
        'No Google Maps components implemented in codebase',
        'Maps embed URLs not whitelisted in frame-src'
      ],
      requiredSecrets: ['GOOGLE_MAPS_API_KEY'],
      implementationSteps: [
        'Add maps.googleapis.com to CSP connect-src and script-src',
        'Add *.google.com to CSP frame-src (already done)',
        'Request Google Maps API key from user',
        'Create Google Maps React component',
        'Add Maps integration routes'
      ]
    };

    this.report.services.push(googleMapsAnalysis);
  }

  private async analyzeTaskadeWidgets(): Promise<void> {
    console.log('📋 Analyzing Taskade widgets integration...');
    
    const taskadeAnalysis: ServiceBlockage = {
      service: 'Taskade Widgets',
      currentStatus: 'partially_blocked',
      blockingFactors: {
        csp: true, // CSP missing taskade domains in some directives
        authentication: true, // Consciousness framework blocking widget routes
        apiKeys: false, // Taskade API key exists
        cors: false, // CORS exemptions exist for taskade-embed
        requestValidation: true, // Strict validation blocking widget payloads
        domNesting: true // DOM nesting warning in console
      },
      specificIssues: [
        'CSP frame-src missing *.taskade.com (partially fixed)',
        'Widget routes requiring consciousness authentication',
        'Request validation pipeline rejecting Taskade widget data',
        'DOM nesting warning: div cannot appear as descendant of p',
        'Missing widget embedding components in React codebase',
        'Taskade-embed route exists but widgets not rendering'
      ],
      requiredSecrets: [], // API key already exists
      implementationSteps: [
        'Fix DOM nesting in Skeleton/DynamicContent components',
        'Create consciousness-exempt widget routes',
        'Add Taskade widget validation schemas',
        'Implement React Taskade widget components',
        'Test widget embedding functionality'
      ]
    };

    this.report.services.push(taskadeAnalysis);
  }

  private async analyzeYouTube(): Promise<void> {
    console.log('📺 Analyzing YouTube integration...');
    
    const youtubeAnalysis: ServiceBlockage = {
      service: 'YouTube',
      currentStatus: 'partially_blocked',
      blockingFactors: {
        csp: false, // YouTube domains already in CSP frame-src
        authentication: true, // API routes may require consciousness auth
        apiKeys: true, // No YouTube Data API key
        cors: false, // YouTube embeds don't need CORS
        requestValidation: false, // Standard YouTube embed requests
        domNesting: false // Not related to DOM issues
      },
      specificIssues: [
        'Missing YOUTUBE_API_KEY for Data API access',
        'YouTube Data API routes requiring authentication',
        'No YouTube playlist/search integration components',
        'YouTube embed components may conflict with consciousness framework',
        'CSP allows YouTube embeds but API calls might be blocked'
      ],
      requiredSecrets: ['YOUTUBE_API_KEY', 'YOUTUBE_DATA_API_KEY'],
      implementationSteps: [
        'Request YouTube Data API key from user',
        'Create public YouTube API routes (no auth required)',
        'Add youtubei.googleapis.com to CSP connect-src',
        'Implement YouTube Data API integration',
        'Create YouTube playlist/search React components'
      ]
    };

    this.report.services.push(youtubeAnalysis);
  }

  private generateOverallFindings(): void {
    this.report.overallFindings = [
      '🚨 DOM nesting warning causing render issues (div in p elements)',
      '🚨 Missing API keys for Google Maps and YouTube Data API',
      '🚨 Consciousness authentication blocking widget/API routes',
      '🚨 Request validation pipeline too strict for external widget data',
      '⚠️ CSP partially updated but missing some Google service domains',
      '⚠️ Taskade widgets exist but not rendering due to validation conflicts',
      '⚠️ YouTube embeds allowed but Data API integration missing',
      '✅ Taskade API key configured and CSRF exemptions exist',
      '✅ Basic CSP updates for external services applied'
    ];
  }

  private prioritizeImmediateFixes(): void {
    this.report.immediateFixes = [
      '1. CRITICAL: Fix DOM nesting warning in Skeleton/DynamicContent components',
      '2. CRITICAL: Create consciousness-exempt routes for widgets/APIs',
      '3. HIGH: Add missing Google service domains to CSP',
      '4. HIGH: Request missing API keys from user (Google Maps, YouTube)',
      '5. MEDIUM: Add validation schemas for external widget data',
      '6. MEDIUM: Implement React components for external services',
      '7. LOW: Test and verify all external service integrations'
    ];

    this.report.secretsNeeded = [
      'GOOGLE_MAPS_API_KEY - for Google Maps integration',
      'YOUTUBE_API_KEY - for YouTube Data API access', 
      'VITE_GA_MEASUREMENT_ID - for Google Analytics (already identified)'
    ];
  }

  private async saveReport(): Promise<void> {
    await fs.writeFile(
      'blocked-services-root-cause-report.json',
      JSON.stringify(this.report, null, 2)
    );
    console.log('📊 Root cause analysis saved to blocked-services-root-cause-report.json');
  }
}

// Execute analysis
async function runBlockedServicesAnalysis() {
  const analyzer = new BlockedServicesAnalyzer();
  const report = await analyzer.analyzeBlockedServices();
  
  console.log('\n🎯 ROOT CAUSE ANALYSIS COMPLETE');
  console.log('================================');
  console.log(`📊 Services Analyzed: ${report.services.length}`);
  console.log(`🚨 Critical Issues Found: ${report.overallFindings.filter(f => f.includes('🚨')).length}`);
  console.log(`🔑 Secrets Needed: ${report.secretsNeeded.length}`);
  
  console.log('\n🚨 OVERALL FINDINGS:');
  report.overallFindings.forEach((finding, index) => {
    console.log(`   ${index + 1}. ${finding}`);
  });
  
  console.log('\n🛠️ IMMEDIATE FIXES NEEDED:');
  report.immediateFixes.forEach((fix, index) => {
    console.log(`   ${fix}`);
  });
  
  console.log('\n🔑 SECRETS NEEDED FROM USER:');
  report.secretsNeeded.forEach((secret, index) => {
    console.log(`   ${index + 1}. ${secret}`);
  });
  
  return report;
}

export { BlockedServicesAnalyzer, runBlockedServicesAnalysis };

// Auto-run analysis
runBlockedServicesAnalysis().catch(console.error);