/**
 * AI-Enhanced Feature Selector for Dale Loves Whales 7.9
 * 
 * Uses OpenAI to intelligently analyze backup features and provide
 * smart recommendations for safe implementation while avoiding 7.8 instabilities.
 */

import OpenAI from 'openai';
import { promises as fs } from 'fs';
import path from 'path';

interface AIAnalysis {
  safetyScore: number; // 0-100
  stabilityRisk: 'low' | 'medium' | 'high';
  implementationStrategy: string;
  potentialConflicts: string[];
  requiredModifications: string[];
  dependencyRisks: string[];
  benefits: string[];
  recommendation: 'implement' | 'modify' | 'skip';
  implementationOrder: number; // 1-10, lower = implement first
}

interface FeatureWithAI {
  name: string;
  path: string;
  category: string;
  content: string;
  aiAnalysis: AIAnalysis;
}

class AIFeatureSelector {
  private openai: OpenAI;
  private currentCodebaseContext: string = '';

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Analyze features with AI assistance
   */
  async analyzeBackupFeatures(): Promise<FeatureWithAI[]> {
    console.log('🤖 Starting AI-enhanced feature analysis...');
    
    // First, understand our current codebase context
    await this.analyzeCurrentCodebase();
    
    // Get the promising features from our previous analysis
    const inventory = JSON.parse(await fs.readFile('backup-inventory.json', 'utf-8'));
    const promisingFeatures = inventory.features.filter((f: any) => 
      f.recommendedAction === 'review' && 
      f.benefits.length > 0 &&
      f.potentialIssues.length <= 2
    );

    console.log(`📊 Analyzing ${promisingFeatures.length} promising features with AI...`);

    const analyzedFeatures: FeatureWithAI[] = [];

    for (const feature of promisingFeatures) {
      try {
        const content = await fs.readFile(feature.path, 'utf-8');
        const aiAnalysis = await this.getAIAnalysis(feature, content);
        
        analyzedFeatures.push({
          name: feature.name,
          path: feature.path,
          category: feature.category,
          content,
          aiAnalysis
        });

        console.log(`✅ Analyzed: ${feature.name} (Safety: ${aiAnalysis.safetyScore}/100)`);
      } catch (error) {
        console.error(`❌ Failed to analyze ${feature.name}:`, error);
      }
    }

    // Sort by implementation order
    analyzedFeatures.sort((a, b) => a.aiAnalysis.implementationOrder - b.aiAnalysis.implementationOrder);

    return analyzedFeatures;
  }

  /**
   * Understand the current codebase to provide better context
   */
  private async analyzeCurrentCodebase(): Promise<void> {
    console.log('📖 Analyzing current codebase context...');
    
    try {
      // Get key files from current codebase
      const packageJson = await fs.readFile('package.json', 'utf-8');
      const clientApp = await fs.readFile('client/src/App.tsx', 'utf-8');
      const serverIndex = await fs.readFile('server/index.ts', 'utf-8');
      
      this.currentCodebaseContext = `
Current Dale Loves Whales 7.9 Codebase Context:

PACKAGE.JSON DEPENDENCIES:
${packageJson}

CLIENT APP STRUCTURE:
${clientApp.slice(0, 2000)}

SERVER STRUCTURE:
${serverIndex.slice(0, 2000)}

CURRENT ARCHITECTURE:
- React frontend with TypeScript
- Express backend with comprehensive security
- PostgreSQL database with Drizzle ORM
- Extensive TypeScript error management tools
- Advanced security scanning systems
- Cosmic UI components with sacred geometry
`;
    } catch (error) {
      console.warn('⚠️ Could not fully analyze current codebase:', error);
      this.currentCodebaseContext = 'Limited codebase context available';
    }
  }

  /**
   * Get AI analysis for a specific feature
   */
  private async getAIAnalysis(feature: any, content: string): Promise<AIAnalysis> {
    const prompt = `
You are an expert software architect analyzing a feature from a backup for integration into a stable codebase.

CONTEXT:
Dale Loves Whales is a consciousness-enhanced music platform. Version 7.8 had severe instabilities that made the app inoperable due to:
- Frontend/backend conflicts
- TypeScript system errors  
- Security standard implementation issues
- Codebase standard conflicts

We're now selectively integrating 7.8 features into stable 7.9 (based on 7.7).

CURRENT CODEBASE CONTEXT:
${this.currentCodebaseContext}

FEATURE TO ANALYZE:
Name: ${feature.name}
Category: ${feature.category}
Benefits: ${feature.benefits.join(', ')}
Known Issues: ${feature.potentialIssues.join(', ')}
Dependencies: ${feature.dependencies.join(', ')}

FEATURE CODE:
${content.slice(0, 4000)}

ANALYSIS REQUIRED:
1. Safety score (0-100) for integrating this feature
2. Stability risk assessment (low/medium/high)
3. Specific implementation strategy to avoid 7.8 instabilities
4. Potential conflicts with current codebase
5. Required modifications before implementation
6. Dependency risks
7. Clear benefits this would bring
8. Final recommendation (implement/modify/skip)
9. Implementation order priority (1-10, lower = higher priority)

Focus on:
- Avoiding the instabilities that plagued 7.8
- Maintaining current app stability
- Maximizing benefits while minimizing risks
- Ensuring compatibility with existing architecture

Respond in JSON format:
{
  "safetyScore": number,
  "stabilityRisk": "low|medium|high",
  "implementationStrategy": "detailed strategy",
  "potentialConflicts": ["conflict1", "conflict2"],
  "requiredModifications": ["mod1", "mod2"],
  "dependencyRisks": ["risk1", "risk2"],
  "benefits": ["benefit1", "benefit2"],
  "recommendation": "implement|modify|skip",
  "implementationOrder": number
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 1500
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No response from OpenAI');

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error(`AI analysis failed for ${feature.name}:`, error);
      
      // Fallback analysis
      return {
        safetyScore: 30,
        stabilityRisk: 'high',
        implementationStrategy: 'Manual review required - AI analysis failed',
        potentialConflicts: ['Unknown conflicts - manual review needed'],
        requiredModifications: ['Full manual analysis required'],
        dependencyRisks: ['Unknown dependency risks'],
        benefits: ['Benefits unclear - manual review needed'],
        recommendation: 'skip',
        implementationOrder: 10
      };
    }
  }

  /**
   * Generate implementation plan based on AI analysis
   */
  async generateImplementationPlan(features: FeatureWithAI[]): Promise<string> {
    const implementFeatures = features.filter(f => f.aiAnalysis.recommendation === 'implement');
    const modifyFeatures = features.filter(f => f.aiAnalysis.recommendation === 'modify');
    const skipFeatures = features.filter(f => f.aiAnalysis.recommendation === 'skip');

    let plan = `# Dale Loves Whales 7.9 - AI-Enhanced Implementation Plan\n\n`;
    
    plan += `## 🎯 Executive Summary\n`;
    plan += `- **Total Features Analyzed**: ${features.length}\n`;
    plan += `- **Recommended for Implementation**: ${implementFeatures.length}\n`;
    plan += `- **Require Modifications**: ${modifyFeatures.length}\n`;
    plan += `- **Should Skip**: ${skipFeatures.length}\n\n`;

    if (implementFeatures.length > 0) {
      plan += `## ✅ Phase 1: Safe Implementation (${implementFeatures.length} features)\n\n`;
      
      implementFeatures.forEach((feature, index) => {
        plan += `### ${index + 1}. ${feature.name}\n`;
        plan += `- **Category**: ${feature.category}\n`;
        plan += `- **Safety Score**: ${feature.aiAnalysis.safetyScore}/100\n`;
        plan += `- **Strategy**: ${feature.aiAnalysis.implementationStrategy}\n`;
        plan += `- **Benefits**: ${feature.aiAnalysis.benefits.join(', ')}\n`;
        if (feature.aiAnalysis.potentialConflicts.length > 0) {
          plan += `- **Watch For**: ${feature.aiAnalysis.potentialConflicts.join(', ')}\n`;
        }
        plan += `\n`;
      });
    }

    if (modifyFeatures.length > 0) {
      plan += `## ⚠️ Phase 2: Requires Modifications (${modifyFeatures.length} features)\n\n`;
      
      modifyFeatures.forEach((feature, index) => {
        plan += `### ${index + 1}. ${feature.name}\n`;
        plan += `- **Category**: ${feature.category}\n`;
        plan += `- **Safety Score**: ${feature.aiAnalysis.safetyScore}/100\n`;
        plan += `- **Required Modifications**: ${feature.aiAnalysis.requiredModifications.join(', ')}\n`;
        plan += `- **Potential Benefits**: ${feature.aiAnalysis.benefits.join(', ')}\n`;
        plan += `\n`;
      });
    }

    plan += `## 🚀 Recommended Implementation Sequence\n\n`;
    const sortedFeatures = [...implementFeatures].sort((a, b) => a.aiAnalysis.implementationOrder - b.aiAnalysis.implementationOrder);
    
    sortedFeatures.forEach((feature, index) => {
      plan += `${index + 1}. **${feature.name}** (Safety: ${feature.aiAnalysis.safetyScore}/100)\n`;
    });

    return plan;
  }

  /**
   * Create implementation commands for safe features
   */
  async generateImplementationCommands(features: FeatureWithAI[]): Promise<string[]> {
    const safeFeatures = features.filter(f => 
      f.aiAnalysis.recommendation === 'implement' && 
      f.aiAnalysis.safetyScore >= 70
    );

    const commands: string[] = [];
    
    for (const feature of safeFeatures) {
      const targetPath = this.determineTargetPath(feature);
      commands.push(`# Implementing ${feature.name}`);
      commands.push(`cp "${feature.path}" "${targetPath}"`);
      
      if (feature.aiAnalysis.requiredModifications.length > 0) {
        commands.push(`# Note: Requires modifications - ${feature.aiAnalysis.requiredModifications.join(', ')}`);
      }
      
      commands.push('');
    }

    return commands;
  }

  /**
   * Determine the best target path for a feature
   */
  private determineTargetPath(feature: FeatureWithAI): string {
    const baseName = path.basename(feature.path);
    
    switch (feature.category) {
      case 'core-systems':
        return `server/utils/${baseName}`;
      case 'ui-cosmic-components':
        return `client/src/components/cosmic/${baseName}`;
      case 'quality-tools':
        return `scripts/${baseName}`;
      case 'security-enhancements':
        return `server/security/${baseName}`;
      case 'typescript-tools':
        return `tools/${baseName}`;
      default:
        return `integration/${baseName}`;
    }
  }
}

// Execute the AI analysis
async function main() {
  const selector = new AIFeatureSelector();
  
  try {
    console.log('🚀 Starting AI-enhanced feature selection...\n');
    
    const analyzedFeatures = await selector.analyzeBackupFeatures();
    const implementationPlan = await selector.generateImplementationPlan(analyzedFeatures);
    const commands = await selector.generateImplementationCommands(analyzedFeatures);
    
    // Save results
    await fs.writeFile('ai-feature-analysis.json', JSON.stringify(analyzedFeatures, null, 2));
    await fs.writeFile('ai-implementation-plan.md', implementationPlan);
    await fs.writeFile('implementation-commands.sh', commands.join('\n'));
    
    console.log('\n🎉 AI Analysis Complete!');
    console.log('📋 Implementation plan saved to: ai-implementation-plan.md');
    console.log('💾 Detailed analysis saved to: ai-feature-analysis.json');
    console.log('⚡ Commands saved to: implementation-commands.sh');
    
    // Show summary
    const safeFeatures = analyzedFeatures.filter(f => f.aiAnalysis.recommendation === 'implement');
    const avgSafety = safeFeatures.reduce((sum, f) => sum + f.aiAnalysis.safetyScore, 0) / safeFeatures.length;
    
    console.log(`\n📊 Summary:`);
    console.log(`✅ ${safeFeatures.length} features ready for implementation`);
    console.log(`🛡️ Average safety score: ${avgSafety.toFixed(1)}/100`);
    
  } catch (error) {
    console.error('❌ AI analysis failed:', error);
    process.exit(1);
  }
}

main();

export { AIFeatureSelector, type AIAnalysis, type FeatureWithAI };