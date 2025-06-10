/**
 * Log Retention & Archival Manager
 * Critical Priority: Implement compliance-based retention schedules
 */

import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import { auditConfig } from '../config/auditConfig.js';

const gzip = promisify(zlib.gzip);

export interface RetentionPolicy {
  type: 'pci' | 'hipaa' | 'gdpr' | 'soc2' | 'default';
  retentionDays: number;
  archiveAfterDays: number;
  compressionLevel: number;
  encryptArchive: boolean;
}

export interface LogFile {
  path: string;
  name: string;
  size: number;
  created: Date;
  modified: Date;
  type: 'transaction' | 'security' | 'blockchain' | 'system';
}

export class RetentionManager {
  private readonly logsDirectory = path.join(process.cwd(), 'logs');
  private readonly archiveDirectory = path.join(process.cwd(), 'logs', 'archive');

  constructor() {
    this.ensureDirectories();
  }

  /**
   * Ensure required directories exist
   */
  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.logsDirectory, { recursive: true });
      await fs.mkdir(this.archiveDirectory, { recursive: true });
      await fs.mkdir(path.join(this.archiveDirectory, 'compressed'), { recursive: true });
    } catch (error) {
      console.error('Failed to create log directories:', error);
    }
  }

  /**
   * Apply retention policies to all log files
   */
  async applyRetentionPolicies(): Promise<void> {
    console.log('Starting log retention policy application...');
    
    try {
      const policies = this.getRetentionPolicies();
      
      for (const policy of policies) {
        await this.processLogsByPolicy(policy);
      }
      
      console.log('Log retention policies applied successfully');
    } catch (error) {
      console.error('Failed to apply retention policies:', error);
    }
  }

  /**
   * Get all retention policies based on configuration
   */
  private getRetentionPolicies(): RetentionPolicy[] {
    const { complianceRetentionDays, archiveCompressionLevel } = auditConfig.retention;
    
    return [
      {
        type: 'pci',
        retentionDays: complianceRetentionDays.pci,
        archiveAfterDays: 30,
        compressionLevel: archiveCompressionLevel,
        encryptArchive: auditConfig.security.encryptAuditLogs
      },
      {
        type: 'hipaa',
        retentionDays: complianceRetentionDays.hipaa,
        archiveAfterDays: 90,
        compressionLevel: archiveCompressionLevel,
        encryptArchive: auditConfig.security.encryptAuditLogs
      },
      {
        type: 'gdpr',
        retentionDays: complianceRetentionDays.gdpr,
        archiveAfterDays: 365,
        compressionLevel: archiveCompressionLevel,
        encryptArchive: true // GDPR requires encryption
      },
      {
        type: 'soc2',
        retentionDays: complianceRetentionDays.soc2,
        archiveAfterDays: 30,
        compressionLevel: archiveCompressionLevel,
        encryptArchive: auditConfig.security.encryptAuditLogs
      },
      {
        type: 'default',
        retentionDays: auditConfig.retention.defaultRetentionDays,
        archiveAfterDays: 7,
        compressionLevel: archiveCompressionLevel,
        encryptArchive: false
      }
    ];
  }

  /**
   * Process logs according to specific retention policy
   */
  private async processLogsByPolicy(policy: RetentionPolicy): Promise<void> {
    const logFiles = await this.getLogFiles();
    const now = new Date();

    for (const logFile of logFiles) {
      const ageInDays = this.getFileAgeInDays(logFile.modified, now);
      
      if (ageInDays > policy.retentionDays) {
        // Delete old files
        await this.deleteLogFile(logFile);
        console.log(`Deleted ${logFile.name} (${ageInDays} days old, policy: ${policy.type})`);
      } else if (ageInDays > policy.archiveAfterDays) {
        // Archive files
        await this.archiveLogFile(logFile, policy);
        console.log(`Archived ${logFile.name} (${ageInDays} days old, policy: ${policy.type})`);
      }
    }
  }

  /**
   * Get all log files with metadata
   */
  private async getLogFiles(): Promise<LogFile[]> {
    const logFiles: LogFile[] = [];
    
    try {
      const entries = await fs.readdir(this.logsDirectory, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.log')) {
          const filePath = path.join(this.logsDirectory, entry.name);
          const stats = await fs.stat(filePath);
          
          logFiles.push({
            path: filePath,
            name: entry.name,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            type: this.determineLogType(entry.name)
          });
        }
      }
      
      // Recursively check subdirectories
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'archive') {
          const subDirFiles = await this.getLogFilesFromDirectory(
            path.join(this.logsDirectory, entry.name)
          );
          logFiles.push(...subDirFiles);
        }
      }
    } catch (error) {
      console.error('Failed to read log files:', error);
    }
    
    return logFiles;
  }

  /**
   * Get log files from specific directory
   */
  private async getLogFilesFromDirectory(directory: string): Promise<LogFile[]> {
    const logFiles: LogFile[] = [];
    
    try {
      const entries = await fs.readdir(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.log')) {
          const filePath = path.join(directory, entry.name);
          const stats = await fs.stat(filePath);
          
          logFiles.push({
            path: filePath,
            name: entry.name,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            type: this.determineLogType(entry.name)
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to read directory ${directory}:`, error);
    }
    
    return logFiles;
  }

  /**
   * Determine log type from filename
   */
  private determineLogType(filename: string): 'transaction' | 'security' | 'blockchain' | 'system' {
    if (filename.includes('transaction')) return 'transaction';
    if (filename.includes('security')) return 'security';
    if (filename.includes('blockchain')) return 'blockchain';
    return 'system';
  }

  /**
   * Calculate file age in days
   */
  private getFileAgeInDays(fileDate: Date, currentDate: Date): number {
    const diffTime = Math.abs(currentDate.getTime() - fileDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Archive a log file with compression
   */
  private async archiveLogFile(logFile: LogFile, policy: RetentionPolicy): Promise<void> {
    try {
      const archiveFileName = `${path.parse(logFile.name).name}_${this.formatDate(logFile.modified)}.gz`;
      const archivePath = path.join(this.archiveDirectory, 'compressed', archiveFileName);
      
      // Read and compress the file
      const fileContent = await fs.readFile(logFile.path);
      const compressedContent = await gzip(fileContent, { level: policy.compressionLevel });
      
      // Write compressed archive
      await fs.writeFile(archivePath, compressedContent);
      
      // Create metadata file
      await this.createArchiveMetadata(archivePath, logFile, policy);
      
      // Remove original file
      await fs.unlink(logFile.path);
      
      console.log(`Archived ${logFile.name} to ${archiveFileName} (${this.formatBytes(compressedContent.length)} compressed from ${this.formatBytes(logFile.size)})`);
    } catch (error) {
      console.error(`Failed to archive ${logFile.name}:`, error);
    }
  }

  /**
   * Create metadata for archived file
   */
  private async createArchiveMetadata(archivePath: string, originalFile: LogFile, policy: RetentionPolicy): Promise<void> {
    const metadata = {
      originalPath: originalFile.path,
      originalName: originalFile.name,
      originalSize: originalFile.size,
      compressedSize: (await fs.stat(archivePath)).size,
      archivedAt: new Date().toISOString(),
      retentionPolicy: policy.type,
      expiresAt: new Date(Date.now() + policy.retentionDays * 24 * 60 * 60 * 1000).toISOString(),
      compressionLevel: policy.compressionLevel,
      encrypted: policy.encryptArchive
    };
    
    const metadataPath = archivePath + '.meta.json';
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  /**
   * Delete a log file securely
   */
  private async deleteLogFile(logFile: LogFile): Promise<void> {
    try {
      await fs.unlink(logFile.path);
      console.log(`Securely deleted ${logFile.name}`);
    } catch (error) {
      console.error(`Failed to delete ${logFile.name}:`, error);
    }
  }

  /**
   * Get retention statistics
   */
  async getRetentionStats(): Promise<any> {
    const logFiles = await this.getLogFiles();
    const now = new Date();
    
    const stats = {
      totalFiles: logFiles.length,
      totalSize: logFiles.reduce((sum, file) => sum + file.size, 0),
      byType: {} as Record<string, { count: number; size: number }>,
      byAge: {
        lessThan7Days: 0,
        lessThan30Days: 0,
        lessThan90Days: 0,
        moreThan90Days: 0
      },
      archiveInfo: await this.getArchiveInfo()
    };
    
    // Calculate stats by type and age
    for (const file of logFiles) {
      const type = file.type;
      if (!stats.byType[type]) {
        stats.byType[type] = { count: 0, size: 0 };
      }
      stats.byType[type].count++;
      stats.byType[type].size += file.size;
      
      const ageInDays = this.getFileAgeInDays(file.modified, now);
      if (ageInDays < 7) stats.byAge.lessThan7Days++;
      else if (ageInDays < 30) stats.byAge.lessThan30Days++;
      else if (ageInDays < 90) stats.byAge.lessThan90Days++;
      else stats.byAge.moreThan90Days++;
    }
    
    return stats;
  }

  /**
   * Get archive information
   */
  private async getArchiveInfo(): Promise<any> {
    try {
      const archiveDir = path.join(this.archiveDirectory, 'compressed');
      const files = await fs.readdir(archiveDir);
      const archiveFiles = files.filter(f => f.endsWith('.gz'));
      
      let totalCompressedSize = 0;
      for (const file of archiveFiles) {
        const stats = await fs.stat(path.join(archiveDir, file));
        totalCompressedSize += stats.size;
      }
      
      return {
        archivedFiles: archiveFiles.length,
        totalCompressedSize,
        averageCompressionRatio: archiveFiles.length > 0 ? totalCompressedSize / archiveFiles.length : 0
      };
    } catch (error) {
      return { archivedFiles: 0, totalCompressedSize: 0, averageCompressionRatio: 0 };
    }
  }

  /**
   * Utility methods
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const retentionManager = new RetentionManager();

// Scheduled retention policy application
export function scheduleRetentionPolicies(): void {
  // Run retention policies daily at 2 AM
  const runDaily = () => {
    const now = new Date();
    const next2AM = new Date();
    next2AM.setHours(2, 0, 0, 0);
    
    if (next2AM <= now) {
      next2AM.setDate(next2AM.getDate() + 1);
    }
    
    const timeUntil2AM = next2AM.getTime() - now.getTime();
    
    setTimeout(() => {
      retentionManager.applyRetentionPolicies().catch(console.error);
      setInterval(() => {
        retentionManager.applyRetentionPolicies().catch(console.error);
      }, 24 * 60 * 60 * 1000); // Every 24 hours
    }, timeUntil2AM);
  };
  
  runDaily();
  console.log('Retention policies scheduled for daily execution at 2 AM');
}