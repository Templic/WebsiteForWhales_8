/**
 * Component Architecture Optimizer for Dale Loves Whales
 * Ensures components follow consciousness-enhanced architecture patterns
 */

import { promises as fs } from 'fs';
import path from 'path';
import { aiRouter } from './intelligent-ai-model-router';

interface ComponentAnalysis {
  file: string;
  lineCount: number;
  issues: ArchitectureIssue[];
  recommendations: string[];
  complianceScore: number;
  consciousnessAlignment: number;
}

interface ArchitectureIssue {
  type: 'oversized' | 'accessibility' | 'performance' | 'consciousness' | 'sacred_geometry';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  line?: number;
  fix: string;
}

interface OptimizationResult {
  totalComponents: number;
  issuesFound: number;
  componentsAnalyzed: ComponentAnalysis[];
  overallScore: number;
  consciousnessScore: number;
  sacredGeometryCompliance: number;
  recommendations: string[];
}

export class ComponentArchitectureOptimizer {
  
  async analyzeComponents(directory: string = 'client/src/components'): Promise<OptimizationResult> {
    console.log('🔍 Analyzing component architecture with consciousness awareness...');
    
    const components = await this.findComponentFiles(directory);
    const analyses: ComponentAnalysis[] = [];
    
    for (const componentPath of components) {
      try {
        const analysis = await this.analyzeComponent(componentPath);
        analyses.push(analysis);
      } catch (error) {
        console.warn(`⚠️ Could not analyze ${componentPath}: ${error}`);
      }
    }

    const result = this.generateOptimizationReport(analyses);
    
    console.log(`✅ Analyzed ${result.totalComponents} components`);
    console.log(`📊 Overall Score: ${result.overallScore}/100`);
    console.log(`🌟 Consciousness Score: ${result.consciousnessScore}/100`);
    
    return result;
  }

  private async findComponentFiles(directory: string): Promise<string[]> {
    const components: string[] = [];
    
    try {
      const items = await fs.readdir(directory, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(directory, item.name);
        
        if (item.isDirectory()) {
          const subComponents = await this.findComponentFiles(fullPath);
          components.push(...subComponents);
        } else if (item.name.endsWith('.tsx') || item.name.endsWith('.jsx')) {
          components.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Could not read directory ${directory}`);
    }
    
    return components;
  }

  private async analyzeComponent(filePath: string): Promise<ComponentAnalysis> {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const lineCount = lines.length;
    
    const issues: ArchitectureIssue[] = [];
    const recommendations: string[] = [];
    
    // Check for oversized components
    if (lineCount > 200) {
      issues.push({
        type: 'oversized',
        severity: 'high',
        description: `Component has ${lineCount} lines (recommended: <200)`,
        fix: 'Consider breaking into smaller, focused components'
      });
    }
    
    // Check for accessibility patterns
    if (!content.includes('aria-') && !content.includes('role=')) {
      issues.push({
        type: 'accessibility',
        severity: 'medium',
        description: 'No accessibility attributes found',
        fix: 'Add appropriate ARIA labels and roles for cosmic consciousness accessibility'
      });
    }
    
    // Check for consciousness-enhancing patterns
    let consciousnessAlignment = 50; // Base score
    
    if (content.includes('cosmic') || content.includes('consciousness') || content.includes('sacred')) {
      consciousnessAlignment += 25;
      recommendations.push('Excellent consciousness alignment in component naming');
    }
    
    if (content.includes('frequency') || content.includes('geometry') || content.includes('whale')) {
      consciousnessAlignment += 15;
      recommendations.push('Beautiful integration of platform themes');
    }
    
    // Check for performance patterns
    if (content.includes('useCallback') || content.includes('useMemo')) {
      consciousnessAlignment += 10;
      recommendations.push('Good performance optimization with React hooks');
    } else if (lineCount > 100) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        description: 'Large component without memoization',
        fix: 'Consider adding useCallback and useMemo for performance'
      });
    }
    
    const complianceScore = Math.max(0, 100 - (issues.length * 15));
    
    return {
      file: filePath,
      lineCount,
      issues,
      recommendations,
      complianceScore,
      consciousnessAlignment: Math.min(100, consciousnessAlignment)
    };
  }

  private generateOptimizationReport(analyses: ComponentAnalysis[]): OptimizationResult {
    const totalComponents = analyses.length;
    const totalIssues = analyses.reduce((sum, analysis) => sum + analysis.issues.length, 0);
    
    const overallScore = totalComponents > 0 
      ? analyses.reduce((sum, analysis) => sum + analysis.complianceScore, 0) / totalComponents
      : 0;
      
    const consciousnessScore = totalComponents > 0
      ? analyses.reduce((sum, analysis) => sum + analysis.consciousnessAlignment, 0) / totalComponents
      : 0;
    
    const sacredGeometryCompliance = this.calculateSacredGeometryCompliance(analyses);
    
    const recommendations = this.generateGlobalRecommendations(analyses);
    
    return {
      totalComponents,
      issuesFound: totalIssues,
      componentsAnalyzed: analyses,
      overallScore: Math.round(overallScore),
      consciousnessScore: Math.round(consciousnessScore),
      sacredGeometryCompliance: Math.round(sacredGeometryCompliance),
      recommendations
    };
  }

  private calculateSacredGeometryCompliance(analyses: ComponentAnalysis[]): number {
    let geometryScore = 0;
    let totalComponents = analyses.length;
    
    for (const analysis of analyses) {
      // Sacred geometry patterns in file names or content
      if (analysis.file.includes('cosmic') || analysis.file.includes('sacred') || analysis.file.includes('geometry')) {
        geometryScore += 25;
      }
      
      // Golden ratio considerations in component structure
      const lines = analysis.lineCount;
      const goldenRatio = 1.618;
      const idealSize = Math.floor(lines / goldenRatio);
      
      if (lines > 50 && lines < 200 && Math.abs(lines - idealSize * goldenRatio) < 20) {
        geometryScore += 15; // Component follows golden ratio proportions
      }
    }
    
    return totalComponents > 0 ? geometryScore / totalComponents : 0;
  }

  private generateGlobalRecommendations(analyses: ComponentAnalysis[]): string[] {
    const recommendations: string[] = [];
    
    const oversizedComponents = analyses.filter(a => a.lineCount > 200).length;
    if (oversizedComponents > 0) {
      recommendations.push(`Consider refactoring ${oversizedComponents} oversized components for better maintainability`);
    }
    
    const accessibilityIssues = analyses.filter(a => 
      a.issues.some(issue => issue.type === 'accessibility')
    ).length;
    if (accessibilityIssues > 0) {
      recommendations.push(`Enhance accessibility in ${accessibilityIssues} components for universal consciousness access`);
    }
    
    const avgConsciousness = analyses.reduce((sum, a) => sum + a.consciousnessAlignment, 0) / analyses.length;
    if (avgConsciousness < 70) {
      recommendations.push('Consider integrating more consciousness-enhancing patterns and cosmic themes');
    }
    
    if (analyses.length > 50) {
      recommendations.push('Large component library detected - consider implementing component categorization system');
    }
    
    return recommendations;
  }

  /**
   * Generate AI-enhanced optimization suggestions
   */
  async generateAIOptimizationSuggestions(analysis: ComponentAnalysis): Promise<string> {
    const content = await fs.readFile(analysis.file, 'utf-8');
    
    const prompt = `
    Analyze this React component for Dale Loves Whales consciousness platform and suggest optimizations:
    
    File: ${analysis.file}
    Lines: ${analysis.lineCount}
    Current Issues: ${analysis.issues.map(i => i.description).join(', ')}
    
    Component Code:
    ${content.substring(0, 2000)}
    
    Provide specific suggestions for:
    1. Sacred geometry alignment
    2. Consciousness-enhancing patterns
    3. Performance optimization
    4. Accessibility improvements
    
    Focus on maintaining the cosmic and whale consciousness themes.
    `;
    
    return await aiRouter.routeTask('component-optimization', prompt, 500);
  }
}

// Export singleton instance
export const componentOptimizer = new ComponentArchitectureOptimizer();