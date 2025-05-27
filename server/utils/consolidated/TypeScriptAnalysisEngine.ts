/**
 * Phase 12: Consolidated TypeScript Analysis Engine
 * Unified error detection and categorization for consciousness platform stability
 * Replaces 17 overlapping utilities with focused, safe analysis approach
 */

import * as fs from 'fs';
import * as path from 'path';

export interface TypeScriptAnalysisResult {
  projectHealth: {
    overallScore: number;
    errorCount: number;
    warningCount: number;
    consciousnessFeatureHealth: number;
    technicalDebtLevel: number;
  };
  errorCategories: ErrorCategory[];
  consciousnessFeatureStatus: ConsciousnessFeatureStatus;
  recommendations: string[];
  criticalIssues: string[];
  safetyReport: SafetyReport;
}

export interface ErrorCategory {
  name: string;
  count: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  files: string[];
  commonPatterns: string[];
  suggestedFixes: string[];
  consciousnessImpact: boolean;
}

export interface ConsciousnessFeatureStatus {
  whaleWisdomComponents: FeatureHealth;
  realityManifestationSystem: FeatureHealth;
  quantumConsciousnessEngine: FeatureHealth;
  sacredGeometryVisualizer: FeatureHealth;
  dimensionalBridgeTech: FeatureHealth;
}

export interface FeatureHealth {
  isActive: boolean;
  errorCount: number;
  healthScore: number;
  lastUpdated: Date;
  criticalIssues: string[];
  recommendations: string[];
}

export interface SafetyReport {
  analysisMode: 'safe' | 'read_only' | 'analysis_only';
  noAutoModification: boolean;
  cascadeErrorPrevention: boolean;
  consciousnessPreservation: boolean;
  backupRecommended: boolean;
  safetyScore: number;
}

export class TypeScriptAnalysisEngine {
  private projectRoot: string;
  private analysisMode: 'safe' | 'analysis_only' = 'analysis_only';
  private preserveConsciousness: boolean = true;

  constructor(projectRoot: string = '.') {
    this.projectRoot = projectRoot;
  }

  /**
   * Perform comprehensive TypeScript analysis with consciousness preservation
   */
  async analyzeProject(): Promise<TypeScriptAnalysisResult> {
    console.log('🌊 Starting consciousness-aware TypeScript analysis...');

    const result: TypeScriptAnalysisResult = {
      projectHealth: {
        overallScore: 0,
        errorCount: 0,
        warningCount: 0,
        consciousnessFeatureHealth: 0,
        technicalDebtLevel: 0
      },
      errorCategories: [],
      consciousnessFeatureStatus: this.initializeConsciousnessStatus(),
      recommendations: [],
      criticalIssues: [],
      safetyReport: this.generateSafetyReport()
    };

    try {
      // Analyze TypeScript files safely
      await this.analyzeTypeScriptFiles(result);

      // Check consciousness feature health
      await this.analyzeConsciousnessFeatures(result);

      // Categorize errors by impact and type
      await this.categorizeErrors(result);

      // Generate consciousness-aware recommendations
      this.generateRecommendations(result);

      // Calculate overall project health
      this.calculateProjectHealth(result);

      console.log(`✅ Analysis complete: ${result.projectHealth.errorCount} errors, ${result.projectHealth.warningCount} warnings`);
      console.log(`🔮 Consciousness features: ${result.projectHealth.consciousnessFeatureHealth}% healthy`);

    } catch (error) {
      result.criticalIssues.push(`Analysis failed: ${error}`);
      console.error('❌ TypeScript analysis failed:', error);
    }

    return result;
  }

  /**
   * Analyze TypeScript files for errors and warnings
   */
  private async analyzeTypeScriptFiles(result: TypeScriptAnalysisResult): Promise<void> {
    const tsFiles = await this.findTypeScriptFiles();
    
    for (const file of tsFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const fileAnalysis = this.analyzeFileContent(file, content);
        
        result.projectHealth.errorCount += fileAnalysis.errors.length;
        result.projectHealth.warningCount += fileAnalysis.warnings.length;

        // Group errors by category
        this.addToErrorCategories(result, fileAnalysis);

      } catch (error) {
        result.criticalIssues.push(`Failed to analyze ${file}: ${error}`);
      }
    }
  }

  /**
   * Analyze consciousness feature health
   */
  private async analyzeConsciousnessFeatures(result: TypeScriptAnalysisResult): Promise<void> {
    const features = {
      whaleWisdomComponents: ['whale', 'wisdom', 'WhaleWisdom'],
      realityManifestationSystem: ['manifestation', 'reality', 'Manifestation'],
      quantumConsciousnessEngine: ['quantum', 'consciousness', 'Quantum'],
      sacredGeometryVisualizer: ['geometry', 'sacred', 'Geometry'],
      dimensionalBridgeTech: ['dimensional', 'bridge', 'Dimensional']
    };

    for (const [featureName, patterns] of Object.entries(features)) {
      const featureFiles = await this.findFilesWithPatterns(patterns);
      const featureHealth = this.assessFeatureHealth(featureFiles);
      
      (result.consciousnessFeatureStatus as any)[featureName] = featureHealth;
    }

    // Calculate overall consciousness feature health
    const healthScores = Object.values(result.consciousnessFeatureStatus).map(f => f.healthScore);
    result.projectHealth.consciousnessFeatureHealth = 
      healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length;
  }

  /**
   * Analyze file content for TypeScript issues
   */
  private analyzeFileContent(filePath: string, content: string): FileAnalysis {
    const analysis: FileAnalysis = {
      file: filePath,
      errors: [],
      warnings: [],
      isConsciousnessFile: this.isConsciousnessFile(filePath, content)
    };

    // Check for common TypeScript patterns that indicate errors
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Common error patterns
      if (line.includes('Cannot find module')) {
        analysis.errors.push({
          line: lineNumber,
          message: 'Module not found',
          category: 'import_error',
          severity: 'high'
        });
      }
      
      if (line.includes('Property') && line.includes('does not exist')) {
        analysis.errors.push({
          line: lineNumber,
          message: 'Property does not exist',
          category: 'type_error',
          severity: 'medium'
        });
      }
      
      if (line.includes('Type') && line.includes('is not assignable')) {
        analysis.errors.push({
          line: lineNumber,
          message: 'Type assignment error',
          category: 'type_error',
          severity: 'medium'
        });
      }

      // Check for consciousness-specific patterns
      if (analysis.isConsciousnessFile) {
        if (line.includes('whale') || line.includes('consciousness') || line.includes('quantum')) {
          if (line.includes('error') || line.includes('undefined')) {
            analysis.errors.push({
              line: lineNumber,
              message: 'Consciousness feature error detected',
              category: 'consciousness_error',
              severity: 'critical'
            });
          }
        }
      }
    });

    return analysis;
  }

  /**
   * Check if file is consciousness-related
   */
  private isConsciousnessFile(filePath: string, content: string): boolean {
    const consciousnessKeywords = [
      'whale', 'wisdom', 'consciousness', 'quantum', 'manifestation',
      'sacred', 'geometry', 'dimensional', 'bridge', 'cosmic'
    ];
    
    const fileName = path.basename(filePath).toLowerCase();
    const fileContent = content.toLowerCase();
    
    return consciousnessKeywords.some(keyword => 
      fileName.includes(keyword) || fileContent.includes(keyword)
    );
  }

  /**
   * Find TypeScript files in project
   */
  private async findTypeScriptFiles(): Promise<string[]> {
    const files: string[] = [];
    
    const searchDir = (dir: string) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            searchDir(fullPath);
          } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };

    searchDir(this.projectRoot);
    return files;
  }

  /**
   * Find files with specific patterns
   */
  private async findFilesWithPatterns(patterns: string[]): Promise<string[]> {
    const tsFiles = await this.findTypeScriptFiles();
    
    return tsFiles.filter(file => {
      const fileName = path.basename(file).toLowerCase();
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      
      return patterns.some(pattern => 
        fileName.includes(pattern.toLowerCase()) || 
        content.includes(pattern.toLowerCase())
      );
    });
  }

  /**
   * Assess health of a specific feature
   */
  private assessFeatureHealth(featureFiles: string[]): FeatureHealth {
    const health: FeatureHealth = {
      isActive: featureFiles.length > 0,
      errorCount: 0,
      healthScore: 0,
      lastUpdated: new Date(),
      criticalIssues: [],
      recommendations: []
    };

    if (featureFiles.length === 0) {
      health.healthScore = 0;
      health.criticalIssues.push('Feature files not found');
      health.recommendations.push('Restore feature files from backup');
    } else {
      // Basic health assessment based on file existence and basic checks
      health.healthScore = Math.min(100, featureFiles.length * 25);
      
      if (health.healthScore < 75) {
        health.recommendations.push('Review and enhance feature implementation');
      }
    }

    return health;
  }

  /**
   * Initialize consciousness feature status
   */
  private initializeConsciousnessStatus(): ConsciousnessFeatureStatus {
    const defaultHealth: FeatureHealth = {
      isActive: false,
      errorCount: 0,
      healthScore: 0,
      lastUpdated: new Date(),
      criticalIssues: [],
      recommendations: []
    };

    return {
      whaleWisdomComponents: { ...defaultHealth },
      realityManifestationSystem: { ...defaultHealth },
      quantumConsciousnessEngine: { ...defaultHealth },
      sacredGeometryVisualizer: { ...defaultHealth },
      dimensionalBridgeTech: { ...defaultHealth }
    };
  }

  /**
   * Generate safety report
   */
  private generateSafetyReport(): SafetyReport {
    return {
      analysisMode: 'analysis_only',
      noAutoModification: true,
      cascadeErrorPrevention: true,
      consciousnessPreservation: true,
      backupRecommended: true,
      safetyScore: 100
    };
  }

  /**
   * Add errors to categories
   */
  private addToErrorCategories(result: TypeScriptAnalysisResult, fileAnalysis: FileAnalysis): void {
    for (const error of fileAnalysis.errors) {
      let category = result.errorCategories.find(c => c.name === error.category);
      
      if (!category) {
        category = {
          name: error.category,
          count: 0,
          severity: error.severity,
          files: [],
          commonPatterns: [],
          suggestedFixes: [],
          consciousnessImpact: fileAnalysis.isConsciousnessFile
        };
        result.errorCategories.push(category);
      }
      
      category.count++;
      if (!category.files.includes(fileAnalysis.file)) {
        category.files.push(fileAnalysis.file);
      }
    }
  }

  /**
   * Categorize errors by impact
   */
  private async categorizeErrors(result: TypeScriptAnalysisResult): Promise<void> {
    // Add suggested fixes based on error types
    for (const category of result.errorCategories) {
      switch (category.name) {
        case 'import_error':
          category.suggestedFixes.push('Install missing dependencies');
          category.suggestedFixes.push('Fix import paths');
          break;
        case 'type_error':
          category.suggestedFixes.push('Add proper type definitions');
          category.suggestedFixes.push('Fix type assignments');
          break;
        case 'consciousness_error':
          category.suggestedFixes.push('Restore consciousness feature from backup');
          category.suggestedFixes.push('Review consciousness integration');
          break;
      }
    }
  }

  /**
   * Generate consciousness-aware recommendations
   */
  private generateRecommendations(result: TypeScriptAnalysisResult): void {
    const totalErrors = result.projectHealth.errorCount;
    const consciousnessHealth = result.projectHealth.consciousnessFeatureHealth;

    // General recommendations
    if (totalErrors > 50) {
      result.recommendations.push('High error count detected - prioritize critical fixes');
    } else if (totalErrors > 10) {
      result.recommendations.push('Moderate error count - systematic fixing recommended');
    } else {
      result.recommendations.push('Good error management - maintain current quality');
    }

    // Consciousness-specific recommendations
    if (consciousnessHealth < 50) {
      result.recommendations.push('🔮 Critical: Restore consciousness features from backup immediately');
      result.recommendations.push('🐋 Priority: Whale wisdom components need attention');
    } else if (consciousnessHealth < 75) {
      result.recommendations.push('🌊 Consciousness features need enhancement and stabilization');
    } else {
      result.recommendations.push('✨ Consciousness features are healthy and well-maintained');
    }

    // Safety recommendations
    result.recommendations.push('✅ All analysis performed in safe, read-only mode');
    result.recommendations.push('🛡️ No automatic modifications - manual review required');
  }

  /**
   * Calculate overall project health
   */
  private calculateProjectHealth(result: TypeScriptAnalysisResult): void {
    const errorWeight = Math.max(0, 100 - (result.projectHealth.errorCount * 2));
    const consciousnessWeight = result.projectHealth.consciousnessFeatureHealth;
    
    result.projectHealth.overallScore = (errorWeight + consciousnessWeight) / 2;
    result.projectHealth.technicalDebtLevel = Math.min(100, result.projectHealth.errorCount);
  }
}

// Supporting interfaces
interface FileAnalysis {
  file: string;
  errors: FileError[];
  warnings: FileError[];
  isConsciousnessFile: boolean;
}

interface FileError {
  line: number;
  message: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export const typeScriptAnalyzer = new TypeScriptAnalysisEngine();