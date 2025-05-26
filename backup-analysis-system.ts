/**
 * Dale Loves Whales - Backup Analysis System
 * Version 7.9 Selective Update Framework
 * 
 * This system analyzes the 7.8 backup to identify beneficial features
 * while filtering out potentially unstable components that caused issues.
 */

import { promises as fs } from 'fs';
import path from 'path';

interface FeatureAnalysis {
  name: string;
  path: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  dependencies: string[];
  benefits: string[];
  potentialIssues: string[];
  recommendedAction: 'implement' | 'review' | 'skip' | 'modify';
}

interface BackupInventory {
  totalFiles: number;
  categories: Record<string, number>;
  features: FeatureAnalysis[];
  safeToImplement: FeatureAnalysis[];
  needsReview: FeatureAnalysis[];
  shouldSkip: FeatureAnalysis[];
}

class BackupAnalysisSystem {
  private backupPath: string;
  private currentPath: string;
  private inventory: BackupInventory;

  constructor(backupPath: string, currentPath: string = '.') {
    this.backupPath = backupPath;
    this.currentPath = currentPath;
    this.inventory = {
      totalFiles: 0,
      categories: {},
      features: [],
      safeToImplement: [],
      needsReview: [],
      shouldSkip: []
    };
  }

  /**
   * Main analysis workflow
   */
  async analyzeBackup(): Promise<BackupInventory> {
    console.log('🔍 Starting sophisticated backup analysis...');
    
    await this.scanBackupStructure();
    await this.analyzeFeatures();
    await this.compareWithCurrent();
    await this.generateRecommendations();
    
    return this.inventory;
  }

  /**
   * Scan the backup directory structure
   */
  private async scanBackupStructure(): Promise<void> {
    const backupDir = path.join(this.backupPath, 'backup-features-export');
    
    try {
      const categories = await fs.readdir(backupDir);
      
      for (const category of categories) {
        if (category.startsWith('.') || category.endsWith('.md')) continue;
        
        const categoryPath = path.join(backupDir, category);
        const stat = await fs.stat(categoryPath);
        
        if (stat.isDirectory()) {
          const files = await this.getFilesInDirectory(categoryPath);
          this.inventory.categories[category] = files.length;
          this.inventory.totalFiles += files.length;
          
          console.log(`📁 Found category: ${category} (${files.length} files)`);
        }
      }
    } catch (error) {
      console.error('Error scanning backup structure:', error);
    }
  }

  /**
   * Analyze individual features for safety and benefit
   */
  private async analyzeFeatures(): Promise<void> {
    const backupDir = path.join(this.backupPath, 'backup-features-export');
    
    for (const category of Object.keys(this.inventory.categories)) {
      const categoryPath = path.join(backupDir, category);
      const files = await this.getFilesInDirectory(categoryPath);
      
      for (const file of files) {
        const analysis = await this.analyzeFeatureFile(file, category);
        this.inventory.features.push(analysis);
      }
    }
  }

  /**
   * Analyze a specific feature file
   */
  private async analyzeFeatureFile(filePath: string, category: string): Promise<FeatureAnalysis> {
    const fileName = path.basename(filePath, path.extname(filePath));
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      const analysis: FeatureAnalysis = {
        name: fileName,
        path: filePath,
        category,
        riskLevel: this.assessRiskLevel(fileName, content, category),
        dependencies: this.extractDependencies(content),
        benefits: this.identifyBenefits(fileName, content),
        potentialIssues: this.identifyPotentialIssues(fileName, content),
        recommendedAction: 'review'
      };
      
      // Determine recommendation based on analysis
      analysis.recommendedAction = this.determineRecommendation(analysis);
      
      return analysis;
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error);
      return {
        name: fileName,
        path: filePath,
        category,
        riskLevel: 'high',
        dependencies: [],
        benefits: [],
        potentialIssues: ['Failed to analyze file'],
        recommendedAction: 'skip'
      };
    }
  }

  /**
   * Assess risk level based on file name, content, and category
   */
  private assessRiskLevel(fileName: string, content: string, category: string): 'low' | 'medium' | 'high' {
    // High-risk indicators
    const highRiskPatterns = [
      /express\.Router/gi,
      /database.*drop/gi,
      /delete.*table/gi,
      /process\.exit/gi,
      /eval\(/gi,
      /exec\(/gi,
      /child_process/gi,
      /fs\.unlink/gi,
      /rm -rf/gi
    ];

    // Medium-risk indicators
    const mediumRiskPatterns = [
      /middleware/gi,
      /authentication/gi,
      /security/gi,
      /cors/gi,
      /session/gi,
      /jwt/gi
    ];

    // Check for high-risk patterns
    if (highRiskPatterns.some(pattern => pattern.test(content) || pattern.test(fileName))) {
      return 'high';
    }

    // Check for medium-risk patterns
    if (mediumRiskPatterns.some(pattern => pattern.test(content) || pattern.test(fileName))) {
      return 'medium';
    }

    // Categories that are generally safer
    if (['ui-cosmic-components', 'documentation', 'examples'].includes(category)) {
      return 'low';
    }

    return 'medium';
  }

  /**
   * Extract dependencies from file content
   */
  private extractDependencies(content: string): string[] {
    const dependencies: string[] = [];
    
    // Extract import statements
    const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g);
    if (importMatches) {
      importMatches.forEach(match => {
        const dep = match.match(/from\s+['"]([^'"]+)['"]/)?.[1];
        if (dep && !dep.startsWith('.') && !dep.startsWith('/')) {
          dependencies.push(dep);
        }
      });
    }

    // Extract require statements
    const requireMatches = content.match(/require\(['"]([^'"]+)['"]\)/g);
    if (requireMatches) {
      requireMatches.forEach(match => {
        const dep = match.match(/require\(['"]([^'"]+)['"]\)/)?.[1];
        if (dep && !dep.startsWith('.') && !dep.startsWith('/')) {
          dependencies.push(dep);
        }
      });
    }

    return [...new Set(dependencies)];
  }

  /**
   * Identify potential benefits of the feature
   */
  private identifyBenefits(fileName: string, content: string): string[] {
    const benefits: string[] = [];
    
    // AI and intelligence benefits
    if (/ai|intelligent|smart|auto/gi.test(fileName) || /ai|machine.*learn/gi.test(content)) {
      benefits.push('Enhanced AI capabilities');
    }

    // Security benefits
    if (/security|protect|safe|secure/gi.test(fileName) || /security|vulnerability/gi.test(content)) {
      benefits.push('Improved security posture');
    }

    // Performance benefits
    if (/performance|optimization|speed|cache/gi.test(fileName) || /performance|optimize/gi.test(content)) {
      benefits.push('Performance improvements');
    }

    // TypeScript benefits
    if (/typescript|ts-|error.*fix/gi.test(fileName) || /typescript.*error/gi.test(content)) {
      benefits.push('Better TypeScript support');
    }

    // UI/UX benefits
    if (/ui|component|cosmic|visual/gi.test(fileName) || /component|react|tsx/gi.test(content)) {
      benefits.push('Enhanced user interface');
    }

    return benefits;
  }

  /**
   * Identify potential issues with the feature
   */
  private identifyPotentialIssues(fileName: string, content: string): string[] {
    const issues: string[] = [];
    
    // Check for potential stability issues that plagued 7.8
    if (/experimental|beta|alpha/gi.test(content)) {
      issues.push('Contains experimental code');
    }

    if (/process\.exit|system\.exit/gi.test(content)) {
      issues.push('May cause application termination');
    }

    if (/global\.|window\./gi.test(content)) {
      issues.push('Modifies global state');
    }

    if (content.includes('any') && content.split('any').length > 5) {
      issues.push('Heavy use of TypeScript any type');
    }

    if (/override|monkey.*patch/gi.test(content)) {
      issues.push('May override existing functionality');
    }

    return issues;
  }

  /**
   * Determine recommendation based on analysis
   */
  private determineRecommendation(analysis: FeatureAnalysis): 'implement' | 'review' | 'skip' | 'modify' {
    if (analysis.riskLevel === 'high' || analysis.potentialIssues.length > 2) {
      return 'skip';
    }

    if (analysis.riskLevel === 'low' && analysis.benefits.length > 0 && analysis.potentialIssues.length === 0) {
      return 'implement';
    }

    if (analysis.benefits.length > analysis.potentialIssues.length) {
      return 'review';
    }

    return 'modify';
  }

  /**
   * Compare with current codebase
   */
  private async compareWithCurrent(): Promise<void> {
    // Check if similar files exist in current codebase
    for (const feature of this.inventory.features) {
      const currentFilePath = path.join(this.currentPath, path.basename(feature.path));
      
      try {
        await fs.access(currentFilePath);
        feature.potentialIssues.push('File with same name exists in current codebase');
        if (feature.recommendedAction === 'implement') {
          feature.recommendedAction = 'review';
        }
      } catch {
        // File doesn't exist, which is good for implementation
      }
    }
  }

  /**
   * Generate final recommendations
   */
  private async generateRecommendations(): Promise<void> {
    this.inventory.safeToImplement = this.inventory.features.filter(f => f.recommendedAction === 'implement');
    this.inventory.needsReview = this.inventory.features.filter(f => f.recommendedAction === 'review' || f.recommendedAction === 'modify');
    this.inventory.shouldSkip = this.inventory.features.filter(f => f.recommendedAction === 'skip');

    console.log(`\n📊 Analysis Complete:`);
    console.log(`✅ Safe to implement: ${this.inventory.safeToImplement.length} files`);
    console.log(`⚠️  Needs review: ${this.inventory.needsReview.length} files`);
    console.log(`❌ Should skip: ${this.inventory.shouldSkip.length} files`);
  }

  /**
   * Generate detailed report
   */
  async generateReport(): Promise<string> {
    let report = `# Dale Loves Whales - Backup Analysis Report\n`;
    report += `## Version 7.8 → 7.9 Selective Update Analysis\n\n`;
    
    report += `### Summary\n`;
    report += `- **Total Files Analyzed**: ${this.inventory.totalFiles}\n`;
    report += `- **Safe to Implement**: ${this.inventory.safeToImplement.length}\n`;
    report += `- **Needs Review**: ${this.inventory.needsReview.length}\n`;
    report += `- **Should Skip**: ${this.inventory.shouldSkip.length}\n\n`;

    report += `### Categories\n`;
    Object.entries(this.inventory.categories).forEach(([category, count]) => {
      report += `- **${category}**: ${count} files\n`;
    });

    report += `\n### Safe to Implement (Low Risk)\n`;
    this.inventory.safeToImplement.forEach(feature => {
      report += `#### ${feature.name}\n`;
      report += `- **Category**: ${feature.category}\n`;
      report += `- **Benefits**: ${feature.benefits.join(', ')}\n`;
      report += `- **Dependencies**: ${feature.dependencies.join(', ') || 'None'}\n\n`;
    });

    report += `\n### Needs Review (Medium Risk)\n`;
    this.inventory.needsReview.forEach(feature => {
      report += `#### ${feature.name}\n`;
      report += `- **Category**: ${feature.category}\n`;
      report += `- **Risk Level**: ${feature.riskLevel}\n`;
      report += `- **Benefits**: ${feature.benefits.join(', ')}\n`;
      report += `- **Potential Issues**: ${feature.potentialIssues.join(', ')}\n\n`;
    });

    return report;
  }

  /**
   * Helper: Get all files in directory recursively
   */
  private async getFilesInDirectory(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const items = await fs.readdir(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory()) {
          const subFiles = await this.getFilesInDirectory(fullPath);
          files.push(...subFiles);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
    }
    
    return files;
  }
}

// Main execution
async function main() {
  const analyzer = new BackupAnalysisSystem('./restoration-staging');
  
  try {
    const inventory = await analyzer.analyzeBackup();
    const report = await analyzer.generateReport();
    
    // Save the report
    await fs.writeFile('backup-analysis-report.md', report);
    console.log('\n📋 Detailed report saved to backup-analysis-report.md');
    
    // Save the inventory as JSON for programmatic access
    await fs.writeFile('backup-inventory.json', JSON.stringify(inventory, null, 2));
    console.log('📊 Analysis data saved to backup-inventory.json');
    
  } catch (error) {
    console.error('Analysis failed:', error);
    process.exit(1);
  }
}

// Auto-execute if this is the main module
main();

export { BackupAnalysisSystem, type FeatureAnalysis, type BackupInventory };