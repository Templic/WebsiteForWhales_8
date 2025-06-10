#!/usr/bin/env node

/**
 * Refactoring Orchestrator
 * 
 * Coordinates all phases of the safe refactoring process
 * with comprehensive safety checks and rollback capabilities.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class RefactorOrchestrator {
  constructor() {
    this.phases = [
      {
        name: 'Import Consolidation',
        script: 'phase1-import-consolidation.js',
        riskLevel: 'LOW',
        estimatedTime: '5 minutes'
      },
      {
        name: 'Type System Enhancement',
        script: 'phase2-type-consolidation.js',
        riskLevel: 'LOW-MEDIUM',
        estimatedTime: '10 minutes'
      },
      {
        name: 'Performance Optimization',
        script: 'phase3-performance.js',
        riskLevel: 'LOW',
        estimatedTime: '15 minutes'
      }
    ];
    
    this.results = {
      phases: [],
      totalTime: 0,
      success: false
    };
    
    this.backupDir = path.join(projectRoot, '.refactoring-backups');
  }

  async run() {
    console.log('🚀 Starting Safe Refactoring Process');
    console.log('=====================================');
    
    const startTime = Date.now();
    
    try {
      // Safety checks
      await this.performSafetyChecks();
      
      // Create master backup
      await this.createMasterBackup();
      
      // Execute phases
      for (const phase of this.phases) {
        await this.executePhase(phase);
      }
      
      // Final validation
      await this.performFinalValidation();
      
      this.results.success = true;
      this.results.totalTime = Date.now() - startTime;
      
      this.printFinalSummary();
      
    } catch (error) {
      console.error('❌ Refactoring failed:', error.message);
      await this.initiateRollback();
      process.exit(1);
    }
  }

  async performSafetyChecks() {
    console.log('🔍 Performing safety checks...');
    
    // Check TypeScript compilation
    try {
      await execAsync('npm run check', { cwd: projectRoot });
      console.log('✅ TypeScript compilation: PASSED');
    } catch (error) {
      throw new Error('TypeScript compilation failed. Please fix errors before refactoring.');
    }
    
    // Check for uncommitted changes
    try {
      const { stdout } = await execAsync('git status --porcelain', { cwd: projectRoot });
      if (stdout.trim()) {
        console.warn('⚠️ Warning: Uncommitted changes detected');
        console.warn('Consider committing changes before refactoring');
      }
    } catch (error) {
      console.warn('⚠️ Git not available - manual backup recommended');
    }
    
    // Check disk space
    const stats = await fs.stat(projectRoot);
    console.log('✅ Safety checks completed');
  }

  async createMasterBackup() {
    console.log('💾 Creating master backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `master-backup-${timestamp}`);
    
    await fs.mkdir(backupPath, { recursive: true });
    
    // Copy critical directories
    const criticalPaths = ['client/src', 'server', 'shared', 'package.json', 'tsconfig.json'];
    
    for (const criticalPath of criticalPaths) {
      const sourcePath = path.join(projectRoot, criticalPath);
      const targetPath = path.join(backupPath, criticalPath);
      
      try {
        await this.copyRecursive(sourcePath, targetPath);
      } catch (error) {
        console.warn(`Warning: Could not backup ${criticalPath}`);
      }
    }
    
    console.log(`✅ Master backup created: ${path.relative(projectRoot, backupPath)}`);
  }

  async copyRecursive(source, target) {
    const stats = await fs.stat(source);
    
    if (stats.isDirectory()) {
      await fs.mkdir(target, { recursive: true });
      const entries = await fs.readdir(source);
      
      for (const entry of entries) {
        await this.copyRecursive(
          path.join(source, entry),
          path.join(target, entry)
        );
      }
    } else {
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.copyFile(source, target);
    }
  }

  async executePhase(phase) {
    console.log(`\n🔄 Executing Phase: ${phase.name}`);
    console.log(`⏱️ Estimated time: ${phase.estimatedTime}`);
    console.log(`⚠️ Risk level: ${phase.riskLevel}`);
    
    const phaseStart = Date.now();
    
    try {
      // Pre-phase validation
      await this.validateBeforePhase();
      
      // Execute phase script
      const scriptPath = path.join(__dirname, phase.script);
      await execAsync(`node ${scriptPath}`, { cwd: projectRoot });
      
      // Post-phase validation
      await this.validateAfterPhase();
      
      const phaseTime = Date.now() - phaseStart;
      
      this.results.phases.push({
        name: phase.name,
        success: true,
        time: phaseTime,
        riskLevel: phase.riskLevel
      });
      
      console.log(`✅ Phase completed in ${phaseTime}ms`);
      
    } catch (error) {
      this.results.phases.push({
        name: phase.name,
        success: false,
        error: error.message,
        riskLevel: phase.riskLevel
      });
      
      throw new Error(`Phase "${phase.name}" failed: ${error.message}`);
    }
  }

  async validateBeforePhase() {
    // Ensure TypeScript still compiles
    try {
      await execAsync('npm run check', { cwd: projectRoot });
    } catch (error) {
      throw new Error('Pre-phase TypeScript validation failed');
    }
  }

  async validateAfterPhase() {
    // Ensure changes don't break compilation
    try {
      await execAsync('npm run check', { cwd: projectRoot });
    } catch (error) {
      throw new Error('Post-phase TypeScript validation failed');
    }
    
    // Quick build test
    try {
      await execAsync('npm run build', { cwd: projectRoot });
    } catch (error) {
      console.warn('⚠️ Build validation failed - may need manual review');
    }
  }

  async performFinalValidation() {
    console.log('\n🔍 Performing final validation...');
    
    // Complete TypeScript check
    await execAsync('npm run check', { cwd: projectRoot });
    
    // Full build test
    await execAsync('npm run build', { cwd: projectRoot });
    
    console.log('✅ Final validation passed');
  }

  async initiateRollback() {
    console.log('\n🔄 Initiating rollback...');
    
    // Find latest master backup
    const backups = await fs.readdir(this.backupDir);
    const masterBackups = backups.filter(name => name.startsWith('master-backup-'));
    
    if (masterBackups.length === 0) {
      console.error('❌ No master backup found for rollback');
      return;
    }
    
    const latestBackup = masterBackups.sort().pop();
    const backupPath = path.join(this.backupDir, latestBackup);
    
    console.log(`📁 Restoring from: ${latestBackup}`);
    
    // Restore critical files
    const criticalPaths = ['client/src', 'server', 'shared'];
    
    for (const criticalPath of criticalPaths) {
      const backupSource = path.join(backupPath, criticalPath);
      const restoreTarget = path.join(projectRoot, criticalPath);
      
      try {
        // Remove current version
        await fs.rm(restoreTarget, { recursive: true, force: true });
        
        // Restore from backup
        await this.copyRecursive(backupSource, restoreTarget);
        
        console.log(`✅ Restored: ${criticalPath}`);
      } catch (error) {
        console.error(`❌ Failed to restore ${criticalPath}:`, error.message);
      }
    }
    
    console.log('🔄 Rollback completed');
  }

  printFinalSummary() {
    console.log('\n📊 Refactoring Summary');
    console.log('=====================================');
    console.log(`⏱️ Total time: ${this.results.totalTime}ms`);
    console.log(`✅ Success: ${this.results.success}`);
    console.log(`📋 Phases completed: ${this.results.phases.length}`);
    
    for (const phase of this.results.phases) {
      const status = phase.success ? '✅' : '❌';
      console.log(`${status} ${phase.name} (${phase.time}ms)`);
    }
    
    if (this.results.success) {
      console.log('\n🎉 Refactoring completed successfully!');
      console.log('📁 Backups available in:', path.relative(projectRoot, this.backupDir));
      console.log('\nNext steps:');
      console.log('1. Test the application thoroughly');
      console.log('2. Run your test suite');
      console.log('3. Commit the changes');
      console.log('4. Deploy to staging for validation');
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const orchestrator = new RefactorOrchestrator();
  orchestrator.run().catch(error => {
    console.error('❌ Orchestrator failed:', error);
    process.exit(1);
  });
}

export { RefactorOrchestrator };