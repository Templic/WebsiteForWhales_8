/**
 * Working Security Scan Utilities
 * Fixed versions of security scanning tools for immediate use
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';

interface SecurityIssue {
  type: 'sql-injection' | 'xss' | 'auth-bypass' | 'crypto-weak' | 'api-exposure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  file: string;
  line: number;
  description: string;
  recommendation: string;
}

interface SecurityScanResult {
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  issues: SecurityIssue[];
  securityScore: number;
}

class WorkingSecurityScanner {
  private basePath: string = '.';
  private issues: SecurityIssue[] = [];

  constructor(basePath?: string) {
    if (basePath) this.basePath = basePath;
  }

  /**
   * Run comprehensive security scan
   */
  async runComprehensiveScan(): Promise<SecurityScanResult> {
    console.log('🔍 Starting comprehensive security scan...');
    
    this.issues = [];
    
    // Scan for SQL injection vulnerabilities
    await this.scanSQLInjection();
    
    // Scan for XSS vulnerabilities  
    await this.scanXSSVulnerabilities();
    
    // Scan authentication and authorization
    await this.scanAuthenticationIssues();
    
    // Scan API security
    await this.scanAPIEndpoints();
    
    // Scan cryptographic implementations
    await this.scanCryptographicIssues();
    
    return this.generateReport();
  }

  /**
   * Scan for SQL injection vulnerabilities
   */
  private async scanSQLInjection(): Promise<void> {
    const files = this.getFilesByExtensions(['.ts', '.js', '.tsx']);
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Check for unsafe SQL query patterns
          const sqlPatterns = [
            /\$\{[^}]*\}/g, // Template literal injection
            /\+\s*['"`][^'"`]*['"`]/g, // String concatenation
            /query\s*\(\s*['"`][^'"`]*\$\{/g, // Direct query injection
            /execute\s*\(\s*['"`][^'"`]*\+/g, // Execute with concatenation
          ];
          
          sqlPatterns.forEach(pattern => {
            if (pattern.test(line) && !line.includes('//') && !line.includes('/*')) {
              this.issues.push({
                type: 'sql-injection',
                severity: 'high',
                file,
                line: index + 1,
                description: 'Potential SQL injection vulnerability detected',
                recommendation: 'Use parameterized queries or prepared statements'
              });
            }
          });
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  /**
   * Scan for XSS vulnerabilities
   */
  private async scanXSSVulnerabilities(): Promise<void> {
    const files = this.getFilesByExtensions(['.tsx', '.jsx', '.ts', '.js']);
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Check for dangerous innerHTML usage
          if (line.includes('dangerouslySetInnerHTML') && !line.includes('SafeHtml')) {
            this.issues.push({
              type: 'xss',
              severity: 'critical',
              file,
              line: index + 1,
              description: 'Unsafe HTML rendering without sanitization',
              recommendation: 'Use SafeHtml component or DOMPurify.sanitize()'
            });
          }
          
          // Check for innerHTML usage
          if (line.includes('.innerHTML') && !line.includes('DOMPurify')) {
            this.issues.push({
              type: 'xss',
              severity: 'high',
              file,
              line: index + 1,
              description: 'Direct innerHTML usage without sanitization',
              recommendation: 'Sanitize content before setting innerHTML'
            });
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  /**
   * Scan authentication and authorization issues
   */
  private async scanAuthenticationIssues(): Promise<void> {
    const files = this.getFilesByExtensions(['.ts', '.js']);
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Check for weak JWT verification
          if (line.includes('jwt.verify') && !line.includes('secret')) {
            this.issues.push({
              type: 'auth-bypass',
              severity: 'critical',
              file,
              line: index + 1,
              description: 'JWT verification without proper secret validation',
              recommendation: 'Ensure JWT is verified with a strong secret'
            });
          }
          
          // Check for missing authorization checks
          if (line.includes('app.get') || line.includes('app.post')) {
            const nextLines = lines.slice(index, index + 3).join('\n');
            if (!nextLines.includes('auth') && !nextLines.includes('requireRole')) {
              this.issues.push({
                type: 'auth-bypass',
                severity: 'medium',
                file,
                line: index + 1,
                description: 'API endpoint without authentication middleware',
                recommendation: 'Add authentication middleware to protect endpoints'
              });
            }
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  /**
   * Scan API endpoint security
   */
  private async scanAPIEndpoints(): Promise<void> {
    const files = this.getFilesByExtensions(['.ts', '.js']);
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Check for exposed sensitive endpoints
          if (line.includes('/admin') && !line.includes('requireRole')) {
            this.issues.push({
              type: 'api-exposure',
              severity: 'high',
              file,
              line: index + 1,
              description: 'Admin endpoint without role-based access control',
              recommendation: 'Add requireRole middleware for admin endpoints'
            });
          }
          
          // Check for missing rate limiting
          if ((line.includes('app.post') || line.includes('app.put')) && 
              !content.includes('rateLimit')) {
            this.issues.push({
              type: 'api-exposure',
              severity: 'medium',
              file,
              line: index + 1,
              description: 'POST/PUT endpoint without rate limiting',
              recommendation: 'Implement rate limiting for write operations'
            });
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  /**
   * Scan cryptographic implementations
   */
  private async scanCryptographicIssues(): Promise<void> {
    const files = this.getFilesByExtensions(['.ts', '.js']);
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Check for weak password hashing
          if (line.includes('md5') || line.includes('sha1')) {
            this.issues.push({
              type: 'crypto-weak',
              severity: 'high',
              file,
              line: index + 1,
              description: 'Weak cryptographic hash function used',
              recommendation: 'Use bcrypt or argon2 for password hashing'
            });
          }
          
          // Check for hardcoded secrets
          if (line.includes('secret') && (line.includes('=') || line.includes(':'))) {
            const secretValue = line.split(/[=:]/)[1]?.trim();
            if (secretValue && secretValue.length > 10 && !secretValue.includes('process.env')) {
              this.issues.push({
                type: 'crypto-weak',
                severity: 'critical',
                file,
                line: index + 1,
                description: 'Hardcoded secret detected',
                recommendation: 'Use environment variables for secrets'
              });
            }
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  /**
   * Get files by extensions recursively
   */
  private getFilesByExtensions(extensions: string[]): string[] {
    const files: string[] = [];
    
    const scanDirectory = (dir: string) => {
      try {
        const items = readdirSync(dir);
        
        for (const item of items) {
          const fullPath = join(dir, item);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            scanDirectory(fullPath);
          } else if (stat.isFile() && extensions.includes(extname(item))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    };
    
    scanDirectory(this.basePath);
    return files;
  }

  /**
   * Generate security report
   */
  private generateReport(): SecurityScanResult {
    const criticalIssues = this.issues.filter(i => i.severity === 'critical').length;
    const highIssues = this.issues.filter(i => i.severity === 'high').length;
    const mediumIssues = this.issues.filter(i => i.severity === 'medium').length;
    const lowIssues = this.issues.filter(i => i.severity === 'low').length;
    
    // Calculate security score (100 base - penalties)
    let securityScore = 100;
    securityScore -= criticalIssues * 20;
    securityScore -= highIssues * 10;
    securityScore -= mediumIssues * 5;
    securityScore -= lowIssues * 1;
    
    // Minimum score is 0
    securityScore = Math.max(0, securityScore);
    
    return {
      totalIssues: this.issues.length,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
      issues: this.issues,
      securityScore
    };
  }

  /**
   * Print detailed report
   */
  printReport(result: SecurityScanResult): void {
    console.log('\n📊 SECURITY SCAN RESULTS');
    console.log('═'.repeat(50));
    console.log(`Security Score: ${result.securityScore}/100`);
    console.log(`Total Issues: ${result.totalIssues}`);
    console.log(`  Critical: ${result.criticalIssues}`);
    console.log(`  High: ${result.highIssues}`);
    console.log(`  Medium: ${result.mediumIssues}`);
    console.log(`  Low: ${result.lowIssues}`);
    
    if (result.issues.length > 0) {
      console.log('\n🔍 DETAILED FINDINGS:');
      console.log('─'.repeat(50));
      
      result.issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.type.toUpperCase()} - ${issue.severity.toUpperCase()}`);
        console.log(`   File: ${issue.file}:${issue.line}`);
        console.log(`   Issue: ${issue.description}`);
        console.log(`   Fix: ${issue.recommendation}`);
      });
    }
    
    if (result.securityScore >= 105) {
      console.log('\n🎉 EXCELLENT! Security score exceeds target of 105 points!');
    } else if (result.securityScore >= 95) {
      console.log('\n✅ GOOD! Security score is above 95 points.');
    } else {
      console.log('\n⚠️  Security improvements needed to reach target score.');
    }
  }
}

// Export for use
export type { SecurityIssue, SecurityScanResult };
export { WorkingSecurityScanner };

// Run scan if called directly
if (process.argv[1].includes('working-security-scan-utilities')) {
  const scanner = new WorkingSecurityScanner();
  scanner.runComprehensiveScan().then(result => {
    scanner.printReport(result);
  });
}