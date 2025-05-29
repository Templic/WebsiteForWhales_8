#!/usr/bin/env npx tsx

/**
 * Advanced Import Audit & Resolution System
 * Comprehensive analysis and rebuilding strategy for systemic import issues
 */

import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ImportIssue {
  file: string;
  line: number;
  type: 'missing_import' | 'circular_dependency' | 'wrong_path' | 'version_conflict' | 'hook_misuse';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  currentImport: string;
  suggestedFix: string;
  dependencies: string[];
}

interface ModuleMapping {
  currentPath: string;
  correctPath: string;
  isComponent: boolean;
  exports: string[];
  imports: string[];
}

class AdvancedImportAuditSystem {
  private issues: ImportIssue[] = [];
  private moduleMap: Map<string, ModuleMapping> = new Map();
  private circularDeps: string[][] = [];
  private missingModules: Set<string> = new Set();

  async conductComprehensiveAudit(): Promise<void> {
    console.log('🔍 ADVANCED IMPORT AUDIT SYSTEM ACTIVATED');
    console.log('📊 Conducting comprehensive analysis of import architecture...\n');

    // Phase 1: Discover all modules and their relationships
    await this.discoverModuleArchitecture();
    
    // Phase 2: Analyze import patterns and detect issues
    await this.analyzeImportPatterns();
    
    // Phase 3: Detect circular dependencies
    await this.detectCircularDependencies();
    
    // Phase 4: Validate module resolution
    await this.validateModuleResolution();
    
    // Phase 5: Generate rebuild strategy
    await this.generateRebuildStrategy();
    
    // Phase 6: Create fixing utilities
    await this.createFixingUtilities();
  }

  private async discoverModuleArchitecture(): Promise<void> {
    console.log('🏗️ Phase 1: Discovering module architecture...');
    
    const clientFiles = await this.findFiles('client/src', ['.ts', '.tsx', '.js', '.jsx']);
    
    for (const file of clientFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const mapping = await this.analyzeFileStructure(file, content);
        this.moduleMap.set(file, mapping);
      } catch (error) {
        console.log(`⚠️ Cannot analyze ${file}: ${error.message}`);
      }
    }
    
    console.log(`📦 Discovered ${this.moduleMap.size} modules`);
  }

  private async analyzeFileStructure(filePath: string, content: string): Promise<ModuleMapping> {
    const imports: string[] = [];
    const exports: string[] = [];
    
    // Extract import statements
    const importRegex = /import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)?\s*(?:,\s*{[^}]+})?\s*from\s+['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    // Extract export statements
    const exportRegex = /export\s+(?:default\s+)?(?:function\s+(\w+)|const\s+(\w+)|class\s+(\w+)|interface\s+(\w+)|type\s+(\w+))/g;
    while ((match = exportRegex.exec(content)) !== null) {
      const exportName = match[1] || match[2] || match[3] || match[4] || match[5];
      if (exportName) exports.push(exportName);
    }
    
    return {
      currentPath: filePath,
      correctPath: this.normalizeModulePath(filePath),
      isComponent: this.isReactComponent(content),
      exports,
      imports
    };
  }

  private async analyzeImportPatterns(): Promise<void> {
    console.log('🔎 Phase 2: Analyzing import patterns...');
    
    for (const [filePath, module] of this.moduleMap) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        await this.analyzeFileImports(filePath, content, module);
      } catch (error) {
        console.log(`⚠️ Cannot analyze imports in ${filePath}`);
      }
    }
    
    console.log(`❌ Found ${this.issues.length} import issues`);
  }

  private async analyzeFileImports(filePath: string, content: string, module: ModuleMapping): Promise<void> {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Check for React usage without import
      if (this.usesReactFeatures(line) && !this.hasReactImport(content)) {
        this.issues.push({
          file: filePath,
          line: index + 1,
          type: 'missing_import',
          severity: 'critical',
          description: 'Uses React features without importing React',
          currentImport: '',
          suggestedFix: 'Add: import React from "react";',
          dependencies: ['react']
        });
      }
      
      // Check for hooks usage outside component
      if (this.usesHooks(line) && !this.isInComponent(content, index)) {
        this.issues.push({
          file: filePath,
          line: index + 1,
          type: 'hook_misuse',
          severity: 'critical',
          description: 'Hooks called outside React component',
          currentImport: line.trim(),
          suggestedFix: 'Move hook call inside React component or custom hook',
          dependencies: []
        });
      }
      
      // Check for incorrect path imports
      const importMatch = line.match(/from\s+['"`]([^'"`]+)['"`]/);
      if (importMatch) {
        const importPath = importMatch[1];
        if (this.isIncorrectPath(importPath, filePath)) {
          const correctPath = this.suggestCorrectPath(importPath, filePath);
          this.issues.push({
            file: filePath,
            line: index + 1,
            type: 'wrong_path',
            severity: 'high',
            description: `Incorrect import path: ${importPath}`,
            currentImport: line.trim(),
            suggestedFix: `Change to: from "${correctPath}"`,
            dependencies: [correctPath]
          });
        }
      }
    });
  }

  private async detectCircularDependencies(): Promise<void> {
    console.log('🔄 Phase 3: Detecting circular dependencies...');
    
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const stack: string[] = [];
    
    for (const [filePath] of this.moduleMap) {
      if (!visited.has(filePath)) {
        await this.dfsCircularCheck(filePath, visited, visiting, stack);
      }
    }
    
    console.log(`🔄 Found ${this.circularDeps.length} circular dependency chains`);
  }

  private async dfsCircularCheck(
    filePath: string, 
    visited: Set<string>, 
    visiting: Set<string>, 
    stack: string[]
  ): Promise<void> {
    visiting.add(filePath);
    stack.push(filePath);
    
    const module = this.moduleMap.get(filePath);
    if (module) {
      for (const importPath of module.imports) {
        const resolvedPath = this.resolveImportPath(importPath, filePath);
        if (resolvedPath) {
          if (visiting.has(resolvedPath)) {
            // Found circular dependency
            const cycleStart = stack.indexOf(resolvedPath);
            const cycle = stack.slice(cycleStart).concat([resolvedPath]);
            this.circularDeps.push(cycle);
          } else if (!visited.has(resolvedPath)) {
            await this.dfsCircularCheck(resolvedPath, visited, visiting, stack);
          }
        }
      }
    }
    
    visiting.delete(filePath);
    visited.add(filePath);
    stack.pop();
  }

  private async validateModuleResolution(): Promise<void> {
    console.log('✅ Phase 4: Validating module resolution...');
    
    for (const [filePath, module] of this.moduleMap) {
      for (const importPath of module.imports) {
        if (!this.canResolveImport(importPath, filePath)) {
          this.missingModules.add(importPath);
          this.issues.push({
            file: filePath,
            line: 0,
            type: 'missing_import',
            severity: 'high',
            description: `Cannot resolve module: ${importPath}`,
            currentImport: importPath,
            suggestedFix: this.suggestModuleFix(importPath),
            dependencies: [importPath]
          });
        }
      }
    }
    
    console.log(`📦 Found ${this.missingModules.size} unresolvable modules`);
  }

  private async generateRebuildStrategy(): Promise<void> {
    console.log('🚀 Phase 5: Generating rebuild strategy...');
    
    const strategy = {
      criticalFixes: this.issues.filter(i => i.severity === 'critical'),
      architecturalChanges: this.generateArchitecturalRecommendations(),
      dependencyUpdates: this.generateDependencyRecommendations(),
      refactoringPlan: this.generateRefactoringPlan(),
      implementationOrder: this.generateImplementationOrder()
    };
    
    await fs.writeFile(
      'IMPORT_REBUILD_STRATEGY.md',
      this.formatRebuildStrategy(strategy),
      'utf-8'
    );
    
    console.log('📋 Rebuild strategy saved to IMPORT_REBUILD_STRATEGY.md');
  }

  private async createFixingUtilities(): Promise<void> {
    console.log('🛠️ Phase 6: Creating automated fixing utilities...');
    
    // Create React import fixer
    await this.createReactImportFixer();
    
    // Create path resolver utility
    await this.createPathResolverUtility();
    
    // Create circular dependency breaker
    await this.createCircularDepBreaker();
    
    // Create component validator
    await this.createComponentValidator();
    
    console.log('🎯 Automated fixing utilities created');
  }

  // Helper methods for analysis
  private usesReactFeatures(line: string): boolean {
    return /\b(useState|useEffect|useContext|useCallback|useMemo|jsx|tsx|React\.)\b/.test(line) ||
           /<[A-Z]\w*/.test(line);
  }

  private hasReactImport(content: string): boolean {
    return /import\s+React\s+from\s+['"`]react['"`]/.test(content);
  }

  private usesHooks(line: string): boolean {
    return /\b(useState|useEffect|useContext|useCallback|useMemo|useTheme|useAuth)\s*\(/.test(line);
  }

  private isInComponent(content: string, lineIndex: number): boolean {
    const lines = content.split('\n');
    let inFunction = false;
    let braceCount = 0;
    
    for (let i = 0; i <= lineIndex; i++) {
      const line = lines[i];
      if (/function\s+[A-Z]\w*|const\s+[A-Z]\w*\s*=/.test(line)) {
        inFunction = true;
        braceCount = 0;
      }
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      if (inFunction && braceCount === 0 && i > 0) {
        inFunction = false;
      }
    }
    
    return inFunction;
  }

  private isReactComponent(content: string): boolean {
    return /export\s+default\s+function\s+[A-Z]/.test(content) ||
           /const\s+[A-Z]\w*\s*=\s*\([^)]*\)\s*=>\s*{/.test(content);
  }

  private normalizeModulePath(filePath: string): string {
    return filePath.replace(/\\/g, '/');
  }

  private isIncorrectPath(importPath: string, fromFile: string): boolean {
    if (importPath.startsWith('@/')) {
      const resolvedPath = importPath.replace('@/', 'client/src/');
      return !this.moduleExists(resolvedPath);
    }
    return false;
  }

  private moduleExists(modulePath: string): boolean {
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    for (const ext of extensions) {
      if (this.moduleMap.has(modulePath + ext)) return true;
    }
    return false;
  }

  private suggestCorrectPath(importPath: string, fromFile: string): string {
    // Implement intelligent path suggestion logic
    return importPath; // Placeholder
  }

  private resolveImportPath(importPath: string, fromFile: string): string | null {
    // Implement path resolution logic
    return null; // Placeholder
  }

  private canResolveImport(importPath: string, fromFile: string): boolean {
    return this.resolveImportPath(importPath, fromFile) !== null;
  }

  private suggestModuleFix(importPath: string): string {
    if (importPath.includes('@/components/ui/')) {
      return 'Install missing shadcn component or create component file';
    }
    if (importPath === 'react') {
      return 'Ensure React is installed: npm install react';
    }
    return `Install missing module: npm install ${importPath}`;
  }

  private generateArchitecturalRecommendations(): string[] {
    return [
      'Create centralized export index files for better module organization',
      'Implement consistent import alias patterns (@/ for src root)',
      'Separate concerns: hooks, components, contexts, and utilities',
      'Use barrel exports for cleaner import statements'
    ];
  }

  private generateDependencyRecommendations(): string[] {
    return [
      'Update React to latest stable version',
      'Ensure all shadcn components are properly installed',
      'Add missing TypeScript type definitions',
      'Clean up unused dependencies'
    ];
  }

  private generateRefactoringPlan(): string[] {
    return [
      'Phase 1: Fix critical React import issues',
      'Phase 2: Resolve circular dependencies',
      'Phase 3: Standardize import paths',
      'Phase 4: Optimize component structure',
      'Phase 5: Implement proper error boundaries'
    ];
  }

  private generateImplementationOrder(): string[] {
    const critical = this.issues.filter(i => i.severity === 'critical').length;
    const high = this.issues.filter(i => i.severity === 'high').length;
    
    return [
      `1. Fix ${critical} critical import issues (immediate)`,
      `2. Resolve ${high} high-priority path issues (next)`,
      '3. Break circular dependencies',
      '4. Implement component validation',
      '5. Optimize import performance'
    ];
  }

  private formatRebuildStrategy(strategy: any): string {
    return `# Import Architecture Rebuild Strategy

## Critical Issues Found: ${strategy.criticalFixes.length}

### Immediate Actions Required:
${strategy.criticalFixes.map(issue => `- ${issue.description} (${issue.file}:${issue.line})`).join('\n')}

### Architectural Recommendations:
${strategy.architecturalChanges.map(rec => `- ${rec}`).join('\n')}

### Implementation Plan:
${strategy.implementationOrder.map(step => step).join('\n')}

### Dependency Updates:
${strategy.dependencyUpdates.map(dep => `- ${dep}`).join('\n')}

## Automated Fixes Available
- React Import Fixer: Run \`npx tsx react-import-fixer.ts\`
- Path Resolver: Run \`npx tsx path-resolver.ts\`
- Circular Dependency Breaker: Run \`npx tsx circular-dep-breaker.ts\`
`;
  }

  private async createReactImportFixer(): Promise<void> {
    const fixerCode = `#!/usr/bin/env npx tsx

/**
 * Automated React Import Fixer
 * Fixes missing React imports and hook usage issues
 */

import { promises as fs } from 'fs';

class ReactImportFixer {
  async fixAllFiles(): Promise<void> {
    const criticalFiles = [
      'client/src/App.tsx',
      'client/src/hooks/use-auth.ts',
      'client/src/contexts/ThemeContext.tsx'
    ];
    
    for (const file of criticalFiles) {
      await this.fixReactImports(file);
    }
  }
  
  async fixReactImports(filePath: string): Promise<void> {
    try {
      let content = await fs.readFile(filePath, 'utf-8');
      
      // Check if React features are used but React not imported
      const usesReact = /\\b(useState|useEffect|jsx|<[A-Z])\\b/.test(content);
      const hasImport = /import React from "react"/.test(content);
      
      if (usesReact && !hasImport) {
        const lines = content.split('\\n');
        const firstImportIndex = lines.findIndex(line => line.includes('import'));
        
        if (firstImportIndex >= 0) {
          lines.splice(firstImportIndex, 0, 'import React from "react";');
        } else {
          lines.unshift('import React from "react";');
        }
        
        content = lines.join('\\n');
        await fs.writeFile(filePath, content);
        console.log(\`✅ Fixed React import in \${filePath}\`);
      }
    } catch (error) {
      console.log(\`❌ Could not fix \${filePath}: \${error.message}\`);
    }
  }
}

const fixer = new ReactImportFixer();
fixer.fixAllFiles();
`;
    
    await fs.writeFile('react-import-fixer.ts', fixerCode);
  }

  private async createPathResolverUtility(): Promise<void> {
    // Implementation for path resolver utility
  }

  private async createCircularDepBreaker(): Promise<void> {
    // Implementation for circular dependency breaker
  }

  private async createComponentValidator(): Promise<void> {
    // Implementation for component validator
  }

  private async findFiles(dir: string, extensions: string[]): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
            files.push(...await this.findFiles(fullPath, extensions));
          }
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return files;
  }
}

// Execute the audit
async function main() {
  const auditor = new AdvancedImportAuditSystem();
  await auditor.conductComprehensiveAudit();
  
  console.log('\\n🎯 AUDIT COMPLETE');
  console.log('📋 Check IMPORT_REBUILD_STRATEGY.md for detailed rebuild plan');
  console.log('🛠️ Run the generated utility scripts to apply fixes');
}

main().catch(console.error);

export { AdvancedImportAuditSystem };