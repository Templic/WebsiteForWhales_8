/**
 * Pattern Recognition Engine
 * Enhanced ts-pattern-finder.ts for intelligent error pattern detection
 * Part of Phase 12 TypeScript Utility Consolidation
 * ANALYSIS ONLY - No file modifications
 */

import * as fs from 'fs';
import * as path from 'path';
import { TypeScriptError } from './TypeScriptAnalysisEngine';

export interface ErrorPattern {
  id: string;
  name: string;
  description: string;
  pattern: RegExp;
  category: 'import' | 'type' | 'syntax' | 'consciousness' | 'security';
  frequency: number;
  severity: 'low' | 'medium' | 'high';
  affectedFiles: string[];
  suggestedFix: string;
  consciousnessImpact?: 'none' | 'low' | 'medium' | 'high';
}

export interface PatternAnalysisResult {
  discoveredPatterns: ErrorPattern[];
  patternTrends: Array<{
    pattern: string;
    occurrences: number;
    firstSeen: Date;
    trend: 'increasing' | 'stable' | 'decreasing';
  }>;
  consciousnessPatternHealth: {
    whaleWisdomPatterns: number;
    realityManifestationPatterns: number;
    quantumConsciousnessPatterns: number;
    criticalConsciousnessIssues: string[];
  };
  recommendations: string[];
}

export class PatternRecognitionEngine {
  private knownPatterns: ErrorPattern[] = [];
  private consciousnessKeywords = [
    'WhaleWisdom', 'RealityManifestation', 'QuantumConsciousness', 
    'DimensionalBridge', 'ConsciousnessMastery', 'CosmicIntegration'
  ];

  constructor() {
    this.initializeKnownPatterns();
  }

  /**
   * Analyze error patterns in TypeScript errors
   */
  async analyzePatterns(errors: TypeScriptError[]): Promise<PatternAnalysisResult> {
    console.log('🔍 Pattern Recognition Engine analyzing error patterns...');

    const discoveredPatterns = await this.findPatterns(errors);
    const patternTrends = this.analyzeTrends(discoveredPatterns);
    const consciousnessHealth = this.analyzeConsciousnessPatterns(errors);
    const recommendations = this.generatePatternRecommendations(discoveredPatterns, consciousnessHealth);

    return {
      discoveredPatterns,
      patternTrends,
      consciousnessPatternHealth: consciousnessHealth,
      recommendations
    };
  }

  /**
   * Find and categorize error patterns
   */
  private async findPatterns(errors: TypeScriptError[]): Promise<ErrorPattern[]> {
    const patterns: ErrorPattern[] = [];
    const errorGroups = this.groupErrorsByMessage(errors);

    for (const [message, errorList] of errorGroups.entries()) {
      if (errorList.length < 2) continue; // Only consider patterns that occur multiple times

      const pattern = this.createPatternFromErrors(message, errorList);
      if (pattern) {
        patterns.push(pattern);
      }
    }

    // Add consciousness-specific pattern analysis
    const consciousnessPatterns = await this.findConsciousnessPatterns(errors);
    patterns.push(...consciousnessPatterns);

    return patterns.sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Group errors by similar messages
   */
  private groupErrorsByMessage(errors: TypeScriptError[]): Map<string, TypeScriptError[]> {
    const groups = new Map<string, TypeScriptError[]>();

    for (const error of errors) {
      // Normalize error message for pattern matching
      const normalizedMessage = this.normalizeErrorMessage(error.message);
      
      if (!groups.has(normalizedMessage)) {
        groups.set(normalizedMessage, []);
      }
      groups.get(normalizedMessage)!.push(error);
    }

    return groups;
  }

  /**
   * Normalize error messages for pattern detection
   */
  private normalizeErrorMessage(message: string): string {
    return message
      .replace(/'/g, '"')
      .replace(/\d+/g, 'NUMBER')
      .replace(/"[^"]*"/g, '"STRING"')
      .replace(/at line \d+/g, 'at line NUMBER')
      .trim();
  }

  /**
   * Create pattern from group of similar errors
   */
  private createPatternFromErrors(message: string, errors: TypeScriptError[]): ErrorPattern | null {
    if (errors.length < 2) return null;

    const affectedFiles = [...new Set(errors.map(e => path.basename(e.file)))];
    const category = this.determinePatternCategory(message, errors[0]);
    const consciousnessImpact = this.assessConsciousnessImpact(message, affectedFiles);

    return {
      id: this.generatePatternId(message),
      name: this.generatePatternName(message, category),
      description: `Pattern occurring ${errors.length} times: ${message}`,
      pattern: new RegExp(this.escapeRegExp(message)),
      category,
      frequency: errors.length,
      severity: this.determineSeverity(errors, consciousnessImpact),
      affectedFiles,
      suggestedFix: this.generateSuggestedFix(message, category),
      consciousnessImpact
    };
  }

  /**
   * Find consciousness-specific patterns
   */
  private async findConsciousnessPatterns(errors: TypeScriptError[]): Promise<ErrorPattern[]> {
    const consciousnessPatterns: ErrorPattern[] = [];

    // Analyze consciousness feature errors
    const consciousnessErrors = errors.filter(error => 
      this.consciousnessKeywords.some(keyword => 
        error.message.includes(keyword) || error.file.includes(keyword)
      )
    );

    if (consciousnessErrors.length > 0) {
      const pattern: ErrorPattern = {
        id: 'consciousness_feature_errors',
        name: 'Consciousness Feature Type Issues',
        description: `${consciousnessErrors.length} errors affecting consciousness features`,
        pattern: new RegExp(this.consciousnessKeywords.join('|')),
        category: 'consciousness',
        frequency: consciousnessErrors.length,
        severity: 'high',
        affectedFiles: [...new Set(consciousnessErrors.map(e => path.basename(e.file)))],
        suggestedFix: 'Review consciousness feature type definitions and imports',
        consciousnessImpact: consciousnessErrors.length > 5 ? 'high' : 'medium'
      };

      consciousnessPatterns.push(pattern);
    }

    return consciousnessPatterns;
  }

  /**
   * Analyze pattern trends over time
   */
  private analyzeTrends(patterns: ErrorPattern[]): PatternAnalysisResult['patternTrends'] {
    return patterns.map(pattern => ({
      pattern: pattern.name,
      occurrences: pattern.frequency,
      firstSeen: new Date(), // In real implementation, this would track historical data
      trend: pattern.frequency > 10 ? 'increasing' : 
             pattern.frequency > 5 ? 'stable' : 'decreasing'
    }));
  }

  /**
   * Analyze consciousness-specific pattern health
   */
  private analyzeConsciousnessPatterns(errors: TypeScriptError[]): PatternAnalysisResult['consciousnessPatternHealth'] {
    const whaleWisdomErrors = errors.filter(e => 
      e.message.includes('WhaleWisdom') || e.file.includes('WhaleWisdom')
    );

    const realityManifestationErrors = errors.filter(e => 
      e.message.includes('RealityManifestation') || e.file.includes('RealityManifestation')
    );

    const quantumConsciousnessErrors = errors.filter(e => 
      e.message.includes('Consciousness') || e.file.includes('Consciousness')
    );

    const criticalIssues: string[] = [];
    
    if (whaleWisdomErrors.length > 5) {
      criticalIssues.push('Multiple WhaleWisdom type errors may affect consciousness connections');
    }
    
    if (realityManifestationErrors.length > 3) {
      criticalIssues.push('RealityManifestation errors could impact intention tracking');
    }
    
    if (quantumConsciousnessErrors.length > 10) {
      criticalIssues.push('Significant consciousness type issues detected');
    }

    return {
      whaleWisdomPatterns: whaleWisdomErrors.length,
      realityManifestationPatterns: realityManifestationErrors.length,
      quantumConsciousnessPatterns: quantumConsciousnessErrors.length,
      criticalConsciousnessIssues: criticalIssues
    };
  }

  /**
   * Generate recommendations based on pattern analysis
   */
  private generatePatternRecommendations(
    patterns: ErrorPattern[], 
    consciousnessHealth: PatternAnalysisResult['consciousnessPatternHealth']
  ): string[] {
    const recommendations: string[] = [];

    // High-frequency pattern recommendations
    const highFrequencyPatterns = patterns.filter(p => p.frequency > 10);
    if (highFrequencyPatterns.length > 0) {
      recommendations.push(
        `Address ${highFrequencyPatterns.length} high-frequency error patterns affecting multiple files`
      );
    }

    // Consciousness-specific recommendations
    if (consciousnessHealth.criticalConsciousnessIssues.length > 0) {
      recommendations.push(
        'Critical consciousness feature issues detected - prioritize fixing to maintain whale wisdom integrity'
      );
    }

    // Import pattern recommendations
    const importPatterns = patterns.filter(p => p.category === 'import');
    if (importPatterns.length > 0) {
      recommendations.push(
        `Resolve ${importPatterns.length} import patterns to improve module resolution`
      );
    }

    // Security pattern recommendations
    const securityPatterns = patterns.filter(p => p.category === 'security');
    if (securityPatterns.length > 0) {
      recommendations.push(
        `Review ${securityPatterns.length} security-related patterns for type safety improvements`
      );
    }

    return recommendations;
  }

  /**
   * Initialize known common patterns
   */
  private initializeKnownPatterns(): void {
    this.knownPatterns = [
      {
        id: 'missing_import',
        name: 'Missing Import Declaration',
        description: 'Module or type cannot be found',
        pattern: /Cannot find module|Cannot find name/,
        category: 'import',
        frequency: 0,
        severity: 'medium',
        affectedFiles: [],
        suggestedFix: 'Add proper import statement or install missing dependency'
      },
      {
        id: 'type_any_usage',
        name: 'Any Type Usage',
        description: 'Usage of any type reduces type safety',
        pattern: /Type 'any'|implicitly has an 'any'/,
        category: 'security',
        frequency: 0,
        severity: 'medium',
        affectedFiles: [],
        suggestedFix: 'Replace any with specific type definitions'
      },
      {
        id: 'consciousness_type_missing',
        name: 'Consciousness Type Missing',
        description: 'Consciousness feature types are not properly defined',
        pattern: /WhaleWisdom|RealityManifestation|Consciousness.*not found/,
        category: 'consciousness',
        frequency: 0,
        severity: 'high',
        affectedFiles: [],
        suggestedFix: 'Ensure consciousness feature types are properly imported and defined',
        consciousnessImpact: 'high'
      }
    ];
  }

  /**
   * Helper methods for pattern analysis
   */
  private determinePatternCategory(message: string, error: TypeScriptError): ErrorPattern['category'] {
    if (this.consciousnessKeywords.some(keyword => message.includes(keyword))) {
      return 'consciousness';
    }
    return error.category;
  }

  private assessConsciousnessImpact(message: string, affectedFiles: string[]): ErrorPattern['consciousnessImpact'] {
    const consciousnessFiles = affectedFiles.filter(file => 
      this.consciousnessKeywords.some(keyword => file.includes(keyword))
    );

    if (consciousnessFiles.length > 3) return 'high';
    if (consciousnessFiles.length > 1) return 'medium';
    if (consciousnessFiles.length > 0) return 'low';
    return 'none';
  }

  private determineSeverity(errors: TypeScriptError[], consciousnessImpact?: string): ErrorPattern['severity'] {
    if (consciousnessImpact === 'high') return 'high';
    if (errors.length > 10) return 'high';
    if (errors.length > 5) return 'medium';
    return 'low';
  }

  private generatePatternId(message: string): string {
    return message
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 50);
  }

  private generatePatternName(message: string, category: string): string {
    const categoryNames = {
      import: 'Import Issue',
      type: 'Type Error',
      syntax: 'Syntax Problem',
      consciousness: 'Consciousness Feature Issue',
      security: 'Security Concern'
    };

    return categoryNames[category] || 'General Error';
  }

  private generateSuggestedFix(message: string, category: string): string {
    const fixTemplates = {
      import: 'Check import paths and ensure dependencies are installed',
      type: 'Review type definitions and ensure proper typing',
      syntax: 'Fix syntax error according to TypeScript rules',
      consciousness: 'Verify consciousness feature types and imports',
      security: 'Improve type safety and remove any usage'
    };

    return fixTemplates[category] || 'Review error message and apply appropriate fix';
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Export pattern analysis for manual review
   */
  async exportPatternReport(result: PatternAnalysisResult, outputPath: string): Promise<void> {
    const reportData = {
      ...result,
      metadata: {
        engine: 'PatternRecognitionEngine',
        version: '1.0.0',
        safetyMode: 'ANALYSIS_ONLY',
        timestamp: new Date()
      }
    };

    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(reportData, null, 2),
      'utf-8'
    );

    console.log(`📊 Pattern analysis report exported to: ${outputPath}`);
  }
}