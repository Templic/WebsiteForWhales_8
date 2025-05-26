/**
 * Dale Loves Whales - Codebase Version Analysis
 * Understanding differences between 7.7 (stable base), 7.8 (advanced but unstable), and 7.9 (current)
 */

import { promises as fs } from 'fs';
import { aiRouter } from './server/utils/intelligent-ai-model-router';

interface CodebaseAnalysis {
  version: string;
  coreStabilities: string[];
  criticalDependencies: string[];
  riskAreas: string[];
  safeEnhancements: string[];
  problematicPatterns: string[];
}

class CodebaseVersionAnalyzer {
  
  async analyzeCurrentStability(): Promise<CodebaseAnalysis> {
    console.log('🔍 Analyzing current version 7.9 stability foundation...');
    
    const analysis: CodebaseAnalysis = {
      version: '7.9 (Current Stable)',
      coreStabilities: [],
      criticalDependencies: [],
      riskAreas: [],
      safeEnhancements: [],
      problematicPatterns: []
    };

    // Analyze what makes 7.9 stable
    await this.identifyStableFoundations(analysis);
    
    // Identify critical dependencies that must not break
    await this.mapCriticalDependencies(analysis);
    
    return analysis;
  }

  async analyze78BackupFeatures(): Promise<CodebaseAnalysis> {
    console.log('📊 Analyzing 7.8 backup features for safe extraction...');
    
    const analysis: CodebaseAnalysis = {
      version: '7.8 (Advanced Backup)',
      coreStabilities: [],
      criticalDependencies: [],
      riskAreas: [],
      safeEnhancements: [],
      problematicPatterns: []
    };

    // Examine backup for valuable but risky patterns
    await this.examine78Patterns(analysis);
    
    return analysis;
  }

  private async identifyStableFoundations(analysis: CodebaseAnalysis): Promise<void> {
    console.log('🏗️ Identifying stable foundations that must be preserved...');
    
    // Database schema stability
    try {
      const storageContent = await fs.readFile('server/storage.ts', 'utf-8');
      
      if (storageContent.includes('PostgresStorage')) {
        analysis.coreStabilities.push('PostgreSQL database layer with established schema');
      }
      
      if (storageContent.includes('drizzle-orm')) {
        analysis.coreStabilities.push('Drizzle ORM integration for type-safe queries');
      }
      
      // API route stability
      const routesContent = await fs.readFile('server/routes.ts', 'utf-8');
      const routeCount = (routesContent.match(/\.(get|post|put|delete)/g) || []).length;
      analysis.coreStabilities.push(`${routeCount} established API endpoints with authentication`);
      
    } catch (error) {
      analysis.riskAreas.push('Could not analyze storage layer');
    }

    // UI component stability
    try {
      const appContent = await fs.readFile('client/src/App.tsx', 'utf-8');
      
      if (appContent.includes('wouter')) {
        analysis.coreStabilities.push('Wouter routing system with established navigation');
      }
      
      if (appContent.includes('cosmic') || appContent.includes('whale')) {
        analysis.coreStabilities.push('Cosmic whale consciousness theme integration');
      }
      
    } catch (error) {
      analysis.riskAreas.push('Could not analyze frontend architecture');
    }

    console.log(`✅ Identified ${analysis.coreStabilities.length} stable foundations`);
  }

  private async mapCriticalDependencies(analysis: CodebaseAnalysis): Promise<void> {
    console.log('🔗 Mapping critical dependencies that must not break...');
    
    try {
      // Check package.json for critical dependencies
      const packageContent = await fs.readFile('package.json', 'utf-8');
      const packageData = JSON.parse(packageContent);
      
      const criticalDeps = [
        'react', 'express', 'drizzle-orm', 'wouter', 
        '@anthropic-ai/sdk', '@google/generative-ai', 'openai'
      ];
      
      for (const dep of criticalDeps) {
        if (packageData.dependencies?.[dep] || packageData.devDependencies?.[dep]) {
          analysis.criticalDependencies.push(`${dep}: Established integration must remain functional`);
        }
      }
      
      // Database connection patterns
      analysis.criticalDependencies.push('PostgreSQL connection string and session management');
      analysis.criticalDependencies.push('Environment variable configuration for API keys');
      
    } catch (error) {
      analysis.riskAreas.push('Could not analyze package dependencies');
    }

    console.log(`🔍 Mapped ${analysis.criticalDependencies.length} critical dependencies`);
  }

  private async examine78Patterns(analysis: CodebaseAnalysis): Promise<void> {
    console.log('⚠️ Examining 7.8 patterns for risks and benefits...');
    
    // Analyze AI router patterns
    try {
      const aiRouterContent = await fs.readFile(
        'restoration-staging/backup-features-export/core-systems/intelligent-ai-model-router.ts', 
        'utf-8'
      );
      
      if (aiRouterContent.includes('claude-3-7-sonnet-20250219')) {
        analysis.safeEnhancements.push('AI model routing with consciousness levels - SAFE to implement');
      }
      
      if (aiRouterContent.includes('execSync') || aiRouterContent.includes('process.exit')) {
        analysis.problematicPatterns.push('System execution commands that could destabilize platform');
      }
      
    } catch (error) {
      analysis.riskAreas.push('Could not analyze AI router backup');
    }

    // Analyze autonomous healing patterns
    try {
      const healingContent = await fs.readFile(
        'restoration-staging/backup-features-export/core-systems/ai-enhanced-autonomous-healing.ts',
        'utf-8'
      );
      
      if (healingContent.includes('writeFile') && healingContent.includes('fs.')) {
        analysis.problematicPatterns.push('Direct file system modifications without validation');
      }
      
      if (healingContent.includes('routeTask')) {
        analysis.safeEnhancements.push('AI-guided analysis and suggestions - SAFE when read-only');
      }
      
    } catch (error) {
      analysis.riskAreas.push('Could not analyze healing system backup');
    }

    // Analyze quality tools patterns
    try {
      const qualityContent = await fs.readFile(
        'restoration-staging/backup-features-export/quality-tools/enhanced-master-quality-controller.ts',
        'utf-8'
      );
      
      if (qualityContent.includes('ComponentArchitectureOptimizer')) {
        analysis.safeEnhancements.push('Component analysis and recommendations - SAFE for insights');
      }
      
      if (qualityContent.includes('automatedFix') && qualityContent.includes('apply')) {
        analysis.problematicPatterns.push('Automated code modifications without user approval');
      }
      
    } catch (error) {
      analysis.riskAreas.push('Could not analyze quality tools backup');
    }

    console.log(`✅ Found ${analysis.safeEnhancements.length} safe enhancements`);
    console.log(`⚠️ Identified ${analysis.problematicPatterns.length} problematic patterns`);
  }

  async generateSafetyGuidelines(): Promise<string> {
    console.log('📋 Generating safety guidelines for feature integration...');
    
    const current = await this.analyzeCurrentStability();
    const backup = await this.analyze78BackupFeatures();
    
    const guidelines = await aiRouter.routeTask(
      'architecture-review',
      `Generate safety guidelines for integrating 7.8 features into stable 7.9 codebase:

STABLE 7.9 FOUNDATIONS (MUST PRESERVE):
${current.coreStabilities.join('\n')}

CRITICAL DEPENDENCIES (CANNOT BREAK):
${current.criticalDependencies.join('\n')}

SAFE 7.8 ENHANCEMENTS (CAN IMPLEMENT):
${backup.safeEnhancements.join('\n')}

DANGEROUS 7.8 PATTERNS (MUST AVOID):
${backup.problematicPatterns.join('\n')}

Provide specific do's and don'ts for safe feature integration.`,
      600
    );

    return guidelines;
  }

  async saveAnalysisReport(): Promise<void> {
    const current = await this.analyzeCurrentStability();
    const backup = await this.analyze78BackupFeatures();
    const guidelines = await this.generateSafetyGuidelines();
    
    const report = `# Dale Loves Whales - Codebase Version Analysis

## 🛡️ Version 7.9 Stable Foundations (MUST PRESERVE)
${current.coreStabilities.map(item => `- ${item}`).join('\n')}

## 🔗 Critical Dependencies (CANNOT BREAK)
${current.criticalDependencies.map(item => `- ${item}`).join('\n')}

## ✅ Safe 7.8 Enhancements (CAN IMPLEMENT)
${backup.safeEnhancements.map(item => `- ${item}`).join('\n')}

## ⚠️ Dangerous 7.8 Patterns (MUST AVOID)
${backup.problematicPatterns.map(item => `- ${item}`).join('\n')}

## 📋 AI-Generated Safety Guidelines
${guidelines}

Generated: ${new Date().toISOString()}
`;
    
    await fs.writeFile('codebase-safety-analysis.md', report);
    console.log('📄 Analysis report saved to codebase-safety-analysis.md');
  }
}

export const versionAnalyzer = new CodebaseVersionAnalyzer();