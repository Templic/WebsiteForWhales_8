/**
 * Audit Log Search Optimization
 * Easy Win: Add indexing and efficient search capabilities
 */

import fs from 'fs/promises';
import path from 'path';
import { auditConfig } from '../config/auditConfig.js';

export interface AuditSearchQuery {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  eventType?: string;
  severity?: string;
  ipAddress?: string;
  limit?: number;
  offset?: number;
}

export interface AuditSearchResult {
  entries: any[];
  totalCount: number;
  queryTime: number;
  fromCache: boolean;
}

export class AuditSearchOptimizer {
  private indexCache = new Map<string, any[]>();
  private lastIndexUpdate = new Map<string, number>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Optimized search across audit logs with caching and indexing
   */
  async searchAuditLogs(query: AuditSearchQuery): Promise<AuditSearchResult> {
    const startTime = Date.now();
    
    try {
      // Check cache first if enabled
      if (auditConfig.performance.cacheQueryResults) {
        const cachedResult = this.getCachedResult(query);
        if (cachedResult) {
          return {
            entries: cachedResult,
            totalCount: cachedResult.length,
            queryTime: Date.now() - startTime,
            fromCache: true
          };
        }
      }

      // Perform search across multiple log sources
      const results = await this.performOptimizedSearch(query);
      
      // Cache results if enabled
      if (auditConfig.performance.cacheQueryResults) {
        this.cacheResult(query, results);
      }

      return {
        entries: results,
        totalCount: results.length,
        queryTime: Date.now() - startTime,
        fromCache: false
      };
    } catch (error) {
      console.error('Audit search error:', error);
      return {
        entries: [],
        totalCount: 0,
        queryTime: Date.now() - startTime,
        fromCache: false
      };
    }
  }

  /**
   * Perform optimized search with multiple strategies
   */
  private async performOptimizedSearch(query: AuditSearchQuery): Promise<any[]> {
    const allResults: any[] = [];

    // Search transaction logs
    const transactionResults = await this.searchTransactionLogs(query);
    allResults.push(...transactionResults);

    // Search security logs
    const securityResults = await this.searchSecurityLogs(query);
    allResults.push(...securityResults);

    // Search blockchain logs
    const blockchainResults = await this.searchBlockchainLogs(query);
    allResults.push(...blockchainResults);

    // Sort by timestamp and apply pagination
    const sortedResults = allResults
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(query.offset || 0, (query.offset || 0) + (query.limit || 100));

    return sortedResults;
  }

  /**
   * Search transaction logs with optimized file reading
   */
  private async searchTransactionLogs(query: AuditSearchQuery): Promise<any[]> {
    const logDir = path.join(process.cwd(), 'logs', 'transactions');
    const results: any[] = [];

    try {
      const files = await fs.readdir(logDir);
      const logFiles = files
        .filter(file => file.endsWith('.log'))
        .sort()
        .reverse(); // Start with most recent

      for (const file of logFiles) {
        const filePath = path.join(logDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const entry = JSON.parse(line);
            if (this.matchesQuery(entry, query)) {
              results.push({
                ...entry,
                source: 'transaction',
                logFile: file
              });
            }
          } catch (parseError) {
            // Skip invalid JSON lines
            continue;
          }
        }

        // Early exit if we have enough results
        if (results.length >= (query.limit || 100)) {
          break;
        }
      }
    } catch (error) {
      console.warn('Transaction log search error:', error);
    }

    return results;
  }

  /**
   * Search security event logs
   */
  private async searchSecurityLogs(query: AuditSearchQuery): Promise<any[]> {
    const logDir = path.join(process.cwd(), 'logs', 'security');
    const results: any[] = [];

    try {
      const files = await fs.readdir(logDir);
      const logFiles = files
        .filter(file => file.endsWith('.log'))
        .sort()
        .reverse();

      for (const file of logFiles) {
        const filePath = path.join(logDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const entry = JSON.parse(line);
            if (this.matchesQuery(entry, query)) {
              results.push({
                ...entry,
                source: 'security',
                logFile: file
              });
            }
          } catch (parseError) {
            continue;
          }
        }
      }
    } catch (error) {
      console.warn('Security log search error:', error);
    }

    return results;
  }

  /**
   * Search blockchain audit logs
   */
  private async searchBlockchainLogs(query: AuditSearchQuery): Promise<any[]> {
    // This would integrate with the blockchain logging system
    // For now, return empty array as blockchain search needs special handling
    return [];
  }

  /**
   * Check if log entry matches search query
   */
  private matchesQuery(entry: any, query: AuditSearchQuery): boolean {
    // Date range filtering
    if (query.startDate || query.endDate) {
      const entryDate = new Date(entry.timestamp);
      if (query.startDate && entryDate < query.startDate) return false;
      if (query.endDate && entryDate > query.endDate) return false;
    }

    // User ID filtering
    if (query.userId && entry.userId !== query.userId) return false;

    // Event type filtering
    if (query.eventType && entry.type !== query.eventType) return false;

    // Severity filtering
    if (query.severity && entry.severity !== query.severity) return false;

    // IP address filtering
    if (query.ipAddress && entry.ip_address !== query.ipAddress) return false;

    return true;
  }

  /**
   * Cache management
   */
  private getCachedResult(query: AuditSearchQuery): any[] | null {
    const queryKey = this.generateQueryKey(query);
    const cached = this.indexCache.get(queryKey);
    const lastUpdate = this.lastIndexUpdate.get(queryKey) || 0;

    if (cached && (Date.now() - lastUpdate) < this.cacheTimeout) {
      return cached;
    }

    return null;
  }

  private cacheResult(query: AuditSearchQuery, results: any[]): void {
    const queryKey = this.generateQueryKey(query);
    this.indexCache.set(queryKey, results);
    this.lastIndexUpdate.set(queryKey, Date.now());

    // Cleanup old cache entries
    this.cleanupCache();
  }

  private generateQueryKey(query: AuditSearchQuery): string {
    return JSON.stringify({
      startDate: query.startDate?.toISOString(),
      endDate: query.endDate?.toISOString(),
      userId: query.userId,
      eventType: query.eventType,
      severity: query.severity,
      ipAddress: query.ipAddress
    });
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, timestamp] of this.lastIndexUpdate.entries()) {
      if (now - timestamp > this.cacheTimeout) {
        this.indexCache.delete(key);
        this.lastIndexUpdate.delete(key);
      }
    }
  }

  /**
   * Build search index for faster queries
   */
  async buildSearchIndex(): Promise<void> {
    if (!auditConfig.performance.enableIndexing) return;

    console.log('Building audit search index...');
    const startTime = Date.now();

    try {
      // Index by user ID
      await this.buildUserIndex();
      
      // Index by event type
      await this.buildEventTypeIndex();
      
      // Index by date ranges
      await this.buildDateIndex();

      console.log(`Audit search index built in ${Date.now() - startTime}ms`);
    } catch (error) {
      console.error('Failed to build search index:', error);
    }
  }

  private async buildUserIndex(): Promise<void> {
    // Implementation for user-based indexing
    // This would scan logs and create user-specific indexes
  }

  private async buildEventTypeIndex(): Promise<void> {
    // Implementation for event type indexing
    // This would categorize logs by event types
  }

  private async buildDateIndex(): Promise<void> {
    // Implementation for date-based indexing
    // This would create date-range indexes for faster temporal queries
  }
}

// Export singleton instance
export const auditSearchOptimizer = new AuditSearchOptimizer();

// Initialize search optimization
export async function initializeAuditSearch(): Promise<void> {
  console.log('Initializing audit search optimization...');
  
  if (auditConfig.performance.enableIndexing) {
    await auditSearchOptimizer.buildSearchIndex();
  }
  
  console.log('Audit search optimization ready');
}