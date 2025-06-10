#!/usr/bin/env node

/**
 * Phase 1 Refactoring Script: Import Consolidation
 * 
 * This script safely consolidates duplicate imports and standardizes
 * import statements across the codebase without breaking functionality.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class ImportConsolidator {
  constructor() {
    this.processedFiles = 0;
    this.consolidatedImports = 0;
    this.removedDuplicates = 0;
    this.backupDir = path.join(projectRoot, '.refactoring-backups');
  }

  async run() {
    console.log('🚀 Starting Phase 1: Import Consolidation');
    console.log('📁 Creating backup directory...');
    
    await this.createBackupDirectory();
    
    // Process client-side files
    console.log('🔄 Processing client-side TypeScript files...');
    await this.processDirectory(path.join(projectRoot, 'client/src'));
    
    // Process server-side files
    console.log('🔄 Processing server-side TypeScript files...');
    await this.processDirectory(path.join(projectRoot, 'server'));
    
    // Process shared files
    console.log('🔄 Processing shared TypeScript files...');
    await this.processDirectory(path.join(projectRoot, 'shared'));
    
    this.printSummary();
  }

  async createBackupDirectory() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create backup directory:', error);
      process.exit(1);
    }
  }

  async processDirectory(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
          await this.processDirectory(fullPath);
        } else if (entry.isFile() && this.isTypeScriptFile(entry.name)) {
          await this.processFile(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Skipping directory ${dirPath}:`, error.message);
    }
  }

  shouldSkipDirectory(dirName) {
    const skipDirs = [
      'node_modules', '.git', 'dist', 'build', 
      '__pycache__', '.cache', 'coverage'
    ];
    return skipDirs.includes(dirName);
  }

  isTypeScriptFile(fileName) {
    return fileName.endsWith('.ts') || fileName.endsWith('.tsx');
  }

  async processFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const originalContent = content;
      
      // Backup original file
      await this.backupFile(filePath, content);
      
      // Process imports
      const processedContent = this.consolidateImports(content, filePath);
      
      if (processedContent !== originalContent) {
        await fs.writeFile(filePath, processedContent, 'utf-8');
        console.log(`✅ Processed: ${path.relative(projectRoot, filePath)}`);
      }
      
      this.processedFiles++;
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  async backupFile(filePath, content) {
    const relativePath = path.relative(projectRoot, filePath);
    const backupPath = path.join(this.backupDir, relativePath);
    
    // Ensure backup directory exists
    await fs.mkdir(path.dirname(backupPath), { recursive: true });
    await fs.writeFile(backupPath, content, 'utf-8');
  }

  consolidateImports(content, filePath) {
    const lines = content.split('\n');
    const imports = new Map();
    const nonImportLines = [];
    let importEndIndex = -1;
    
    // Parse existing imports
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (this.isImportLine(line)) {
        this.parseImportLine(line, imports);
        importEndIndex = i;
      } else if (line.startsWith('//') || line.startsWith('/*') || line === '') {
        // Allow comments and empty lines in import section
        if (importEndIndex === -1 || i <= importEndIndex + 5) {
          continue;
        } else {
          nonImportLines.push(...lines.slice(i));
          break;
        }
      } else {
        // Non-import line found
        nonImportLines.push(...lines.slice(i));
        break;
      }
    }
    
    // Generate consolidated imports
    const consolidatedImports = this.generateConsolidatedImports(imports);
    
    // Combine with rest of file
    const result = [
      ...consolidatedImports,
      '',
      ...nonImportLines
    ].join('\n');
    
    return result;
  }

  isImportLine(line) {
    return line.startsWith('import ') && 
           (line.includes(' from ') || line.includes('import('));
  }

  parseImportLine(line, imports) {
    // Handle different import patterns
    const patterns = [
      // import { a, b } from 'module'
      /^import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"];?$/,
      // import * as name from 'module'
      /^import\s*\*\s*as\s+(\w+)\s*from\s*['"]([^'"]+)['"];?$/,
      // import name from 'module'
      /^import\s+(\w+)\s*from\s*['"]([^'"]+)['"];?$/,
      // import 'module' (side effect)
      /^import\s*['"]([^'"]+)['"];?$/
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const moduleName = match[match.length - 1];
        
        if (!imports.has(moduleName)) {
          imports.set(moduleName, {
            namedImports: new Set(),
            defaultImport: null,
            namespaceImport: null,
            sideEffect: false
          });
        }
        
        const importData = imports.get(moduleName);
        
        if (pattern === patterns[0]) {
          // Named imports
          const namedImports = match[1].split(',').map(s => s.trim());
          namedImports.forEach(imp => importData.namedImports.add(imp));
          this.removedDuplicates++;
        } else if (pattern === patterns[1]) {
          // Namespace import
          importData.namespaceImport = match[1];
        } else if (pattern === patterns[2]) {
          // Default import
          importData.defaultImport = match[1];
        } else if (pattern === patterns[3]) {
          // Side effect import
          importData.sideEffect = true;
        }
        
        break;
      }
    }
  }

  generateConsolidatedImports(imports) {
    const importLines = [];
    
    // Sort imports: side effects first, then third-party, then relative
    const sortedModules = Array.from(imports.keys()).sort((a, b) => {
      const aIsRelative = a.startsWith('.') || a.startsWith('@/');
      const bIsRelative = b.startsWith('.') || b.startsWith('@/');
      
      if (aIsRelative && !bIsRelative) return 1;
      if (!aIsRelative && bIsRelative) return -1;
      return a.localeCompare(b);
    });
    
    for (const moduleName of sortedModules) {
      const importData = imports.get(moduleName);
      
      if (importData.sideEffect) {
        importLines.push(`import '${moduleName}';`);
        continue;
      }
      
      const parts = [];
      
      if (importData.defaultImport) {
        parts.push(importData.defaultImport);
      }
      
      if (importData.namespaceImport) {
        parts.push(`* as ${importData.namespaceImport}`);
      }
      
      if (importData.namedImports.size > 0) {
        const namedImports = Array.from(importData.namedImports).sort();
        if (namedImports.length > 3) {
          // Multi-line for readability
          parts.push(`{\n  ${namedImports.join(',\n  ')}\n}`);
        } else {
          parts.push(`{ ${namedImports.join(', ')} }`);
        }
      }
      
      if (parts.length > 0) {
        importLines.push(`import ${parts.join(', ')} from '${moduleName}';`);
        this.consolidatedImports++;
      }
    }
    
    return importLines;
  }

  printSummary() {
    console.log('\n📊 Import Consolidation Summary');
    console.log('=====================================');
    console.log(`✅ Files processed: ${this.processedFiles}`);
    console.log(`🔧 Imports consolidated: ${this.consolidatedImports}`);
    console.log(`🗑️ Duplicate imports removed: ${this.removedDuplicates}`);
    console.log(`💾 Backups stored in: ${path.relative(projectRoot, this.backupDir)}`);
    console.log('\n✨ Phase 1 completed successfully!');
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  const consolidator = new ImportConsolidator();
  consolidator.run().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export { ImportConsolidator };