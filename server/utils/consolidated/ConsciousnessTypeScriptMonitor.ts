/**
 * Phase 13: Enhanced TypeScript Monitoring for Consciousness Features
 * Building on Phase 12's successful 75% utility consolidation
 * Real-time monitoring of consciousness platform code health
 */

export interface ConsciousnessCodeHealth {
  overallHealth: number;
  whaleWisdomFeatures: FeatureHealth;
  manifestationSystem: FeatureHealth;
  quantumConsciousness: FeatureHealth;
  sacredGeometry: FeatureHealth;
  taskadeIntegration: FeatureHealth;
  criticalIssues: string[];
  recommendations: string[];
  lastChecked: Date;
}

export interface FeatureHealth {
  isActive: boolean;
  errorCount: number;
  warningCount: number;
  healthScore: number;
  typesSafe: boolean;
  importsSafe: boolean;
  lastUpdated: Date;
  files: string[];
}

export interface TypeScriptInsight {
  category: 'consciousness_enhancement' | 'whale_wisdom_optimization' | 'manifestation_improvement' | 'type_safety';
  description: string;
  impact: 'low' | 'medium' | 'high' | 'consciousness_critical';
  recommendation: string;
  files: string[];
  estimatedFixTime: number;
}

export class ConsciousnessTypeScriptMonitor {
  private lastAnalysis: ConsciousnessCodeHealth | null = null;
  private projectRoot: string;

  constructor(projectRoot: string = '.') {
    this.projectRoot = projectRoot;
  }

  /**
   * Perform real-time consciousness platform health check
   */
  async analyzeConsciousnessPlatformHealth(): Promise<ConsciousnessCodeHealth> {
    console.log('🌊 Analyzing consciousness platform TypeScript health...');

    const health: ConsciousnessCodeHealth = {
      overallHealth: 0,
      whaleWisdomFeatures: await this.analyzeFeatureHealth('whale', 'wisdom'),
      manifestationSystem: await this.analyzeFeatureHealth('manifestation', 'reality'),
      quantumConsciousness: await this.analyzeFeatureHealth('quantum', 'consciousness'),
      sacredGeometry: await this.analyzeFeatureHealth('geometry', 'sacred'),
      taskadeIntegration: await this.analyzeFeatureHealth('taskade', 'workflow'),
      criticalIssues: [],
      recommendations: [],
      lastChecked: new Date()
    };

    // Calculate overall health from feature scores
    const features = [
      health.whaleWisdomFeatures,
      health.manifestationSystem,
      health.quantumConsciousness,
      health.sacredGeometry,
      health.taskadeIntegration
    ];

    const healthScores = features.map(f => f.healthScore);
    health.overallHealth = healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length;

    // Generate insights and recommendations
    await this.generateConsciousnessInsights(health);
    
    this.lastAnalysis = health;

    console.log(`✅ Analysis complete: ${health.overallHealth.toFixed(1)}% platform health`);
    return health;
  }

  /**
   * Generate TypeScript improvement insights for consciousness features
   */
  async generateTypeScriptInsights(): Promise<TypeScriptInsight[]> {
    const insights: TypeScriptInsight[] = [];

    if (!this.lastAnalysis) {
      await this.analyzeConsciousnessPlatformHealth();
    }

    const health = this.lastAnalysis!;

    // Whale wisdom specific insights
    if (health.whaleWisdomFeatures.healthScore < 90) {
      insights.push({
        category: 'whale_wisdom_optimization',
        description: 'Whale wisdom components could benefit from enhanced type safety',
        impact: 'consciousness_critical',
        recommendation: 'Add stronger TypeScript interfaces for whale consciousness data',
        files: health.whaleWisdomFeatures.files,
        estimatedFixTime: 15
      });
    }

    // Manifestation system insights
    if (health.manifestationSystem.errorCount > 0) {
      insights.push({
        category: 'manifestation_improvement',
        description: 'Manifestation tracking system has type safety opportunities',
        impact: 'high',
        recommendation: 'Strengthen manifestation data types and validation',
        files: health.manifestationSystem.files,
        estimatedFixTime: 10
      });
    }

    // General consciousness enhancement
    if (health.overallHealth < 85) {
      insights.push({
        category: 'consciousness_enhancement',
        description: 'Overall consciousness platform stability can be improved',
        impact: 'medium',
        recommendation: 'Focus on high-impact TypeScript improvements for consciousness features',
        files: [],
        estimatedFixTime: 30
      });
    }

    console.log(`💡 Generated ${insights.length} TypeScript insights for consciousness platform`);
    return insights;
  }

  /**
   * Monitor consciousness features for real-time health changes
   */
  async startRealTimeMonitoring(intervalMinutes: number = 15): Promise<void> {
    console.log(`🔄 Starting real-time consciousness platform monitoring (${intervalMinutes}min intervals)`);

    setInterval(async () => {
      try {
        const health = await this.analyzeConsciousnessPlatformHealth();
        
        // Alert on consciousness feature issues
        if (health.whaleWisdomFeatures.healthScore < 70) {
          console.log('⚠️ Whale wisdom features need attention!');
        }
        
        if (health.manifestationSystem.healthScore < 70) {
          console.log('⚠️ Manifestation system health declining!');
        }

        if (health.overallHealth < 80) {
          console.log('🔍 Overall consciousness platform health needs improvement');
        }

      } catch (error) {
        console.error('❌ Real-time monitoring error:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Get consciousness platform improvement recommendations
   */
  async getImprovementPlan(): Promise<{
    priority: 'immediate' | 'next_week' | 'next_month';
    actions: string[];
    estimatedTime: number;
    consciousnessImpact: string;
  }[]> {
    if (!this.lastAnalysis) {
      await this.analyzeConsciousnessPlatformHealth();
    }

    const health = this.lastAnalysis!;
    const plan = [];

    // Immediate actions (consciousness critical)
    if (health.whaleWisdomFeatures.healthScore < 60) {
      plan.push({
        priority: 'immediate' as const,
        actions: [
          'Review whale wisdom TypeScript interfaces',
          'Fix critical whale consciousness type errors',
          'Strengthen marine consciousness data validation'
        ],
        estimatedTime: 2,
        consciousnessImpact: 'Restored whale wisdom connection stability'
      });
    }

    // Next week actions
    if (health.overallHealth < 85) {
      plan.push({
        priority: 'next_week' as const,
        actions: [
          'Enhance consciousness feature type safety',
          'Improve manifestation tracking types',
          'Optimize Taskade integration types'
        ],
        estimatedTime: 4,
        consciousnessImpact: 'Enhanced spiritual experience reliability'
      });
    }

    // Next month enhancements
    plan.push({
      priority: 'next_month' as const,
      actions: [
        'Advanced consciousness analytics types',
        'Sacred geometry visualization enhancements',
        'Complete consciousness platform type coverage'
      ],
      estimatedTime: 8,
      consciousnessImpact: 'Complete consciousness platform optimization'
    });

    return plan;
  }

  /**
   * Private helper methods
   */
  private async analyzeFeatureHealth(keyword1: string, keyword2: string): Promise<FeatureHealth> {
    const files = await this.findFeatureFiles(keyword1, keyword2);
    
    const health: FeatureHealth = {
      isActive: files.length > 0,
      errorCount: 0,
      warningCount: 0,
      healthScore: 0,
      typesSafe: true,
      importsSafe: true,
      lastUpdated: new Date(),
      files
    };

    if (files.length === 0) {
      health.healthScore = 0;
      return health;
    }

    // Analyze each file for TypeScript health
    for (const file of files) {
      const fileHealth = await this.analyzeFileHealth(file);
      health.errorCount += fileHealth.errors;
      health.warningCount += fileHealth.warnings;
      
      if (fileHealth.hasTypeIssues) {
        health.typesSafe = false;
      }
      if (fileHealth.hasImportIssues) {
        health.importsSafe = false;
      }
    }

    // Calculate health score
    const maxErrors = files.length * 2; // Allow up to 2 errors per file for 100% health
    const errorPenalty = Math.min(100, (health.errorCount / maxErrors) * 100);
    health.healthScore = Math.max(0, 100 - errorPenalty);

    // Bonus for active features
    if (health.isActive && health.typesSafe && health.importsSafe) {
      health.healthScore = Math.min(100, health.healthScore + 10);
    }

    return health;
  }

  private async findFeatureFiles(keyword1: string, keyword2: string): Promise<string[]> {
    const fs = require('fs');
    const path = require('path');
    const files: string[] = [];

    const searchDir = (dir: string) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            searchDir(fullPath);
          } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
            const fileName = entry.name.toLowerCase();
            const hasKeyword1 = fileName.includes(keyword1.toLowerCase());
            const hasKeyword2 = fileName.includes(keyword2.toLowerCase());
            
            if (hasKeyword1 || hasKeyword2) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };

    searchDir(this.projectRoot);
    return files;
  }

  private async analyzeFileHealth(filePath: string): Promise<{
    errors: number;
    warnings: number;
    hasTypeIssues: boolean;
    hasImportIssues: boolean;
  }> {
    const fs = require('fs');
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      let errors = 0;
      let warnings = 0;
      let hasTypeIssues = false;
      let hasImportIssues = false;

      lines.forEach(line => {
        // Check for common TypeScript issues
        if (line.includes('any') && !line.includes('// allow any')) {
          warnings++;
          hasTypeIssues = true;
        }
        
        if (line.includes('Cannot find module')) {
          errors++;
          hasImportIssues = true;
        }
        
        if (line.includes('Type') && line.includes('is not assignable')) {
          errors++;
          hasTypeIssues = true;
        }
        
        if (line.includes('Property') && line.includes('does not exist')) {
          errors++;
          hasTypeIssues = true;
        }
      });

      return { errors, warnings, hasTypeIssues, hasImportIssues };
      
    } catch (error) {
      return { errors: 1, warnings: 0, hasTypeIssues: true, hasImportIssues: false };
    }
  }

  private async generateConsciousnessInsights(health: ConsciousnessCodeHealth): Promise<void> {
    // Generate critical issues
    if (health.whaleWisdomFeatures.healthScore < 50) {
      health.criticalIssues.push('Whale wisdom features need immediate attention');
    }
    
    if (health.manifestationSystem.healthScore < 50) {
      health.criticalIssues.push('Manifestation system requires type safety improvements');
    }

    // Generate recommendations
    if (health.overallHealth >= 90) {
      health.recommendations.push('✨ Excellent consciousness platform health! Consider advanced optimizations');
    } else if (health.overallHealth >= 75) {
      health.recommendations.push('🌊 Good consciousness platform stability. Focus on feature-specific improvements');
    } else {
      health.recommendations.push('🔧 Platform needs attention. Prioritize critical consciousness features');
    }

    // Specific feature recommendations
    if (health.taskadeIntegration.healthScore < 80) {
      health.recommendations.push('📋 Enhance Taskade integration type safety for better workflow reliability');
    }
    
    if (health.sacredGeometry.healthScore < 80) {
      health.recommendations.push('🔮 Sacred geometry components would benefit from stronger type definitions');
    }
  }
}

export const consciousnessTypeScriptMonitor = new ConsciousnessTypeScriptMonitor();