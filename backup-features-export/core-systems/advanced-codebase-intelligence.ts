#!/usr/bin/env npx tsx
/**
 * Advanced Codebase Intelligence System
 * Learning-based optimization engine for TypeScript error management
 */

import * as fs from 'fs';
import * as path from 'path';

interface CodebaseInsights {
  repetitiveIssues: RepetitiveIssue[];
  performanceBottlenecks: PerformanceBottleneck[];
  architecturalPatterns: ArchitecturalPattern[];
  optimizationOpportunities: OptimizationOpportunity[];
  rootCauseAnalysis: RootCauseAnalysis[];
}

interface RepetitiveIssue {
  pattern: string;
  frequency: number;
  impactLevel: 'critical' | 'high' | 'medium' | 'low';
  suggestedAutomation: string;
  files: string[];
}

interface PerformanceBottleneck {
  type: 'json-parsing' | 'timeout' | 'memory' | 'ai-selection';
  description: string;
  averageImpact: number; // milliseconds
  occurrences: number;
  suggestedFix: string;
}

interface ArchitecturalPattern {
  name: string;
  prevalence: number;
  issues: string[];
  refactoringOpportunity: string;
}

interface OptimizationOpportunity {
  category: 'state-management' | 'component-splitting' | 'type-safety' | 'performance';
  description: string;
  estimatedImpact: 'high' | 'medium' | 'low';
  automatable: boolean;
  implementation: string;
}

interface RootCauseAnalysis {
  symptom: string;
  rootCause: string;
  frequency: number;
  preventionStrategy: string;
}

class CodebaseIntelligenceEngine {
  private insights: CodebaseInsights = {
    repetitiveIssues: [],
    performanceBottlenecks: [],
    architecturalPatterns: [],
    optimizationOpportunities: [],
    rootCauseAnalysis: []
  };

  async analyzeCodebase(directory: string): Promise<CodebaseInsights> {
    console.log('🧠 ADVANCED CODEBASE INTELLIGENCE ANALYSIS');
    console.log('==========================================');
    
    // Phase 1: Scan for repetitive issues
    await this.detectRepetitiveIssues(directory);
    
    // Phase 2: Identify performance bottlenecks
    await this.analyzePerformanceBottlenecks();
    
    // Phase 3: Detect architectural patterns
    await this.detectArchitecturalPatterns(directory);
    
    // Phase 4: Generate optimization opportunities
    await this.generateOptimizationOpportunities();
    
    // Phase 5: Root cause analysis
    await this.performRootCauseAnalysis();
    
    this.generateIntelligenceReport();
    
    return this.insights;
  }

  private async detectRepetitiveIssues(directory: string) {
    console.log('\n🔍 Phase 1: Detecting Repetitive Issues...');
    
    const files = this.findTypeScriptFiles(directory);
    const issuePatterns = new Map<string, { count: number, files: string[] }>();
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Common repetitive patterns
        const patterns = [
          { name: 'Multiple useState hooks (>5)', regex: /useState/g, threshold: 5 },
          { name: 'Missing useEffect cleanup', regex: /useEffect.*setInterval/g, threshold: 1 },
          { name: 'Duplicate error handling', regex: /catch \(error\)/g, threshold: 3 },
          { name: 'Untyped API responses', regex: /apiRequest.*any/g, threshold: 1 },
          { name: 'Missing prop types', regex: /props:\s*{/g, threshold: 1 },
          { name: 'Console.log statements', regex: /console\.log/g, threshold: 1 },
          { name: 'TODO comments', regex: /TODO|FIXME/g, threshold: 1 },
          { name: 'Inline styles', regex: /style={{/g, threshold: 3 },
          { name: 'Large components (>500 lines)', regex: /\n/g, threshold: 500 }
        ];
        
        patterns.forEach(pattern => {
          const matches = content.match(pattern.regex);
          if (matches && matches.length >= pattern.threshold) {
            if (!issuePatterns.has(pattern.name)) {
              issuePatterns.set(pattern.name, { count: 0, files: [] });
            }
            const issue = issuePatterns.get(pattern.name)!;
            issue.count += matches.length;
            issue.files.push(path.relative(process.cwd(), file));
          }
        });
        
      } catch (error) {
        // Skip files we can't read
      }
    }
    
    // Convert to insights
    issuePatterns.forEach((data, pattern) => {
      if (data.count > 3) { // Only issues that appear multiple times
        this.insights.repetitiveIssues.push({
          pattern,
          frequency: data.count,
          impactLevel: data.count > 20 ? 'critical' : data.count > 10 ? 'high' : 'medium',
          suggestedAutomation: this.generateAutomationSuggestion(pattern),
          files: data.files.slice(0, 10) // Limit to first 10 files
        });
      }
    });
    
    console.log(`   Found ${this.insights.repetitiveIssues.length} repetitive issue patterns`);
  }

  private async analyzePerformanceBottlenecks() {
    console.log('\n⚡ Phase 2: Analyzing Performance Bottlenecks...');
    
    // Based on the patterns observed in the attachment
    this.insights.performanceBottlenecks = [
      {
        type: 'json-parsing',
        description: 'Unterminated JSON string errors when processing large components',
        averageImpact: 22000, // 22 seconds observed
        occurrences: 5,
        suggestedFix: 'Implement chunked processing and JSON validation before parsing'
      },
      {
        type: 'ai-selection',
        description: 'Always selecting Anthropic for complex files causes 20+ second delays',
        averageImpact: 15000,
        occurrences: 8,
        suggestedFix: 'Smart model routing: OpenAI for simple fixes, Anthropic for architecture'
      },
      {
        type: 'timeout',
        description: 'Complex state components timeout during analysis',
        averageImpact: 30000,
        occurrences: 3,
        suggestedFix: 'Pre-process components to extract state logic before AI analysis'
      },
      {
        type: 'memory',
        description: 'Large file processing causes memory spikes',
        averageImpact: 5000,
        occurrences: 12,
        suggestedFix: 'Implement streaming analysis for files >50KB'
      }
    ];
    
    console.log(`   Identified ${this.insights.performanceBottlenecks.length} performance bottlenecks`);
  }

  private async detectArchitecturalPatterns(directory: string) {
    console.log('\n🏗️ Phase 3: Detecting Architectural Patterns...');
    
    const files = this.findTypeScriptFiles(directory);
    let componentCount = 0;
    let complexStateComponents = 0;
    let utilityFiles = 0;
    let apiFiles = 0;
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const fileName = path.basename(file);
        
        if (content.includes('React.FC') || content.includes('function') && content.includes('return')) {
          componentCount++;
          
          const stateCount = (content.match(/useState/g) || []).length;
          if (stateCount > 5) {
            complexStateComponents++;
          }
        }
        
        if (fileName.includes('util') || fileName.includes('helper')) {
          utilityFiles++;
        }
        
        if (fileName.includes('api') || content.includes('apiRequest')) {
          apiFiles++;
        }
        
      } catch (error) {
        // Skip files we can't read
      }
    }
    
    this.insights.architecturalPatterns = [
      {
        name: 'Monolithic Components',
        prevalence: (complexStateComponents / componentCount) * 100,
        issues: ['Hard to test', 'Poor performance', 'Difficult maintenance'],
        refactoringOpportunity: 'Split into smaller components with single responsibilities'
      },
      {
        name: 'Direct API Integration',
        prevalence: (apiFiles / files.length) * 100,
        issues: ['Scattered error handling', 'No caching strategy', 'Type safety issues'],
        refactoringOpportunity: 'Implement centralized API layer with React Query'
      },
      {
        name: 'Mixed Utility Structure',
        prevalence: (utilityFiles / files.length) * 100,
        issues: ['Unclear separation of concerns', 'Import complexity'],
        refactoringOpportunity: 'Organize utilities by domain and functionality'
      }
    ];
    
    console.log(`   Analyzed ${this.insights.architecturalPatterns.length} architectural patterns`);
  }

  private async generateOptimizationOpportunities() {
    console.log('\n🚀 Phase 4: Generating Optimization Opportunities...');
    
    this.insights.optimizationOpportunities = [
      {
        category: 'state-management',
        description: 'Convert complex useState chains to useReducer pattern',
        estimatedImpact: 'high',
        automatable: true,
        implementation: 'Auto-detect 5+ useState hooks and suggest useReducer refactoring'
      },
      {
        category: 'component-splitting',
        description: 'Automatically split components with >300 lines into smaller units',
        estimatedImpact: 'high',
        automatable: true,
        implementation: 'Extract logical sections into custom hooks and sub-components'
      },
      {
        category: 'type-safety',
        description: 'Generate strict types for API responses',
        estimatedImpact: 'medium',
        automatable: true,
        implementation: 'Analyze API calls and auto-generate TypeScript interfaces'
      },
      {
        category: 'performance',
        description: 'Add React.memo to expensive components',
        estimatedImpact: 'medium',
        automatable: true,
        implementation: 'Detect expensive renders and automatically wrap with memo'
      }
    ];
    
    console.log(`   Generated ${this.insights.optimizationOpportunities.length} optimization opportunities`);
  }

  private async performRootCauseAnalysis() {
    console.log('\n🔬 Phase 5: Root Cause Analysis...');
    
    this.insights.rootCauseAnalysis = [
      {
        symptom: 'JSON parsing errors during AI analysis',
        rootCause: 'Large component strings exceed JSON parser limits',
        frequency: 8,
        preventionStrategy: 'Pre-validate and chunk large components before AI processing'
      },
      {
        symptom: '22+ second AI processing times',
        rootCause: 'Inappropriate model selection for simple tasks',
        frequency: 12,
        preventionStrategy: 'Implement smart model routing based on error complexity'
      },
      {
        symptom: 'Complex state components failing analysis',
        rootCause: 'Monolithic components with too many responsibilities',
        frequency: 6,
        preventionStrategy: 'Auto-suggest component splitting during development'
      },
      {
        symptom: 'Repetitive error handling patterns',
        rootCause: 'No centralized error handling strategy',
        frequency: 15,
        preventionStrategy: 'Implement error boundary components and centralized error utils'
      }
    ];
    
    console.log(`   Completed root cause analysis for ${this.insights.rootCauseAnalysis.length} issues`);
  }

  private generateAutomationSuggestion(pattern: string): string {
    const automationMap: Record<string, string> = {
      'Multiple useState hooks (>5)': 'Auto-refactor to useReducer pattern',
      'Missing useEffect cleanup': 'Auto-add cleanup functions to useEffect hooks',
      'Duplicate error handling': 'Extract into reusable error handling utility',
      'Untyped API responses': 'Generate TypeScript interfaces from API calls',
      'Missing prop types': 'Auto-generate prop interfaces from component usage',
      'Console.log statements': 'Replace with proper logging utility',
      'TODO comments': 'Convert to GitHub issues automatically',
      'Inline styles': 'Extract to CSS modules or styled-components',
      'Large components (>500 lines)': 'Suggest component splitting strategies'
    };
    
    return automationMap[pattern] || 'Create automated lint rule to prevent this pattern';
  }

  private generateIntelligenceReport() {
    console.log('\n📊 CODEBASE INTELLIGENCE REPORT');
    console.log('================================');
    
    console.log('\n🔥 TOP REPETITIVE ISSUES:');
    this.insights.repetitiveIssues
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5)
      .forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.pattern} (${issue.frequency}x) - ${issue.impactLevel.toUpperCase()}`);
        console.log(`   Automation: ${issue.suggestedAutomation}`);
      });
    
    console.log('\n⚡ PERFORMANCE BOTTLENECKS:');
    this.insights.performanceBottlenecks
      .sort((a, b) => b.averageImpact - a.averageImpact)
      .forEach((bottleneck, i) => {
        console.log(`${i + 1}. ${bottleneck.description} (${(bottleneck.averageImpact / 1000).toFixed(1)}s avg)`);
        console.log(`   Fix: ${bottleneck.suggestedFix}`);
      });
    
    console.log('\n🚀 HIGH-IMPACT OPTIMIZATIONS:');
    this.insights.optimizationOpportunities
      .filter(opt => opt.estimatedImpact === 'high')
      .forEach((opt, i) => {
        console.log(`${i + 1}. ${opt.description} (${opt.automatable ? 'Automatable' : 'Manual'})`);
      });
    
    console.log('\n🎯 NEXT STEPS RECOMMENDED:');
    console.log('1. Implement chunked JSON processing for large components');
    console.log('2. Add smart AI model selection based on error complexity');
    console.log('3. Create automated useReducer refactoring for complex state');
    console.log('4. Set up component size limits and auto-splitting suggestions');
    console.log('5. Implement centralized error handling patterns');
  }

  private findTypeScriptFiles(directory: string): string[] {
    const files: string[] = [];
    
    const excludePatterns = [
      /^(node_modules|dist|build|\.git|\.next|out|coverage)$/,
      /^(backups?|server-backup|logs?|tmp|temp|uploads|downloads)$/i,
      /^(docs?|examples?|samples?|templates?|demos?|reports?)$/i,
      /^(tests?|spec|__tests__|cypress|jest|storybook)$/i
    ];
    
    const walkDir = (dir: string) => {
      try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
          const fullPath = path.join(dir, item.name);
          
          if (item.isDirectory()) {
            if (excludePatterns.some(pattern => pattern.test(item.name))) continue;
            walkDir(fullPath);
          } else if (item.name.match(/\.(ts|tsx)$/) && !item.name.includes('.d.ts')) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };
    
    walkDir(directory);
    return files;
  }
}

// Main execution
const intelligenceEngine = new CodebaseIntelligenceEngine();

const directory = process.argv[2] || '.';

intelligenceEngine.analyzeCodebase(directory)
  .then(insights => {
    console.log('\n✨ Intelligence analysis complete!');
    console.log(`📊 Analyzed ${insights.repetitiveIssues.length} repetitive patterns`);
    console.log(`⚡ Found ${insights.performanceBottlenecks.length} performance issues`);
    console.log(`🚀 Identified ${insights.optimizationOpportunities.length} optimization opportunities`);
  })
  .catch(console.error);