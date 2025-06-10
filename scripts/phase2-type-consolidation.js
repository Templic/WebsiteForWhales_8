#!/usr/bin/env node

/**
 * Phase 2 Refactoring Script: Type System Enhancement
 * 
 * Consolidates duplicate type definitions and enhances TypeScript
 * configuration for better type safety and developer experience.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class TypeConsolidator {
  constructor() {
    this.processedFiles = 0;
    this.duplicateTypes = new Map();
    this.consolidatedTypes = 0;
    this.backupDir = path.join(projectRoot, '.refactoring-backups/phase2');
  }

  async run() {
    console.log('🚀 Starting Phase 2: Type System Enhancement');
    
    await this.createBackupDirectory();
    
    // Step 1: Analyze existing types
    console.log('🔍 Analyzing existing type definitions...');
    await this.analyzeTypes();
    
    // Step 2: Generate consolidated types
    console.log('🔧 Generating consolidated type definitions...');
    await this.generateConsolidatedTypes();
    
    // Step 3: Update TypeScript configuration
    console.log('⚙️ Optimizing TypeScript configuration...');
    await this.optimizeTsConfig();
    
    this.printSummary();
  }

  async createBackupDirectory() {
    await fs.mkdir(this.backupDir, { recursive: true });
  }

  async analyzeTypes() {
    const typeFiles = await this.findTypeDefinitions();
    
    for (const filePath of typeFiles) {
      await this.analyzeTypeFile(filePath);
    }
  }

  async findTypeDefinitions() {
    const typeFiles = [];
    const searchDirs = [
      path.join(projectRoot, 'client/src'),
      path.join(projectRoot, 'server'),
      path.join(projectRoot, 'shared')
    ];

    for (const dir of searchDirs) {
      const files = await this.findFilesRecursively(dir, /\.(ts|tsx)$/);
      typeFiles.push(...files);
    }

    return typeFiles;
  }

  async findFilesRecursively(dir, pattern) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
          const subFiles = await this.findFilesRecursively(fullPath, pattern);
          files.push(...subFiles);
        } else if (entry.isFile() && pattern.test(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Skipping directory ${dir}:`, error.message);
    }
    
    return files;
  }

  shouldSkipDirectory(dirName) {
    return ['node_modules', '.git', 'dist', 'build', '__pycache__', '.cache'].includes(dirName);
  }

  async analyzeTypeFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const types = this.extractTypeDefinitions(content);
      
      for (const typeInfo of types) {
        const key = `${typeInfo.name}_${typeInfo.signature}`;
        
        if (!this.duplicateTypes.has(key)) {
          this.duplicateTypes.set(key, []);
        }
        
        this.duplicateTypes.get(key).push({
          ...typeInfo,
          filePath,
          relativePath: path.relative(projectRoot, filePath)
        });
      }
      
      this.processedFiles++;
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error.message);
    }
  }

  extractTypeDefinitions(content) {
    const types = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Interface definitions
      const interfaceMatch = line.match(/^export\s+interface\s+(\w+)/);
      if (interfaceMatch) {
        const name = interfaceMatch[1];
        const signature = this.extractInterfaceSignature(lines, i);
        types.push({
          type: 'interface',
          name,
          signature,
          lineNumber: i + 1,
          exported: true
        });
      }
      
      // Type alias definitions
      const typeMatch = line.match(/^export\s+type\s+(\w+)/);
      if (typeMatch) {
        const name = typeMatch[1];
        const signature = this.extractTypeSignature(lines, i);
        types.push({
          type: 'type',
          name,
          signature,
          lineNumber: i + 1,
          exported: true
        });
      }
      
      // Enum definitions
      const enumMatch = line.match(/^export\s+enum\s+(\w+)/);
      if (enumMatch) {
        const name = enumMatch[1];
        const signature = this.extractEnumSignature(lines, i);
        types.push({
          type: 'enum',
          name,
          signature,
          lineNumber: i + 1,
          exported: true
        });
      }
    }
    
    return types;
  }

  extractInterfaceSignature(lines, startIndex) {
    let signature = '';
    let braceCount = 0;
    let i = startIndex;
    
    while (i < lines.length) {
      const line = lines[i].trim();
      signature += line + '\n';
      
      for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }
      
      if (braceCount === 0 && line.includes('{')) {
        break;
      }
      
      i++;
    }
    
    return signature.trim();
  }

  extractTypeSignature(lines, startIndex) {
    const line = lines[startIndex].trim();
    return line;
  }

  extractEnumSignature(lines, startIndex) {
    return this.extractInterfaceSignature(lines, startIndex);
  }

  async generateConsolidatedTypes() {
    const consolidatedContent = this.buildConsolidatedTypeFile();
    const outputPath = path.join(projectRoot, 'shared/types/consolidated.ts');
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, consolidatedContent, 'utf-8');
    
    console.log(`✅ Generated consolidated types: ${path.relative(projectRoot, outputPath)}`);
  }

  buildConsolidatedTypeFile() {
    let content = `/**
 * Consolidated Type Definitions
 * 
 * This file contains unified type definitions to eliminate
 * duplicates and improve type consistency across the application.
 * 
 * Generated by Phase 2 refactoring script.
 */

`;

    // Group types by category
    const categories = {
      core: [],
      api: [],
      ui: [],
      admin: [],
      theme: [],
      other: []
    };

    for (const [key, occurrences] of this.duplicateTypes.entries()) {
      if (occurrences.length > 1) {
        const type = occurrences[0];
        const category = this.categorizeType(type.name);
        categories[category].push(type);
        this.consolidatedTypes++;
      }
    }

    // Generate content for each category
    for (const [categoryName, types] of Object.entries(categories)) {
      if (types.length > 0) {
        content += `// ===================================================================\n`;
        content += `// ${categoryName.toUpperCase()} TYPES\n`;
        content += `// ===================================================================\n\n`;
        
        for (const type of types) {
          content += `${type.signature}\n\n`;
        }
      }
    }

    return content;
  }

  categorizeType(typeName) {
    const patterns = {
      core: /^(User|Auth|Session|Config)/i,
      api: /^(API|Request|Response|Endpoint)/i,
      ui: /^(Component|Props|Theme|Style)/i,
      admin: /^(Admin|Dashboard|Management)/i,
      theme: /^(Theme|Color|Font|Style)/i
    };

    for (const [category, pattern] of Object.entries(patterns)) {
      if (pattern.test(typeName)) {
        return category;
      }
    }

    return 'other';
  }

  async optimizeTsConfig() {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    
    try {
      const content = await fs.readFile(tsconfigPath, 'utf-8');
      const config = JSON.parse(content);
      
      // Backup original
      await this.backupFile(tsconfigPath, content);
      
      // Enhance configuration
      config.compilerOptions = {
        ...config.compilerOptions,
        strict: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedIndexedAccess: true,
        exactOptionalPropertyTypes: true,
        paths: {
          ...config.compilerOptions.paths,
          "@/types/*": ["./shared/types/*"],
          "@/schemas/*": ["./shared/schemas/*"]
        }
      };

      const optimizedContent = JSON.stringify(config, null, 2);
      await fs.writeFile(tsconfigPath, optimizedContent, 'utf-8');
      
      console.log('✅ Optimized TypeScript configuration');
    } catch (error) {
      console.error('Error optimizing tsconfig.json:', error.message);
    }
  }

  async backupFile(filePath, content) {
    const relativePath = path.relative(projectRoot, filePath);
    const backupPath = path.join(this.backupDir, relativePath);
    
    await fs.mkdir(path.dirname(backupPath), { recursive: true });
    await fs.writeFile(backupPath, content, 'utf-8');
  }

  printSummary() {
    console.log('\n📊 Type Consolidation Summary');
    console.log('=====================================');
    console.log(`✅ Files analyzed: ${this.processedFiles}`);
    console.log(`🔧 Types consolidated: ${this.consolidatedTypes}`);
    console.log(`📝 Duplicate types found: ${Array.from(this.duplicateTypes.keys()).length}`);
    console.log(`💾 Backups stored in: ${path.relative(projectRoot, this.backupDir)}`);
    console.log('\n✨ Phase 2 completed successfully!');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const consolidator = new TypeConsolidator();
  consolidator.run().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export { TypeConsolidator };