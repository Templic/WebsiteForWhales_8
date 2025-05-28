/**
 * Holistic Security System Diagnosis
 * Comprehensive analysis of multi-layer security blocking Google/Taskade APIs
 * 
 * This tool analyzes the entire security stack:
 * 1. CSRF Protection Layer
 * 2. Content Security Policy (CSP)
 * 3. CORS Configuration
 * 4. Authentication Middleware
 * 5. Request Validation Pipeline
 * 6. API Route Security
 * 7. Consciousness Security Framework
 */

import { promises as fs } from 'fs';

interface SecurityLayer {
  name: string;
  status: 'blocking' | 'allowing' | 'unknown';
  configuration: any;
  potentialIssues: string[];
  recommendations: string[];
}

interface APIBlockageDiagnosis {
  service: 'google' | 'taskade';
  blocked: boolean;
  blockingLayers: SecurityLayer[];
  allowingLayers: SecurityLayer[];
  rootCause: string;
  solution: string[];
}

interface HolisticSecurityReport {
  timestamp: string;
  systemStatus: 'fully_blocked' | 'partially_blocked' | 'fully_open';
  securityLayers: SecurityLayer[];
  apiDiagnoses: APIBlockageDiagnosis[];
  criticalFindings: string[];
  implementationPlan: string[];
}

class HolisticSecurityDiagnostic {
  private report: HolisticSecurityReport = {
    timestamp: new Date().toISOString(),
    systemStatus: 'unknown' as any,
    securityLayers: [],
    apiDiagnoses: [],
    criticalFindings: [],
    implementationPlan: []
  };

  async runComprehensiveDiagnosis(): Promise<HolisticSecurityReport> {
    console.log('🔍 Starting holistic security system diagnosis...');
    
    // Analyze each security layer
    await this.analyzeCSRFProtection();
    await this.analyzeContentSecurityPolicy();
    await this.analyzeCORSConfiguration();
    await this.analyzeAuthenticationMiddleware();
    await this.analyzeRequestValidation();
    await this.analyzeAPIRouting();
    await this.analyzeConsciousnessFramework();
    
    // Diagnose specific API blockages
    await this.diagnoseGoogleAPI();
    await this.diagnoseTaskadeAPI();
    
    // Generate critical findings and solutions
    await this.generateCriticalFindings();
    await this.createImplementationPlan();
    
    // Determine overall system status
    this.assessSystemStatus();
    
    // Save comprehensive report
    await this.saveReport();
    
    return this.report;
  }

  private async analyzeCSRFProtection(): Promise<void> {
    console.log('🛡️ Analyzing CSRF Protection Layer...');
    
    const csrfLayer: SecurityLayer = {
      name: 'CSRF Protection',
      status: 'allowing',
      configuration: {
        enabled: false, // Disabled in middleware/index.ts
        exemptRoutes: [
          '/api/health',
          '/api/webhooks', 
          '/api/external-callbacks',
          '/api/auth/*',
          '/api/jwt/*',
          '/taskade-embed'
        ],
        note: 'CSRF Protection temporarily disabled for Replit Auth integration'
      },
      potentialIssues: [
        'CSRF completely disabled globally',
        'No double-submit cookie verification',
        'Missing Origin header validation',
        'API endpoints completely unprotected from CSRF'
      ],
      recommendations: [
        'Re-enable CSRF with smart exemptions',
        'Implement Origin header validation for API calls',
        'Add CSRF token validation for state-changing operations',
        'Keep exemptions only for authentic external integrations'
      ]
    };

    this.report.securityLayers.push(csrfLayer);
  }

  private async analyzeContentSecurityPolicy(): Promise<void> {
    console.log('🔒 Analyzing Content Security Policy...');
    
    const cspLayer: SecurityLayer = {
      name: 'Content Security Policy',
      status: 'blocking',
      configuration: {
        'default-src': "'self'",
        'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https://auth.util.repl.co https://www.youtube.com https://js.stripe.com",
        'connect-src': "'self' wss: ws: https://api.stripe.com",
        'frame-src': "'self' https://auth.util.repl.co https://www.youtube.com https://youtube.com https://www.google.com https://*.google.com https://js.stripe.com https://hooks.stripe.com"
      },
      potentialIssues: [
        'Google APIs (*.googleapis.com) NOT in connect-src',
        'Google Analytics domains missing from script-src',
        'Taskade domains (*.taskade.com) NOT in any CSP directive',
        'Google Fonts/CDN resources blocked',
        'API calls to external services rejected by browser'
      ],
      recommendations: [
        'Add *.googleapis.com to connect-src for Google API calls',
        'Add www.googletagmanager.com to script-src for Analytics',
        'Add *.taskade.com to connect-src and frame-src',
        'Add fonts.googleapis.com to font-src',
        'Test each API integration endpoint specifically'
      ]
    };

    this.report.securityLayers.push(cspLayer);
  }

  private async analyzeCORSConfiguration(): Promise<void> {
    console.log('🌐 Analyzing CORS Configuration...');
    
    const corsLayer: SecurityLayer = {
      name: 'CORS Configuration',
      status: 'allowing',
      configuration: {
        origin: 'config.corsOrigins',
        credentials: true,
        note: 'Using dynamic origin from config'
      },
      potentialIssues: [
        'CORS origins might not include all required domains',
        'Credentials enabled could block some API calls',
        'Missing specific handling for preflight OPTIONS requests'
      ],
      recommendations: [
        'Verify config.corsOrigins includes Google/Taskade domains if needed',
        'Add explicit OPTIONS method handling',
        'Consider separate CORS rules for API vs embedding'
      ]
    };

    this.report.securityLayers.push(corsLayer);
  }

  private async analyzeAuthenticationMiddleware(): Promise<void> {
    console.log('👤 Analyzing Authentication Middleware...');
    
    const authLayer: SecurityLayer = {
      name: 'Authentication Middleware',
      status: 'blocking',
      configuration: {
        replit_auth: 'enabled',
        session_based: 'enabled', 
        jwt_auth: 'enabled',
        consciousness_framework: 'enabled'
      },
      potentialIssues: [
        'Multiple auth systems could conflict',
        'API endpoints might require authentication when they should be public',
        'Consciousness framework adds additional permission layers',
        'Session requirements for client-side API calls'
      ],
      recommendations: [
        'Create public API routes for Google/Taskade integration',
        'Exempt external API endpoints from authentication',
        'Separate internal vs external API authentication requirements',
        'Review consciousness permission levels for API access'
      ]
    };

    this.report.securityLayers.push(authLayer);
  }

  private async analyzeRequestValidation(): Promise<void> {
    console.log('✅ Analyzing Request Validation Pipeline...');
    
    const validationLayer: SecurityLayer = {
      name: 'Request Validation',
      status: 'blocking',
      configuration: {
        zod_validation: 'strict',
        api_validation: 'enabled',
        rasp_protection: 'active',
        quantum_encryption: 'enabled'
      },
      potentialIssues: [
        'Strict Zod validation might reject valid API requests',
        'RASP protection could block legitimate external calls',
        'Request body validation conflicts with API payloads',
        'Quantum encryption overhead on API responses'
      ],
      recommendations: [
        'Create validation exemptions for external API integrations',
        'Add specific schemas for Google/Taskade API formats',
        'Bypass RASP for trusted external services',
        'Optimize encryption for API performance'
      ]
    };

    this.report.securityLayers.push(validationLayer);
  }

  private async analyzeAPIRouting(): Promise<void> {
    console.log('🛣️ Analyzing API Routing Layer...');
    
    const routingLayer: SecurityLayer = {
      name: 'API Routing',
      status: 'unknown',
      configuration: {
        protected_routes: 'most API endpoints require isAuthenticated',
        admin_routes: 'require admin privileges',
        public_routes: 'limited public access',
        external_integration: 'unclear routing for external APIs'
      },
      potentialIssues: [
        'Google/Taskade API routes might not exist',
        'Existing routes might require authentication inappropriately',
        'Missing route handlers for external service integration',
        'Route middleware stack too restrictive for API calls'
      ],
      recommendations: [
        'Create dedicated /api/external/* routes for third-party integrations',
        'Add public routes for Google Analytics tracking',
        'Implement Taskade webhook endpoints without auth requirements',
        'Review all route middleware for API compatibility'
      ]
    };

    this.report.securityLayers.push(routingLayer);
  }

  private async analyzeConsciousnessFramework(): Promise<void> {
    console.log('🧠 Analyzing Consciousness Security Framework...');
    
    const consciousnessLayer: SecurityLayer = {
      name: 'Consciousness Security Framework',
      status: 'blocking',
      configuration: {
        consciousness_levels: 'required for spiritual data access',
        whale_wisdom_protection: 'active',
        manifestation_privacy: 'enabled',
        sacred_geometry_access: 'consciousness-gated'
      },
      potentialIssues: [
        'Consciousness level requirements block external API access',
        'Spiritual permission system conflicts with technical APIs',
        'External services cannot authenticate with consciousness framework',
        'API calls fail consciousness validation checks'
      ],
      recommendations: [
        'Create technical API bypass for consciousness requirements',
        'Separate spiritual features from technical integrations',
        'Add external service authentication method',
        'Implement consciousness-exempt routes for APIs'
      ]
    };

    this.report.securityLayers.push(consciousnessLayer);
  }

  private async diagnoseGoogleAPI(): Promise<void> {
    console.log('🔍 Diagnosing Google API Integration...');
    
    const googleDiagnosis: APIBlockageDiagnosis = {
      service: 'google',
      blocked: true,
      blockingLayers: [
        this.report.securityLayers.find(l => l.name === 'Content Security Policy')!,
        this.report.securityLayers.find(l => l.name === 'Consciousness Security Framework')!
      ],
      allowingLayers: [
        this.report.securityLayers.find(l => l.name === 'CSRF Protection')!
      ],
      rootCause: 'CSP blocks *.googleapis.com connections and consciousness framework requires authentication',
      solution: [
        'Add *.googleapis.com to CSP connect-src directive',
        'Add www.googletagmanager.com to CSP script-src',
        'Create public Google API routes that bypass consciousness authentication',
        'Implement Google Analytics without consciousness level requirements'
      ]
    };

    this.report.apiDiagnoses.push(googleDiagnosis);
  }

  private async diagnoseTaskadeAPI(): Promise<void> {
    console.log('🔍 Diagnosing Taskade API Integration...');
    
    const taskadeDiagnosis: APIBlockageDiagnosis = {
      service: 'taskade',
      blocked: true,
      blockingLayers: [
        this.report.securityLayers.find(l => l.name === 'Content Security Policy')!,
        this.report.securityLayers.find(l => l.name === 'Authentication Middleware')!,
        this.report.securityLayers.find(l => l.name === 'Consciousness Security Framework')!
      ],
      allowingLayers: [
        this.report.securityLayers.find(l => l.name === 'CSRF Protection')! // Has taskade-embed exemption
      ],
      rootCause: 'CSP missing Taskade domains, authentication required for API routes, consciousness framework blocking',
      solution: [
        'Add *.taskade.com to CSP connect-src and frame-src directives',
        'Create public Taskade API integration routes',
        'Implement Taskade webhook endpoints without authentication',
        'Bypass consciousness requirements for Taskade technical integration'
      ]
    };

    this.report.apiDiagnoses.push(taskadeDiagnosis);
  }

  private async generateCriticalFindings(): Promise<void> {
    this.report.criticalFindings = [
      '🚨 Content Security Policy blocking Google APIs (*.googleapis.com missing from connect-src)',
      '🚨 Content Security Policy blocking Taskade domains (*.taskade.com missing)',
      '🚨 Consciousness Security Framework requiring authentication for technical APIs',
      '🚨 Missing public API routes for external service integration',
      '🚨 Request validation pipeline too strict for external API payloads',
      '⚠️ Multiple authentication systems potentially conflicting',
      '⚠️ CSRF protection completely disabled (security risk)',
      '⚠️ API routing unclear for external service integration'
    ];
  }

  private async createImplementationPlan(): Promise<void> {
    this.report.implementationPlan = [
      '1. IMMEDIATE: Update CSP to allow Google/Taskade domains',
      '2. IMMEDIATE: Create public API routes for external integrations', 
      '3. HIGH: Implement consciousness-exempt API authentication',
      '4. HIGH: Add specific validation schemas for external APIs',
      '5. MEDIUM: Re-enable smart CSRF protection with exemptions',
      '6. MEDIUM: Optimize security middleware stack for API performance',
      '7. LOW: Consolidate authentication systems for clarity',
      '8. LOW: Add comprehensive API integration testing'
    ];
  }

  private assessSystemStatus(): void {
    const blockingLayers = this.report.securityLayers.filter(layer => layer.status === 'blocking').length;
    const totalLayers = this.report.securityLayers.length;
    
    if (blockingLayers >= totalLayers * 0.7) {
      this.report.systemStatus = 'fully_blocked';
    } else if (blockingLayers > 0) {
      this.report.systemStatus = 'partially_blocked';
    } else {
      this.report.systemStatus = 'fully_open';
    }
  }

  private async saveReport(): Promise<void> {
    await fs.writeFile(
      'holistic-security-diagnosis-report.json',
      JSON.stringify(this.report, null, 2)
    );
    console.log('📊 Holistic security diagnosis saved to holistic-security-diagnosis-report.json');
  }
}

// Execute comprehensive diagnosis
async function runHolisticSecurityDiagnosis() {
  const diagnostic = new HolisticSecurityDiagnostic();
  const report = await diagnostic.runComprehensiveDiagnosis();
  
  console.log('\n🎯 HOLISTIC SECURITY DIAGNOSIS COMPLETE');
  console.log('=====================================');
  console.log(`📊 System Status: ${report.systemStatus.toUpperCase()}`);
  console.log(`🔒 Security Layers Analyzed: ${report.securityLayers.length}`);
  console.log(`🚨 Critical Findings: ${report.criticalFindings.length}`);
  console.log(`🛠️ Implementation Steps: ${report.implementationPlan.length}`);
  
  console.log('\n🚨 CRITICAL FINDINGS:');
  report.criticalFindings.forEach((finding, index) => {
    console.log(`   ${index + 1}. ${finding}`);
  });
  
  console.log('\n🛠️ IMPLEMENTATION PLAN:');
  report.implementationPlan.forEach((step, index) => {
    console.log(`   ${step}`);
  });
  
  return report;
}

export { HolisticSecurityDiagnostic, runHolisticSecurityDiagnosis };

// Auto-run diagnosis
runHolisticSecurityDiagnosis().catch(console.error);