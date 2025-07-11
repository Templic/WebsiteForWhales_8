/**
 * Simple logger utility for the application
 * In a production environment, this would be replaced with 
 * a more robust solution like Winston or Pino
 */

// Set the log level based on environment
const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

/**
 * Get the current timestamp in a consistent format
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format a log message with timestamp, level, and optional context
 */
function formatMessage(level: string, message: string, context?: any): string {
  const timestamp = getTimestamp();
  const baseMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (context) {
    try {
      // Format context appropriately
      const contextStr = typeof context === 'object' 
        ? JSON.stringify(context)
        : context.toString();
      return `${baseMessage} - ${contextStr}`;
    } catch (err) {
      return `${baseMessage} - [Context serialization failed]`;
    }
  }
  
  return baseMessage;
}

/**
 * Check if the given log level should be logged based on current LOG_LEVEL
 */
function shouldLog(level: keyof typeof levels): boolean {
  return levels[level] <= levels[LOG_LEVEL as keyof typeof levels];
}

/**
 * Logger object with methods for different log levels
 */
export const logger = {
  /**
   * Log an error message
   */
  error(message: string, context?: any): void {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message, context));
    }
  },
  
  /**
   * Log a warning message
   */
  warn(message: string, context?: any): void {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message, context));
    }
  },
  
  /**
   * Log an informational message
   */
  info(message: string, context?: any): void {
    if (shouldLog('info')) {
      console.info(formatMessage('info', message, context));
    }
  },
  
  /**
   * Log a debug message (only in development)
   */
  debug(message: string, context?: any): void {
    if (shouldLog('debug')) {
      console.debug(formatMessage('debug', message, context));
    }
  },
  
  /**
   * Log a message with a specific level
   */
  log(level: keyof typeof levels, message: string, context?: any): void {
    if (shouldLog(level)) {
      console.log(formatMessage(level, message, context));
    }
  }
};

export default logger;