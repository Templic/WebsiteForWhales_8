import DOMPurify from "dompurify";
#!/usr/bin/env npx tsx
/**
 * Utility 3: Security Compliance Scanner
 * Ensures security best practices across the entire codebase
 * Based on app documentation standards for security and data protection
 */

import * as fs from 'fs';
import * as path from 'path';

interface SecurityIssue {
  type: 'input_sanitization' | 'sql_injection' | 'auth_flow' | 'cors_config' | 'data_exposure' |
        'privacy_compliance' | 'encryption_standards' | 'audit_logging';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  file: string;
  line?: number;
  fix: string;
  impact: string;
}

interface SecurityAnalysisResult {
  totalFiles: number;
  vulnerabilities: number;
  criticalIssues: number;
  securityScore: number;
  issues: SecurityIssue[];
  recommendations: string[];
  complianceStatus: {
    inputValidation: boolean;
    authenticationFlow: boolean;
    dataProtection: boolean;
    corsConfiguration: boolean;
    sensitiveDataHandling: boolean;
  };
  privacyCompliance: {
    gdprReady: boolean;
    ccpaCompliant: boolean;
    dataRetentionPolicies: boolean;
    consentManagement: boolean;
  };
  encryptionStandards: {
    dataAtRest: boolean;
    dataInTransit: boolean;
    keyManagement: boolean;
    certificateValidation: boolean;
  };
  auditingCapabilities: {
    accessLogging: boolean;
    changeTracking: boolean;
    securityEvents: boolean;
    complianceReporting: boolean;
  };
}

export class SecurityComplianceScanner {
  private dangerousPatterns = [
    'eval(', 'innerHTML', 'document.write', 'setTimeout(', 'setInterval(',
    'new Function(', 'script>', '<iframe', 'javascript:'
  ];

  private sqlPatterns = [
    'SELECT * FROM', 'INSERT INTO', 'UPDATE ', 'DELETE FROM',
    'DROP TABLE', 'ALTER TABLE', 'CREATE TABLE'
  ];

  private sensitiveDataPatterns = [
    'password', 'token', 'secret', 'key', 'credential',
    'api_key', 'private', 'auth', 'session'
  ];

  // NEW SUBTITLE 1: Privacy Compliance Patterns
  private privacyPatterns = [
    'gdpr', 'ccpa', 'consent', 'opt-out', 'data-retention',
    'right-to-be-forgotten', 'privacy-policy', 'cookie-consent'
  ];

  // NEW SUBTITLE 2: Encryption Standards
  private encryptionPatterns = [
    'crypto.', 'bcrypt', 'scrypt', 'AES', 'RSA', 'TLS', 'SSL',
    'encrypt', 'decrypt', 'hash', 'salt', 'cipher'
  ];

  // NEW SUBTITLE 3: Audit Logging Patterns
  private auditPatterns = [
    'audit.log', 'access.log', 'security.log', 'loginAttempt',
    'dataAccess', 'permissions', 'roleChange', 'sensitiveOperation'
  ];

  /**
   * Perform comprehensive security analysis
   */
  async scanSecurity(directory: string = './'): Promise<SecurityAnalysisResult> {
    console.log('🔒 Security Compliance Scanner');
    console.log('Analyzing codebase for security vulnerabilities and best practices...\n');

    const files = await this.findSecurityRelevantFiles(directory);
    const issues: SecurityIssue[] = [];

    for (const file of files) {
      const fileIssues = await this.analyzeFileSecurity(file);
      issues.push(...fileIssues);
    }

    const result: SecurityAnalysisResult = {
      totalFiles: files.length,
      vulnerabilities: issues.length,
      criticalIssues: issues.filter(i => i.severity === 'critical').length,
      securityScore: this.calculateSecurityScore(issues, files.length),
      issues,
      recommendations: this.generateSecurityRecommendations(issues),
      complianceStatus: this.assessCompliance(issues)
    };

    this.displayResults(result);
    return result;
  }

  /**
   * Analyze security issues in a single file
   */
  private async analyzeFileSecurity(filePath: string): Promise<SecurityIssue[]> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const issues: SecurityIssue[] = [];

    // Check input sanitization
    const inputIssues = this.checkInputSanitization(content, lines, filePath);
    issues.push(...inputIssues);

    // Check SQL injection vulnerabilities
    const sqlIssues = this.checkSQLInjection(content, lines, filePath);
    issues.push(...sqlIssues);

    // Check authentication flows
    const authIssues = this.checkAuthenticationFlow(content, lines, filePath);
    issues.push(...authIssues);

    // Check CORS configuration
    const corsIssues = this.checkCORSConfiguration(content, lines, filePath);
    issues.push(...corsIssues);

    // Check sensitive data exposure
    const dataIssues = this.checkSensitiveDataExposure(content, lines, filePath);
    issues.push(...dataIssues);

    return issues;
  }

  /**
   * Check input sanitization
   */
  private checkInputSanitization(content: string, lines: string[], filePath: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    lines.forEach((line, index) => {
      // Check for dangerous patterns
      this.dangerousPatterns.forEach(pattern => {
        if (line.includes(pattern)) {
          issues.push({
            type: 'input_sanitization',
            severity: 'critical',
            description: `Dangerous pattern detected: ${pattern}`,
            file: filePath,
            line: index + 1,
            fix: 'Sanitize input and use safe alternatives',
            impact: 'XSS vulnerabilities and code injection attacks'
          });
        }
      });

      // Check for unsanitized user input
      if (line.includes('req.body') || line.includes('req.query') || line.includes('req.params')) {
        const hasValidation = content.includes('validate') || 
                            content.includes('sanitize') ||
                            content.includes('joi') ||
                            content.includes('zod');
        
        if (!hasValidation) {
          issues.push({
            type: 'input_sanitization',
            severity: 'high',
            description: 'User input used without validation/sanitization',
            file: filePath,
            line: index + 1,
            fix: 'Add input validation using Joi, Zod, or express-validator',
            impact: 'Data corruption and injection attacks'
          });
        }
      }
    });

    return issues;
  }

  /**
   * Check SQL injection vulnerabilities
   */
  private checkSQLInjection(content: string, lines: string[], filePath: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    lines.forEach((line, index) => {
      // Check for string concatenation in SQL queries
      this.sqlPatterns.forEach(pattern => {
        if (line.includes(pattern) && (line.includes('+') || line.includes('${') || line.includes('`'))) {
          issues.push({
            type: 'sql_injection',
            severity: 'critical',
            description: 'SQL query uses string concatenation',
            file: filePath,
            line: index + 1,
            fix: 'Use parameterized queries or prepared statements',
            impact: 'SQL injection attacks and database compromise'
          });
        }
      });

      // Check for direct SQL execution without parameterization
      if ((line.includes('query(') || line.includes('execute(')) && 
          (line.includes('req.') || line.includes('${') || line.includes('+'))) {
        issues.push({
          type: 'sql_injection',
          severity: 'critical',
          description: 'Dynamic SQL query with user input',
          file: filePath,
          line: index + 1,
          fix: 'Use parameterized queries with placeholders',
          impact: 'Database compromise and data theft'
        });
      }
    });

    return issues;
  }

  /**
   * Check authentication flow security
   */
  private checkAuthenticationFlow(content: string, lines: string[], filePath: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check for hardcoded secrets
    lines.forEach((line, index) => {
      this.sensitiveDataPatterns.forEach(pattern => {
        if (line.includes(`${pattern}:`) || line.includes(`${pattern}=`)) {
          const hasHardcodedValue = line.includes('"') || line.includes("'");
          if (hasHardcodedValue && !line.includes('process.env')) {
            issues.push({
              type: 'auth_flow',
              severity: 'critical',
              description: `Hardcoded ${pattern} detected`,
              file: filePath,
              line: index + 1,
              fix: 'Move secrets to environment variables',
              impact: 'Credential exposure and unauthorized access'
            });
          }
        }
      });
    });

    // Check for weak session management
    if (content.includes('session') && !content.includes('secure')) {
      issues.push({
        type: 'auth_flow',
        severity: 'high',
        description: 'Session configuration missing security flags',
        file: filePath,
        fix: 'Add secure, httpOnly, and sameSite flags to session config',
        impact: 'Session hijacking and CSRF attacks'
      });
    }

    // Check for missing JWT verification
    if (content.includes('jwt') && !content.includes('verify')) {
      issues.push({
        type: 'auth_flow',
        severity: 'high',
        description: 'JWT token used without proper verification',
        file: filePath,
        fix: 'Always verify JWT signatures and expiration',
        impact: 'Token forgery and unauthorized access'
      });
    }

    return issues;
  }

  /**
   * Check CORS configuration
   */
  private checkCORSConfiguration(content: string, lines: string[], filePath: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check for wildcard CORS
    lines.forEach((line, index) => {
      if (line.includes('Access-Control-Allow-Origin') && line.includes('*')) {
        issues.push({
          type: 'cors_config',
          severity: 'high',
          description: 'CORS configured with wildcard origin',
          file: filePath,
          line: index + 1,
          fix: 'Specify allowed origins explicitly',
          impact: 'Cross-origin attacks and data exposure'
        });
      }

      if (line.includes('cors()') && !line.includes('origin:')) {
        issues.push({
          type: 'cors_config',
          severity: 'medium',
          description: 'CORS middleware without origin restrictions',
          file: filePath,
          line: index + 1,
          fix: 'Configure CORS with specific allowed origins',
          impact: 'Unauthorized cross-origin requests'
        });
      }
    });

    return issues;
  }

  /**
   * Check sensitive data exposure
   */
  private checkSensitiveDataExposure(content: string, lines: string[], filePath: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    lines.forEach((line, index) => {
      // Check for console.log with sensitive data
      if (line.includes('console.log') || line.includes('console.error')) {
        this.sensitiveDataPatterns.forEach(pattern => {
          if (line.toLowerCase().includes(pattern)) {
            issues.push({
              type: 'data_exposure',
              severity: 'medium',
              description: `Sensitive data logged to console: ${pattern}`,
              file: filePath,
              line: index + 1,
              fix: 'Remove console logs with sensitive data',
              impact: 'Information disclosure in logs'
            });
          }
        });
      }

      // Check for error messages exposing internals
      if (line.includes('throw new Error') && (line.includes('database') || line.includes('internal'))) {
        issues.push({
          type: 'data_exposure',
          severity: 'medium',
          description: 'Error message may expose internal details',
          file: filePath,
          line: index + 1,
          fix: 'Use generic error messages for users',
          impact: 'Information disclosure to attackers'
        });
      }

      // Check for unencrypted sensitive data storage
      if ((line.includes('password') || line.includes('secret')) && 
          !line.includes('hash') && !line.includes('encrypt') && !line.includes('bcrypt')) {
        issues.push({
          type: 'data_exposure',
          severity: 'critical',
          description: 'Sensitive data stored without encryption',
          file: filePath,
          line: index + 1,
          fix: 'Encrypt sensitive data before storage',
          impact: 'Data breach and credential compromise'
        });
      }
    });

    return issues;
  }

  /**
   * Calculate security score
   */
  private calculateSecurityScore(issues: SecurityIssue[], fileCount: number): number {
    if (fileCount === 0) return 1.0;

    let score = 1.0;
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;

    score -= (criticalIssues * 0.4) / fileCount;
    score -= (highIssues * 0.2) / fileCount;
    score -= (mediumIssues * 0.1) / fileCount;

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Assess compliance status
   */
  private assessCompliance(issues: SecurityIssue[]): any {
    const issueTypes = new Set(issues.map(i => i.type));

    return {
      inputValidation: !issueTypes.has('input_sanitization'),
      authenticationFlow: !issueTypes.has('auth_flow'),
      dataProtection: !issueTypes.has('data_exposure'),
      corsConfiguration: !issueTypes.has('cors_config'),
      sensitiveDataHandling: !issues.some(i => i.severity === 'critical' && i.type === 'data_exposure')
    };
  }

  /**
   * Generate security recommendations
   */
  private generateSecurityRecommendations(issues: SecurityIssue[]): string[] {
    const recommendations: string[] = [];
    const issueTypes = new Set(issues.map(i => i.type));

    if (issueTypes.has('input_sanitization')) {
      recommendations.push('Implement comprehensive input validation and sanitization');
    }

    if (issueTypes.has('sql_injection')) {
      recommendations.push('Use parameterized queries and ORM to prevent SQL injection');
    }

    if (issueTypes.has('auth_flow')) {
      recommendations.push('Strengthen authentication with proper secret management');
    }

    if (issueTypes.has('cors_config')) {
      recommendations.push('Configure CORS with specific allowed origins');
    }

    if (issueTypes.has('data_exposure')) {
      recommendations.push('Encrypt sensitive data and remove debug information');
    }

    return recommendations;
  }

  /**
   * Find security-relevant files
   */
  private async findSecurityRelevantFiles(directory: string): Promise<string[]> {
    const files: string[] = [];

    const walk = async (dir: string) => {
      try {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
            await walk(fullPath);
          } else if (entry.isFile() && this.isSecurityRelevantFile(entry.name)) {
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
   * Display security analysis results
   */
  private displayResults(result: SecurityAnalysisResult): void {
    console.log('📊 Security Compliance Analysis Results');
    console.log('=' .repeat(50));
    console.log(`   Files Analyzed: ${result.totalFiles}`);
    console.log(`   Vulnerabilities Found: ${result.vulnerabilities}`);
    console.log(`   Critical Issues: ${result.criticalIssues}`);
    console.log(`   Security Score: ${(result.securityScore * 100).toFixed(1)}%`);

    console.log('\n🛡️ Compliance Status:');
    const compliance = result.complianceStatus;
    console.log(`   Input Validation: ${compliance.inputValidation ? '✅ Compliant' : '❌ Issues Found'}`);
    console.log(`   Authentication Flow: ${compliance.authenticationFlow ? '✅ Compliant' : '❌ Issues Found'}`);
    console.log(`   Data Protection: ${compliance.dataProtection ? '✅ Compliant' : '❌ Issues Found'}`);
    console.log(`   CORS Configuration: ${compliance.corsConfiguration ? '✅ Compliant' : '❌ Issues Found'}`);
    console.log(`   Sensitive Data Handling: ${compliance.sensitiveDataHandling ? '✅ Compliant' : '❌ Issues Found'}`);

    if (result.criticalIssues > 0) {
      console.log('\n🚨 Critical Security Issues:');
      const criticalIssues = result.issues.filter(i => i.severity === 'critical');
      criticalIssues.slice(0, 5).forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue.description}`);
        console.log(`      File: ${path.basename(issue.file)}:${issue.line || 'N/A'}`);
        console.log(`      Impact: ${issue.impact}`);
        console.log(`      Fix: ${issue.fix}`);
        console.log('');
      });
    }

    if (result.recommendations.length > 0) {
      console.log('💡 Security Recommendations:');
      result.recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
    }

    console.log('\n🎯 Security Summary:');
    if (result.securityScore > 0.9) {
      console.log('   ✅ Excellent security posture!');
    } else if (result.securityScore > 0.7) {
      console.log('   👍 Good security with room for improvement');
    } else {
      console.log('   🚨 Critical security improvements needed');
    }
  }

  /**
   * Utility methods
   */
  private shouldSkipDirectory(name: string): boolean {
    return ['node_modules', 'dist', 'build', '.git', 'coverage'].includes(name);
  }

  private isSecurityRelevantFile(filename: string): boolean {
    return /\.(js|ts|jsx|tsx)$/.test(filename) && 
           !filename.endsWith('.test.js') && 
           !filename.endsWith('.test.ts');
  }
}

/**
 * Main execution
 */
async function main() {
  const scanner = new SecurityComplianceScanner();
  
  try {
    await scanner.scanSecurity('./');
    console.log('\n🎉 Security Compliance Scan Complete!');
  } catch (error) {
    console.error('❌ Security scan failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
export default SecurityComplianceScanner;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}