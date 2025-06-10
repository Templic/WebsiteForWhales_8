#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const clientSrc = path.join(projectRoot, 'client/src');

class ImportDiagnostic {
  constructor() {
    this.issues = {
      missingFiles: [],
      wrongPaths: [],
      aliasProblems: [],
      existing: []
    };
  }

  async run() {
    console.log('🔍 Diagnosing Import Path Issues');
    console.log('================================');
    
    await this.analyzeAppTsx();
    await this.checkFileExistence();
    this.generateReport();
  }

  async analyzeAppTsx() {
    const appPath = path.join(clientSrc, 'App.tsx');
    const content = await fs.readFile(appPath, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('import ')) {
        this.analyzeImportLine(line, i + 1);
      }
    }
  }

  analyzeImportLine(line, lineNumber) {
    const fromMatch = line.match(/from ['"]([^'"]+)['"]/);
    if (!fromMatch) return;
    
    const importPath = fromMatch[1];
    const resolvedPath = this.resolveImportPath(importPath);
    
    this.issues.existing.push({
      line: lineNumber,
      original: importPath,
      resolved: resolvedPath,
      lineContent: line
    });
  }

  resolveImportPath(importPath) {
    if (importPath.startsWith('@/')) {
      return path.join(clientSrc, importPath.substring(2));
    } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
      return path.join(clientSrc, importPath);
    }
    return importPath; // External module
  }

  async checkFileExistence() {
    for (const item of this.issues.existing) {
      if (item.resolved.startsWith(clientSrc)) {
        const exists = await this.fileExists(item.resolved);
        
        if (!exists) {
          // Try with .tsx extension
          const withTsx = item.resolved + '.tsx';
          const tsxExists = await this.fileExists(withTsx);
          
          if (!tsxExists) {
            // Try with .ts extension
            const withTs = item.resolved + '.ts';
            const tsExists = await this.fileExists(withTs);
            
            if (!tsExists) {
              this.issues.missingFiles.push({
                ...item,
                attempted: [item.resolved, withTsx, withTs]
              });
            }
          }
        }
      }
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  generateReport() {
    console.log(`\n📊 Import Analysis Results`);
    console.log(`Total imports analyzed: ${this.issues.existing.length}`);
    console.log(`Missing files: ${this.issues.missingFiles.length}`);
    
    if (this.issues.missingFiles.length > 0) {
      console.log('\n❌ Missing Files:');
      this.issues.missingFiles.forEach(item => {
        console.log(`Line ${item.line}: ${item.original}`);
        console.log(`  Tried: ${item.attempted.join(', ')}`);
      });
    }
    
    console.log('\n🔧 Recommended Actions:');
    console.log('1. Remove imports for non-existent files');
    console.log('2. Create missing critical components');
    console.log('3. Update import paths for moved files');
    console.log('4. Implement lazy loading for large imports');
  }
}

const diagnostic = new ImportDiagnostic();
diagnostic.run().catch(console.error);