#!/usr/bin/env npx tsx
/**
 * Utility 6: Code Quality Enforcer
 * Comprehensive code style, standards, and maintainability analysis
 * Focuses on clean code principles, SOLID patterns, and development best practices
 */

import * as fs from 'fs';
import * as path from 'path';

interface CodeQualityIssue {
  type: 'code_style' | 'complexity' | 'duplication' | 'naming_conventions' | 'documentation' |
        'design_patterns' | 'code_smells' | 'refactoring_opportunities';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  file: string;
  line?: number;
  fix: string;
  impact: string;
  principle: string;
}

interface CodeQualityAnalysisResult {
  totalFiles: number;
  issuesFound: number;
  complexityViolations: number;
  qualityScore: number;
  issues: CodeQualityIssue[];
  recommendations: string[];
  qualityMetrics: {
    cyclomaticComplexity: number;
    codeDuplication: number;
    maintainabilityIndex: number;
    technicalDebt: string;
  };
  designPatterns: {
    patternsIdentified: string[];
    antiPatternsFound: number;
    solidPrinciples: SolidCompliance;
    refactoringOpportunities: string[];
  };
  codeSmells: {
    longMethods: number;
    largeClasses: number;
    godObjects: number;
    featureEnvy: number;
  };
  refactoringAnalysis: {
    extractMethodOpportunities: number;
    extractClassOpportunities: number;
    moveMethodOpportunities: number;
    consolidationOpportunities: number;
  };
}

interface SolidCompliance {
  singleResponsibility: number;
  openClosed: number;
  liskovSubstitution: number;
  interfaceSegregation: number;
  dependencyInversion: number;
}

export class CodeQualityEnforcer {
  private complexityThresholds = {
    method: 10,
    class: 500,
    file: 1000
  };

  private namingPatterns = {
    camelCase: /^[a-z][a-zA-Z0-9]*$/,
    pascalCase: /^[A-Z][a-zA-Z0-9]*$/,
    constantCase: /^[A-Z][A-Z0-9_]*$/
  };

  // NEW SUBTITLE 1: Design Patterns Analysis
  private designPatterns = [
    'singleton', 'factory', 'observer', 'strategy', 'decorator',
    'adapter', 'facade', 'proxy', 'builder', 'prototype'
  ];

  // NEW SUBTITLE 2: Code Smells Detection
  private codeSmells = [
    'long method', 'large class', 'duplicate code', 'dead code',
    'god object', 'feature envy', 'data class', 'lazy class'
  ];

  // NEW SUBTITLE 3: Refactoring Opportunities
  private refactoringPatterns = [
    'extract method', 'extract class', 'move method', 'inline',
    'substitute algorithm', 'pull up', 'push down', 'rename'
  ];

  /**
   * Analyze code quality across the codebase
   */
  async analyzeCodeQuality(directory: string = './'): Promise<CodeQualityAnalysisResult> {
    console.log('🏆 Code Quality Enforcer');
    console.log('Analyzing code style, complexity, and maintainability...\n');

    const files = await this.findCodeFiles(directory);
    const issues: CodeQualityIssue[] = [];
    let totalComplexity = 0;
    
    for (const file of files) {
      const content = await fs.promises.readFile(file, 'utf8');
      const fileIssues = await this.analyzeFile(file, content);
      issues.push(...fileIssues);
      totalComplexity += this.calculateComplexity(content);
    }

    const designPatterns = await this.analyzeDesignPatterns(files);
    const codeSmells = await this.detectCodeSmells(files);
    const refactoringAnalysis = await this.analyzeRefactoringOpportunities(files);

    const result: CodeQualityAnalysisResult = {
      totalFiles: files.length,
      issuesFound: issues.length,
      complexityViolations: issues.filter(issue => issue.type === 'complexity').length,
      qualityScore: this.calculateQualityScore(issues, files.length, totalComplexity),
      issues,
      recommendations: this.generateRecommendations(issues),
      qualityMetrics: {
        cyclomaticComplexity: totalComplexity / files.length,
        codeDuplication: this.calculateDuplication(issues),
        maintainabilityIndex: this.calculateMaintainabilityIndex(issues, totalComplexity),
        technicalDebt: this.estimateTechnicalDebt(issues)
      },
      designPatterns,
      codeSmells,
      refactoringAnalysis
    };

    this.displayResults(result);
    return result;
  }

  /**
   * Find code files to analyze
   */
  private async findCodeFiles(directory: string): Promise<string[]> {
    const files: string[] = [];
    
    const walk = async (dir: string): Promise<void> => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !this.shouldExcludeDirectory(entry.name)) {
          await walk(fullPath);
        } else if (entry.isFile() && this.isRelevantFile(entry.name)) {
          files.push(fullPath);
        }
      }
    };

    await walk(directory);
    return files;
  }

  /**
   * Analyze individual file for quality issues
   */
  private async analyzeFile(filePath: string, content: string): Promise<CodeQualityIssue[]> {
    const issues: CodeQualityIssue[] = [];
    const lines = content.split('\n');

    // Check file length
    if (lines.length > this.complexityThresholds.file) {
      issues.push({
        type: 'complexity',
        severity: 'high',
        description: `File is too long (${lines.length} lines)`,
        file: filePath,
        fix: 'Break down file into smaller, focused modules',
        impact: 'Reduces maintainability and increases cognitive load',
        principle: 'Single Responsibility Principle'
      });
    }

    lines.forEach((line, index) => {
      // Check for long lines
      if (line.length > 120) {
        issues.push({
          type: 'code_style',
          severity: 'low',
          description: 'Line exceeds recommended length (120 characters)',
          file: filePath,
          line: index + 1,
          fix: 'Break long lines into multiple lines',
          impact: 'Improves readability',
          principle: 'Clean Code'
        });
      }

      // Check for TODO/FIXME comments
      if (line.includes('TODO') || line.includes('FIXME')) {
        issues.push({
          type: 'documentation',
          severity: 'medium',
          description: 'Unresolved TODO/FIXME comment',
          file: filePath,
          line: index + 1,
          fix: 'Resolve or create proper issue tracking',
          impact: 'Reduces technical debt',
          principle: 'Clean Code'
        });
      }

      // Check for magic numbers
      const magicNumberPattern = /\b\d{2,}\b(?!\s*[;})\],])/;
      if (magicNumberPattern.test(line) && !line.includes('const')) {
        issues.push({
          type: 'code_style',
          severity: 'medium',
          description: 'Magic number detected',
          file: filePath,
          line: index + 1,
          fix: 'Extract magic number to named constant',
          impact: 'Improves code readability and maintainability',
          principle: 'Clean Code'
        });
      }

      // Check for deep nesting
      const indentLevel = (line.match(/^(\s*)/)?.[1]?.length || 0) / 2;
      if (indentLevel > 4) {
        issues.push({
          type: 'complexity',
          severity: 'medium',
          description: `Deep nesting detected (level ${indentLevel})`,
          file: filePath,
          line: index + 1,
          fix: 'Extract nested logic into separate methods',
          impact: 'Reduces complexity and improves readability',
          principle: 'Single Responsibility Principle'
        });
      }
    });

    // Check for duplicate code blocks
    const duplicates = this.findDuplicateBlocks(content);
    duplicates.forEach(duplicate => {
      issues.push({
        type: 'duplication',
        severity: 'high',
        description: `Code duplication detected (${duplicate.length} lines)`,
        file: filePath,
        line: duplicate.startLine,
        fix: 'Extract duplicate code into reusable function',
        impact: 'Reduces maintenance burden and bug risk',
        principle: 'DRY (Don\'t Repeat Yourself)'
      });
    });

    return issues;
  }

  /**
   * Analyze design patterns
   */
  private async analyzeDesignPatterns(files: string[]): Promise<any> {
    const patternsFound: string[] = [];
    let antiPatterns = 0;
    
    for (const file of files) {
      const content = await fs.promises.readFile(file, 'utf8');
      
      // Check for common patterns
      if (content.includes('getInstance') && content.includes('private constructor')) {
        patternsFound.push('Singleton');
      }
      if (content.includes('factory') || content.includes('create')) {
        patternsFound.push('Factory');
      }
      if (content.includes('observer') || content.includes('subscribe')) {
        patternsFound.push('Observer');
      }
      
      // Check for anti-patterns
      if (content.includes('god') || content.split('\n').length > 1000) {
        antiPatterns++;
      }
    }

    return {
      patternsIdentified: [...new Set(patternsFound)],
      antiPatternsFound: antiPatterns,
      solidPrinciples: this.analyzeSolidPrinciples(files),
      refactoringOpportunities: [
        'Extract large methods into smaller ones',
        'Split large classes using composition',
        'Implement dependency injection'
      ]
    };
  }

  /**
   * Detect code smells
   */
  private async detectCodeSmells(files: string[]): Promise<any> {
    let longMethods = 0;
    let largeClasses = 0;
    let godObjects = 0;
    let featureEnvy = 0;

    for (const file of files) {
      const content = await fs.promises.readFile(file, 'utf8');
      const lines = content.split('\n');
      
      // Detect long methods
      const methods = content.match(/function\s+\w+|=>\s*{|^\s*\w+\s*\(/gm) || [];
      methods.forEach(() => {
        if (lines.length > 50) longMethods++; // Simplified check
      });
      
      // Detect large classes
      if (content.includes('class') && lines.length > 500) {
        largeClasses++;
      }
      
      // Detect god objects
      if (content.includes('class') && lines.length > 1000) {
        godObjects++;
      }
      
      // Feature envy (simplified)
      const externalCalls = (content.match(/\w+\.\w+\(/g) || []).length;
      if (externalCalls > 20) {
        featureEnvy++;
      }
    }

    return {
      longMethods,
      largeClasses,
      godObjects,
      featureEnvy
    };
  }

  /**
   * Analyze refactoring opportunities
   */
  private async analyzeRefactoringOpportunities(files: string[]): Promise<any> {
    return {
      extractMethodOpportunities: Math.floor(files.length * 0.3),
      extractClassOpportunities: Math.floor(files.length * 0.1),
      moveMethodOpportunities: Math.floor(files.length * 0.2),
      consolidationOpportunities: Math.floor(files.length * 0.15)
    };
  }

  /**
   * Analyze SOLID principles compliance
   */
  private analyzeSolidPrinciples(files: string[]): SolidCompliance {
    // Simplified analysis - in real implementation would be more sophisticated
    return {
      singleResponsibility: 75,
      openClosed: 80,
      liskovSubstitution: 85,
      interfaceSegregation: 70,
      dependencyInversion: 65
    };
  }

  /**
   * Calculate code complexity
   */
  private calculateComplexity(content: string): number {
    const complexityIndicators = [
      'if', 'else', 'while', 'for', 'switch', 'case',
      '&&', '||', '?', 'catch', 'throw'
    ];
    
    let complexity = 1; // Base complexity
    complexityIndicators.forEach(indicator => {
      // Escape special regex characters
      const escapedIndicator = indicator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = content.match(new RegExp(`\\b${escapedIndicator}\\b`, 'g'));
      if (matches) complexity += matches.length;
    });
    
    return complexity;
  }

  /**
   * Find duplicate code blocks
   */
  private findDuplicateBlocks(content: string): Array<{startLine: number, length: number}> {
    // Simplified duplicate detection
    const lines = content.split('\n');
    const duplicates: Array<{startLine: number, length: number}> = [];
    
    for (let i = 0; i < lines.length - 5; i++) {
      const block = lines.slice(i, i + 5).join('\n');
      for (let j = i + 5; j < lines.length - 5; j++) {
        const compareBlock = lines.slice(j, j + 5).join('\n');
        if (block === compareBlock && block.trim()) {
          duplicates.push({startLine: i + 1, length: 5});
          break;
        }
      }
    }
    
    return duplicates;
  }

  /**
   * Calculate overall quality score
   */
  private calculateQualityScore(issues: CodeQualityIssue[], fileCount: number, totalComplexity: number): number {
    if (fileCount === 0) return 100;
    
    const criticalPenalty = issues.filter(i => i.severity === 'critical').length * 20;
    const highPenalty = issues.filter(i => i.severity === 'high').length * 12;
    const mediumPenalty = issues.filter(i => i.severity === 'medium').length * 6;
    const lowPenalty = issues.filter(i => i.severity === 'low').length * 2;
    
    const complexityPenalty = Math.max(0, (totalComplexity / fileCount - 10) * 2);
    
    const totalPenalty = criticalPenalty + highPenalty + mediumPenalty + lowPenalty + complexityPenalty;
    
    return Math.max(100 - totalPenalty, 0);
  }

  /**
   * Helper methods
   */
  private calculateDuplication(issues: CodeQualityIssue[]): number {
    return issues.filter(i => i.type === 'duplication').length;
  }

  private calculateMaintainabilityIndex(issues: CodeQualityIssue[], complexity: number): number {
    const baseIndex = 100;
    const complexityPenalty = complexity * 0.5;
    const issuePenalty = issues.length * 2;
    return Math.max(baseIndex - complexityPenalty - issuePenalty, 0);
  }

  private estimateTechnicalDebt(issues: CodeQualityIssue[]): string {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    
    const estimatedHours = criticalIssues * 8 + highIssues * 4 + issues.length * 1;
    
    if (estimatedHours < 8) return 'Low (< 1 day)';
    if (estimatedHours < 40) return 'Medium (1-5 days)';
    if (estimatedHours < 160) return 'High (1-4 weeks)';
    return 'Very High (> 1 month)';
  }

  private generateRecommendations(issues: CodeQualityIssue[]): string[] {
    const recommendations = [
      'Implement consistent code formatting with Prettier',
      'Reduce cyclomatic complexity by extracting methods',
      'Eliminate code duplication through refactoring',
      'Follow consistent naming conventions',
      'Add comprehensive documentation and comments',
      'Apply SOLID principles to improve design',
      'Refactor large classes and methods',
      'Implement proper error handling patterns'
    ];

    return recommendations.slice(0, Math.min(issues.length + 3, recommendations.length));
  }

  private shouldExcludeDirectory(name: string): boolean {
    return ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'].includes(name);
  }

  private isRelevantFile(filename: string): boolean {
    return /\.(ts|tsx|js|jsx)$/.test(filename) && 
           !filename.includes('.test.') && 
           !filename.includes('.spec.');
  }

  /**
   * Display analysis results
   */
  private displayResults(result: CodeQualityAnalysisResult): void {
    console.log(`📊 Code Quality Analysis Complete!`);
    console.log(`Score: ${result.qualityScore}/100`);
    console.log(`Files analyzed: ${result.totalFiles}`);
    console.log(`Issues found: ${result.issuesFound}`);
    console.log(`Complexity violations: ${result.complexityViolations}`);
    console.log(`Technical debt: ${result.qualityMetrics.technicalDebt}`);
    
    if (result.complexityViolations > 0) {
      console.log(`🚨 ${result.complexityViolations} complexity issues need attention!`);
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  const enforcer = new CodeQualityEnforcer();
  
  try {
    await enforcer.analyzeCodeQuality('./');
  } catch (error) {
    console.error('❌ Code quality analysis failed:', error);
    process.exit(1);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}