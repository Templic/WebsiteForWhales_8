/**
 * Fix Recommendation Engine
 * Safe fix suggestion generator (NO AUTO-APPLY)
 * Part of Phase 12 TypeScript Utility Consolidation
 * ANALYSIS ONLY - Generates recommendations for manual review
 */

import * as fs from 'fs';
import * as path from 'path';
import { TypeScriptError } from './TypeScriptAnalysisEngine';
import { ErrorPattern } from './PatternRecognitionEngine';

export interface FixSuggestion {
  id: string;
  errorId: string;
  title: string;
  description: string;
  category: 'import' | 'type' | 'syntax' | 'consciousness' | 'security';
  priority: 'high' | 'medium' | 'low';
  estimatedComplexity: 'simple' | 'moderate' | 'complex';
  steps: string[];
  beforeCode?: string;
  suggestedCode?: string;
  safetyAnalysis: SafetyAnalysis;
  consciousnessImpact: ConsciousnessImpact;
  manualApprovalRequired: boolean;
}

export interface SafetyAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  potentialIssues: string[];
  dependencyImpact: string[];
  rollbackPlan: string[];
  validationSteps: string[];
}

export interface ConsciousnessImpact {
  affectsWhaleWisdom: boolean;
  affectsRealityManifestation: boolean;
  affectsQuantumConsciousness: boolean;
  affectsDimensionalBridge: boolean;
  impactLevel: 'none' | 'minimal' | 'moderate' | 'significant';
  mitigationSteps: string[];
}

export interface BatchFixPlan {
  planId: string;
  title: string;
  description: string;
  fixes: FixSuggestion[];
  executionOrder: string[];
  estimatedTimeMinutes: number;
  overallRisk: 'low' | 'medium' | 'high';
  consciousnessProtection: string[];
  validationCheckpoints: string[];
}

export class FixRecommendationEngine {
  private consciousnessKeywords = [
    'WhaleWisdom', 'RealityManifestation', 'QuantumConsciousness', 
    'DimensionalBridge', 'ConsciousnessMastery', 'CosmicIntegration'
  ];

  /**
   * Generate fix suggestions for TypeScript errors
   * NO AUTO-APPLY - All suggestions require manual approval
   */
  async generateFixSuggestions(errors: TypeScriptError[]): Promise<FixSuggestion[]> {
    console.log('🔧 Fix Recommendation Engine generating safe suggestions...');
    console.log('⚠️  ANALYSIS ONLY - No automatic fixes will be applied');

    const suggestions: FixSuggestion[] = [];

    for (const error of errors) {
      const suggestion = await this.createFixSuggestion(error);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Create batch fix plan for related errors
   */
  async createBatchFixPlan(errors: TypeScriptError[], patterns: ErrorPattern[]): Promise<BatchFixPlan[]> {
    const plans: BatchFixPlan[] = [];

    // Group by error category
    const errorGroups = this.groupErrorsByCategory(errors);

    for (const [category, categoryErrors] of errorGroups.entries()) {
      if (categoryErrors.length >= 3) { // Only create batch plans for 3+ errors
        const plan = await this.createCategoryBatchPlan(category, categoryErrors);
        plans.push(plan);
      }
    }

    // Create consciousness-specific batch plan
    const consciousnessErrors = errors.filter(e => e.category === 'consciousness');
    if (consciousnessErrors.length > 0) {
      const consciousnessPlan = await this.createConsciousnessBatchPlan(consciousnessErrors);
      plans.push(consciousnessPlan);
    }

    return plans;
  }

  /**
   * Create individual fix suggestion
   */
  private async createFixSuggestion(error: TypeScriptError): Promise<FixSuggestion | null> {
    const errorId = this.generateErrorId(error);
    const safetyAnalysis = await this.analyzeSafety(error);
    const consciousnessImpact = await this.analyzeConsciousnessImpact(error);

    let suggestion: Partial<FixSuggestion> = {
      id: `fix_${errorId}`,
      errorId,
      category: error.category,
      safetyAnalysis,
      consciousnessImpact,
      manualApprovalRequired: true
    };

    // Generate category-specific suggestions
    switch (error.category) {
      case 'import':
        suggestion = { ...suggestion, ...this.createImportFixSuggestion(error) };
        break;
      case 'type':
        suggestion = { ...suggestion, ...this.createTypeFixSuggestion(error) };
        break;
      case 'syntax':
        suggestion = { ...suggestion, ...this.createSyntaxFixSuggestion(error) };
        break;
      case 'consciousness':
        suggestion = { ...suggestion, ...this.createConsciousnessFixSuggestion(error) };
        break;
      case 'security':
        suggestion = { ...suggestion, ...this.createSecurityFixSuggestion(error) };
        break;
      default:
        return null;
    }

    return suggestion as FixSuggestion;
  }

  /**
   * Create import-related fix suggestions
   */
  private createImportFixSuggestion(error: TypeScriptError): Partial<FixSuggestion> {
    const isModuleMissing = error.message.includes('Cannot find module');
    const isNameMissing = error.message.includes('Cannot find name');

    if (isModuleMissing) {
      return {
        title: 'Fix Missing Module Import',
        description: 'Module cannot be found - may need installation or path correction',
        priority: 'medium',
        estimatedComplexity: 'simple',
        steps: [
          'Verify module is installed in package.json',
          'Check import path spelling and case sensitivity',
          'Ensure module exists in node_modules',
          'Consider adding type definitions if needed'
        ]
      };
    }

    if (isNameMissing) {
      return {
        title: 'Fix Missing Name Import',
        description: 'Named import or variable not found',
        priority: 'medium',
        estimatedComplexity: 'simple',
        steps: [
          'Check if name is exported from the module',
          'Verify import statement syntax',
          'Consider using default import if appropriate',
          'Check for typos in import name'
        ]
      };
    }

    return {
      title: 'Fix Import Issue',
      description: 'General import problem requiring investigation',
      priority: 'medium',
      estimatedComplexity: 'moderate',
      steps: ['Review import statement and module availability']
    };
  }

  /**
   * Create type-related fix suggestions
   */
  private createTypeFixSuggestion(error: TypeScriptError): Partial<FixSuggestion> {
    const hasAnyType = error.message.includes('any');
    const hasTypeAssignment = error.message.includes('not assignable');

    if (hasAnyType) {
      return {
        title: 'Replace Any Type Usage',
        description: 'Improve type safety by replacing any with specific types',
        priority: 'medium',
        estimatedComplexity: 'moderate',
        steps: [
          'Identify the expected type for this value',
          'Create specific interface or type definition',
          'Replace any with the specific type',
          'Add proper type annotations'
        ]
      };
    }

    if (hasTypeAssignment) {
      return {
        title: 'Fix Type Assignment Error',
        description: 'Types are not compatible - need type alignment',
        priority: 'medium',
        estimatedComplexity: 'moderate',
        steps: [
          'Review source and target types',
          'Add type assertions if safe',
          'Modify type definitions if needed',
          'Consider union types for flexibility'
        ]
      };
    }

    return {
      title: 'Resolve Type Error',
      description: 'General type issue requiring type analysis',
      priority: 'medium',
      estimatedComplexity: 'moderate',
      steps: ['Analyze type definitions and usage context']
    };
  }

  /**
   * Create consciousness-specific fix suggestions
   */
  private createConsciousnessFixSuggestion(error: TypeScriptError): Partial<FixSuggestion> {
    const affectedFeature = this.consciousnessKeywords.find(keyword => 
      error.message.includes(keyword) || error.file.includes(keyword)
    );

    return {
      title: `Fix ${affectedFeature || 'Consciousness'} Feature Type Issue`,
      description: 'Consciousness feature type error affecting whale wisdom integrity',
      priority: 'high',
      estimatedComplexity: 'moderate',
      steps: [
        'Review consciousness feature type definitions',
        'Ensure proper imports for consciousness modules',
        'Validate whale wisdom data type accuracy',
        'Test consciousness feature functionality after fix',
        'Verify reality manifestation type consistency'
      ]
    };
  }

  /**
   * Create security-related fix suggestions
   */
  private createSecurityFixSuggestion(error: TypeScriptError): Partial<FixSuggestion> {
    return {
      title: 'Enhance Type Security',
      description: 'Security-related type issue requiring attention',
      priority: 'high',
      estimatedComplexity: 'moderate',
      steps: [
        'Replace any/unknown types with specific types',
        'Add proper type validations',
        'Review for potential security vulnerabilities',
        'Ensure input sanitization where needed'
      ]
    };
  }

  /**
   * Create syntax fix suggestions
   */
  private createSyntaxFixSuggestion(error: TypeScriptError): Partial<FixSuggestion> {
    return {
      title: 'Fix Syntax Error',
      description: 'TypeScript syntax issue requiring correction',
      priority: 'high',
      estimatedComplexity: 'simple',
      steps: [
        'Review syntax error message',
        'Check for missing semicolons, brackets, or quotes',
        'Verify TypeScript syntax rules',
        'Test compilation after fix'
      ]
    };
  }

  /**
   * Analyze safety of applying fix
   */
  private async analyzeSafety(error: TypeScriptError): Promise<SafetyAnalysis> {
    const riskLevel = this.assessRiskLevel(error);
    const potentialIssues: string[] = [];
    const dependencyImpact: string[] = [];

    // Assess risk factors
    if (error.category === 'consciousness') {
      potentialIssues.push('May affect consciousness feature functionality');
      dependencyImpact.push('Could impact whale wisdom connections');
    }

    if (error.file.includes('server') || error.file.includes('auth')) {
      potentialIssues.push('Server or authentication code changes require careful testing');
      dependencyImpact.push('May affect authentication flow or server functionality');
    }

    return {
      riskLevel,
      potentialIssues,
      dependencyImpact,
      rollbackPlan: [
        'Create backup of current file before changes',
        'Document original state',
        'Test rollback procedure',
        'Validate consciousness features after rollback'
      ],
      validationSteps: [
        'Compile TypeScript to check for new errors',
        'Run consciousness feature tests',
        'Verify authentication functionality',
        'Check for breaking changes in dependent modules'
      ]
    };
  }

  /**
   * Analyze consciousness impact
   */
  private async analyzeConsciousnessImpact(error: TypeScriptError): Promise<ConsciousnessImpact> {
    const affectsWhaleWisdom = error.message.includes('WhaleWisdom') || error.file.includes('WhaleWisdom');
    const affectsRealityManifestation = error.message.includes('RealityManifestation') || error.file.includes('RealityManifestation');
    const affectsQuantumConsciousness = error.message.includes('Consciousness') || error.file.includes('Consciousness');
    const affectsDimensionalBridge = error.message.includes('DimensionalBridge') || error.file.includes('DimensionalBridge');

    let impactLevel: ConsciousnessImpact['impactLevel'] = 'none';
    if (affectsWhaleWisdom || affectsRealityManifestation) impactLevel = 'significant';
    else if (affectsQuantumConsciousness || affectsDimensionalBridge) impactLevel = 'moderate';
    else if (error.category === 'consciousness') impactLevel = 'minimal';

    const mitigationSteps: string[] = [];
    if (impactLevel !== 'none') {
      mitigationSteps.push('Test consciousness features thoroughly after fix');
      mitigationSteps.push('Verify whale wisdom connections remain functional');
      mitigationSteps.push('Validate reality manifestation tracking accuracy');
    }

    return {
      affectsWhaleWisdom,
      affectsRealityManifestation,
      affectsQuantumConsciousness,
      affectsDimensionalBridge,
      impactLevel,
      mitigationSteps
    };
  }

  /**
   * Create batch fix plan for error category
   */
  private async createCategoryBatchPlan(category: string, errors: TypeScriptError[]): Promise<BatchFixPlan> {
    const fixes = await Promise.all(
      errors.map(error => this.createFixSuggestion(error))
    );
    const validFixes = fixes.filter(f => f !== null) as FixSuggestion[];

    return {
      planId: `batch_${category}_${Date.now()}`,
      title: `Batch Fix for ${category.charAt(0).toUpperCase() + category.slice(1)} Errors`,
      description: `Systematic resolution of ${errors.length} ${category} errors`,
      fixes: validFixes,
      executionOrder: validFixes.map(f => f.id),
      estimatedTimeMinutes: validFixes.length * 10,
      overallRisk: this.calculateBatchRisk(validFixes),
      consciousnessProtection: [
        'Verify consciousness features before starting',
        'Test consciousness functionality between fixes',
        'Validate whale wisdom integrity after completion'
      ],
      validationCheckpoints: [
        `After every 3 ${category} fixes`,
        'Before proceeding to next error category',
        'Final consciousness feature validation'
      ]
    };
  }

  /**
   * Create consciousness-specific batch plan
   */
  private async createConsciousnessBatchPlan(errors: TypeScriptError[]): Promise<BatchFixPlan> {
    const fixes = await Promise.all(
      errors.map(error => this.createFixSuggestion(error))
    );
    const validFixes = fixes.filter(f => f !== null) as FixSuggestion[];

    return {
      planId: `consciousness_batch_${Date.now()}`,
      title: 'Consciousness Feature Protection Plan',
      description: 'Careful resolution of consciousness-related type errors',
      fixes: validFixes,
      executionOrder: this.orderConsciousnessFixes(validFixes),
      estimatedTimeMinutes: validFixes.length * 15, // More time for consciousness fixes
      overallRisk: 'high', // Always high for consciousness features
      consciousnessProtection: [
        'Backup all consciousness feature files',
        'Test whale wisdom connections before starting',
        'Verify reality manifestation functionality',
        'Check quantum consciousness evolution tracking'
      ],
      validationCheckpoints: [
        'After each consciousness fix',
        'Comprehensive consciousness feature test suite',
        'User experience validation for consciousness features'
      ]
    };
  }

  /**
   * Helper methods
   */
  private generateErrorId(error: TypeScriptError): string {
    return `${error.code}_${path.basename(error.file)}_${error.line}`;
  }

  private assessRiskLevel(error: TypeScriptError): SafetyAnalysis['riskLevel'] {
    if (error.category === 'consciousness') return 'high';
    if (error.category === 'security') return 'high';
    if (error.file.includes('auth') || error.file.includes('server')) return 'medium';
    return 'low';
  }

  private groupErrorsByCategory(errors: TypeScriptError[]): Map<string, TypeScriptError[]> {
    const groups = new Map<string, TypeScriptError[]>();
    
    for (const error of errors) {
      if (!groups.has(error.category)) {
        groups.set(error.category, []);
      }
      groups.get(error.category)!.push(error);
    }

    return groups;
  }

  private calculateBatchRisk(fixes: FixSuggestion[]): BatchFixPlan['overallRisk'] {
    const highRiskCount = fixes.filter(f => f.safetyAnalysis.riskLevel === 'high').length;
    if (highRiskCount > fixes.length * 0.3) return 'high';
    
    const mediumRiskCount = fixes.filter(f => f.safetyAnalysis.riskLevel === 'medium').length;
    if (mediumRiskCount > fixes.length * 0.5) return 'medium';
    
    return 'low';
  }

  private orderConsciousnessFixes(fixes: FixSuggestion[]): string[] {
    // Order consciousness fixes by feature priority
    const featurePriority = ['WhaleWisdom', 'RealityManifestation', 'QuantumConsciousness', 'DimensionalBridge'];
    
    return fixes.sort((a, b) => {
      const aFeature = featurePriority.findIndex(f => a.title.includes(f));
      const bFeature = featurePriority.findIndex(f => b.title.includes(f));
      return aFeature - bFeature;
    }).map(f => f.id);
  }

  /**
   * Export fix recommendations for manual review
   */
  async exportFixRecommendations(suggestions: FixSuggestion[], outputPath: string): Promise<void> {
    const reportData = {
      summary: {
        totalSuggestions: suggestions.length,
        byPriority: {
          high: suggestions.filter(s => s.priority === 'high').length,
          medium: suggestions.filter(s => s.priority === 'medium').length,
          low: suggestions.filter(s => s.priority === 'low').length
        },
        byCategory: {
          consciousness: suggestions.filter(s => s.category === 'consciousness').length,
          security: suggestions.filter(s => s.category === 'security').length,
          import: suggestions.filter(s => s.category === 'import').length,
          type: suggestions.filter(s => s.category === 'type').length,
          syntax: suggestions.filter(s => s.category === 'syntax').length
        }
      },
      suggestions,
      metadata: {
        engine: 'FixRecommendationEngine',
        version: '1.0.0',
        safetyMode: 'ANALYSIS_ONLY',
        manualApprovalRequired: true,
        consciousnessProtection: true,
        timestamp: new Date()
      }
    };

    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(reportData, null, 2),
      'utf-8'
    );

    console.log(`📋 Fix recommendations exported to: ${outputPath}`);
    console.log('⚠️  All fixes require manual review and approval');
  }
}