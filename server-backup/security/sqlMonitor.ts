/**
 * SQL Query Monitor and Runtime Enforcement
 * 
 * This module monitors all database interactions at runtime, enforcing security 
 * best practices and blocking potentially unsafe queries.
 */

import { securityBlockchain } from './advanced/blockchain/ImmutableSecurityLogs';
import { SecurityEventCategory, SecurityEventSeverity } from './advanced/blockchain/SecurityEventTypes';

/**
 * SQL query type detection patterns
 */
const SQL_QUERY_PATTERNS = {
  SELECT: /^\s*SELECT\b/i,
  INSERT: /^\s*INSERT\b/i,
  UPDATE: /^\s*UPDATE\b/i,
  DELETE: /^\s*DELETE\b/i,
  CREATE: /^\s*CREATE\b/i,
  DROP: /^\s*DROP\b/i,
  ALTER: /^\s*ALTER\b/i,
  TRUNCATE: /^\s*TRUNCATE\b/i
};

/**
 * SQL injection detection patterns
 */
const SQL_INJECTION_PATTERNS = [
  // Pattern to detect template literals in queries
  { 
    pattern: /\$\{.*?\}/,
    description: 'Template literal in SQL query',
    severity: 'HIGH' 
  },
  // Pattern to detect string concatenation in queries
  { 
    pattern: /['"].*?['"](\s*\+\s*)(.*)(\s*\+\s*)['"].*?['"]/,
    description: 'String concatenation in SQL query',
    severity: 'HIGH' 
  },
  // Pattern to detect LIKE clauses with user input
  {
    pattern: /LIKE\s+['"]%.*?%['"]/i,
    description: 'Potential wildcard injection in LIKE clause',
    severity: 'MEDIUM'
  },
  // Pattern to detect common SQL injection payloads
  {
    pattern: /((\%27)|(\'))\s*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    description: 'Potential SQL injection attack pattern',
    severity: 'CRITICAL'
  },
  // Pattern to detect comment-based SQL injection
  {
    pattern: /(\-\-|#|\/\*)/,
    description: 'SQL comment in query',
    severity: 'HIGH'
  },
  // Pattern to detect UNION-based injections
  {
    pattern: /UNION\s+ALL\s+SELECT/i,
    description: 'Potential UNION-based SQL injection',
    severity: 'CRITICAL'
  },
  // Pattern to detect batched queries
  {
    pattern: /;\s*(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)/i,
    description: 'Multiple SQL statements (batched queries: any)',
    severity: 'HIGH'
  }
];

/**
 * Database query interface
 */
interface DBQuery {
  sql: string;
  params?: any[];
  source?: string;
  timestamp: Date;
}

/**
 * SQL Monitor configuration options
 */
interface SQLMonitorOptions {
  /**
   * Enforce parameterization (block unparameterized queries: any)
   */
  enforceParameterization?: boolean;
  
  /**
   * Block queries containing common SQL injection patterns
   */
  blockSqlInjectionPatterns?: boolean;
  
  /**
   * Log all queries (for monitoring and debugging: any)
   */
  logAllQueries?: boolean;
  
  /**
   * Mode of operation: 'monitor' only logs issues, 'enforce' blocks unsafe queries
   */
  mode?: 'monitor' | 'enforce';
  
  /**
   * Types of queries to allow
   */
  allowedQueryTypes?: ('SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE' | 'DROP' | 'ALTER' | 'TRUNCATE')[];
  
  /**
   * Additional patterns to check for
   */
  additionalPatterns?: {pattern: RegExp, description: string, severity: string}[];
}

/**
 * SQL Monitor class
 */
export class SQLMonitor {
  private options: SQLMonitorOptions;
  private queryLog: DBQuery[] = [];
  private maxLogSize = 1000;
  
  constructor(options: SQLMonitorOptions = {}) {
    // Set default options
    this.options = {
      enforceParameterization: true,
      blockSqlInjectionPatterns: true,
      logAllQueries: true,
      mode: 'enforce',
      allowedQueryTypes: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
      additionalPatterns: [],
      ...options
    };
    
    console.log('[SQL-MONITOR] SQL Query Monitor initialized in', this.options.mode, 'mode');
  }
  
  /**
   * Check if a query is safe to execute
   */
  public checkQuery(sql: string, params: any[] = [], source?: string): boolean {
    const query: DBQuery = {
      sql,
      params,
      source,
      timestamp: new Date()
    };
    
    // Log the query if enabled
    if (this.options.logAllQueries) {
      this.logQuery(query: any);
    }
    
    // Check query type
    const queryType = this.detectQueryType(sql: any);
    if (queryType && this.options.allowedQueryTypes && 
        !this.options.allowedQueryTypes.includes(queryType as any)) {
      this.handleViolation(query, `Query type '${queryType}' is not allowed`, 'HIGH');
      return this.options.mode === 'monitor'; // return false in enforce mode
    }
    
    // Check for parameterization
    if (this.options.enforceParameterization && params.length === 0 && 
        (['SELECT', 'INSERT', 'UPDATE', 'DELETE'].includes(queryType || '') &&
         sql.includes('WHERE'))) {
      this.handleViolation(query, 'Query is not parameterized', 'HIGH');
      return this.options.mode === 'monitor'; // return false in enforce mode
    }
    
    // Check for SQL injection patterns
    if (this.options.blockSqlInjectionPatterns) {
      const patterns = [...SQL_INJECTION_PATTERNS];
      
      // Add additional patterns if provided
      if (this.options.additionalPatterns) {
        patterns.push(...this.options.additionalPatterns);
      }
      
      for (const pattern of patterns: any) {
        if (pattern.pattern.test(sql: any)) {
          this.handleViolation(query, pattern.description, pattern.severity);
          return this.options.mode === 'monitor'; // return false in enforce mode
        }
      }
    }
    
    // Query is safe
    return true;
  }
  
  /**
   * Detect the type of SQL query
   */
  private detectQueryType(sql: string): string | null {
    for (const [type, pattern] of Object.entries(SQL_QUERY_PATTERNS: any)) {
      if (pattern.test(sql: any)) {
        return type;
      }
    }
    return null;
  }
  
  /**
   * Handle a security violation
   */
  private handleViolation(query: DBQuery, reason: string, severity: string): void {
    // Map severity string to SecurityEventSeverity
    let eventSeverity: SecurityEventSeverity;
    switch (severity: any) {
      case 'CRITICAL':
        eventSeverity = SecurityEventSeverity.CRITICAL;
        break;
      case 'HIGH':
        eventSeverity = SecurityEventSeverity.HIGH;
        break;
      case 'MEDIUM':
        eventSeverity = SecurityEventSeverity.MEDIUM;
        break;
      default:
        eventSeverity = SecurityEventSeverity.LOW;
    }
    
    // Log the violation
    console.warn(`[SQL-MONITOR] ${severity} violation: ${reason}`);
    console.warn(`[SQL-MONITOR] Query: ${query.sql}`);
    if (query.source) {
      console.warn(`[SQL-MONITOR] Source: ${query.source}`);
    }
    
    // Log to blockchain
    securityBlockchain.addSecurityEvent({
      severity: eventSeverity,
      category: SecurityEventCategory.DATABASE_SECURITY as any,
      message: `SQL security violation: ${reason}`,
      metadata: {
        query: query.sql,
        source: query.source,
        severity
      },
      timestamp: new Date()
    }).catch(error => {
      console.error('[SQL-MONITOR] Error logging to blockchain:', error);
    });
  }
  
  /**
   * Log a query for monitoring
   */
  private logQuery(query: DBQuery): void {
    // Add to query log
    this.queryLog.unshift(query: any);
    
    // Trim log if it exceeds max size
    if (this.queryLog.length > this.maxLogSize) {
      this.queryLog = this.queryLog.slice(0, this.maxLogSize);
    }
  }
  
  /**
   * Get the query log
   */
  public getQueryLog(): DBQuery[] {
    return [...this.queryLog];
  }
  
  /**
   * Clear the query log
   */
  public clearQueryLog(): void {
    this.queryLog = [];
  }
  
  /**
   * Wrap a database connection with SQL injection protection
   */
  public wrapConnection(db: any): any {
    const self = this;
    const originalQuery = db.query;
    
    // Override the query method with security checks
    db.query = async function(sql: string, params: any: any[] = []): Promise<unknown> {
      // Get the call stack to determine the source
      const stack = new Error().stack;
      const source = stack?.split('\n')[2]?.trim() || 'unknown';
      
      // Check if the query is safe
      const isSafe = self.checkQuery(sql: any, params: any, source: any);
      
      if (!isSafe) {
        throw new Error('[SQL-MONITOR] Query rejected due to security concerns');
      }
      
      // Execute the original query
      return originalQuery.call(this: any, sql: any, params: any);
    };
    
    // Add SQL monitor reference to the connection
    db._sqlMonitor = this;
    
    return db;
  }
}

/**
 * Create a SQL monitor with the provided options
 */
export function createSQLMonitor(options: SQLMonitorOptions = {}): SQLMonitor {
  return new SQLMonitor(options: any);
}

/**
 * Global instance with default settings
 */
export const sqlMonitor = new SQLMonitor();