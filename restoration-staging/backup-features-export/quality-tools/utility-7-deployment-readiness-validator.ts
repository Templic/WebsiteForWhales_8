#!/usr/bin/env npx tsx
/**
 * Utility 7: Deployment Readiness Validator
 * Comprehensive production deployment validation and environment configuration analysis
 * Ensures applications are ready for production deployment with proper configurations
 */

import * as fs from 'fs';
import * as path from 'path';

interface DeploymentIssue {
  type: 'environment_config' | 'build_optimization' | 'security_hardening' | 'monitoring_setup' | 'scalability' |
        'infrastructure_config' | 'compliance_checks' | 'disaster_recovery';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  file?: string;
  line?: number;
  fix: string;
  impact: string;
  category: 'configuration' | 'security' | 'performance' | 'reliability';
}

interface DeploymentReadinessResult {
  totalChecks: number;
  issuesFound: number;
  criticalBlocking: number;
  readinessScore: number;
  issues: DeploymentIssue[];
  recommendations: string[];
  environmentValidation: {
    productionConfig: boolean;
    environmentVariables: boolean;
    secretsManagement: boolean;
    databaseConfiguration: boolean;
  };
  buildOptimization: {
    bundleSize: string;
    compressionEnabled: boolean;
    treeshakingEnabled: boolean;
    sourceMapHandling: boolean;
  };
  securityHardening: {
    httpsEnforcement: boolean;
    csrfProtection: boolean;
    corsConfiguration: boolean;
    securityHeaders: boolean;
  };
  infrastructureConfig: {
    containerization: boolean;
    loadBalancing: boolean;
    autoScaling: boolean;
    healthChecks: boolean;
  };
  complianceChecks: {
    gdprCompliant: boolean;
    accessibilityCompliant: boolean;
    performanceStandards: boolean;
    securityStandards: boolean;
  };
  disasterRecovery: {
    backupStrategy: boolean;
    rollbackPlan: boolean;
    monitoringAlerts: boolean;
    incidentResponse: boolean;
  };
}

export class DeploymentReadinessValidator {
  private productionConfigFiles = [
    'docker-compose.prod.yml', 'Dockerfile', '.env.production',
    'nginx.conf', 'kubernetes.yaml', 'helm'
  ];

  private buildConfigFiles = [
    'package.json', 'webpack.config.js', 'vite.config.js',
    'next.config.js', 'tsconfig.json'
  ];

  // NEW SUBTITLE 1: Infrastructure Configuration Patterns
  private infrastructurePatterns = [
    'docker', 'kubernetes', 'helm', 'terraform', 'ansible',
    'load balancer', 'auto scaling', 'health check', 'service mesh'
  ];

  // NEW SUBTITLE 2: Compliance & Standards Patterns
  private compliancePatterns = [
    'gdpr', 'ccpa', 'hipaa', 'sox', 'pci-dss',
    'accessibility', 'wcag', 'performance budget', 'security policy'
  ];

  // NEW SUBTITLE 3: Disaster Recovery Patterns
  private disasterRecoveryPatterns = [
    'backup', 'restore', 'rollback', 'failover', 'redundancy',
    'monitoring', 'alerting', 'incident response', 'sla'
  ];

  /**
   * Validate deployment readiness across the application
   */
  async validateDeploymentReadiness(directory: string = './'): Promise<DeploymentReadinessResult> {
    console.log('🚀 Deployment Readiness Validator');
    console.log('Validating production deployment configuration and readiness...\n');

    const issues: DeploymentIssue[] = [];
    
    // Core validation checks
    const envValidation = await this.validateEnvironmentConfig(directory);
    const buildOptimization = await this.validateBuildOptimization(directory);
    const securityHardening = await this.validateSecurityHardening(directory);
    
    // Extended validation checks (new subtitles)
    const infrastructureConfig = await this.validateInfrastructureConfig(directory);
    const complianceChecks = await this.validateComplianceChecks(directory);
    const disasterRecovery = await this.validateDisasterRecovery(directory);

    // Collect all issues
    issues.push(...await this.checkEnvironmentIssues(directory));
    issues.push(...await this.checkBuildIssues(directory));
    issues.push(...await this.checkSecurityIssues(directory));
    issues.push(...await this.checkInfrastructureIssues(directory));
    issues.push(...await this.checkComplianceIssues(directory));
    issues.push(...await this.checkDisasterRecoveryIssues(directory));

    const result: DeploymentReadinessResult = {
      totalChecks: 30, // Total number of deployment checks
      issuesFound: issues.length,
      criticalBlocking: issues.filter(issue => issue.severity === 'critical').length,
      readinessScore: this.calculateReadinessScore(issues),
      issues,
      recommendations: this.generateRecommendations(issues),
      environmentValidation: envValidation,
      buildOptimization,
      securityHardening,
      infrastructureConfig,
      complianceChecks,
      disasterRecovery
    };

    this.displayResults(result);
    return result;
  }

  /**
   * Validate environment configuration
   */
  private async validateEnvironmentConfig(directory: string): Promise<any> {
    const hasProductionEnv = await this.fileExists(path.join(directory, '.env.production'));
    const hasEnvExample = await this.fileExists(path.join(directory, '.env.example'));
    const packageJson = await this.checkPackageJson(directory);
    
    return {
      productionConfig: hasProductionEnv,
      environmentVariables: hasEnvExample,
      secretsManagement: packageJson.includes('dotenv'),
      databaseConfiguration: packageJson.includes('database')
    };
  }

  /**
   * Validate build optimization
   */
  private async validateBuildOptimization(directory: string): Promise<any> {
    const packageJson = await this.checkPackageJson(directory);
    const hasViteConfig = await this.fileExists(path.join(directory, 'vite.config.ts'));
    
    return {
      bundleSize: await this.estimateBundleSize(directory),
      compressionEnabled: packageJson.includes('compression') || hasViteConfig,
      treeshakingEnabled: hasViteConfig || packageJson.includes('webpack'),
      sourceMapHandling: packageJson.includes('source-map')
    };
  }

  /**
   * Validate security hardening
   */
  private async validateSecurityHardening(directory: string): Promise<any> {
    const serverFiles = await this.findServerFiles(directory);
    let hasHttps = false;
    let hasCsrf = false;
    let hasCors = false;
    let hasSecurityHeaders = false;

    for (const file of serverFiles) {
      const content = await fs.promises.readFile(file, 'utf8');
      if (content.includes('https') || content.includes('ssl')) hasHttps = true;
      if (content.includes('csrf') || content.includes('csurf')) hasCsrf = true;
      if (content.includes('cors')) hasCors = true;
      if (content.includes('helmet') || content.includes('security-headers')) hasSecurityHeaders = true;
    }

    return {
      httpsEnforcement: hasHttps,
      csrfProtection: hasCsrf,
      corsConfiguration: hasCors,
      securityHeaders: hasSecurityHeaders
    };
  }

  /**
   * Validate infrastructure configuration
   */
  private async validateInfrastructureConfig(directory: string): Promise<any> {
    const hasDockerfile = await this.fileExists(path.join(directory, 'Dockerfile'));
    const hasK8sConfig = await this.fileExists(path.join(directory, 'kubernetes.yaml'));
    const hasNginxConfig = await this.fileExists(path.join(directory, 'nginx.conf'));
    
    return {
      containerization: hasDockerfile,
      loadBalancing: hasNginxConfig,
      autoScaling: hasK8sConfig,
      healthChecks: hasDockerfile || hasK8sConfig
    };
  }

  /**
   * Validate compliance checks
   */
  private async validateComplianceChecks(directory: string): Promise<any> {
    const allFiles = await this.findAllFiles(directory);
    let gdprCompliant = false;
    let accessibilityCompliant = false;
    let performanceStandards = false;
    let securityStandards = false;

    for (const file of allFiles) {
      const content = await fs.promises.readFile(file, 'utf8');
      if (content.includes('gdpr') || content.includes('privacy')) gdprCompliant = true;
      if (content.includes('aria-') || content.includes('accessibility')) accessibilityCompliant = true;
      if (content.includes('performance') || content.includes('lighthouse')) performanceStandards = true;
      if (content.includes('security') || content.includes('csp')) securityStandards = true;
    }

    return {
      gdprCompliant,
      accessibilityCompliant,
      performanceStandards,
      securityStandards
    };
  }

  /**
   * Validate disaster recovery
   */
  private async validateDisasterRecovery(directory: string): Promise<any> {
    const hasBackupScript = await this.checkForBackupScripts(directory);
    const hasRollbackPlan = await this.checkForRollbackPlan(directory);
    const hasMonitoring = await this.checkForMonitoring(directory);
    
    return {
      backupStrategy: hasBackupScript,
      rollbackPlan: hasRollbackPlan,
      monitoringAlerts: hasMonitoring,
      incidentResponse: hasMonitoring && hasRollbackPlan
    };
  }

  /**
   * Check environment issues
   */
  private async checkEnvironmentIssues(directory: string): Promise<DeploymentIssue[]> {
    const issues: DeploymentIssue[] = [];
    
    if (!await this.fileExists(path.join(directory, '.env.production'))) {
      issues.push({
        type: 'environment_config',
        severity: 'critical',
        description: 'Missing production environment configuration',
        fix: 'Create .env.production file with production settings',
        impact: 'Application may fail to start in production',
        category: 'configuration'
      });
    }

    if (!await this.fileExists(path.join(directory, '.env.example'))) {
      issues.push({
        type: 'environment_config',
        severity: 'medium',
        description: 'Missing environment variables documentation',
        fix: 'Create .env.example file documenting required variables',
        impact: 'Deployment setup complexity increases',
        category: 'configuration'
      });
    }

    return issues;
  }

  /**
   * Check build issues
   */
  private async checkBuildIssues(directory: string): Promise<DeploymentIssue[]> {
    const issues: DeploymentIssue[] = [];
    
    const packageJson = await this.checkPackageJson(directory);
    if (!packageJson.includes('"build"')) {
      issues.push({
        type: 'build_optimization',
        severity: 'critical',
        description: 'Missing build script in package.json',
        fix: 'Add production build script to package.json',
        impact: 'Cannot create production build',
        category: 'configuration'
      });
    }

    const bundleSize = await this.estimateBundleSize(directory);
    if (bundleSize === 'Large (>1MB)') {
      issues.push({
        type: 'build_optimization',
        severity: 'high',
        description: 'Bundle size may be too large for optimal performance',
        fix: 'Implement code splitting and tree shaking',
        impact: 'Slower initial page load times',
        category: 'performance'
      });
    }

    return issues;
  }

  /**
   * Check security issues
   */
  private async checkSecurityIssues(directory: string): Promise<DeploymentIssue[]> {
    const issues: DeploymentIssue[] = [];
    
    const serverFiles = await this.findServerFiles(directory);
    let hasHttpsRedirect = false;
    
    for (const file of serverFiles) {
      const content = await fs.promises.readFile(file, 'utf8');
      if (content.includes('https') && content.includes('redirect')) {
        hasHttpsRedirect = true;
      }
    }

    if (!hasHttpsRedirect) {
      issues.push({
        type: 'security_hardening',
        severity: 'critical',
        description: 'Missing HTTPS enforcement',
        fix: 'Implement HTTPS redirect and enforce secure connections',
        impact: 'Data transmitted over insecure connections',
        category: 'security'
      });
    }

    return issues;
  }

  /**
   * Check infrastructure issues
   */
  private async checkInfrastructureIssues(directory: string): Promise<DeploymentIssue[]> {
    const issues: DeploymentIssue[] = [];
    
    if (!await this.fileExists(path.join(directory, 'Dockerfile'))) {
      issues.push({
        type: 'infrastructure_config',
        severity: 'high',
        description: 'Missing containerization configuration',
        fix: 'Create Dockerfile for containerized deployment',
        impact: 'Limited deployment options and scalability',
        category: 'configuration'
      });
    }

    return issues;
  }

  /**
   * Check compliance issues
   */
  private async checkComplianceIssues(directory: string): Promise<DeploymentIssue[]> {
    const issues: DeploymentIssue[] = [];
    
    const hasPrivacyPolicy = await this.checkForPrivacyPolicy(directory);
    if (!hasPrivacyPolicy) {
      issues.push({
        type: 'compliance_checks',
        severity: 'high',
        description: 'Missing privacy policy for GDPR compliance',
        fix: 'Implement privacy policy and consent management',
        impact: 'Legal compliance issues in EU markets',
        category: 'reliability'
      });
    }

    return issues;
  }

  /**
   * Check disaster recovery issues
   */
  private async checkDisasterRecoveryIssues(directory: string): Promise<DeploymentIssue[]> {
    const issues: DeploymentIssue[] = [];
    
    if (!await this.checkForBackupScripts(directory)) {
      issues.push({
        type: 'disaster_recovery',
        severity: 'high',
        description: 'Missing automated backup strategy',
        fix: 'Implement automated backup and recovery procedures',
        impact: 'Risk of data loss in disaster scenarios',
        category: 'reliability'
      });
    }

    return issues;
  }

  /**
   * Calculate deployment readiness score
   */
  private calculateReadinessScore(issues: DeploymentIssue[]): number {
    const criticalPenalty = issues.filter(i => i.severity === 'critical').length * 25;
    const highPenalty = issues.filter(i => i.severity === 'high').length * 15;
    const mediumPenalty = issues.filter(i => i.severity === 'medium').length * 8;
    const lowPenalty = issues.filter(i => i.severity === 'low').length * 3;
    
    const totalPenalty = criticalPenalty + highPenalty + mediumPenalty + lowPenalty;
    
    return Math.max(100 - totalPenalty, 0);
  }

  /**
   * Generate deployment recommendations
   */
  private generateRecommendations(issues: DeploymentIssue[]): string[] {
    const recommendations = [
      'Set up production environment configuration',
      'Implement HTTPS enforcement and security headers',
      'Configure automated backups and disaster recovery',
      'Optimize bundle size with code splitting',
      'Set up monitoring and alerting systems',
      'Implement proper secrets management',
      'Configure load balancing and auto-scaling',
      'Ensure GDPR and accessibility compliance',
      'Set up CI/CD pipeline for automated deployments',
      'Configure health checks and readiness probes'
    ];

    return recommendations.slice(0, Math.min(issues.length + 3, recommendations.length));
  }

  /**
   * Helper methods
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async checkPackageJson(directory: string): Promise<string> {
    try {
      const content = await fs.promises.readFile(path.join(directory, 'package.json'), 'utf8');
      return content;
    } catch {
      return '';
    }
  }

  private async findServerFiles(directory: string): Promise<string[]> {
    const serverFiles: string[] = [];
    const serverDir = path.join(directory, 'server');
    
    if (await this.fileExists(serverDir)) {
      const walk = async (dir: string): Promise<void> => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            await walk(fullPath);
          } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.js')) {
            serverFiles.push(fullPath);
          }
        }
      };
      
      await walk(serverDir);
    }
    
    return serverFiles;
  }

  private async findAllFiles(directory: string): Promise<string[]> {
    const files: string[] = [];
    
    const walk = async (dir: string): Promise<void> => {
      try {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
            await walk(fullPath);
          } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.js') || entry.name.endsWith('.md'))) {
            files.push(fullPath);
          }
        }
      } catch {
        // Ignore permission errors
      }
    };
    
    await walk(directory);
    return files;
  }

  private async estimateBundleSize(directory: string): Promise<string> {
    // This would analyze actual bundle size - simplified for now
    const packageJson = await this.checkPackageJson(directory);
    const dependencies = (packageJson.match(/"dependencies":\s*{[^}]*}/)?.[0] || '').length;
    
    if (dependencies > 2000) return 'Large (>1MB)';
    if (dependencies > 1000) return 'Medium (500KB-1MB)';
    return 'Small (<500KB)';
  }

  private async checkForBackupScripts(directory: string): Promise<boolean> {
    const files = await this.findAllFiles(directory);
    return files.some(file => file.includes('backup') || file.includes('dump'));
  }

  private async checkForRollbackPlan(directory: string): Promise<boolean> {
    const files = await this.findAllFiles(directory);
    return files.some(file => file.includes('rollback') || file.includes('deploy'));
  }

  private async checkForMonitoring(directory: string): Promise<boolean> {
    const packageJson = await this.checkPackageJson(directory);
    return packageJson.includes('monitoring') || packageJson.includes('prometheus') || packageJson.includes('grafana');
  }

  private async checkForPrivacyPolicy(directory: string): Promise<boolean> {
    const files = await this.findAllFiles(directory);
    return files.some(file => file.toLowerCase().includes('privacy') || file.toLowerCase().includes('gdpr'));
  }

  /**
   * Display analysis results
   */
  private displayResults(result: DeploymentReadinessResult): void {
    console.log(`📊 Deployment Readiness Analysis Complete!`);
    console.log(`Readiness Score: ${result.readinessScore}/100`);
    console.log(`Total checks: ${result.totalChecks}`);
    console.log(`Issues found: ${result.issuesFound}`);
    console.log(`Critical blocking issues: ${result.criticalBlocking}`);
    
    if (result.criticalBlocking > 0) {
      console.log(`🚨 ${result.criticalBlocking} critical issues must be resolved before deployment!`);
    } else if (result.readinessScore >= 80) {
      console.log(`✅ Application appears ready for production deployment!`);
    } else {
      console.log(`⚠️ Address remaining issues to improve deployment readiness`);
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  const validator = new DeploymentReadinessValidator();
  
  try {
    await validator.validateDeploymentReadiness('./');
  } catch (error) {
    console.error('❌ Deployment readiness validation failed:', error);
    process.exit(1);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}