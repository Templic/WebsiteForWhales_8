#!/usr/bin/env npx tsx
/**
 * Utility 1: Component Architecture Optimizer
 * Ensures components follow proper structure, separation of concerns, and performance patterns
 * Based on app documentation standards for React components
 */

import * as fs from 'fs';
import * as path from 'path';

interface ComponentAnalysis {
  file: string;
  lineCount: number;
  issues: ArchitectureIssue[];
  recommendations: string[];
  complianceScore: number;
}

interface ArchitectureIssue {
  type: 'oversized' | 'hook_misuse' | 'prop_interface' | 'state_management' | 'theme_inconsistency' | 
        'accessibility_violations' | 'component_coupling' | 'testing_coverage';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  line?: number;
  fix: string;
}

interface OptimizationResult {
  totalComponents: number;
  issuesFound: number;
  componentsToRefactor: ComponentAnalysis[];
  overallScore: number;
  bestPracticesViolations: string[];
  accessibilityCompliance: {
    score: number;
    violations: number;
    improvements: string[];
  };
  componentCoupling: {
    tightlyCoupled: number;
    recommendations: string[];
  };
  testingCoverage: {
    covered: number;
    uncovered: number;
    suggestions: string[];
  };
}

export class ComponentArchitectureOptimizer {
  private cosmicThemePatterns = [
    'cosmic-glow', 'bg-gradient-to-r', 'from-[#00ebd6]', 'to-[#a855f7]',
    'backdrop-blur', 'cosmic-fade-in', 'cosmic-scale'
  ];

  private hookPatterns = [
    'useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useContext'
  ];

  // NEW SUBTITLE 1: Accessibility Compliance Patterns
  private accessibilityPatterns = [
    'aria-label', 'aria-describedby', 'role=', 'alt=', 'tabIndex',
    'onKeyDown', 'onKeyPress', 'aria-expanded', 'aria-hidden'
  ];

  // NEW SUBTITLE 2: Component Coupling Detection
  private couplingIndicators = [
    'import.*from.*\\.\\./\\.\\./\\.\\.',  // Deep relative imports
    'props\\.[a-zA-Z]+\\.[a-zA-Z]+',      // Prop drilling
    'useContext\\(',                      // Context usage
    'forwardRef\\('                       // Ref forwarding
  ];

  // NEW SUBTITLE 3: Testing Coverage Patterns
  private testingPatterns = [
    'test\\(', 'it\\(', 'describe\\(', 'expect\\(',
    'render\\(', 'fireEvent', 'waitFor', 'screen\\.'
  ];

  /**
   * Analyze component architecture across the codebase
   */
  async analyzeComponents(directory: string = './client/src/components'): Promise<OptimizationResult> {
    console.log('🏗️ Component Architecture Optimizer');
    console.log('Analyzing React components for best practices...\n');

    const components = await this.findReactComponents(directory);
    const analyses: ComponentAnalysis[] = [];

    for (const component of components) {
      const analysis = await this.analyzeComponent(component);
      analyses.push(analysis);
    }

    const result: OptimizationResult = {
      totalComponents: components.length,
      issuesFound: analyses.reduce((sum, a) => sum + a.issues.length, 0),
      componentsToRefactor: analyses.filter(a => a.complianceScore < 0.8),
      overallScore: analyses.reduce((sum, a) => sum + a.complianceScore, 0) / analyses.length,
      bestPracticesViolations: this.identifyBestPracticesViolations(analyses)
    };

    this.displayResults(result);
    return result;
  }

  /**
   * Analyze individual component
   */
  private async analyzeComponent(filePath: string): Promise<ComponentAnalysis> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const issues: ArchitectureIssue[] = [];

    // Check component size
    if (lines.length > 300) {
      issues.push({
        type: 'oversized',
        severity: 'high',
        description: `Component is ${lines.length} lines (recommended: <300)`,
        fix: 'Break down into smaller, focused components'
      });
    }

    // Check hook usage patterns
    const hookIssues = this.analyzeHookUsage(content, lines);
    issues.push(...hookIssues);

    // Check prop interfaces
    const propIssues = this.analyzePropInterfaces(content, lines);
    issues.push(...propIssues);

    // Check state management
    const stateIssues = this.analyzeStateManagement(content, lines);
    issues.push(...stateIssues);

    // Check cosmic theme consistency
    const themeIssues = this.analyzeThemeConsistency(content, lines);
    issues.push(...themeIssues);

    const complianceScore = this.calculateComplianceScore(issues, lines.length);
    const recommendations = this.generateRecommendations(issues);

    return {
      file: filePath,
      lineCount: lines.length,
      issues,
      recommendations,
      complianceScore
    };
  }

  /**
   * Analyze hook usage patterns
   */
  private analyzeHookUsage(content: string, lines: string[]): ArchitectureIssue[] {
    const issues: ArchitectureIssue[] = [];

    // Check for useState without proper destructuring
    lines.forEach((line, index) => {
      if (line.includes('useState') && !line.includes('[') && !line.includes('=')) {
        issues.push({
          type: 'hook_misuse',
          severity: 'medium',
          description: 'useState should use array destructuring',
          line: index + 1,
          fix: 'Use const [state, setState] = useState(initialValue)'
        });
      }

      // Check for missing useCallback on event handlers
      if (line.includes('onClick') && !content.includes('useCallback')) {
        issues.push({
          type: 'hook_misuse',
          severity: 'medium',
          description: 'Event handlers should be wrapped in useCallback',
          line: index + 1,
          fix: 'Wrap event handlers with useCallback for performance'
        });
      }
    });

    // Check for missing useMemo on expensive calculations
    if (content.includes('filter(') || content.includes('map(') || content.includes('reduce(')) {
      if (!content.includes('useMemo')) {
        issues.push({
          type: 'hook_misuse',
          severity: 'medium',
          description: 'Expensive calculations should use useMemo',
          fix: 'Wrap expensive calculations with useMemo'
        });
      }
    }

    return issues;
  }

  /**
   * Analyze prop interfaces
   */
  private analyzePropInterfaces(content: string, lines: string[]): ArchitectureIssue[] {
    const issues: ArchitectureIssue[] = [];

    // Check for missing prop interfaces
    if (content.includes('export default function') || content.includes('const ')) {
      if (!content.includes('interface') && !content.includes('type ')) {
        issues.push({
          type: 'prop_interface',
          severity: 'high',
          description: 'Component missing TypeScript prop interface',
          fix: 'Define proper TypeScript interface for component props'
        });
      }
    }

    // Check for any type usage
    lines.forEach((line, index) => {
      if (line.includes(': any') || line.includes('<any>')) {
        issues.push({
          type: 'prop_interface',
          severity: 'high',
          description: 'Using "any" type instead of specific types',
          line: index + 1,
          fix: 'Replace "any" with specific TypeScript types'
        });
      }
    });

    return issues;
  }

  /**
   * Analyze state management patterns
   */
  private analyzeStateManagement(content: string, lines: string[]): ArchitectureIssue[] {
    const issues: ArchitectureIssue[] = [];

    // Count useState calls
    const useStateCount = (content.match(/useState/g) || []).length;
    if (useStateCount > 5) {
      issues.push({
        type: 'state_management',
        severity: 'medium',
        description: `Component has ${useStateCount} state variables (recommended: <5)`,
        fix: 'Consider using useReducer or extracting to custom hooks'
      });
    }

    // Check for state mutations
    lines.forEach((line, index) => {
      if (line.includes('.push(') || line.includes('.pop(') || line.includes('.splice(')) {
        issues.push({
          type: 'state_management',
          severity: 'high',
          description: 'Direct state mutation detected',
          line: index + 1,
          fix: 'Use immutable state updates with spread operator'
        });
      }
    });

    return issues;
  }

  /**
   * Analyze cosmic theme consistency
   */
  private analyzeThemeConsistency(content: string, lines: string[]): ArchitectureIssue[] {
    const issues: ArchitectureIssue[] = [];

    // Check for hardcoded colors instead of cosmic theme
    lines.forEach((line, index) => {
      if (line.includes('#') && !line.includes('#00ebd6') && !line.includes('#a855f7')) {
        if (line.includes('bg-') || line.includes('text-') || line.includes('border-')) {
          issues.push({
            type: 'theme_inconsistency',
            severity: 'medium',
            description: 'Using hardcoded colors instead of cosmic theme',
            line: index + 1,
            fix: 'Use cosmic theme colors: #00ebd6 (cyan) and #a855f7 (purple)'
          });
        }
      }
    });

    // Check for missing cosmic animation classes
    if (content.includes('transition') && !this.cosmicThemePatterns.some(pattern => content.includes(pattern))) {
      issues.push({
        type: 'theme_inconsistency',
        severity: 'low',
        description: 'Missing cosmic animation classes',
        fix: 'Add cosmic-glow, cosmic-fade-in, or cosmic-scale classes'
      });
    }

    return issues;
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(issues: ArchitectureIssue[], lineCount: number): number {
    let score = 1.0;

    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': score -= 0.3; break;
        case 'high': score -= 0.2; break;
        case 'medium': score -= 0.1; break;
        case 'low': score -= 0.05; break;
      }
    });

    // Bonus for well-structured components
    if (lineCount < 200) score += 0.1;
    if (lineCount < 100) score += 0.1;

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(issues: ArchitectureIssue[]): string[] {
    const recommendations: string[] = [];
    const issueTypes = new Set(issues.map(i => i.type));

    if (issueTypes.has('oversized')) {
      recommendations.push('Break down large components into smaller, focused ones');
    }

    if (issueTypes.has('hook_misuse')) {
      recommendations.push('Optimize hook usage with useCallback and useMemo');
    }

    if (issueTypes.has('prop_interface')) {
      recommendations.push('Add proper TypeScript interfaces for all props');
    }

    if (issueTypes.has('state_management')) {
      recommendations.push('Simplify state management with custom hooks or useReducer');
    }

    if (issueTypes.has('theme_inconsistency')) {
      recommendations.push('Ensure consistent use of cosmic theme throughout');
    }

    return recommendations;
  }

  /**
   * Identify best practices violations
   */
  private identifyBestPracticesViolations(analyses: ComponentAnalysis[]): string[] {
    const violations: string[] = [];

    const oversizedComponents = analyses.filter(a => a.lineCount > 300).length;
    if (oversizedComponents > 0) {
      violations.push(`${oversizedComponents} components exceed 300 lines`);
    }

    const highSeverityIssues = analyses.reduce((sum, a) => 
      sum + a.issues.filter(i => i.severity === 'critical' || i.severity === 'high').length, 0
    );
    if (highSeverityIssues > 0) {
      violations.push(`${highSeverityIssues} high/critical severity issues found`);
    }

    const lowComplianceComponents = analyses.filter(a => a.complianceScore < 0.6).length;
    if (lowComplianceComponents > 0) {
      violations.push(`${lowComplianceComponents} components have low compliance scores`);
    }

    return violations;
  }

  /**
   * Find React components
   */
  private async findReactComponents(directory: string): Promise<string[]> {
    const components: string[] = [];

    const walk = async (dir: string) => {
      try {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
            await walk(fullPath);
          } else if (entry.isFile() && this.isReactComponent(entry.name)) {
            components.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not read directory ${dir}`);
      }
    };

    await walk(directory);
    return components;
  }

  /**
   * Display results
   */
  private displayResults(result: OptimizationResult): void {
    console.log('📊 Component Architecture Analysis Results');
    console.log('=' .repeat(50));
    console.log(`   Total Components: ${result.totalComponents}`);
    console.log(`   Issues Found: ${result.issuesFound}`);
    console.log(`   Components Needing Refactor: ${result.componentsToRefactor.length}`);
    console.log(`   Overall Compliance Score: ${(result.overallScore * 100).toFixed(1)}%`);

    if (result.bestPracticesViolations.length > 0) {
      console.log('\n🚨 Best Practices Violations:');
      result.bestPracticesViolations.forEach((violation, i) => {
        console.log(`   ${i + 1}. ${violation}`);
      });
    }

    if (result.componentsToRefactor.length > 0) {
      console.log('\n🔧 Components Needing Attention:');
      result.componentsToRefactor.slice(0, 5).forEach((comp, i) => {
        const filename = path.basename(comp.file);
        console.log(`   ${i + 1}. ${filename} (${comp.lineCount} lines, ${comp.issues.length} issues)`);
        console.log(`      Score: ${(comp.complianceScore * 100).toFixed(1)}%`);
        
        if (comp.recommendations.length > 0) {
          console.log(`      💡 ${comp.recommendations[0]}`);
        }
      });
    }

    console.log('\n🎯 Architecture Optimization Summary:');
    if (result.overallScore > 0.8) {
      console.log('   ✅ Excellent component architecture!');
    } else if (result.overallScore > 0.6) {
      console.log('   👍 Good architecture with room for improvement');
    } else {
      console.log('   🚨 Significant architecture improvements needed');
    }
  }

  /**
   * Utility methods
   */
  private shouldSkipDirectory(name: string): boolean {
    return ['node_modules', 'dist', 'build', '.git'].includes(name);
  }

  private isReactComponent(filename: string): boolean {
    return /\.(tsx|jsx)$/.test(filename) && !filename.endsWith('.test.tsx');
  }
}

/**
 * Main execution
 */
async function main() {
  const optimizer = new ComponentArchitectureOptimizer();
  
  try {
    await optimizer.analyzeComponents('./client/src/components');
    console.log('\n🎉 Component Architecture Optimization Complete!');
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
export default ComponentArchitectureOptimizer;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}