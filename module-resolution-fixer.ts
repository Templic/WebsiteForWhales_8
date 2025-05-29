/**
 * Module Resolution Fixer
 * 
 * Fixes TypeScript module resolution issues in client components
 */

import * as fs from 'fs';
import * as path from 'path';

interface ModuleResolutionFix {
  file: string;
  incorrectImport: string;
  correctImport: string;
  description: string;
}

class ModuleResolutionFixer {
  private fixes: ModuleResolutionFix[] = [];

  constructor() {
    this.initializeFixes();
  }

  private initializeFixes(): void {
    this.fixes = [
      {
        file: 'client/src/hooks/use-auth.tsx',
        incorrectImport: '@/hooks/use-toast',
        correctImport: './use-toast',
        description: 'Fix relative path for use-toast hook'
      },
      {
        file: 'client/src/components/features/admin/AdminEditor.tsx',
        incorrectImport: '@/hooks/use-toast',
        correctImport: '../../../hooks/use-toast',
        description: 'Fix relative path for use-toast in AdminEditor'
      },
      {
        file: 'client/src/components/features/admin/AdminEditor.tsx',
        incorrectImport: '@/hooks/use-auth',
        correctImport: '../../../hooks/use-auth',
        description: 'Fix relative path for use-auth in AdminEditor'
      },
      {
        file: 'client/src/components/features/admin/ContentPreview.tsx',
        incorrectImport: '@/lib/queryClient',
        correctImport: '../../../lib/queryClient',
        description: 'Fix relative path for queryClient'
      }
    ];
  }

  async applyModuleResolutionFixes(): Promise<void> {
    console.log('🔧 Applying module resolution fixes...');
    
    for (const fix of this.fixes) {
      try {
        if (fs.existsSync(fix.file)) {
          console.log(`Fixing: ${fix.description} in ${fix.file}`);
          this.fixImportPath(fix);
          console.log(`✅ Fixed: ${fix.file}`);
        }
      } catch (error) {
        console.warn(`❌ Failed to fix ${fix.file}: ${error}`);
      }
    }
    
    console.log('🎯 Module resolution fixes applied');
  }

  private fixImportPath(fix: ModuleResolutionFix): void {
    const content = fs.readFileSync(fix.file, 'utf8');
    
    // Replace the incorrect import with the correct one
    const fixedContent = content.replace(
      new RegExp(`from ["']${fix.incorrectImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g'),
      `from "${fix.correctImport}"`
    );
    
    if (fixedContent !== content) {
      fs.writeFileSync(fix.file, fixedContent, 'utf8');
    }
  }

  async generateReport(): Promise<string> {
    let report = '📊 Module Resolution Fix Report\n';
    report += '=================================\n\n';
    
    for (const fix of this.fixes) {
      report += `✓ ${fix.description}\n`;
      report += `  File: ${fix.file}\n`;
      report += `  Import: ${fix.incorrectImport} → ${fix.correctImport}\n\n`;
    }
    
    return report;
  }
}

export const moduleResolver = new ModuleResolutionFixer();

export async function runModuleResolutionFixes(): Promise<void> {
  await moduleResolver.applyModuleResolutionFixes();
  const report = await moduleResolver.generateReport();
  console.log(report);
}

// Run if called directly
if (process.argv[1].includes('module-resolution-fixer')) {
  runModuleResolutionFixes().catch(console.error);
}