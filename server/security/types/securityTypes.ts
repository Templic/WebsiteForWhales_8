/**
 * Security Types
 * 
 * This module defines common types for the security system.
 */

import { Session } from 'express-session';

/**
 * Security event types for logging
 */
export enum SecurityEventType {
  // Authentication events
  AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS',
  AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE',
  SESSION_CREATED = 'SESSION_CREATED',
  SESSION_DESTROYED = 'SESSION_DESTROYED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
  MFA_CHALLENGED = 'MFA_CHALLENGED',
  MFA_SUCCEEDED = 'MFA_SUCCEEDED',
  MFA_FAILED = 'MFA_FAILED',
  
  // Authorization events
  ACCESS_DENIED = 'ACCESS_DENIED',
  AUTHORIZATION_FAILURE = 'AUTHORIZATION_FAILURE',
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',
  ROLE_ASSIGNED = 'ROLE_ASSIGNED',
  ROLE_REVOKED = 'ROLE_REVOKED',
  
  // API events
  API_REQUEST = 'API_REQUEST',
  API_RESPONSE = 'API_RESPONSE',
  API_ERROR_RESPONSE = 'API_ERROR_RESPONSE',
  API_VALIDATION_FAILURE = 'API_VALIDATION_FAILURE',
  
  // Rate limiting events
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  RATE_LIMIT_WARNING = 'RATE_LIMIT_WARNING',
  
  // CSRF events
  CSRF_TOKEN_GENERATED = 'CSRF_TOKEN_GENERATED',
  CSRF_VALIDATION_FAILURE = 'CSRF_VALIDATION_FAILURE',
  CSRF_TOKEN_ROTATED = 'CSRF_TOKEN_ROTATED',
  
  // Security configuration events
  SECURITY_CONFIGURATION_CHANGED = 'SECURITY_CONFIGURATION_CHANGED',
  SECURITY_SCAN_REQUESTED = 'SECURITY_SCAN_REQUESTED',
  TEST_SECURITY_SCAN_REQUESTED = 'TEST_SECURITY_SCAN_REQUESTED',
  AUTH_SCAN_REQUESTED = 'AUTH_SCAN_REQUESTED',
  SECURITY_LOGS_ACCESSED = 'SECURITY_LOGS_ACCESSED',
  
  // Suspicious activity events
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  ANOMALY_DETECTED = 'ANOMALY_DETECTED',
  ATTACK_DETECTED = 'ATTACK_DETECTED',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  
  // Content events
  CONTENT_CREATED = 'CONTENT_CREATED',
  CONTENT_UPDATED = 'CONTENT_UPDATED',
  CONTENT_DELETED = 'CONTENT_DELETED',
  SENSITIVE_CONTENT_ACCESSED = 'SENSITIVE_CONTENT_ACCESSED',
  
  // Payment and order events
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  ORDER_DELETED = 'ORDER_DELETED',
  
  // Newsletter events
  NEWSLETTER_SUBSCRIBED = 'NEWSLETTER_SUBSCRIBED',
  NEWSLETTER_UNSUBSCRIBED = 'NEWSLETTER_UNSUBSCRIBED',
  
  // Other events
  SECURITY_INITIALIZED = 'SECURITY_INITIALIZED',
  SECURITY_ERROR = 'SECURITY_ERROR',
  SECURITY_WARNING = 'SECURITY_WARNING'
}

/**
 * Log levels for security events
 */
export enum SecurityLogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Interface for security events
 */
export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: Date;
  level: SecurityLogLevel;
  source: string;
  data: Record<string, unknown>;
}

/**
 * Interface for security attack patterns
 */
export interface AttackPattern {
  name: string;
  description: string;
  patterns: RegExp[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigationStrategy?: string;
  references?: string[];
}

/**
 * Interface for security configuration
 */
export interface SecurityConfig {
  enableAPIValidation: boolean;
  enableRateLimiting: boolean;
  enableSecurityHeaders: boolean;
  enableLogging: boolean;
  enableCSRFProtection: boolean;
  enableStrictContentSecurityPolicy: boolean;
  enableQuantumResistantCrypto: boolean;
  enableAnomalyDetection: boolean;
  enableRuntimeProtection: boolean;
  enableImmutableLogs: boolean;
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordMinComplexity: number;
  sessionTimeout: number;
  tokenExpiration: number;
  cookieSecureFlag: boolean;
  cookieHttpOnlyFlag: boolean;
  cookieSameSitePolicy: 'strict' | 'lax' | 'none';
}

/**
 * Feature flags for security features
 */
export interface FeatureFlags {
  enableSecurityScans: boolean;
  enableAdvancedAnalytics: boolean;
  enableAdvancedRateLimiting: boolean;
  enableAdvancedCSRFProtection: boolean;
  enableMachineLearning: boolean;
  enableIntelligenceFeed: boolean;
  enableAdvancedSecurityHeaders: boolean;
  enableImmutableLogs: boolean;
  enableAdvancedInputValidation: boolean;
  enableZeroTrustMode: boolean;
}

/**
 * Security status levels
 */
export enum SecurityStatusLevel {
  NORMAL = 'normal',
  ELEVATED = 'elevated',
  HIGH = 'high',
  CRITICAL = 'critical',
  LOCKDOWN = 'lockdown'
}

/**
 * Interface for security metrics
 */
export interface SecurityMetrics {
  apiRequestCount: number;
  failedLoginAttempts: number;
  rateLimitExceededCount: number;
  validationFailureCount: number;
  suspiciousActivityCount: number;
  csrfFailureCount: number;
  anomalyDetectionCount: number;
  attackDetectionCount: number;
}

/**
 * Extended session with security-related fields
 */
export interface SecureSession extends Session {
  userId?: string;
  roles?: string[];
  securityContext?: {
    lastPasswordChange?: Date;
    mfaEnabled?: boolean;
    failedLoginAttempts?: number;
    securityLevel?: SecurityStatusLevel;
    lastActivity?: Date;
    deviceFingerprint?: string;
    trustedDevices?: string[];
  };
}

/**
 * Interface for security component in the security fabric
 */
export interface SecurityComponent {
  name: string;
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
  getStatus(): Promise<{ active: boolean; status: string }>;
}

/**
 * Security user roles
 */
export enum SecurityRole {
  USER = 'user',
  ADMIN = 'admin',
  SECURITY_ADMIN = 'security_admin',
  CONTENT_MANAGER = 'content_manager',
  SYSTEM = 'system'
}

/**
 * Authentication methods
 */
export enum AuthMethod {
  PASSWORD = 'password',
  MFA_TOTP = 'mfa_totp',
  MFA_SMS = 'mfa_sms',
  MFA_EMAIL = 'mfa_email',
  SOCIAL = 'social',
  SSO = 'sso',
  API_KEY = 'api_key'
}

/**
 * Scan types for security scans
 */
export enum ScanType {
  FULL = 'full',
  QUICK = 'quick',
  AUTHENTICATION = 'authentication',
  API = 'api',
  VULNERABILITY = 'vulnerability',
  CONFIGURATION = 'configuration',
  DEPENDENCY = 'dependency'
}