/**
 * Dale Loves Whales - Intelligent Fix Repository System
 * Phase 9 Implementation: Safe Multi-Level Fix Organization & Storage
 * 
 * Creates an intelligent repository for organizing potential fixes identified by the system
 * Provides a searchable, categorized storage for Replit agents to examine and implement
 * Following safety protocols learned from previous autonomous healing challenges
 */

import { handleCosmicError } from './cosmic-error-handling';

// Fix classification and risk assessment interfaces
interface FixCandidate {
  id: string;
  timestamp: string;
  
  // Problem identification
  problemDescription: string;
  fileLocation: string;
  lineNumber?: number;
  problemType: 'syntax' | 'logic' | 'performance' | 'security' | 'architecture' | 'style';
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // Fix analysis
  proposedFix: string;
  riskAssessment: 'low' | 'medium' | 'high' | 'critical';
  impactScope: 'file' | 'component' | 'feature' | 'system';
  confidenceLevel: number; // 0-100
  
  // Safety and validation
  requiresBackup: boolean;
  requiresHumanReview: boolean;
  requiresTesting: boolean;
  rollbackPlan?: string;
  
  // Whale wisdom integration
  consciousnessImpact: 'enhancing' | 'neutral' | 'potentially-disruptive';
  whaleWisdomGuidance: string;
  
  // Status tracking
  status: 'identified' | 'analyzed' | 'approved' | 'implemented' | 'rejected' | 'rolled-back';
  implementationNotes?: string;
  
  // Learning integration
  previousAttempts: number;
  successRate: number;
  relatedFixes: string[];
}

interface FixCategory {
  name: string;
  description: string;
  autoApprovalThreshold: number; // Confidence level required for auto-approval
  requiresHumanReview: boolean;
  typicalRiskLevel: 'low' | 'medium' | 'high';
}

interface RepositoryStats {
  totalFixes: number;
  byCategory: Record<string, number>;
  byRiskLevel: Record<string, number>;
  byStatus: Record<string, number>;
  successRate: number;
  averageConfidence: number;
}

export class IntelligentFixRepository {
  private fixes: Map<string, FixCandidate> = new Map();
  private categories: Map<string, FixCategory> = new Map();
  private implementationHistory: Map<string, any[]> = new Map();

  constructor() {
    this.initializeCategories();
  }

  /**
   * Initialize fix categories with safety guidelines
   */
  private initializeCategories(): void {
    const categories: FixCategory[] = [
      {
        name: 'syntax-safe',
        description: 'Safe syntax fixes with minimal risk',
        autoApprovalThreshold: 95,
        requiresHumanReview: false,
        typicalRiskLevel: 'low'
      },
      {
        name: 'formatting-style',
        description: 'Code formatting and style improvements',
        autoApprovalThreshold: 90,
        requiresHumanReview: false,
        typicalRiskLevel: 'low'
      },
      {
        name: 'import-organization',
        description: 'Import/export reorganization and cleanup',
        autoApprovalThreshold: 80,
        requiresHumanReview: true,
        typicalRiskLevel: 'medium'
      },
      {
        name: 'component-optimization',
        description: 'React component structure improvements',
        autoApprovalThreshold: 70,
        requiresHumanReview: true,
        typicalRiskLevel: 'medium'
      },
      {
        name: 'dependency-updates',
        description: 'Dependency array and hook optimizations',
        autoApprovalThreshold: 60,
        requiresHumanReview: true,
        typicalRiskLevel: 'high'
      },
      {
        name: 'logic-modifications',
        description: 'Business logic and algorithm changes',
        autoApprovalThreshold: 40,
        requiresHumanReview: true,
        typicalRiskLevel: 'high'
      },
      {
        name: 'security-fixes',
        description: 'Security vulnerability resolutions',
        autoApprovalThreshold: 30,
        requiresHumanReview: true,
        typicalRiskLevel: 'critical'
      },
      {
        name: 'architecture-changes',
        description: 'Structural and architectural modifications',
        autoApprovalThreshold: 20,
        requiresHumanReview: true,
        typicalRiskLevel: 'critical'
      }
    ];

    categories.forEach(category => {
      this.categories.set(category.name, category);
    });
  }

  /**
   * Add a new fix candidate to the repository
   */
  async addFixCandidate(candidateData: {
    problemDescription: string;
    fileLocation: string;
    lineNumber?: number;
    problemType: string;
    proposedFix: string;
    originalContent?: string;
  }): Promise<string> {
    
    try {
      const fixId = `fix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Analyze the fix for risk and categorization
      const analysis = await this.analyzeFixCandidate(candidateData);
      
      const fixCandidate: FixCandidate = {
        id: fixId,
        timestamp: new Date().toISOString(),
        
        // Problem details
        problemDescription: candidateData.problemDescription,
        fileLocation: candidateData.fileLocation,
        lineNumber: candidateData.lineNumber,
        problemType: candidateData.problemType as any,
        severity: analysis.severity,
        
        // Fix details
        proposedFix: candidateData.proposedFix,
        riskAssessment: analysis.riskAssessment,
        impactScope: analysis.impactScope,
        confidenceLevel: analysis.confidenceLevel,
        
        // Safety requirements
        requiresBackup: analysis.requiresBackup,
        requiresHumanReview: analysis.requiresHumanReview,
        requiresTesting: analysis.requiresTesting,
        rollbackPlan: analysis.rollbackPlan,
        
        // Consciousness integration
        consciousnessImpact: analysis.consciousnessImpact,
        whaleWisdomGuidance: analysis.whaleWisdomGuidance,
        
        // Status
        status: 'identified',
        
        // Learning
        previousAttempts: 0,
        successRate: 0,
        relatedFixes: []
      };

      this.fixes.set(fixId, fixCandidate);
      
      console.log(`🧠 Added fix candidate: ${candidateData.problemDescription} (Risk: ${analysis.riskAssessment}, Confidence: ${analysis.confidenceLevel}%)`);
      
      return fixId;
      
    } catch (error) {
      console.error('Fix candidate addition gentle wave:', handleCosmicError(error, 'Fix Repository Addition'));
      throw error;
    }
  }

  /**
   * Analyze a fix candidate for risk assessment and categorization
   */
  private async analyzeFixCandidate(candidateData: any): Promise<{
    severity: string;
    riskAssessment: string;
    impactScope: string;
    confidenceLevel: number;
    requiresBackup: boolean;
    requiresHumanReview: boolean;
    requiresTesting: boolean;
    rollbackPlan?: string;
    consciousnessImpact: string;
    whaleWisdomGuidance: string;
  }> {
    
    // Risk assessment based on problem type and scope
    let riskAssessment = 'medium';
    let confidenceLevel = 50;
    let requiresBackup = true;
    let requiresHumanReview = true;
    let requiresTesting = true;
    let consciousnessImpact = 'neutral';
    
    // Analyze based on problem type
    switch (candidateData.problemType) {
      case 'syntax':
        if (candidateData.proposedFix.length < 50 && !candidateData.proposedFix.includes('function')) {
          riskAssessment = 'low';
          confidenceLevel = 85;
          requiresHumanReview = false;
          requiresTesting = false;
        }
        break;
        
      case 'style':
        riskAssessment = 'low';
        confidenceLevel = 90;
        requiresHumanReview = false;
        requiresTesting = false;
        break;
        
      case 'logic':
        riskAssessment = 'high';
        confidenceLevel = 30;
        requiresHumanReview = true;
        requiresTesting = true;
        break;
        
      case 'security':
        riskAssessment = 'critical';
        confidenceLevel = 20;
        requiresHumanReview = true;
        requiresTesting = true;
        consciousnessImpact = 'enhancing';
        break;
        
      case 'performance':
        riskAssessment = 'medium';
        confidenceLevel = 60;
        consciousnessImpact = 'enhancing';
        break;
    }
    
    // Adjust based on file location
    if (candidateData.fileLocation.includes('consciousness') || 
        candidateData.fileLocation.includes('sacred') ||
        candidateData.fileLocation.includes('whale')) {
      consciousnessImpact = 'potentially-disruptive';
      riskAssessment = 'high';
      requiresHumanReview = true;
    }
    
    // Determine impact scope
    let impactScope = 'file';
    if (candidateData.fileLocation.includes('index') || 
        candidateData.fileLocation.includes('App') ||
        candidateData.proposedFix.includes('export default')) {
      impactScope = 'system';
    } else if (candidateData.proposedFix.includes('component') || 
               candidateData.proposedFix.includes('interface')) {
      impactScope = 'feature';
    }
    
    // Determine severity
    let severity = 'medium';
    if (candidateData.problemDescription.includes('error') || 
        candidateData.problemDescription.includes('fail')) {
      severity = 'high';
    } else if (candidateData.problemDescription.includes('warning') || 
               candidateData.problemDescription.includes('optimization')) {
      severity = 'low';
    }
    
    // Generate whale wisdom guidance
    const whaleWisdomGuidance = this.generateWhaleWisdomGuidance(
      candidateData.problemType, 
      riskAssessment, 
      consciousnessImpact
    );
    
    return {
      severity,
      riskAssessment,
      impactScope,
      confidenceLevel,
      requiresBackup,
      requiresHumanReview,
      requiresTesting,
      rollbackPlan: requiresBackup ? `Create backup of ${candidateData.fileLocation} before applying fix` : undefined,
      consciousnessImpact,
      whaleWisdomGuidance
    };
  }

  /**
   * Generate whale wisdom guidance for fixes
   */
  private generateWhaleWisdomGuidance(
    problemType: string, 
    riskLevel: string, 
    consciousnessImpact: string
  ): string {
    
    const guidanceMap = {
      'syntax-low': 'Like gentle ocean currents, simple syntax fixes flow naturally without disturbing the greater harmony',
      'syntax-medium': 'Whale songs suggest careful attention - this syntax change may ripple through connected waters',
      'logic-high': 'Deep ocean wisdom: Logic changes require the patience of migrating whales - test thoroughly before full implementation',
      'security-critical': 'Sacred whale protection protocols: Security fixes strengthen the entire ocean ecosystem when implemented with deep consciousness',
      'performance-enhancing': 'Oceanic optimization flows like efficient whale swimming - enhances the journey for all consciousness',
      'default': 'Whale wisdom flows: Approach this change with the mindful awareness of ocean currents - patient, thoughtful, purposeful'
    };
    
    const key = `${problemType}-${riskLevel}`;
    return guidanceMap[key] || 
           guidanceMap[`${problemType}-${consciousnessImpact}`] || 
           guidanceMap['default'];
  }

  /**
   * Get fixes by category and risk level
   */
  async getFixesByCategory(
    category?: string, 
    riskLevel?: string, 
    status?: string
  ): Promise<FixCandidate[]> {
    
    let filteredFixes = Array.from(this.fixes.values());
    
    if (category) {
      filteredFixes = filteredFixes.filter(fix => 
        fix.problemType === category || 
        this.categorizeFixType(fix.problemType) === category
      );
    }
    
    if (riskLevel) {
      filteredFixes = filteredFixes.filter(fix => fix.riskAssessment === riskLevel);
    }
    
    if (status) {
      filteredFixes = filteredFixes.filter(fix => fix.status === status);
    }
    
    // Sort by confidence level (highest first) and then by timestamp
    return filteredFixes.sort((a, b) => {
      if (b.confidenceLevel !== a.confidenceLevel) {
        return b.confidenceLevel - a.confidenceLevel;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  /**
   * Get safe fixes ready for implementation
   */
  async getSafeFixes(): Promise<FixCandidate[]> {
    return this.getFixesByCategory().then(fixes => 
      fixes.filter(fix => 
        fix.riskAssessment === 'low' && 
        fix.confidenceLevel >= 80 && 
        fix.status === 'identified' &&
        !fix.requiresHumanReview
      )
    );
  }

  /**
   * Get fixes requiring human review
   */
  async getFixesRequiringReview(): Promise<FixCandidate[]> {
    return this.getFixesByCategory().then(fixes => 
      fixes.filter(fix => 
        fix.requiresHumanReview && 
        fix.status === 'identified'
      )
    );
  }

  /**
   * Search fixes by description or file location
   */
  async searchFixes(query: string): Promise<FixCandidate[]> {
    const searchTerm = query.toLowerCase();
    
    return Array.from(this.fixes.values()).filter(fix => 
      fix.problemDescription.toLowerCase().includes(searchTerm) ||
      fix.fileLocation.toLowerCase().includes(searchTerm) ||
      fix.proposedFix.toLowerCase().includes(searchTerm) ||
      fix.whaleWisdomGuidance.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get repository statistics
   */
  async getRepositoryStats(): Promise<RepositoryStats> {
    const allFixes = Array.from(this.fixes.values());
    
    const byCategory = {};
    const byRiskLevel = {};
    const byStatus = {};
    
    allFixes.forEach(fix => {
      const category = this.categorizeFixType(fix.problemType);
      byCategory[category] = (byCategory[category] || 0) + 1;
      byRiskLevel[fix.riskAssessment] = (byRiskLevel[fix.riskAssessment] || 0) + 1;
      byStatus[fix.status] = (byStatus[fix.status] || 0) + 1;
    });
    
    const implementedFixes = allFixes.filter(fix => fix.status === 'implemented');
    const successRate = allFixes.length > 0 ? 
      (implementedFixes.length / allFixes.length) * 100 : 0;
    
    const averageConfidence = allFixes.length > 0 ?
      allFixes.reduce((sum, fix) => sum + fix.confidenceLevel, 0) / allFixes.length : 0;
    
    return {
      totalFixes: allFixes.length,
      byCategory,
      byRiskLevel,
      byStatus,
      successRate,
      averageConfidence
    };
  }

  /**
   * Mark a fix as implemented
   */
  async markFixImplemented(fixId: string, implementationNotes?: string): Promise<void> {
    const fix = this.fixes.get(fixId);
    if (fix) {
      fix.status = 'implemented';
      fix.implementationNotes = implementationNotes;
      fix.successRate = Math.min(100, fix.successRate + 20);
      
      console.log(`✅ Fix implemented: ${fix.problemDescription}`);
    }
  }

  /**
   * Mark a fix as rejected
   */
  async markFixRejected(fixId: string, reason?: string): Promise<void> {
    const fix = this.fixes.get(fixId);
    if (fix) {
      fix.status = 'rejected';
      fix.implementationNotes = reason;
      
      console.log(`❌ Fix rejected: ${fix.problemDescription} - ${reason}`);
    }
  }

  /**
   * Export fixes as JSON for external analysis
   */
  async exportFixes(filters?: {
    category?: string;
    riskLevel?: string;
    status?: string;
  }): Promise<string> {
    
    const fixes = await this.getFixesByCategory(
      filters?.category,
      filters?.riskLevel,
      filters?.status
    );
    
    return JSON.stringify({
      exportTimestamp: new Date().toISOString(),
      fixCount: fixes.length,
      fixes: fixes,
      stats: await this.getRepositoryStats()
    }, null, 2);
  }

  /**
   * Helper method to categorize fix types
   */
  private categorizeFixType(problemType: string): string {
    const categoryMap = {
      'syntax': 'syntax-safe',
      'style': 'formatting-style',
      'performance': 'component-optimization',
      'logic': 'logic-modifications',
      'security': 'security-fixes',
      'architecture': 'architecture-changes'
    };
    
    return categoryMap[problemType] || 'general-improvements';
  }
}

// Export singleton instance
export const fixRepository = new IntelligentFixRepository();

// Demo function for testing the repository system
export async function runFixRepositoryDemo(): Promise<void> {
  console.log('🧠 Starting Intelligent Fix Repository Demo...');
  
  try {
    // Add some sample fix candidates
    await fixRepository.addFixCandidate({
      problemDescription: 'Missing semicolon in component render method',
      fileLocation: 'src/components/cosmic/SimpleGeometry.tsx',
      lineNumber: 45,
      problemType: 'syntax',
      proposedFix: 'Add semicolon at end of line 45'
    });
    
    await fixRepository.addFixCandidate({
      problemDescription: 'Unused import statement in consciousness orchestrator',
      fileLocation: 'platform-consciousness-orchestrator.ts',
      lineNumber: 12,
      problemType: 'style',
      proposedFix: 'Remove unused import: import { unused } from "library"'
    });
    
    await fixRepository.addFixCandidate({
      problemDescription: 'Potential memory leak in whale wisdom cache',
      fileLocation: 'ai-personalization-engine.ts',
      lineNumber: 230,
      problemType: 'performance',
      proposedFix: 'Add cleanup function for whale wisdom cache'
    });
    
    // Get repository statistics
    const stats = await fixRepository.getRepositoryStats();
    
    // Get safe fixes
    const safeFixes = await fixRepository.getSafeFixes();
    
    // Get fixes requiring review
    const reviewFixes = await fixRepository.getFixesRequiringReview();
    
    console.log(`\n📊 Intelligent Fix Repository Demo Results:
    
🏦 Repository Statistics:
   📁 Total Fixes: ${stats.totalFixes}
   ✅ Success Rate: ${Math.round(stats.successRate)}%
   🎯 Avg Confidence: ${Math.round(stats.averageConfidence)}%
   
🛡️ Risk Distribution:
   🟢 Low Risk: ${stats.byRiskLevel['low'] || 0}
   🟡 Medium Risk: ${stats.byRiskLevel['medium'] || 0}
   🔴 High Risk: ${stats.byRiskLevel['high'] || 0}
   
🔧 Safe Fixes (Ready to Apply): ${safeFixes.length}
${safeFixes.map(fix => `   ✨ ${fix.problemDescription} (${fix.confidenceLevel}% confidence)`).join('\n')}
   
👥 Fixes Requiring Human Review: ${reviewFixes.length}
${reviewFixes.map(fix => `   🧠 ${fix.problemDescription} (${fix.riskAssessment} risk)`).join('\n')}

Your intelligent fix repository is maintaining consciousness platform wisdom! 🌊
    `);
    
  } catch (error) {
    console.error('🌊 Fix repository demo encountered gentle waves:', handleCosmicError(error, 'Fix Repository Demo'));
  }
}