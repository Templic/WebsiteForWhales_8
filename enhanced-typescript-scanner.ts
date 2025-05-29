/**
 * Enhanced TypeScript Scanner
 * 
 * Comprehensive error detection with advanced pattern recognition
 * and automated fix suggestions for remaining TypeScript issues
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface EnhancedTypeScriptError {
  file: string;
  line: number;
  column: number;
  code: number;
  message: string;
  category: 'error' | 'warning' | 'suggestion';
  severity: 'critical' | 'high' | 'medium' | 'low';
  fixable: boolean;
  suggestedFix?: string;
  relatedFiles?: string[];
  pattern: string;
}

interface ScanResults {
  totalErrors: number;
  errorsByPattern: Record<string, number>;
  errorsByFile: Record<string, number>;
  fixableErrors: number;
  criticalErrors: number;
  errors: EnhancedTypeScriptError[];
  scanTimestamp: string;
  completionStatus: 'complete' | 'partial' | 'failed';
}

class EnhancedTypeScriptScanner {
  private projectRoot: string;
  private configPath: string;
  
  constructor(projectRoot: string = '.') {
    this.projectRoot = path.resolve(projectRoot);
    this.configPath = path.join(this.projectRoot, 'tsconfig.json');
  }

  /**
   * Perform enhanced TypeScript scan with pattern detection
   */
  async performEnhancedScan(): Promise<ScanResults> {
    console.log('🔍 Starting enhanced TypeScript scan...');
    
    const results: ScanResults = {
      totalErrors: 0,
      errorsByPattern: {},
      errorsByFile: {},
      fixableErrors: 0,
      criticalErrors: 0,
      errors: [],
      scanTimestamp: new Date().toISOString(),
      completionStatus: 'complete'
    };

    try {
      // Load TypeScript configuration
      const configFile = ts.readConfigFile(this.configPath, ts.sys.readFile);
      if (configFile.error) {
        throw new Error(`Failed to read tsconfig.json: ${configFile.error.messageText}`);
      }

      const parsedConfig = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        this.projectRoot
      );

      // Create TypeScript program
      const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
      
      // Get all diagnostics
      const diagnostics = [
        ...program.getConfigFileParsingDiagnostics(),
        ...program.getSyntacticDiagnostics(),
        ...program.getSemanticDiagnostics(),
        ...program.getGlobalDiagnostics()
      ];

      // Process each diagnostic
      for (const diagnostic of diagnostics) {
        const error = this.processDiagnostic(diagnostic);
        if (error) {
          results.errors.push(error);
          
          // Update pattern counts
          results.errorsByPattern[error.pattern] = (results.errorsByPattern[error.pattern] || 0) + 1;
          
          // Update file counts
          results.errorsByFile[error.file] = (results.errorsByFile[error.file] || 0) + 1;
          
          // Update counters
          if (error.fixable) results.fixableErrors++;
          if (error.severity === 'critical') results.criticalErrors++;
        }
      }

      results.totalErrors = results.errors.length;
      
      console.log(`✅ Enhanced scan complete: ${results.totalErrors} issues found`);
      console.log(`   - Critical: ${results.criticalErrors}`);
      console.log(`   - Fixable: ${results.fixableErrors}`);
      
      return results;

    } catch (error) {
      console.error('❌ Enhanced scan failed:', error);
      results.completionStatus = 'failed';
      return results;
    }
  }

  /**
   * Process TypeScript diagnostic into enhanced error
   */
  private processDiagnostic(diagnostic: ts.Diagnostic): EnhancedTypeScriptError | null {
    if (!diagnostic.file) return null;

    const fileName = diagnostic.file.fileName;
    const lineAndChar = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start || 0);
    
    const error: EnhancedTypeScriptError = {
      file: path.relative(this.projectRoot, fileName),
      line: lineAndChar.line + 1,
      column: lineAndChar.character + 1,
      code: diagnostic.code,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      category: this.getCategoryFromDiagnostic(diagnostic),
      severity: this.getSeverityFromCode(diagnostic.code),
      fixable: this.isFixable(diagnostic.code),
      pattern: this.getErrorPattern(diagnostic.code, diagnostic.messageText),
      suggestedFix: this.getSuggestedFix(diagnostic.code, diagnostic.messageText)
    };

    return error;
  }

  /**
   * Determine error category
   */
  private getCategoryFromDiagnostic(diagnostic: ts.Diagnostic): 'error' | 'warning' | 'suggestion' {
    switch (diagnostic.category) {
      case ts.DiagnosticCategory.Error: return 'error';
      case ts.DiagnosticCategory.Warning: return 'warning';
      case ts.DiagnosticCategory.Suggestion: return 'suggestion';
      default: return 'error';
    }
  }

  /**
   * Determine severity based on error code
   */
  private getSeverityFromCode(code: number): 'critical' | 'high' | 'medium' | 'low' {
    const criticalCodes = [2307, 2339, 2322, 2345, 2364]; // Module not found, property missing, type errors
    const highCodes = [2551, 2352, 2554, 2555]; // Export conflicts, isolatedModules issues
    const mediumCodes = [2304, 2305, 2377, 7006]; // Cannot find name, implicit any
    
    if (criticalCodes.includes(code)) return 'critical';
    if (highCodes.includes(code)) return 'high';
    if (mediumCodes.includes(code)) return 'medium';
    return 'low';
  }

  /**
   * Check if error is automatically fixable
   */
  private isFixable(code: number): boolean {
    const fixableCodes = [2552, 1202, 2305, 7006]; // Re-exporting types, implicit any
    return fixableCodes.includes(code);
  }

  /**
   * Get error pattern classification
   */
  private getErrorPattern(code: number, messageText: string | ts.DiagnosticMessageChain): string {
    const message = typeof messageText === 'string' ? messageText : ts.flattenDiagnosticMessageText(messageText, '');
    
    if (code === 2552 || message.includes('isolatedModules')) return 'export_pattern';
    if (code === 2307 || message.includes('Cannot find module')) return 'module_resolution';
    if (code === 2339 || message.includes('Property') && message.includes('does not exist')) return 'property_access';
    if (code === 2322 || message.includes('not assignable to type')) return 'type_assignment';
    if (code === 7006 || message.includes('implicitly has an')) return 'implicit_any';
    if (message.includes('SQL') || message.includes('query')) return 'database_query';
    if (message.includes('overload') || message.includes('No overload matches')) return 'function_overload';
    
    return 'general';
  }

  /**
   * Get suggested fix for common patterns
   */
  private getSuggestedFix(code: number, messageText: string | ts.DiagnosticMessageChain): string | undefined {
    const message = typeof messageText === 'string' ? messageText : ts.flattenDiagnosticMessageText(messageText, '');
    
    if (code === 2552) {
      return 'Change export to: export type { TypeName };';
    }
    
    if (code === 2307 && message.includes('@/')) {
      return 'Check if the module path exists or add to tsconfig paths';
    }
    
    if (code === 7006) {
      return 'Add explicit type annotation or enable strict mode';
    }
    
    if (message.includes('No overload matches')) {
      return 'Check function parameters and their types';
    }
    
    return undefined;
  }

  /**
   * Generate detailed report
   */
  generateReport(results: ScanResults): string {
    let report = `\n📊 Enhanced TypeScript Scan Report\n`;
    report += `=====================================\n`;
    report += `Scan completed: ${results.scanTimestamp}\n`;
    report += `Total errors: ${results.totalErrors}\n`;
    report += `Critical errors: ${results.criticalErrors}\n`;
    report += `Fixable errors: ${results.fixableErrors}\n\n`;

    // Pattern breakdown
    report += `🔍 Error Patterns:\n`;
    Object.entries(results.errorsByPattern)
      .sort(([,a], [,b]) => b - a)
      .forEach(([pattern, count]) => {
        report += `  ${pattern}: ${count} errors\n`;
      });

    // Most problematic files
    report += `\n📁 Files with most errors:\n`;
    Object.entries(results.errorsByFile)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([file, count]) => {
        report += `  ${file}: ${count} errors\n`;
      });

    // Critical errors details
    const criticalErrors = results.errors.filter(e => e.severity === 'critical');
    if (criticalErrors.length > 0) {
      report += `\n🚨 Critical Errors:\n`;
      criticalErrors.slice(0, 5).forEach(error => {
        report += `  ${error.file}:${error.line} - ${error.message}\n`;
        if (error.suggestedFix) {
          report += `    💡 Fix: ${error.suggestedFix}\n`;
        }
      });
    }

    return report;
  }

  /**
   * Apply automatic fixes for fixable errors
   */
  async applyAutomaticFixes(results: ScanResults): Promise<number> {
    console.log('🔧 Applying automatic fixes...');
    
    let fixesApplied = 0;
    const fixableErrors = results.errors.filter(e => e.fixable);
    
    for (const error of fixableErrors) {
      try {
        if (error.pattern === 'export_pattern' && error.code === 2552) {
          await this.fixExportPattern(error);
          fixesApplied++;
        }
      } catch (fixError) {
        console.warn(`Failed to fix ${error.file}:${error.line} - ${fixError}`);
      }
    }
    
    console.log(`✅ Applied ${fixesApplied} automatic fixes`);
    return fixesApplied;
  }

  /**
   * Fix export pattern issues
   */
  private async fixExportPattern(error: EnhancedTypeScriptError): Promise<void> {
    const filePath = path.join(this.projectRoot, error.file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern to fix: export { Type, Interface, Class }
    const exportPattern = /export\s*\{\s*([^}]+)\s*\}/g;
    
    const fixedContent = content.replace(exportPattern, (match, exports) => {
      const items = exports.split(',').map((item: string) => item.trim());
      const types = items.filter((item: string) => this.isTypeExport(item));
      const values = items.filter((item: string) => !this.isTypeExport(item));
      
      let result = '';
      if (types.length > 0) {
        result += `export type { ${types.join(', ')} };\n`;
      }
      if (values.length > 0) {
        result += `export { ${values.join(', ')} };`;
      }
      
      return result;
    });
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed export patterns in ${error.file}`);
    }
  }

  /**
   * Check if export item is a type
   */
  private isTypeExport(item: string): boolean {
    // Simple heuristic - can be enhanced with AST analysis
    return /^[A-Z]/.test(item) && !item.includes('(');
  }
}

// Export enhanced scanner
export { EnhancedTypeScriptScanner };
export type { EnhancedTypeScriptError, ScanResults };

// Demo function
export async function runEnhancedTypeScriptScan(): Promise<void> {
  const scanner = new EnhancedTypeScriptScanner();
  const results = await scanner.performEnhancedScan();
  
  console.log(scanner.generateReport(results));
  
  if (results.fixableErrors > 0) {
    const fixesApplied = await scanner.applyAutomaticFixes(results);
    console.log(`\n🎯 Applied ${fixesApplied} automatic fixes`);
  }
}

// Run if called directly
if (process.argv[1].includes('enhanced-typescript-scanner')) {
  runEnhancedTypeScriptScan().catch(console.error);
}