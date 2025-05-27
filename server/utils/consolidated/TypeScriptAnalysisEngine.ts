/**
 * TypeScript Analysis Engine
 * Consolidated tool combining ts-error-analyzer.ts + ts-error-finder.ts
 * Part of Phase 12 TypeScript Utility Consolidation
 * ANALYSIS ONLY - No file modifications
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

export interface AnalysisOptions {
  projectRoot: string;
  includeNodeModules?: boolean;
  maxErrors?: number;
  consciousnessFeatureFocus?: boolean;
}

export interface TypeScriptError {
  code: number;
  message: string;
  file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  category: 'syntax' | 'type' | 'security' | 'consciousness' | 'import' | 'other';
}

export interface AnalysisReport {
  totalErrors: number;
  errorsByCategory: Record<string, number>;
  errorsByFile: Record<string, number>;
  consciousnessFeatureHealth: {
    whaleWisdomTypes: boolean;
    realityManifestationTypes: boolean;
    quantumConsciousnessTypes: boolean;
    dimensionalBridgeTypes: boolean;
  };
  recommendations: string[];
  timestamp: Date;
}

export class TypeScriptAnalysisEngine {
  private program: ts.Program | null = null;
  private options: AnalysisOptions;

  constructor(options: AnalysisOptions) {
    this.options = {
      maxErrors: 100,
      includeNodeModules: false,
      consciousnessFeatureFocus: true,
      ...options
    };
  }

  /**
   * Main analysis method - ANALYSIS ONLY, no modifications
   */
  async analyzeProject(): Promise<AnalysisReport> {
    console.log('🔍 Starting TypeScript Analysis Engine (Analysis Only Mode)');
    
    try {
      // Initialize TypeScript program
      await this.initializeProgram();
      
      // Perform comprehensive analysis
      const errors = await this.detectAllErrors();
      const categorizedErrors = this.categorizeErrors(errors);
      const consciousnessHealth = await this.analyzeConsciousnessFeatures();
      
      const report: AnalysisReport = {
        totalErrors: errors.length,
        errorsByCategory: this.groupByCategory(categorizedErrors),
        errorsByFile: this.groupByFile(categorizedErrors),
        consciousnessFeatureHealth: consciousnessHealth,
        recommendations: this.generateRecommendations(categorizedErrors, consciousnessHealth),
        timestamp: new Date()
      };

      console.log(`✅ Analysis complete: ${errors.length} issues found`);
      return report;
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      throw error;
    }
  }

  /**
   * Initialize TypeScript compilation program
   */
  private async initializeProgram(): Promise<void> {
    const configPath = ts.findConfigFile(this.options.projectRoot, ts.sys.fileExists, 'tsconfig.json');
    
    if (!configPath) {
      throw new Error('Cannot find tsconfig.json');
    }

    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      path.dirname(configPath)
    );

    this.program = ts.createProgram({
      rootNames: parsedConfig.fileNames,
      options: parsedConfig.options
    });
  }

  /**
   * Detect all TypeScript errors in the project
   */
  private async detectAllErrors(): Promise<TypeScriptError[]> {
    if (!this.program) {
      throw new Error('TypeScript program not initialized');
    }

    const errors: TypeScriptError[] = [];
    const diagnostics = [
      ...this.program.getSemanticDiagnostics(),
      ...this.program.getSyntacticDiagnostics(),
      ...this.program.getDeclarationDiagnostics()
    ];

    for (const diagnostic of diagnostics) {
      if (this.options.maxErrors && errors.length >= this.options.maxErrors) {
        break;
      }

      const error = this.convertDiagnosticToError(diagnostic);
      if (error) {
        errors.push(error);
      }
    }

    return errors;
  }

  /**
   * Convert TypeScript diagnostic to our error format
   */
  private convertDiagnosticToError(diagnostic: ts.Diagnostic): TypeScriptError | null {
    if (!diagnostic.file || !diagnostic.start) {
      return null;
    }

    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

    return {
      code: diagnostic.code,
      message,
      file: diagnostic.file.fileName,
      line: line + 1,
      column: character + 1,
      severity: this.getSeverity(diagnostic.category),
      category: this.categorizeError(diagnostic.code, message)
    };
  }

  /**
   * Categorize errors for better organization
   */
  private categorizeErrors(errors: TypeScriptError[]): TypeScriptError[] {
    return errors.map(error => ({
      ...error,
      category: this.categorizeError(error.code, error.message)
    }));
  }

  /**
   * Categorize individual error
   */
  private categorizeError(code: number, message: string): TypeScriptError['category'] {
    // Consciousness feature type checking
    if (message.includes('WhaleWisdom') || message.includes('Consciousness') || 
        message.includes('RealityManifestation') || message.includes('DimensionalBridge')) {
      return 'consciousness';
    }

    // Import/module errors
    if (code === 2307 || code === 2304 || message.includes('Cannot find module')) {
      return 'import';
    }

    // Type errors
    if (code >= 2300 && code <= 2500) {
      return 'type';
    }

    // Syntax errors
    if (code >= 1000 && code <= 1999) {
      return 'syntax';
    }

    // Security-related patterns
    if (message.includes('any') || message.includes('unknown') || message.includes('eval')) {
      return 'security';
    }

    return 'other';
  }

  /**
   * Analyze consciousness feature type health
   */
  private async analyzeConsciousnessFeatures(): Promise<AnalysisReport['consciousnessFeatureHealth']> {
    const files = await this.findConsciousnessFiles();
    
    return {
      whaleWisdomTypes: await this.checkFeatureTypes(files, 'WhaleWisdom'),
      realityManifestationTypes: await this.checkFeatureTypes(files, 'RealityManifestation'),
      quantumConsciousnessTypes: await this.checkFeatureTypes(files, 'Consciousness'),
      dimensionalBridgeTypes: await this.checkFeatureTypes(files, 'DimensionalBridge')
    };
  }

  /**
   * Find files related to consciousness features
   */
  private async findConsciousnessFiles(): Promise<string[]> {
    const patterns = [
      '**/QuantumConsciousnessEngine*',
      '**/WhaleWisdom*',
      '**/RealityManifestation*',
      '**/DimensionalBridge*',
      '**/ConsciousnessMastery*'
    ];

    const files: string[] = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern, { cwd: this.options.projectRoot });
      files.push(...matches.map(f => path.join(this.options.projectRoot, f)));
    }

    return files;
  }

  /**
   * Check if specific feature types are healthy
   */
  private async checkFeatureTypes(files: string[], featureName: string): Promise<boolean> {
    for (const file of files) {
      if (file.includes(featureName)) {
        try {
          const content = await fs.promises.readFile(file, 'utf-8');
          // Basic check - if file exists and has TypeScript content, consider healthy
          return content.includes('interface') || content.includes('type') || content.includes('class');
        } catch {
          return false;
        }
      }
    }
    return true; // If no specific files found, assume healthy
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(errors: TypeScriptError[], consciousnessHealth: AnalysisReport['consciousnessFeatureHealth']): string[] {
    const recommendations: string[] = [];

    // Error-based recommendations
    const importErrors = errors.filter(e => e.category === 'import').length;
    const typeErrors = errors.filter(e => e.category === 'type').length;
    const consciousnessErrors = errors.filter(e => e.category === 'consciousness').length;

    if (importErrors > 0) {
      recommendations.push(`Fix ${importErrors} import/module resolution issues`);
    }

    if (typeErrors > 10) {
      recommendations.push(`Address ${typeErrors} type safety issues for better code quality`);
    }

    if (consciousnessErrors > 0) {
      recommendations.push(`Review ${consciousnessErrors} consciousness feature type issues to maintain whale wisdom integrity`);
    }

    // Consciousness health recommendations
    if (!consciousnessHealth.whaleWisdomTypes) {
      recommendations.push('Restore WhaleWisdom type definitions for proper consciousness tracking');
    }

    if (!consciousnessHealth.realityManifestationTypes) {
      recommendations.push('Verify RealityManifestation types for intention tracking accuracy');
    }

    return recommendations;
  }

  /**
   * Helper methods for grouping and analysis
   */
  private getSeverity(category: ts.DiagnosticCategory): TypeScriptError['severity'] {
    switch (category) {
      case ts.DiagnosticCategory.Error: return 'error';
      case ts.DiagnosticCategory.Warning: return 'warning';
      case ts.DiagnosticCategory.Suggestion: return 'info';
      default: return 'info';
    }
  }

  private groupByCategory(errors: TypeScriptError[]): Record<string, number> {
    const groups: Record<string, number> = {};
    for (const error of errors) {
      groups[error.category] = (groups[error.category] || 0) + 1;
    }
    return groups;
  }

  private groupByFile(errors: TypeScriptError[]): Record<string, number> {
    const groups: Record<string, number> = {};
    for (const error of errors) {
      const fileName = path.basename(error.file);
      groups[fileName] = (groups[fileName] || 0) + 1;
    }
    return groups;
  }

  /**
   * Export analysis results for manual review
   */
  async exportReport(report: AnalysisReport, outputPath: string): Promise<void> {
    const reportData = {
      ...report,
      metadata: {
        analysisEngine: 'TypeScriptAnalysisEngine',
        version: '1.0.0',
        safetyMode: 'ANALYSIS_ONLY',
        consciousnessFocus: this.options.consciousnessFeatureFocus
      }
    };

    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(reportData, null, 2),
      'utf-8'
    );

    console.log(`📊 Analysis report exported to: ${outputPath}`);
  }
}