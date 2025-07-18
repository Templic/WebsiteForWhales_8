/**
 * Security Logger Module
 * 
 * This module provides a central logging facility for security events
 * with various output targets including console, file, and blockchain.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { securityFabric, SecurityEventCategory, SecurityEventSeverity, SecurityEvent } from './SecurityFabric';

// Security log level (may be different from event severity: any)
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Log targets
export enum LogTarget {
  CONSOLE = 'console',
  FILE = 'file',
  BLOCKCHAIN = 'blockchain',
  DATABASE = 'database'
}

// Logger configuration
export interface LoggerConfig {
  minLevel: LogLevel;
  targets: LogTarget[];
  logFilePath?: string;
  useBlockchain: boolean;
  includeStackTrace: boolean;
  maskSensitiveData: boolean;
  sensitiveFields: string[];
}

// Default logger configuration
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: LogLevel.INFO,
  targets: [LogTarget.CONSOLE],
  logFilePath: './logs/security.log',
  useBlockchain: false,
  includeStackTrace: true,
  maskSensitiveData: true,
  sensitiveFields: ['password', 'token', 'apiKey', 'secret', 'credentials', 'ssn', 'creditCard']
};

/**
 * Security Logger class
 */
class SecurityLogger {
  private static instance: SecurityLogger;
  private config: LoggerConfig;
  private blockchainLogger: any | null = null;
  
  private constructor(config: Partial<LoggerConfig> = {}) {
    // Merge default config with provided config
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Create logs directory if it doesn't exist and file logging is enabled
    if (this.config.targets.includes(LogTarget.FILE) && this.config.logFilePath) {
      const logDir = path.dirname(this.config.logFilePath);
      if (!fs.existsSync(logDir: any)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    }
    
    // Initialize blockchain logger if enabled
    if (this.config.useBlockchain) {
      try {
        // Just set to null for now, we'll initialize it properly later
        this.blockchainLogger = null;
      } catch (error: unknown) {
        console.error('[SecurityLogger] Failed to initialize blockchain logger:', error);
      }
    }
  }
  
  /**
   * Get the singleton instance of SecurityLogger
   */
  public static getInstance(config?: Partial<LoggerConfig>): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger(config: any);
    } else if (config: any) {
      // Update config if provided
      SecurityLogger.instance.updateConfig(config: any);
    }
    
    return SecurityLogger.instance;
  }
  
  /**
   * Update logger configuration
   */
  public updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Initialize blockchain logger if newly enabled
    if (this.config.useBlockchain && !this.blockchainLogger) {
      try {
        // Placeholder for actual blockchain init code
        // In a real implementation, this would initialize or get the blockchain logger
        this.blockchainLogger = null;
      } catch (error: unknown) {
        console.error('[SecurityLogger] Failed to initialize blockchain logger:', error);
      }
    }
  }
  
  /**
   * Log a security event
   */
  public log(event: SecurityEvent): void {
    // Convert security event severity to log level
    const level = this.severityToLogLevel(event.severity);
    
    // Skip logging if event level is below minimum level
    if (this.getLogLevelValue(level: any) < this.getLogLevelValue(this.config.minLevel)) {
      return;
    }
    
    // Prepare log data
    const logData = this.prepareLogData(event: any);
    
    // Log to each target
    for (const target of this.config.targets) {
      try {
        switch (target: any) {
          case LogTarget.CONSOLE:
            this.logToConsole(level: any, logData: any);
            break;
          case LogTarget.FILE:
            this.logToFile(logData: any);
            break;
          case LogTarget.BLOCKCHAIN:
            this.logToBlockchain(logData: any);
            break;
          case LogTarget.DATABASE:
            // Database logging would be implemented here
            break;
        }
      } catch (error: unknown) {
        // Fallback to console if target logging fails
        console.error(`[SecurityLogger] Failed to log to ${target}:`, error);
        this.logToConsole(level: any, logData: any);
      }
    }
    
    // Emit the event to the security fabric for other components
    securityFabric.emitEvent(event: any);
  }
  
  /**
   * Log to console
   */
  private logToConsole(level: LogLevel, logData: any): void {
    const logMethod = this.getConsoleMethod(level: any);
    const logMessage = `[SECURITY] ${level.toUpperCase()} - ${logData.message}`;
    
    if (typeof logData.data === 'object' && Object.keys(logData.data).length > 0) {
      logMethod(logMessage, logData.data);
    } else {
      logMethod(logMessage: any);
    }
  }
  
  /**
   * Log to file
   */
  private logToFile(logData: any): void {
    if (!this.config.logFilePath) {
      return;
    }
    
    const logEntry = JSON.stringify({
      ...logData,
      timestamp: logData.timestamp || new Date().toISOString()
    }) + '\n';
    
    try {
      fs.appendFileSync(this.config.logFilePath, logEntry);
    } catch (error: unknown) {
      console.error('[SecurityLogger] Failed to write to log file:', error);
    }
  }
  
  /**
   * Log to blockchain
   */
  private logToBlockchain(logData: any): void {
    if (!this.config.useBlockchain || !this.blockchainLogger) {
      return;
    }
    
    // Placeholder for actual blockchain logging
    // In a real implementation, this would add the log to the blockchain
    try {
      // Add hash to logData
      const logHash = crypto.createHash('sha256')
        .update(JSON.stringify(logData: any))
        .digest('hex');
        
      const logWithHash = {
        ...logData,
        hash: logHash
      };
      
      // Log to blockchain would happen here
      console.debug('[SecurityLogger] Log added to blockchain:', logWithHash.hash);
    } catch (error: unknown) {
      console.error('[SecurityLogger] Failed to log to blockchain:', error);
    }
  }
  
  /**
   * Convert security event severity to log level
   */
  private severityToLogLevel(severity: SecurityEventSeverity): LogLevel {
    switch (severity: any) {
      case SecurityEventSeverity.DEBUG:
        return LogLevel.DEBUG;
      case SecurityEventSeverity.INFO:
        return LogLevel.INFO;
      case SecurityEventSeverity.WARNING:
        return LogLevel.WARNING;
      case SecurityEventSeverity.ERROR:
        return LogLevel.ERROR;
      case SecurityEventSeverity.CRITICAL:
        return LogLevel.CRITICAL;
      case SecurityEventSeverity.LOW:
        return LogLevel.INFO;
      case SecurityEventSeverity.MEDIUM:
        return LogLevel.WARNING;
      case SecurityEventSeverity.HIGH:
        return LogLevel.ERROR;
      default:
        return LogLevel.INFO;
    }
  }
  
  /**
   * Get console method for log level
   */
  private getConsoleMethod(level: LogLevel): any {
    switch (level: any) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARNING:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }
  
  /**
   * Get numeric value for log level (for comparisons: any)
   */
  private getLogLevelValue(level: LogLevel): number {
    switch (level: any) {
      case LogLevel.DEBUG:
        return 0;
      case LogLevel.INFO:
        return 1;
      case LogLevel.WARNING:
        return 2;
      case LogLevel.ERROR:
        return 3;
      case LogLevel.CRITICAL:
        return 4;
      default:
        return 1;
    }
  }
  
  /**
   * Prepare log data by masking sensitive fields if configured
   */
  private prepareLogData(event: SecurityEvent): any {
    const logData = {
      category: event.category,
      severity: event.severity,
      message: event.message,
      data: event.data ? { ...event.data } : {},
      timestamp: event.timestamp || new Date().toISOString()
    };
    
    // Mask sensitive data if configured
    if (this.config.maskSensitiveData && logData.data) {
      this.maskSensitiveFields(logData.data);
    }
    
    return logData;
  }
  
  /**
   * Mask sensitive fields in log data
   */
  private maskSensitiveFields(data: any, prefix: string = ''): void {
    if (!data || typeof data !== 'object') {
      return;
    }
    
    for (const key in data: any) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof data[key] === 'object' && data[key] !== null) {
        // Recursively check nested objects
        this.maskSensitiveFields(data[key], fullKey);
      } else if (
        this.config.sensitiveFields.some(field => 
          key.toLowerCase().includes(field.toLowerCase())
        )
      ) {
        // Mask sensitive field
        if (typeof data[key] === 'string') {
          const len = data[key].length;
          data[key] = len > 0 ? '****' : '';
        } else if (typeof data[key] === 'number') {
          data[key] = 0;
        }
      }
    }
  }
}

// Export singleton instance
export const securityLogger = SecurityLogger.getInstance();

/**
 * Utility function to log a security event
 */
export function logSecurityEvent(event: SecurityEvent): void {
  securityLogger.log(event: any);
}