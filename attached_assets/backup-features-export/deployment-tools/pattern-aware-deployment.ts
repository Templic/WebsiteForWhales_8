/**
 * Pattern Aware Deployment System
 * 
 * This system integrates:
 * 1. Enhanced architecture components (chunking, model selection, etc.)
 * 2. Existing error pattern documentation from the codebase
 * 3. Advanced learning mechanisms to improve over time
 */

import { 
  ChunkedJSONProcessor, 
  SmartModelSelector, 
  StateManagementRefactorer, 
  ErrorPatternCache, 
  ComponentHealthAnalyzer,
  EnhancedErrorProcessor
} from './enhanced-system-architecture';
import * as fs from 'fs';
import * as path from 'path';
import { enhancedAnalyzer } from './enhanced-confidence-system';
import { createHash } from 'crypto';

// ====== PATTERN EXTRACTION FROM EXISTING DOCUMENTATION ======

/**
 * Pattern documentation source types
 */
type PatternSource = 'README' | 'ERROR_LOGS' | 'DOCUMENTATION' | 'LEARNED';

/**
 * Documented error pattern
 */
interface DocumentedPattern {
  pattern: string;
  explanation: string;
  fix: string;
  confidence: number;
  source: PatternSource;
  tags: string[];
  lastUsed?: Date;
  usageCount?: number;
}

/**
 * Pattern store for documented solutions
 */
class DocumentedPatternStore {
  private patterns: DocumentedPattern[] = [];
  private readonly patternCacheFile = 'error-pattern-cache.json';
  private static instance: DocumentedPatternStore;
  
  private constructor() {
    this.loadPatterns();
  }
  
  static getInstance(): DocumentedPatternStore {
    if (!DocumentedPatternStore.instance) {
      DocumentedPatternStore.instance = new DocumentedPatternStore();
    }
    return DocumentedPatternStore.instance;
  }
  
  /**
   * Add a pattern to the store
   */
  addPattern(pattern: DocumentedPattern): void {
    // Check if pattern already exists
    const existing = this.patterns.findIndex(p => 
      this.normalizePattern(p.pattern) === this.normalizePattern(pattern.pattern));
      
    if (existing >= 0) {
      // Update existing pattern if new one has higher confidence
      if (pattern.confidence > this.patterns[existing].confidence) {
        this.patterns[existing] = {
          ...pattern,
          usageCount: (this.patterns[existing].usageCount || 0) + 1,
          lastUsed: new Date()
        };
      }
    } else {
      // Add new pattern
      this.patterns.push({
        ...pattern,
        usageCount: 1,
        lastUsed: new Date()
      });
    }
    
    // Save updated patterns
    this.savePatterns();
  }
  
  /**
   * Find a matching pattern
   */
  findMatchingPattern(errorMessage: string): DocumentedPattern | null {
    const normalizedError = this.normalizePattern(errorMessage);
    
    // Try exact match first
    const exactMatch = this.patterns.find(p => 
      this.normalizePattern(p.pattern) === normalizedError);
      
    if (exactMatch) {
      return this.updateUsage(exactMatch);
    }
    
    // Try substring matches
    const substringMatches = this.patterns.filter(p => 
      normalizedError.includes(this.normalizePattern(p.pattern)) ||
      this.normalizePattern(p.pattern).includes(normalizedError));
      
    if (substringMatches.length > 0) {
      // Return the highest confidence match
      const bestMatch = substringMatches.reduce((prev, current) => 
        (current.confidence > prev.confidence) ? current : prev);
        
      return this.updateUsage(bestMatch);
    }
    
    // Try fuzzy matching based on key error terms
    const errorTerms = this.extractErrorTerms(normalizedError);
    if (errorTerms.length > 0) {
      const termMatches = this.patterns.filter(p => {
        const patternTerms = this.extractErrorTerms(this.normalizePattern(p.pattern));
        return errorTerms.some(term => patternTerms.includes(term));
      });
      
      if (termMatches.length > 0) {
        // Return the highest confidence match among term matches
        const bestMatch = termMatches.reduce((prev, current) => 
          (current.confidence > prev.confidence) ? current : prev);
          
        return this.updateUsage(bestMatch);
      }
    }
    
    return null;
  }
  
  /**
   * Load patterns from documentation directories
   */
  async loadPatternsFromDocumentation(docsDir: string = './docs'): Promise<void> {
    try {
      console.log(`Loading patterns from documentation in: ${docsDir}`);
      
      // Find all markdown files
      const files = this.findFilesRecursively(docsDir, '.md');
      console.log(`Found ${files.length} documentation files`);
      
      let patternsFound = 0;
      
      for (const file of files) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Look for error pattern sections
          // Format we're looking for:
          // ### Error: [pattern]
          // [explanation]
          // ```typescript
          // [fix code]
          // ```
          const errorSections = content.match(/###\s*Error:([^\n]+)([\s\S]*?)```(?:typescript|ts|js|javascript)?([\s\S]*?)```/g);
          
          if (errorSections) {
            for (const section of errorSections) {
              const patternMatch = section.match(/###\s*Error:([^\n]+)/);
              const codeMatch = section.match(/```(?:typescript|ts|js|javascript)?([\s\S]*?)```/);
              
              if (patternMatch && codeMatch) {
                const pattern = patternMatch[1].trim();
                const fixCode = codeMatch[1].trim();
                
                // Extract explanation (text between pattern and code block)
                const explanationMatch = section.match(new RegExp(`${patternMatch[0]}([\\s\\S]*?)````, 'g'));
                const explanation = explanationMatch ? section.substring(patternMatch[0].length, section.indexOf('```')).trim() : '';
                
                this.addPattern({
                  pattern,
                  explanation,
                  fix: fixCode,
                  confidence: 0.9, // High confidence for documented patterns
                  source: 'DOCUMENTATION',
                  tags: ['documented', this.extractPatternType(pattern)]
                });
                
                patternsFound++;
              }
            }
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
        }
      }
      
      console.log(`Added ${patternsFound} patterns from documentation`);
      
      // Now process README files for common patterns
      await this.processReadmeFiles();
    } catch (error) {
      console.error('Error loading patterns from documentation:', error);
    }
  }
  
  /**
   * Process README files for error patterns
   */
  private async processReadmeFiles(): Promise<void> {
    try {
      const readmeFiles = [
        './README.md',
        './README-typescript-error-management.md',
        './README-security-optimizations.md',
        './TypeScript-Error-Management-README.md'
      ];
      
      let patternsFound = 0;
      
      for (const file of readmeFiles) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          
          // Look for lists of common errors or patterns
          // Format we're looking for:
          // - **[pattern]**: [explanation]
          const patternMatches = content.match(/[-*]\s+\*\*([^:]+)\*\*:\s+([^\n]+)/g);
          
          if (patternMatches) {
            for (const match of patternMatches) {
              const [_, pattern, explanation] = match.match(/[-*]\s+\*\*([^:]+)\*\*:\s+([^\n]+)/) || [];
              
              if (pattern && explanation) {
                // For patterns from README, we don't have fix code directly
                // but we store the explanation for use during analysis
                this.addPattern({
                  pattern,
                  explanation,
                  fix: '', // Will be generated by AI
                  confidence: 0.75, // Medium confidence
                  source: 'README',
                  tags: ['readme', this.extractPatternType(pattern)]
                });
                
                patternsFound++;
              }
            }
          }
        }
      }
      
      console.log(`Added ${patternsFound} patterns from README files`);
    } catch (error) {
      console.error('Error processing README files:', error);
    }
  }
  
  /**
   * Process error logs for patterns
   */
  async loadPatternsFromErrorLogs(logsDir: string = './logs'): Promise<void> {
    try {
      console.log(`Loading patterns from error logs in: ${logsDir}`);
      
      // Find all log files
      const files = this.findFilesRecursively(logsDir, '.log');
      console.log(`Found ${files.length} log files`);
      
      const processedLogs = new Set<string>(); // Avoid duplicates
      let patternsFound = 0;
      
      for (const file of files) {
        if (file.includes('error') || file.includes('fixes')) {
          try {
            const content = fs.readFileSync(file, 'utf8');
            const lines = content.split('\n');
            
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              
              // Look for error pattern and potential fix pairs
              if (line.includes('ERROR:') || line.includes('Error:')) {
                const errorPattern = line.replace(/.*(?:ERROR:|Error:)\s*/, '').trim();
                
                // Skip if already processed
                if (processedLogs.has(errorPattern)) continue;
                processedLogs.add(errorPattern);
                
                // Look for potential fix in next few lines
                let fix = '';
                let explanation = '';
                
                // Look ahead for potential fixes (marked with "FIX:" or code blocks)
                for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
                  const nextLine = lines[j];
                  
                  if (nextLine.includes('FIX:') || nextLine.includes('SOLUTION:')) {
                    fix = nextLine.replace(/.*(?:FIX:|SOLUTION:)\s*/, '').trim();
                    break;
                  } else if (nextLine.startsWith('```') || nextLine.includes('Fixed code:')) {
                    // Extract code block
                    let codeBlock = '';
                    let k = j + 1;
                    
                    while (k < lines.length && !lines[k].startsWith('```')) {
                      codeBlock += lines[k] + '\n';
                      k++;
                    }
                    
                    fix = codeBlock.trim();
                    break;
                  } else if (explanation.length < 100 && !nextLine.includes('ERROR:')) {
                    // Collect explanation lines
                    explanation += ' ' + nextLine.trim();
                  }
                }
                
                if (errorPattern) {
                  this.addPattern({
                    pattern: errorPattern,
                    explanation: explanation.trim(),
                    fix,
                    confidence: fix ? 0.85 : 0.6, // Higher confidence if fix exists
                    source: 'ERROR_LOGS',
                    tags: ['error_log', this.extractPatternType(errorPattern)]
                  });
                  
                  patternsFound++;
                }
              }
            }
          } catch (error) {
            console.error(`Error processing log file ${file}:`, error);
          }
        }
      }
      
      console.log(`Added ${patternsFound} patterns from error logs`);
    } catch (error) {
      console.error('Error loading patterns from error logs:', error);
    }
  }
  
  /**
   * Extract fixed code from log files
   */
  async loadFixesFromLogs(): Promise<void> {
    const fixLogFiles = [
      './duplicate-cn-imports-fixes.log',
      './duplicate-imports-fixes.log',
      './duplicate-react-import-advanced-fixes.log',
      './duplicate-react-import-fixes.log',
      './duplicate-type-imports-fixes.log',
      './frequency-visualizer-fixes.log',
      './http2-optimization-fixes.log',
      './lib-utils-fixes.log',
      './memory-leak-detector-fixes.log',
      './module-paths-fixes.log',
      './order-confirmation-page-fixes.log',
      './parameter-error-fixes.log'
    ];
    
    let patternsAdded = 0;
    
    for (const file of fixLogFiles) {
      if (fs.existsSync(file)) {
        try {
          console.log(`Processing fix log: ${file}`);
          const content = fs.readFileSync(file, 'utf8');
          
          // Extract file name as category
          const category = path.basename(file, '.log')
            .replace(/-fixes$/, '')
            .replace(/-/g, ' ');
          
          // Find sections with "Before:" and "After:" or "Original:" and "Fixed:"
          const beforeAfterPattern = /(?:Before|Original):\s*([\s\S]*?)(?:After|Fixed):\s*([\s\S]*?)(?=(?:Before|Original):|$)/g;
          
          let match;
          while ((match = beforeAfterPattern.exec(content)) !== null) {
            const beforeCode = match[1].trim();
            const afterCode = match[2].trim();
            
            if (beforeCode && afterCode) {
              // Determine what changed to extract the error pattern
              const issueType = this.determineIssueType(beforeCode, afterCode, category);
              
              this.addPattern({
                pattern: issueType,
                explanation: `Issue detected in category: ${category}`,
                fix: afterCode,
                confidence: 0.88,
                source: 'ERROR_LOGS',
                tags: ['fix_log', category]
              });
              
              patternsAdded++;
            }
          }
        } catch (error) {
          console.error(`Error processing fix log ${file}:`, error);
        }
      }
    }
    
    console.log(`Added ${patternsAdded} patterns from fix logs`);
  }
  
  /**
   * Find all files recursively with a specific extension
   */
  private findFilesRecursively(dir: string, extension: string): string[] {
    if (!fs.existsSync(dir)) {
      return [];
    }
    
    const files: string[] = [];
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip specific directories
        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          files.push(...this.findFilesRecursively(fullPath, extension));
        }
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  /**
   * Determine the issue type from before/after code samples
   */
  private determineIssueType(before: string, after: string, category: string): string {
    // Analyze the differences to determine the issue type
    
    // Check for import issues
    if (category.includes('import')) {
      if (before.includes('import') && after.includes('import')) {
        const beforeImports = before.match(/import .* from .*/g) || [];
        const afterImports = after.match(/import .* from .*/g) || [];
        
        if (beforeImports.length > afterImports.length) {
          return 'Duplicate import declaration';
        } else if (before.includes('* as')) {
          return 'Wildcard import replaced with specific imports';
        } else {
          return 'Import statement issue fixed';
        }
      }
    }
    
    // Check for specific patterns
    if (before.includes('useState') && after.includes('useReducer')) {
      return 'Complex state management refactored to useReducer';
    }
    
    if (before.includes('any') && !after.includes('any')) {
      return 'Replaced any type with specific type';
    }
    
    if (before.includes('// @ts-ignore') || before.includes('// @ts-nocheck')) {
      return 'Removed TypeScript suppression comments';
    }
    
    // Check for missing properties
    const missingPropMatch = before.match(/Property '([^']+)' does not exist/);
    if (missingPropMatch) {
      return `Missing property: ${missingPropMatch[1]}`;
    }
    
    // Default to category-based issue
    return `${category} issue fixed`;
  }
  
  /**
   * Save patterns to JSON file
   */
  private savePatterns(): void {
    try {
      fs.writeFileSync(
        this.patternCacheFile,
        JSON.stringify(this.patterns, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Error saving patterns:', error);
    }
  }
  
  /**
   * Load patterns from JSON file
   */
  private loadPatterns(): void {
    try {
      if (fs.existsSync(this.patternCacheFile)) {
        const data = fs.readFileSync(this.patternCacheFile, 'utf8');
        this.patterns = JSON.parse(data);
        console.log(`Loaded ${this.patterns.length} patterns from cache`);
      }
    } catch (error) {
      console.error('Error loading patterns:', error);
      // Start with empty patterns
      this.patterns = [];
    }
  }
  
  /**
   * Update usage statistics for a pattern
   */
  private updateUsage(pattern: DocumentedPattern): DocumentedPattern {
    const index = this.patterns.findIndex(p => p.pattern === pattern.pattern);
    
    if (index >= 0) {
      this.patterns[index] = {
        ...this.patterns[index],
        usageCount: (this.patterns[index].usageCount || 0) + 1,
        lastUsed: new Date()
      };
      
      this.savePatterns();
      return this.patterns[index];
    }
    
    return pattern;
  }
  
  /**
   * Extract error terms for fuzzy matching
   */
  private extractErrorTerms(pattern: string): string[] {
    // Split and extract key terms from error pattern
    const terms = pattern
      .split(/[\s,.(){}[\]'"]+/)
      .filter(term => 
        term.length > 3 && 
        !['error', 'the', 'and', 'for', 'with', 'this', 'that', 'from'].includes(term)
      );
      
    return [...new Set(terms)]; // Remove duplicates
  }
  
  /**
   * Extract pattern type based on error message
   */
  private extractPatternType(pattern: string): string {
    const lowerPattern = pattern.toLowerCase();
    
    if (lowerPattern.includes('type') && lowerPattern.includes('assign')) {
      return 'type-assignment';
    } else if (lowerPattern.includes('import')) {
      return 'import-error';
    } else if (lowerPattern.includes('undefined') || lowerPattern.includes('null')) {
      return 'null-undefined';
    } else if (lowerPattern.includes('syntax')) {
      return 'syntax-error';
    } else if (lowerPattern.includes('hook') || lowerPattern.includes('useeffect') || lowerPattern.includes('usestate')) {
      return 'react-hooks';
    } else if (lowerPattern.includes('component')) {
      return 'react-component';
    } else if (lowerPattern.includes('security') || lowerPattern.includes('xss') || lowerPattern.includes('injection')) {
      return 'security';
    } else {
      return 'general';
    }
  }
  
  /**
   * Normalize pattern for matching
   */
  private normalizePattern(pattern: string): string {
    return pattern
      .toLowerCase()
      .replace(/['"]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * Get all patterns
   */
  getAllPatterns(): DocumentedPattern[] {
    return [...this.patterns];
  }
  
  /**
   * Get patterns by tag
   */
  getPatternsByTag(tag: string): DocumentedPattern[] {
    return this.patterns.filter(p => p.tags.includes(tag));
  }
  
  /**
   * Get pattern count by source
   */
  getPatternCountBySource(): Record<PatternSource, number> {
    const counts: Partial<Record<PatternSource, number>> = {};
    
    for (const pattern of this.patterns) {
      counts[pattern.source] = (counts[pattern.source] || 0) + 1;
    }
    
    return {
      README: counts.README || 0,
      ERROR_LOGS: counts.ERROR_LOGS || 0,
      DOCUMENTATION: counts.DOCUMENTATION || 0,
      LEARNED: counts.LEARNED || 0
    };
  }
}

/**
 * Enhanced Pattern-Aware Error Processor
 * Extends the base processor with pattern documentation integration
 */
class PatternAwareErrorProcessor {
  private processor = new EnhancedErrorProcessor();
  private patternStore = DocumentedPatternStore.getInstance();
  
  /**
   * Initialize pattern store with existing documentation
   */
  async initialize(scanDocs: boolean = true): Promise<void> {
    if (scanDocs) {
      await this.patternStore.loadPatternsFromDocumentation();
      await this.patternStore.loadPatternsFromErrorLogs();
      await this.patternStore.loadFixesFromLogs();
    }
    
    const counts = this.patternStore.getPatternCountBySource();
    console.log('Pattern store initialized with:');
    console.log(`- Documentation: ${counts.DOCUMENTATION} patterns`);
    console.log(`- README files: ${counts.README} patterns`);
    console.log(`- Error logs: ${counts.ERROR_LOGS} patterns`);
    console.log(`- Learned: ${counts.LEARNED} patterns`);
  }
  
  /**
   * Process an error with pattern awareness
   */
  async processError(errorInfo: any, filePath: string): Promise<any> {
    console.log(`Processing error in ${path.basename(filePath)} with pattern awareness...`);
    
    // Try to find matching pattern first
    const foundPattern = this.patternStore.findMatchingPattern(errorInfo.message);
    
    if (foundPattern && foundPattern.fix) {
      console.log(`🎯 Found matching pattern: ${foundPattern.pattern.substring(0, 50)}...`);
      console.log(`🔍 Source: ${foundPattern.source}, Confidence: ${foundPattern.confidence}`);
      
      return {
        fix: { 
          fixedCode: foundPattern.fix,
          original: fs.readFileSync(filePath, 'utf8')
        },
        confidence: foundPattern.confidence,
        processingTime: 0,
        fromPattern: true,
        pattern: {
          source: foundPattern.source,
          explanation: foundPattern.explanation
        }
      };
    }
    
    // If no matching pattern with fix, use enhanced processor
    console.log('No exact pattern match found, using enhanced processor...');
    const result = await this.processor.processError(errorInfo, filePath);
    
    // If fix was successful, store it as a learned pattern
    if (result.confidence > 0.85 && result.fix?.fixedCode) {
      this.patternStore.addPattern({
        pattern: errorInfo.message,
        explanation: result.explanation || 'Automatically fixed by system',
        fix: result.fix.fixedCode,
        confidence: result.confidence,
        source: 'LEARNED',
        tags: ['learned', 'ai-generated']
      });
      
      console.log('✅ Added new learned pattern based on successful fix');
    }
    
    return result;
  }
  
  /**
   * Get pattern statistics
   */
  getPatternStats(): any {
    const patterns = this.patternStore.getAllPatterns();
    const countBySource = this.patternStore.getPatternCountBySource();
    
    // Collect tags
    const tags: Record<string, number> = {};
    patterns.forEach(p => {
      p.tags.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1;
      });
    });
    
    return {
      totalPatterns: patterns.length,
      countBySource,
      topTags: Object.entries(tags)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }))
    };
  }
}

/**
 * Deploy a pattern-aware error processing system
 */
async function deployPatternAwareSystem(
  scanDir: string = '.', 
  outDir: string = 'src',
  maxFiles: number = 50,
  production: boolean = true
): Promise<void> {
  console.log(`Initializing Pattern-Aware Deployment System...`);
  console.log(`Scan directory: ${scanDir}`);
  console.log(`Output directory: ${outDir}`);
  console.log(`Max files: ${maxFiles}`);
  console.log(`Production mode: ${production}`);
  
  // Initialize the pattern-aware processor
  const processor = new PatternAwareErrorProcessor();
  await processor.initialize();
  
  // Display pattern statistics
  const stats = processor.getPatternStats();
  console.log('\nPattern Statistics:');
  console.log(`Total patterns: ${stats.totalPatterns}`);
  console.log('Patterns by source:');
  Object.entries(stats.countBySource).forEach(([source, count]) => {
    console.log(`- ${source}: ${count}`);
  });
  
  console.log('\nTop tags:');
  stats.topTags.forEach(({ tag, count }) => {
    console.log(`- ${tag}: ${count}`);
  });
  
  // In a real deployment, we would now scan for errors and process them
  console.log('\nReady for deployment!');
}

// Export the main deployment function
export default deployPatternAwareSystem;

// For testing
if (require.main === module) {
  deployPatternAwareSystem().catch(console.error);
}