#!/usr/bin/env npx tsx
/**
 * Utility 2: API Standards Enforcer
 * Validates API endpoints follow REST conventions and security best practices
 * Based on app documentation standards for server-side API design
 */

import * as fs from 'fs';
import * as path from 'path';

interface APIEndpoint {
  file: string;
  method: string;
  path: string;
  handler: string;
  line: number;
}

interface APIIssue {
  type: 'method_convention' | 'response_schema' | 'auth_missing' | 'error_handling' | 'rate_limiting' |
        'documentation_gaps' | 'versioning_strategy' | 'monitoring_telemetry';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  endpoint: APIEndpoint;
  fix: string;
}

interface APIAnalysisResult {
  totalEndpoints: number;
  issuesFound: number;
  securityIssues: number;
  conventionViolations: number;
  complianceScore: number;
  endpoints: APIEndpoint[];
  issues: APIIssue[];
  recommendations: string[];
  documentationCoverage: {
    documented: number;
    undocumented: number;
    quality: 'excellent' | 'good' | 'poor';
  };
  versioningCompliance: {
    hasVersioning: boolean;
    deprecationStrategy: boolean;
    backwardCompatibility: number;
  };
  monitoringSetup: {
    hasLogging: boolean;
    hasMetrics: boolean;
    hasTracing: boolean;
    alertingConfigured: boolean;
  };
}

export class APIStandardsEnforcer {
  private httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  private securityMiddleware = ['authenticate', 'authorize', 'validateToken', 'requireAuth'];
  private errorPatterns = ['try', 'catch', 'throw', 'error'];

  // NEW SUBTITLE 1: API Documentation Patterns
  private documentationPatterns = [
    '@swagger', '@openapi', '* @param', '* @returns', '* @throws',
    'JSDoc', 'API_DOCS', 'schema:', 'example:'
  ];

  // NEW SUBTITLE 2: API Versioning Patterns
  private versioningPatterns = [
    '/v1/', '/v2/', 'version:', 'api-version', 'Accept-Version',
    'deprecated', '@deprecated', 'sunset-date'
  ];

  // NEW SUBTITLE 3: Monitoring & Telemetry Patterns
  private monitoringPatterns = [
    'console.log', 'logger.', 'metrics.', 'trace.', 'span.',
    'prometheus', 'datadog', 'newrelic', 'sentry'
  ];

  /**
   * Analyze API standards across the server codebase
   */
  async analyzeAPIs(directory: string = './server'): Promise<APIAnalysisResult> {
    console.log('🔌 API Standards Enforcer');
    console.log('Analyzing API endpoints for REST conventions and security...\n');

    const files = await this.findAPIFiles(directory);
    const endpoints: APIEndpoint[] = [];
    const issues: APIIssue[] = [];

    for (const file of files) {
      const fileEndpoints = await this.extractEndpoints(file);
      endpoints.push(...fileEndpoints);

      const fileIssues = await this.analyzeFileAPIs(file, fileEndpoints);
      issues.push(...fileIssues);
    }

    const result: APIAnalysisResult = {
      totalEndpoints: endpoints.length,
      issuesFound: issues.length,
      securityIssues: issues.filter(i => i.type === 'auth_missing').length,
      conventionViolations: issues.filter(i => i.type === 'method_convention').length,
      complianceScore: this.calculateComplianceScore(issues, endpoints.length),
      endpoints,
      issues,
      recommendations: this.generateRecommendations(issues)
    };

    this.displayResults(result);
    return result;
  }

  /**
   * Extract API endpoints from file
   */
  private async extractEndpoints(filePath: string): Promise<APIEndpoint[]> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const endpoints: APIEndpoint[] = [];

    lines.forEach((line, index) => {
      // Match Express route patterns: app.get('/path', handler) or router.post('/path', handler)
      const routeMatch = line.match(/(app|router)\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/i);
      if (routeMatch) {
        const [, , method, path] = routeMatch;
        
        endpoints.push({
          file: filePath,
          method: method.toUpperCase(),
          path: path,
          handler: line.trim(),
          line: index + 1
        });
      }
    });

    return endpoints;
  }

  /**
   * Analyze API issues in a file
   */
  private async analyzeFileAPIs(filePath: string, endpoints: APIEndpoint[]): Promise<APIIssue[]> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const issues: APIIssue[] = [];

    for (const endpoint of endpoints) {
      // Check method conventions
      const methodIssues = this.checkMethodConventions(endpoint);
      issues.push(...methodIssues);

      // Check authentication
      const authIssues = this.checkAuthentication(endpoint, content);
      issues.push(...authIssues);

      // Check error handling
      const errorIssues = this.checkErrorHandling(endpoint, content);
      issues.push(...errorIssues);

      // Check response schemas
      const schemaIssues = this.checkResponseSchemas(endpoint, content);
      issues.push(...schemaIssues);

      // Check rate limiting
      const rateLimitIssues = this.checkRateLimiting(endpoint, content);
      issues.push(...rateLimitIssues);
    }

    return issues;
  }

  /**
   * Check HTTP method conventions
   */
  private checkMethodConventions(endpoint: APIEndpoint): APIIssue[] {
    const issues: APIIssue[] = [];

    // GET should not modify data
    if (endpoint.method === 'GET' && endpoint.path.includes('/create')) {
      issues.push({
        type: 'method_convention',
        severity: 'high',
        description: 'GET method used for data creation',
        endpoint,
        fix: 'Use POST method for creating resources'
      });
    }

    // POST should be for creation
    if (endpoint.method === 'POST' && endpoint.path.includes('/get')) {
      issues.push({
        type: 'method_convention',
        severity: 'medium',
        description: 'POST method used for data retrieval',
        endpoint,
        fix: 'Use GET method for data retrieval'
      });
    }

    // DELETE should be for deletion
    if (endpoint.method === 'DELETE' && !endpoint.path.includes('/:id')) {
      issues.push({
        type: 'method_convention',
        severity: 'medium',
        description: 'DELETE endpoint missing resource identifier',
        endpoint,
        fix: 'Include resource ID in DELETE endpoint path'
      });
    }

    // PUT should be for full updates
    if (endpoint.method === 'PUT' && endpoint.path.includes('/partial')) {
      issues.push({
        type: 'method_convention',
        severity: 'low',
        description: 'PUT method used for partial updates',
        endpoint,
        fix: 'Use PATCH for partial updates, PUT for full replacement'
      });
    }

    return issues;
  }

  /**
   * Check authentication requirements
   */
  private checkAuthentication(endpoint: APIEndpoint, content: string): APIIssue[] {
    const issues: APIIssue[] = [];

    // Check if endpoint requires authentication
    const isPublicEndpoint = endpoint.path.includes('/public') || 
                            endpoint.path.includes('/health') ||
                            endpoint.path === '/';

    if (!isPublicEndpoint) {
      const hasAuth = this.securityMiddleware.some(middleware => 
        content.includes(middleware) || endpoint.handler.includes(middleware)
      );

      if (!hasAuth) {
        issues.push({
          type: 'auth_missing',
          severity: 'critical',
          description: 'Protected endpoint missing authentication middleware',
          endpoint,
          fix: 'Add authentication middleware (authenticate, requireAuth, etc.)'
        });
      }
    }

    return issues;
  }

  /**
   * Check error handling
   */
  private checkErrorHandling(endpoint: APIEndpoint, content: string): APIIssue[] {
    const issues: APIIssue[] = [];

    // Get the handler function content
    const handlerStartIndex = content.indexOf(endpoint.handler);
    if (handlerStartIndex === -1) return issues;

    // Look for try-catch blocks in the handler
    const handlerSection = content.substring(handlerStartIndex, handlerStartIndex + 1000);
    const hasTryCatch = handlerSection.includes('try') && handlerSection.includes('catch');
    const hasErrorHandling = this.errorPatterns.some(pattern => handlerSection.includes(pattern));

    if (!hasTryCatch && !hasErrorHandling) {
      issues.push({
        type: 'error_handling',
        severity: 'high',
        description: 'Endpoint missing proper error handling',
        endpoint,
        fix: 'Add try-catch blocks and proper error responses'
      });
    }

    return issues;
  }

  /**
   * Check response schemas
   */
  private checkResponseSchemas(endpoint: APIEndpoint, content: string): APIIssue[] {
    const issues: APIIssue[] = [];

    // Check for consistent response format
    const handlerStartIndex = content.indexOf(endpoint.handler);
    if (handlerStartIndex === -1) return issues;

    const handlerSection = content.substring(handlerStartIndex, handlerStartIndex + 1000);
    
    // Look for status codes
    const hasStatusCode = handlerSection.includes('.status(') || handlerSection.includes('.sendStatus(');
    
    if (!hasStatusCode) {
      issues.push({
        type: 'response_schema',
        severity: 'medium',
        description: 'Response missing explicit status code',
        endpoint,
        fix: 'Set explicit HTTP status codes (200, 201, 400, etc.)'
      });
    }

    // Check for JSON responses
    const hasJsonResponse = handlerSection.includes('.json(') || handlerSection.includes('res.send(');
    
    if (!hasJsonResponse && endpoint.method !== 'DELETE') {
      issues.push({
        type: 'response_schema',
        severity: 'medium',
        description: 'API should return consistent JSON responses',
        endpoint,
        fix: 'Use res.json() for consistent API responses'
      });
    }

    return issues;
  }

  /**
   * Check rate limiting
   */
  private checkRateLimiting(endpoint: APIEndpoint, content: string): APIIssue[] {
    const issues: APIIssue[] = [];

    // Check for rate limiting middleware
    const hasRateLimit = content.includes('rateLimit') || 
                        content.includes('rateLimiter') ||
                        content.includes('express-rate-limit');

    // POST, PUT, PATCH endpoints should have rate limiting
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && !hasRateLimit) {
      issues.push({
        type: 'rate_limiting',
        severity: 'medium',
        description: 'Write endpoints missing rate limiting',
        endpoint,
        fix: 'Add rate limiting middleware for write operations'
      });
    }

    return issues;
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(issues: APIIssue[], endpointCount: number): number {
    if (endpointCount === 0) return 1.0;

    let score = 1.0;
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;
    const lowIssues = issues.filter(i => i.severity === 'low').length;

    score -= (criticalIssues * 0.3) / endpointCount;
    score -= (highIssues * 0.2) / endpointCount;
    score -= (mediumIssues * 0.1) / endpointCount;
    score -= (lowIssues * 0.05) / endpointCount;

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(issues: APIIssue[]): string[] {
    const recommendations: string[] = [];
    const issueTypes = new Set(issues.map(i => i.type));

    if (issueTypes.has('auth_missing')) {
      recommendations.push('Implement authentication middleware for all protected endpoints');
    }

    if (issueTypes.has('method_convention')) {
      recommendations.push('Follow REST conventions: GET for retrieval, POST for creation, PUT/PATCH for updates');
    }

    if (issueTypes.has('error_handling')) {
      recommendations.push('Add comprehensive error handling with try-catch blocks');
    }

    if (issueTypes.has('response_schema')) {
      recommendations.push('Standardize API responses with consistent status codes and JSON format');
    }

    if (issueTypes.has('rate_limiting')) {
      recommendations.push('Implement rate limiting for write operations and sensitive endpoints');
    }

    return recommendations;
  }

  /**
   * Find API files
   */
  private async findAPIFiles(directory: string): Promise<string[]> {
    const files: string[] = [];

    const walk = async (dir: string) => {
      try {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
            await walk(fullPath);
          } else if (entry.isFile() && this.isAPIFile(entry.name)) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not read directory ${dir}`);
      }
    };

    await walk(directory);
    return files;
  }

  /**
   * Display results
   */
  private displayResults(result: APIAnalysisResult): void {
    console.log('📊 API Standards Analysis Results');
    console.log('=' .repeat(50));
    console.log(`   Total Endpoints: ${result.totalEndpoints}`);
    console.log(`   Issues Found: ${result.issuesFound}`);
    console.log(`   Security Issues: ${result.securityIssues}`);
    console.log(`   Convention Violations: ${result.conventionViolations}`);
    console.log(`   Compliance Score: ${(result.complianceScore * 100).toFixed(1)}%`);

    if (result.issues.length > 0) {
      console.log('\n🚨 Critical Issues:');
      const criticalIssues = result.issues.filter(i => i.severity === 'critical');
      criticalIssues.slice(0, 5).forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue.description}`);
        console.log(`      Endpoint: ${issue.endpoint.method} ${issue.endpoint.path}`);
        console.log(`      Fix: ${issue.fix}`);
        console.log('');
      });
    }

    if (result.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      result.recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
    }

    console.log('\n🎯 API Standards Summary:');
    if (result.complianceScore > 0.9) {
      console.log('   ✅ Excellent API standards compliance!');
    } else if (result.complianceScore > 0.7) {
      console.log('   👍 Good API standards with minor issues');
    } else {
      console.log('   🚨 Significant API standards improvements needed');
    }
  }

  /**
   * Utility methods
   */
  private shouldSkipDirectory(name: string): boolean {
    return ['node_modules', 'dist', 'build', '.git'].includes(name);
  }

  private isAPIFile(filename: string): boolean {
    return /\.(js|ts)$/.test(filename) && 
           (filename.includes('route') || filename.includes('api') || filename.includes('controller'));
  }
}

/**
 * Main execution
 */
async function main() {
  const enforcer = new APIStandardsEnforcer();
  
  try {
    await enforcer.analyzeAPIs('./server');
    console.log('\n🎉 API Standards Analysis Complete!');
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
export default APIStandardsEnforcer;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}