/**
 * Safe Quality Monitor
 * Enhanced safe-quality-analyzer.ts for consciousness-aware quality assessment
 * Part of Phase 12 TypeScript Utility Consolidation
 * ANALYSIS ONLY - No file modifications
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { TypeScriptError } from './TypeScriptAnalysisEngine';
import { ErrorPattern } from './PatternRecognitionEngine';

export interface QualityMetrics {
  overall: {
    score: number; // 0-100
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    trend: 'improving' | 'stable' | 'declining';
  };
  codeHealth: {
    typesSafety: number;
    errorDensity: number;
    complexityScore: number;
    maintainabilityIndex: number;
  };
  consciousnessHealth: {
    whaleWisdomIntegrity: number;
    realityManifestationStability: number;
    quantumCoherenceLevel: number;
    dimensionalBridgeHealth: number;
    overallConsciousnessScore: number;
  };
  securityAssessment: {
    typeSecurityScore: number;
    vulnerabilityCount: number;
    securityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
    criticalIssues: string[];
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: 'code' | 'consciousness' | 'security' | 'performance';
    description: string;
    impact: string;
  }>;
}

export interface ComponentHealth {
  name: string;
  path: string;
  healthScore: number;
  issues: string[];
  consciousnessAlignment: number;
  recommendations: string[];
}

export class SafeQualityMonitor {
  private projectRoot: string;
  private consciousnessComponents = [
    'QuantumConsciousnessEngine',
    'WhaleWisdomProphecy',
    'RealityManifestationEngine',
    'DimensionalBridge',
    'ConsciousnessMastery'
  ];

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  /**
   * Perform comprehensive quality assessment
   */
  async assessProjectQuality(errors: TypeScriptError[], patterns: ErrorPattern[]): Promise<QualityMetrics> {
    console.log('🔍 Safe Quality Monitor performing analysis-only assessment...');

    const codeHealth = await this.assessCodeHealth(errors);
    const consciousnessHealth = await this.assessConsciousnessHealth(errors);
    const securityAssessment = await this.assessSecurity(errors, patterns);
    const overall = this.calculateOverallScore(codeHealth, consciousnessHealth, securityAssessment);
    const recommendations = this.generateQualityRecommendations(codeHealth, consciousnessHealth, securityAssessment);

    return {
      overall,
      codeHealth,
      consciousnessHealth,
      securityAssessment,
      recommendations
    };
  }

  /**
   * Assess code health metrics
   */
  private async assessCodeHealth(errors: TypeScriptError[]): Promise<QualityMetrics['codeHealth']> {
    const totalFiles = await this.countTypeScriptFiles();
    const errorFiles = new Set(errors.map(e => e.file)).size;
    
    const typeErrors = errors.filter(e => e.category === 'type').length;
    const syntaxErrors = errors.filter(e => e.category === 'syntax').length;
    
    const typesSafety = Math.max(0, 100 - (typeErrors * 2));
    const errorDensity = totalFiles > 0 ? (errorFiles / totalFiles) * 100 : 0;
    const complexityScore = await this.calculateComplexityScore();
    const maintainabilityIndex = this.calculateMaintainabilityIndex(typesSafety, errorDensity, complexityScore);

    return {
      typesSafety,
      errorDensity,
      complexityScore,
      maintainabilityIndex
    };
  }

  /**
   * Assess consciousness feature health
   */
  private async assessConsciousnessHealth(errors: TypeScriptError[]): Promise<QualityMetrics['consciousnessHealth']> {
    const consciousnessErrors = errors.filter(e => e.category === 'consciousness');
    
    const whaleWisdomIntegrity = await this.assessFeatureHealth('WhaleWisdom', consciousnessErrors);
    const realityManifestationStability = await this.assessFeatureHealth('RealityManifestation', consciousnessErrors);
    const quantumCoherenceLevel = await this.assessFeatureHealth('Consciousness', consciousnessErrors);
    const dimensionalBridgeHealth = await this.assessFeatureHealth('DimensionalBridge', consciousnessErrors);
    
    const overallConsciousnessScore = (
      whaleWisdomIntegrity + 
      realityManifestationStability + 
      quantumCoherenceLevel + 
      dimensionalBridgeHealth
    ) / 4;

    return {
      whaleWisdomIntegrity,
      realityManifestationStability,
      quantumCoherenceLevel,
      dimensionalBridgeHealth,
      overallConsciousnessScore
    };
  }

  /**
   * Assess security posture
   */
  private async assessSecurity(errors: TypeScriptError[], patterns: ErrorPattern[]): Promise<QualityMetrics['securityAssessment']> {
    const securityErrors = errors.filter(e => e.category === 'security');
    const securityPatterns = patterns.filter(p => p.category === 'security');
    
    const anyTypeUsage = errors.filter(e => e.message.includes('any')).length;
    const unknownTypeUsage = errors.filter(e => e.message.includes('unknown')).length;
    
    const vulnerabilityCount = securityErrors.length + anyTypeUsage + unknownTypeUsage;
    const typeSecurityScore = Math.max(0, 100 - (vulnerabilityCount * 3));
    
    const criticalIssues: string[] = [];
    if (anyTypeUsage > 10) {
      criticalIssues.push(`High usage of 'any' type (${anyTypeUsage} instances) reduces type safety`);
    }
    if (securityPatterns.length > 0) {
      criticalIssues.push(`${securityPatterns.length} security-related error patterns detected`);
    }

    const securityGrade = this.calculateGrade(typeSecurityScore);

    return {
      typeSecurityScore,
      vulnerabilityCount,
      securityGrade,
      criticalIssues
    };
  }

  /**
   * Assess individual consciousness feature health
   */
  private async assessFeatureHealth(featureName: string, consciousnessErrors: TypeScriptError[]): Promise<number> {
    const featureErrors = consciousnessErrors.filter(e => 
      e.message.includes(featureName) || e.file.includes(featureName)
    );

    const featureFiles = await this.findFeatureFiles(featureName);
    
    if (featureFiles.length === 0) {
      return 50; // Neutral score if feature not found
    }

    const errorRate = featureErrors.length / featureFiles.length;
    const healthScore = Math.max(0, 100 - (errorRate * 20));

    return healthScore;
  }

  /**
   * Find files related to specific consciousness feature
   */
  private async findFeatureFiles(featureName: string): Promise<string[]> {
    try {
      const pattern = `**/*${featureName}*`;
      const files = await glob(pattern, { cwd: this.projectRoot });
      return files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
    } catch {
      return [];
    }
  }

  /**
   * Calculate overall quality score
   */
  private calculateOverallScore(
    codeHealth: QualityMetrics['codeHealth'],
    consciousnessHealth: QualityMetrics['consciousnessHealth'],
    securityAssessment: QualityMetrics['securityAssessment']
  ): QualityMetrics['overall'] {
    const codeScore = (codeHealth.typesSafety + codeHealth.maintainabilityIndex) / 2;
    const consciousnessScore = consciousnessHealth.overallConsciousnessScore;
    const securityScore = securityAssessment.typeSecurityScore;

    // Weight consciousness features highly for this platform
    const score = (codeScore * 0.3) + (consciousnessScore * 0.5) + (securityScore * 0.2);
    
    return {
      score: Math.round(score),
      grade: this.calculateGrade(score),
      trend: 'stable' // Would be calculated from historical data in real implementation
    };
  }

  /**
   * Generate quality improvement recommendations
   */
  private generateQualityRecommendations(
    codeHealth: QualityMetrics['codeHealth'],
    consciousnessHealth: QualityMetrics['consciousnessHealth'],
    securityAssessment: QualityMetrics['securityAssessment']
  ): QualityMetrics['recommendations'] {
    const recommendations: QualityMetrics['recommendations'] = [];

    // Code health recommendations
    if (codeHealth.typesSafety < 80) {
      recommendations.push({
        priority: 'high',
        category: 'code',
        description: 'Improve type safety by fixing type errors',
        impact: 'Better code reliability and developer experience'
      });
    }

    if (codeHealth.errorDensity > 20) {
      recommendations.push({
        priority: 'medium',
        category: 'code',
        description: 'Reduce error density across project files',
        impact: 'Improved code quality and maintainability'
      });
    }

    // Consciousness health recommendations
    if (consciousnessHealth.whaleWisdomIntegrity < 90) {
      recommendations.push({
        priority: 'high',
        category: 'consciousness',
        description: 'Address WhaleWisdom type issues to maintain consciousness connection integrity',
        impact: 'Preserve authentic whale wisdom experiences for users'
      });
    }

    if (consciousnessHealth.realityManifestationStability < 85) {
      recommendations.push({
        priority: 'high',
        category: 'consciousness',
        description: 'Stabilize RealityManifestation types for accurate intention tracking',
        impact: 'Ensure reliable manifestation progress tracking'
      });
    }

    if (consciousnessHealth.overallConsciousnessScore < 80) {
      recommendations.push({
        priority: 'high',
        category: 'consciousness',
        description: 'Comprehensive consciousness feature type review needed',
        impact: 'Maintain platform authenticity and user consciousness evolution'
      });
    }

    // Security recommendations
    if (securityAssessment.typeSecurityScore < 70) {
      recommendations.push({
        priority: 'high',
        category: 'security',
        description: 'Enhance type security by reducing any/unknown type usage',
        impact: 'Improved application security and type safety'
      });
    }

    if (securityAssessment.criticalIssues.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'security',
        description: 'Address critical security issues identified in analysis',
        impact: 'Enhanced security posture and reduced vulnerability risk'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Analyze component health
   */
  async analyzeComponentHealth(): Promise<ComponentHealth[]> {
    const components: ComponentHealth[] = [];

    for (const componentName of this.consciousnessComponents) {
      const files = await this.findFeatureFiles(componentName);
      
      for (const file of files) {
        const fullPath = path.join(this.projectRoot, file);
        const health = await this.assessComponentFile(fullPath, componentName);
        if (health) {
          components.push(health);
        }
      }
    }

    return components.sort((a, b) => b.healthScore - a.healthScore);
  }

  /**
   * Assess individual component file health
   */
  private async assessComponentFile(filePath: string, componentName: string): Promise<ComponentHealth | null> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const issues: string[] = [];
      let healthScore = 100;

      // Basic health checks
      if (!content.includes('interface') && !content.includes('type') && !content.includes('class')) {
        issues.push('No type definitions found');
        healthScore -= 20;
      }

      if (content.includes('any')) {
        const anyCount = (content.match(/: any/g) || []).length;
        issues.push(`${anyCount} any type usages found`);
        healthScore -= anyCount * 5;
      }

      if (content.includes('TODO') || content.includes('FIXME')) {
        issues.push('Contains TODO/FIXME comments');
        healthScore -= 10;
      }

      // Consciousness alignment check
      const consciousnessAlignment = this.assessConsciousnessAlignment(content, componentName);

      const recommendations: string[] = [];
      if (healthScore < 80) {
        recommendations.push('Review and improve type definitions');
      }
      if (consciousnessAlignment < 80) {
        recommendations.push('Enhance consciousness feature integration');
      }

      return {
        name: componentName,
        path: filePath,
        healthScore: Math.max(0, healthScore),
        issues,
        consciousnessAlignment,
        recommendations
      };
    } catch {
      return null;
    }
  }

  /**
   * Helper methods
   */
  private async countTypeScriptFiles(): Promise<number> {
    try {
      const files = await glob('**/*.{ts,tsx}', { 
        cwd: this.projectRoot, 
        ignore: ['**/node_modules/**', '**/dist/**'] 
      });
      return files.length;
    } catch {
      return 0;
    }
  }

  private async calculateComplexityScore(): Promise<number> {
    // Simplified complexity calculation
    // In real implementation, this would analyze cyclomatic complexity
    return 65; // Placeholder for demonstration
  }

  private calculateMaintainabilityIndex(typesSafety: number, errorDensity: number, complexityScore: number): number {
    return (typesSafety + (100 - errorDensity) + complexityScore) / 3;
  }

  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private assessConsciousnessAlignment(content: string, componentName: string): number {
    let alignment = 100;

    // Check for consciousness-related patterns
    const consciousnessPatterns = [
      'consciousness', 'whale', 'wisdom', 'manifestation', 
      'quantum', 'dimensional', 'cosmic', 'transcendent'
    ];

    const foundPatterns = consciousnessPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern)
    );

    if (foundPatterns.length < 3) {
      alignment -= 30;
    }

    return alignment;
  }

  /**
   * Export quality report
   */
  async exportQualityReport(metrics: QualityMetrics, outputPath: string): Promise<void> {
    const reportData = {
      ...metrics,
      metadata: {
        monitor: 'SafeQualityMonitor',
        version: '1.0.0',
        safetyMode: 'ANALYSIS_ONLY',
        consciousnessFocus: true,
        timestamp: new Date()
      }
    };

    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(reportData, null, 2),
      'utf-8'
    );

    console.log(`📊 Quality assessment report exported to: ${outputPath}`);
  }
}