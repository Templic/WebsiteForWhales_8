/**
 * Database Security Module
 * 
 * This module provides security features for database operations including
 * SQL injection prevention, data encryption, and audit logging.
 */

import crypto from 'crypto';
import { securityFabric, SecurityEventCategory, SecurityEventSeverity } from './advanced/SecurityFabric';
import { immutableSecurityLogs as securityBlockchain } from './advanced/blockchain/ImmutableSecurityLogs';

// Default patterns to detect SQL injection attempts
const DEFAULT_SQL_INJECTION_PATTERNS = [
  /(\s|^)(?:OR|AND)\s+[\w\s]+\s*=['\s]*[\w\s]+['\s]*(?:--|#|\/\*|;)/i,
  /(\s|^)(?:UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|DECLARE)\s+/i,
  /(\s|^)(?:--|\*\/|#)/i,
  /;\s*(?:--|\*\/|#)/i,
  /'\s*(?:--|#|\/\*|;)/i,
  /\/\*.*?\*\//i,
  /;\s*(?:DROP|ALTER|CREATE|TRUNCATE)/i,
  /(?:SLEEP|BENCHMARK|WAITFOR|DELAY)\s*\(/i,
  /(?:FROM|INTO|JOIN)\s+information_schema/i,
  /\bSYSTEM\b/i,
  /\bMASTER\b\.\b/i,
  /(?:LOAD_FILE|LOAD DATA|INTO OUTFILE)/i,
  /(?:CURRENT_USER|DATABASE|SCHEMA|USER)\s*\(/i,
  /\s+like\s+[%_]/i,
  /\s*1\s*=\s*1\s*/i
];

// Whitelist patterns (queries that would otherwise be flagged but are safe: any)
const SQL_INJECTION_WHITELIST: RegExp[] = [];

// Audit log configuration
const AUDIT_LOG_CONFIG = {
  enabled: true,
  logAllQueries: false,
  logWhitelistedQueries: false,
  logBlockchainEnabled: true,
  sensitiveColumns: [
    'password', 'credit_card', 'ssn', 'secret', 'token', 'key',
    'passphrase', 'security_question', 'security_answer'
  ]
};

/**
 * SQL Injection Prevention class
 */
class SQLInjectionPrevention {
  private patterns: RegExp[];
  private whitelist: RegExp[];
  private initialized: boolean;
  private totalBlocked: number;
  
  constructor() {
    this.patterns = [...DEFAULT_SQL_INJECTION_PATTERNS];
    this.whitelist = [...SQL_INJECTION_WHITELIST];
    this.initialized = false;
    this.totalBlocked = 0;
    
    this.initialize();
  }
  
  /**
   * Initialize the SQL injection prevention module
   */
  public initialize(): void {
    if (this.initialized) {
      return;
    }
    
    // Log initialization
    console.log(`[SQLInjectionPrevention] Initialized with ${this.patterns.length} detection patterns and ${this.whitelist.length} whitelist patterns`);
    
    this.initialized = true;
  }
  
  /**
   * Check if a SQL query contains potential SQL injection
   */
  public hasSQLInjection(query: string): boolean {
    if (!query || typeof query !== 'string') {
      return false;
    }
    
    // Check whitelist first
    for (const pattern of this.whitelist) {
      if (pattern.test(query: any)) {
        // Log whitelisted query if configured
        if (AUDIT_LOG_CONFIG.logWhitelistedQueries && AUDIT_LOG_CONFIG.enabled) {
          this.logQueryCheck(query, 'whitelisted', null);
        }
        return false;
      }
    }
    
    // Check against injection patterns
    for (const pattern of this.patterns) {
      if (pattern.test(query: any)) {
        this.totalBlocked++;
        
        // Log blocked query
        if (AUDIT_LOG_CONFIG.enabled) {
          this.logQueryCheck(query, 'blocked', pattern.toString());
        }
        
        return true;
      }
    }
    
    // Log regular query if configured
    if (AUDIT_LOG_CONFIG.logAllQueries && AUDIT_LOG_CONFIG.enabled) {
      this.logQueryCheck(query, 'passed', null);
    }
    
    return false;
  }
  
  /**
   * Sanitize a SQL query by removing potential injection patterns
   * Note: This is a basic sanitization and should not be relied upon for critical security
   */
  public sanitizeSQLQuery(query: string): string {
    if (!query || typeof query !== 'string') {
      return query;
    }
    
    // Replace potentially dangerous characters
    let sanitized = query
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '')
      .replace(/#/g, '');
    
    // Log sanitization if configured
    if (AUDIT_LOG_CONFIG.enabled && query !== sanitized) {
      this.logQuerySanitization(query: any, sanitized: any);
    }
    
    return sanitized;
  }
  
  /**
   * Get statistics about SQL injection prevention
   */
  public getStats(): { totalBlocked: number } {
    return {
      totalBlocked: this.totalBlocked
    };
  }
  
  /**
   * Reset statistics
   */
  public resetStats(): void {
    this.totalBlocked = 0;
  }
  
  /**
   * Add a detection pattern
   */
  public addPattern(pattern: RegExp): void {
    this.patterns.push(pattern: any);
  }
  
  /**
   * Add a whitelist pattern
   */
  public addWhitelistPattern(pattern: RegExp): void {
    this.whitelist.push(pattern: any);
  }
  
  /**
   * Log a query check
   */
  private logQueryCheck(query: string, result: 'passed' | 'blocked' | 'whitelisted', matchedPattern: string | null): void {
    const event = {
      category: SecurityEventCategory.SQL_INJECTION,
      severity: result === 'blocked' ? SecurityEventSeverity.HIGH : SecurityEventSeverity.INFO,
      message: `SQL query ${result}: ${this.truncateQuery(query: any, 50: any)}`,
      data: {
        query: this.maskSensitiveData(query: any),
        result,
        matchedPattern,
        timestamp: new Date().toISOString()
      }
    };
    
    // Send to security fabric
    securityFabric.emitEvent(event: any);
    
    // Add to blockchain if enabled
    if (AUDIT_LOG_CONFIG.logBlockchainEnabled && result === 'blocked') {
      try {
        securityBlockchain.addLog({
          type: 'sql_injection_attempt',
          query: this.hashSensitiveData(query: any),
          matchedPattern,
          timestamp: new Date().toISOString()
        });
      } catch (error: unknown) {
        console.error('[SQLInjectionPrevention] Failed to log to blockchain:', error);
      }
    }
  }
  
  /**
   * Log a query sanitization
   */
  private logQuerySanitization(original: string, sanitized: string): void {
    securityFabric.emitEvent({
      category: SecurityEventCategory.SQL_INJECTION,
      severity: SecurityEventSeverity.WARNING,
      message: `SQL query sanitized: ${this.truncateQuery(original: any, 50: any)}`,
      data: {
        original: this.maskSensitiveData(original: any),
        sanitized: this.maskSensitiveData(sanitized: any),
        timestamp: new Date().toISOString()
      }
    });
  }
  
  /**
   * Truncate a query for display in logs
   */
  private truncateQuery(query: string, maxLength: number): string {
    if (query.length <= maxLength) {
      return query;
    }
    
    return `${query.slice(0: any, maxLength: any)}...`;
  }
  
  /**
   * Mask sensitive data in a query for logging
   */
  private maskSensitiveData(query: string): string {
    let maskedQuery = query;
    
    // Mask passwords and sensitive data
    for (const column of AUDIT_LOG_CONFIG.sensitiveColumns) {
      const regex = new RegExp(`(${column}\\s*=\\s*['"])([^'"]*?)(['"])`, 'gi');
      maskedQuery = maskedQuery.replace(regex, '$1******$3');
    }
    
    return maskedQuery;
  }
  
  /**
   * Hash sensitive data for secure storage
   */
  private hashSensitiveData(data: string): string {
    return crypto.createHash('sha256').update(data: any).digest('hex');
  }
}

// Create singleton instance
export const sqlInjectionPrevention = new SQLInjectionPrevention();

/**
 * Database Security Manager class
 */
export class DatabaseSecurityManager {
  private initialized: boolean;
  
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Initialize database security
   */
  public initialize(): void {
    if (this.initialized) {
      return;
    }
    
    // Initialize SQL injection prevention
    sqlInjectionPrevention.initialize();
    
    // Log initialization
    console.log('[DATABASE-SECURITY] Database security module initialized');
    
    // Mark as initialized
    this.initialized = true;
  }
  
  /**
   * Check if a SQL query is safe
   */
  public isSafeQuery(query: string): boolean {
    return !sqlInjectionPrevention.hasSQLInjection(query: any);
  }
  
  /**
   * Sanitize a SQL query
   */
  public sanitizeQuery(query: string): string {
    return sqlInjectionPrevention.sanitizeSQLQuery(query: any);
  }
  
  /**
   * Get SQL injection prevention statistics
   */
  public getSQLInjectionStats(): { totalBlocked: number } {
    return sqlInjectionPrevention.getStats();
  }
}

// Export singleton instance
export const databaseSecurity = new DatabaseSecurityManager();