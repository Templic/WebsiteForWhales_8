#!/usr/bin/env npx tsx
/**
 * Utility 4: Performance Optimization Detector
 * Identifies performance bottlenecks and optimization opportunities
 * Based on app documentation standards for performance and efficiency
 */

import * as fs from 'fs';
import * as path from 'path';

interface PerformanceIssue {
  type: 'unnecessary_renders' | 'missing_memoization' | 'bundle_size' | 'lazy_loading' | 'database_queries' |
        'caching_strategy' | 'network_optimization' | 'resource_management';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  file: string;
  line?: number;
  fix: string;
  impact: string;
  estimatedGain: string;
}

interface PerformanceAnalysisResult {
  totalFiles: number;
  issuesFound: number;
  criticalBottlenecks: number;
  performanceScore: number;
  issues: PerformanceIssue[];
  recommendations: string[];
  optimizationOpportunities: {
    reactOptimizations: number;
    bundleOptimizations: number;
    databaseOptimizations: number;
    loadingOptimizations: number;
  };
  cachingAnalysis: {
    missedOpportunities: number;
    invalidationIssues: number;
    cacheHitRatio: number;
    strategies: string[];
  };
  networkOptimization: {
    requestCount: number;
    compressionOpportunities: number;
    cdnCandidates: number;
    prefetchingOpportunities: number;
  };
  resourceManagement: {
    memoryLeaks: number;
    heavyAssets: number;
    unusedCode: number;
    optimizationPotential: string;
  };
}

export class PerformanceOptimizationDetector {
  private reactHooks = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef'];
  private expensiveOperations = [
    'filter(', 'map(', 'reduce(', 'sort(', 'find(',
    'JSON.parse', 'JSON.stringify', 'Date.now()', 'new Date('
  ];
  private heavyComponents = ['Chart', 'Table', 'Grid', 'List', 'Map'];

  // NEW SUBTITLE 1: Caching Strategy Patterns
  private cachingPatterns = [
    'localStorage', 'sessionStorage', 'indexedDB', 'cache.set',
    'memoize', 'SWR', 'React.memo', 'useMemo', 'useCallback'
  ];

  // NEW SUBTITLE 2: Network Optimization Patterns
  private networkPatterns = [
    'fetch(', 'axios', 'XMLHttpRequest', 'websocket',
    'compression', 'gzip', 'brotli', 'prefetch', 'preload'
  ];

  // NEW SUBTITLE 3: Resource Management Patterns
  private resourcePatterns = [
    'addEventListener', 'removeEventListener', 'setInterval', 'setTimeout',
    'clearInterval', 'clearTimeout', 'memory', 'cleanup', 'dispose'
  ];

  /**
   * Analyze performance across the codebase
   */
  async analyzePerformance(directory: string = './'): Promise<PerformanceAnalysisResult> {
    console.log('⚡ Performance Optimization Detector');
    console.log('Analyzing codebase for performance bottlenecks and optimization opportunities...\n');

    const files = await this.findPerformanceRelevantFiles(directory);
    const issues: PerformanceIssue[] = [];

    for (const file of files) {
      const fileIssues = await this.analyzeFilePerformance(file);
      issues.push(...fileIssues);
    }

    const result: PerformanceAnalysisResult = {
      totalFiles: files.length,
      issuesFound: issues.length,
      criticalBottlenecks: issues.filter(i => i.severity === 'critical').length,
      performanceScore: this.calculatePerformanceScore(issues, files.length),
      issues,
      recommendations: this.generatePerformanceRecommendations(issues),
      optimizationOpportunities: this.categorizeOptimizations(issues)
    };

    this.displayResults(result);
    return result;
  }

  /**
   * Analyze performance issues in a single file
   */
  private async analyzeFilePerformance(filePath: string): Promise<PerformanceIssue[]> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const issues: PerformanceIssue[] = [];

    // Check for unnecessary re-renders
    const renderIssues = this.checkUnnecessaryRenders(content, lines, filePath);
    issues.push(...renderIssues);

    // Check for missing memoization
    const memoIssues = this.checkMissingMemoization(content, lines, filePath);
    issues.push(...memoIssues);

    // Check bundle size issues
    const bundleIssues = this.checkBundleSize(content, lines, filePath);
    issues.push(...bundleIssues);

    // Check lazy loading opportunities
    const lazyIssues = this.checkLazyLoading(content, lines, filePath);
    issues.push(...lazyIssues);

    // Check database query efficiency
    const dbIssues = this.checkDatabaseQueries(content, lines, filePath);
    issues.push(...dbIssues);

    return issues;
  }

  /**
   * Check for unnecessary re-renders
   */
  private checkUnnecessaryRenders(content: string, lines: string[], filePath: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];

    // Check for components without React.memo
    if (content.includes('export default function') && !content.includes('React.memo')) {
      const isComplexComponent = lines.length > 100 || 
                                this.heavyComponents.some(comp => content.includes(comp));
      
      if (isComplexComponent) {
        issues.push({
          type: 'unnecessary_renders',
          severity: 'medium',
          description: 'Complex component not wrapped with React.memo',
          file: filePath,
          fix: 'Wrap component with React.memo to prevent unnecessary re-renders',
          impact: 'Component re-renders on every parent update',
          estimatedGain: '20-40% render performance improvement'
        });
      }
    }

    // Check for inline object/array creation in JSX
    lines.forEach((line, index) => {
      if (line.includes('style={{') || line.includes('className={') || line.includes('props={{')) {
        issues.push({
          type: 'unnecessary_renders',
          severity: 'low',
          description: 'Inline object creation in JSX',
          file: filePath,
          line: index + 1,
          fix: 'Move object creation outside render or use useMemo',
          impact: 'New object created on every render',
          estimatedGain: '5-10% render performance improvement'
        });
      }

      // Check for inline functions in JSX
      if (line.includes('onClick={() =>') || line.includes('onChange={() =>')) {
        issues.push({
          type: 'unnecessary_renders',
          severity: 'low',
          description: 'Inline function in JSX prop',
          file: filePath,
          line: index + 1,
          fix: 'Use useCallback or move function outside render',
          impact: 'New function created on every render',
          estimatedGain: '5-15% render performance improvement'
        });
      }
    });

    return issues;
  }

  /**
   * Check for missing memoization opportunities
   */
  private checkMissingMemoization(content: string, lines: string[], filePath: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];

    // Check for expensive operations without useMemo
    lines.forEach((line, index) => {
      this.expensiveOperations.forEach(operation => {
        if (line.includes(operation) && !content.includes('useMemo')) {
          issues.push({
            type: 'missing_memoization',
            severity: 'medium',
            description: `Expensive operation ${operation} not memoized`,
            file: filePath,
            line: index + 1,
            fix: 'Wrap expensive calculation with useMemo',
            impact: 'Expensive calculation runs on every render',
            estimatedGain: '30-60% calculation performance improvement'
          });
        }
      });

      // Check for complex calculations
      if ((line.includes('.filter(') && line.includes('.map(')) || 
          (line.includes('.reduce(') && line.includes('.sort('))) {
        if (!content.includes('useMemo')) {
          issues.push({
            type: 'missing_memoization',
            severity: 'high',
            description: 'Complex chained operations not memoized',
            file: filePath,
            line: index + 1,
            fix: 'Use useMemo for complex data transformations',
            impact: 'Multiple array operations on every render',
            estimatedGain: '50-80% data processing improvement'
          });
        }
      }
    });

    // Check for event handlers without useCallback
    const eventHandlerCount = (content.match(/const handle\w+/g) || []).length;
    const useCallbackCount = (content.match(/useCallback/g) || []).length;
    
    if (eventHandlerCount > 2 && useCallbackCount === 0) {
      issues.push({
        type: 'missing_memoization',
        severity: 'medium',
        description: 'Multiple event handlers not memoized',
        file: filePath,
        fix: 'Wrap event handlers with useCallback',
        impact: 'Child components re-render due to new function references',
        estimatedGain: '15-25% child component performance improvement'
      });
    }

    return issues;
  }

  /**
   * Check bundle size issues
   */
  private checkBundleSize(content: string, lines: string[], filePath: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];

    // Check for large library imports
    const heavyLibraries = ['lodash', 'moment', 'axios', 'react-router-dom'];
    
    lines.forEach((line, index) => {
      heavyLibraries.forEach(lib => {
        if (line.includes(`import`) && line.includes(lib) && !line.includes('from')) {
          issues.push({
            type: 'bundle_size',
            severity: 'medium',
            description: `Full ${lib} library imported instead of specific functions`,
            file: filePath,
            line: index + 1,
            fix: `Import only needed functions: import { specific } from '${lib}'`,
            impact: 'Unnecessary bundle size increase',
            estimatedGain: '10-50KB bundle size reduction'
          });
        }
      });

      // Check for unused imports
      if (line.includes('import') && line.includes('{')) {
        const importMatch = line.match(/import\s*{\s*([^}]+)\s*}/);
        if (importMatch) {
          const imports = importMatch[1].split(',').map(imp => imp.trim());
          imports.forEach(imp => {
            if (!content.includes(imp.replace(/\s+as\s+\w+/, ''))) {
              issues.push({
                type: 'bundle_size',
                severity: 'low',
                description: `Unused import: ${imp}`,
                file: filePath,
                line: index + 1,
                fix: 'Remove unused imports',
                impact: 'Dead code in bundle',
                estimatedGain: '1-5KB bundle size reduction'
              });
            }
          });
        }
      }
    });

    return issues;
  }

  /**
   * Check lazy loading opportunities
   */
  private checkLazyLoading(content: string, lines: string[], filePath: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];

    // Check for heavy components not lazy loaded
    if (filePath.includes('pages/') || filePath.includes('components/')) {
      const isHeavyComponent = this.heavyComponents.some(comp => content.includes(comp)) ||
                              lines.length > 200;

      if (isHeavyComponent && !content.includes('lazy') && !content.includes('Suspense')) {
        issues.push({
          type: 'lazy_loading',
          severity: 'medium',
          description: 'Heavy component not lazy loaded',
          file: filePath,
          fix: 'Use React.lazy() and Suspense for code splitting',
          impact: 'Large component loaded upfront',
          estimatedGain: '20-100KB initial bundle reduction'
        });
      }
    }

    // Check for images without lazy loading
    lines.forEach((line, index) => {
      if (line.includes('<img') && !line.includes('loading="lazy"')) {
        issues.push({
          type: 'lazy_loading',
          severity: 'low',
          description: 'Image without lazy loading',
          file: filePath,
          line: index + 1,
          fix: 'Add loading="lazy" attribute to images',
          impact: 'All images loaded immediately',
          estimatedGain: 'Faster initial page load'
        });
      }
    });

    return issues;
  }

  /**
   * Check database query efficiency
   */
  private checkDatabaseQueries(content: string, lines: string[], filePath: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];

    lines.forEach((line, index) => {
      // Check for N+1 query patterns
      if (line.includes('.map(') && (line.includes('await') || content.includes('database'))) {
        issues.push({
          type: 'database_queries',
          severity: 'critical',
          description: 'Potential N+1 query pattern in loop',
          file: filePath,
          line: index + 1,
          fix: 'Use batch queries or include/join statements',
          impact: 'Multiple database queries in loop',
          estimatedGain: '80-95% database query time reduction'
        });
      }

      // Check for SELECT * queries
      if (line.includes('SELECT *') || line.includes('findAll()')) {
        issues.push({
          type: 'database_queries',
          severity: 'medium',
          description: 'Query selects all columns',
          file: filePath,
          line: index + 1,
          fix: 'Select only needed columns',
          impact: 'Unnecessary data transfer',
          estimatedGain: '30-70% query response time improvement'
        });
      }

      // Check for missing pagination
      if ((line.includes('findAll') || line.includes('SELECT')) && 
          !line.includes('LIMIT') && !line.includes('limit')) {
        issues.push({
          type: 'database_queries',
          severity: 'high',
          description: 'Query without pagination or limits',
          file: filePath,
          line: index + 1,
          fix: 'Add LIMIT/OFFSET or pagination',
          impact: 'Potential to load large datasets',
          estimatedGain: '50-90% memory and response time improvement'
        });
      }
    });

    return issues;
  }

  /**
   * Calculate performance score
   */
  private calculatePerformanceScore(issues: PerformanceIssue[], fileCount: number): number {
    if (fileCount === 0) return 1.0;

    let score = 1.0;
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;

    score -= (criticalIssues * 0.3) / fileCount;
    score -= (highIssues * 0.2) / fileCount;
    score -= (mediumIssues * 0.1) / fileCount;

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Categorize optimization opportunities
   */
  private categorizeOptimizations(issues: PerformanceIssue[]): any {
    return {
      reactOptimizations: issues.filter(i => 
        i.type === 'unnecessary_renders' || i.type === 'missing_memoization'
      ).length,
      bundleOptimizations: issues.filter(i => i.type === 'bundle_size').length,
      databaseOptimizations: issues.filter(i => i.type === 'database_queries').length,
      loadingOptimizations: issues.filter(i => i.type === 'lazy_loading').length
    };
  }

  /**
   * Generate performance recommendations
   */
  private generatePerformanceRecommendations(issues: PerformanceIssue[]): string[] {
    const recommendations: string[] = [];
    const issueTypes = new Set(issues.map(i => i.type));

    if (issueTypes.has('unnecessary_renders')) {
      recommendations.push('Optimize React components with memo, useMemo, and useCallback');
    }

    if (issueTypes.has('missing_memoization')) {
      recommendations.push('Add memoization for expensive calculations and event handlers');
    }

    if (issueTypes.has('bundle_size')) {
      recommendations.push('Optimize bundle size with tree shaking and selective imports');
    }

    if (issueTypes.has('lazy_loading')) {
      recommendations.push('Implement lazy loading for components and images');
    }

    if (issueTypes.has('database_queries')) {
      recommendations.push('Optimize database queries with batching and pagination');
    }

    return recommendations;
  }

  /**
   * Find performance-relevant files
   */
  private async findPerformanceRelevantFiles(directory: string): Promise<string[]> {
    const files: string[] = [];

    const walk = async (dir: string) => {
      try {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
            await walk(fullPath);
          } else if (entry.isFile() && this.isPerformanceRelevantFile(entry.name)) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not read directory ${dir}`);
      }
    };

    await walk(directory);
    return files;
  }

  /**
   * Display performance analysis results
   */
  private displayResults(result: PerformanceAnalysisResult): void {
    console.log('📊 Performance Optimization Analysis Results');
    console.log('=' .repeat(50));
    console.log(`   Files Analyzed: ${result.totalFiles}`);
    console.log(`   Issues Found: ${result.issuesFound}`);
    console.log(`   Critical Bottlenecks: ${result.criticalBottlenecks}`);
    console.log(`   Performance Score: ${(result.performanceScore * 100).toFixed(1)}%`);

    console.log('\n⚡ Optimization Opportunities:');
    const opps = result.optimizationOpportunities;
    console.log(`   React Optimizations: ${opps.reactOptimizations} opportunities`);
    console.log(`   Bundle Optimizations: ${opps.bundleOptimizations} opportunities`);
    console.log(`   Database Optimizations: ${opps.databaseOptimizations} opportunities`);
    console.log(`   Loading Optimizations: ${opps.loadingOptimizations} opportunities`);

    if (result.criticalBottlenecks > 0) {
      console.log('\n🚨 Critical Performance Bottlenecks:');
      const criticalIssues = result.issues.filter(i => i.severity === 'critical');
      criticalIssues.slice(0, 3).forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue.description}`);
        console.log(`      File: ${path.basename(issue.file)}:${issue.line || 'N/A'}`);
        console.log(`      Impact: ${issue.impact}`);
        console.log(`      Potential Gain: ${issue.estimatedGain}`);
        console.log(`      Fix: ${issue.fix}`);
        console.log('');
      });
    }

    if (result.recommendations.length > 0) {
      console.log('💡 Performance Recommendations:');
      result.recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
    }

    console.log('\n🎯 Performance Summary:');
    if (result.performanceScore > 0.9) {
      console.log('   ✅ Excellent performance optimization!');
    } else if (result.performanceScore > 0.7) {
      console.log('   👍 Good performance with optimization opportunities');
    } else {
      console.log('   🚨 Significant performance improvements possible');
    }
  }

  /**
   * Utility methods
   */
  private shouldSkipDirectory(name: string): boolean {
    return ['node_modules', 'dist', 'build', '.git', 'coverage'].includes(name);
  }

  private isPerformanceRelevantFile(filename: string): boolean {
    return /\.(js|ts|jsx|tsx)$/.test(filename) && 
           !filename.endsWith('.test.js') && 
           !filename.endsWith('.test.ts');
  }
}

/**
 * Main execution
 */
async function main() {
  const detector = new PerformanceOptimizationDetector();
  
  try {
    await detector.analyzePerformance('./');
    console.log('\n🎉 Performance Optimization Analysis Complete!');
  } catch (error) {
    console.error('❌ Performance analysis failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
export default PerformanceOptimizationDetector;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}