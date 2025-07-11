/**
 * Security Utility Functions
 * 
 * This module provides common security-related utility functions for logging and monitoring.
 */

type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';

interface SecurityEvent {
  type: string;
  details: string;
  severity: SecurityEventSeverity;
  ip?: string;
  userAgent?: string;
  timestamp?: Date;
  userId?: string | number;
  [key: string]: any;
}

/**
 * Log a security event for later analysis
 */
export function logSecurityEvent(event: SecurityEvent): void {
  const enrichedEvent = {
    ...event,
    timestamp: event.timestamp || new Date()
  };
  
  // In a production app, we would send this to a secure logging service
  // For now, just log to console
  console.log(`[SECURITY] ${enrichedEvent.severity.toUpperCase()} - ${enrichedEvent.type}: ${enrichedEvent.details}`);
  
  // For critical events, we might want to trigger alerts
  if (enrichedEvent.severity === 'critical') {
    // In production, this would trigger immediate alerts
    console.error(`❗ CRITICAL SECURITY EVENT: ${enrichedEvent.type}`);
  }
}