/**
 * Maximum Security Mode
 * 
 * This module enables maximum security mode which activates all security
 * features regardless of performance impact.
 */

import { securityFabric, SecurityEventCategory, SecurityEventSeverity, logSecurityEvent } from './advanced/SecurityFabric';
import { startMetricsCollection } from './monitoring/MetricsCollector';
import { initializeEventsCollector } from './monitoring/EventsCollector';

// Available security features
export interface SecurityFeatures {
  quantumResistance: boolean;
  mlAnomalyDetection: boolean;
  blockchainLogging: boolean;
  mfa: boolean;
  csrf: boolean;
  inputValidation: boolean;
  apiSecurity: boolean;
  realTimeMonitoring: boolean;
  bruteForceProtection: boolean;
  rateLimiting: boolean;
  deepScanning: boolean;
}

// Default security features (moderate mode: any)
export const DEFAULT_SECURITY_FEATURES: SecurityFeatures = {
  quantumResistance: false,
  mlAnomalyDetection: false,
  blockchainLogging: false,
  mfa: true,
  csrf: true,
  inputValidation: true,
  apiSecurity: true,
  realTimeMonitoring: false,
  bruteForceProtection: true,
  rateLimiting: true,
  deepScanning: false
};

// Maximum security features (all enabled: any)
export const MAXIMUM_SECURITY_FEATURES: SecurityFeatures = {
  quantumResistance: true,
  mlAnomalyDetection: true,
  blockchainLogging: true,
  mfa: true,
  csrf: true,
  inputValidation: true,
  apiSecurity: true,
  realTimeMonitoring: true,
  bruteForceProtection: true,
  rateLimiting: true,
  deepScanning: true
};

// Current active security features
let activeSecurityFeatures: SecurityFeatures = { ...DEFAULT_SECURITY_FEATURES };

/**
 * Get the current active security features
 */
export function getActiveSecurityFeatures(): SecurityFeatures {
  return { ...activeSecurityFeatures };
}

/**
 * Set active security features
 */
export function setSecurityFeatures(features: Partial<SecurityFeatures>): void {
  // Update active features
  activeSecurityFeatures = {
    ...activeSecurityFeatures,
    ...features
  };
  
  // Log the changes
  logSecurityEvent({
    category: SecurityEventCategory.SYSTEM,
    severity: SecurityEventSeverity.INFO,
    message: 'Security features updated',
    data: { features: activeSecurityFeatures }
  });
}

/**
 * Enable maximum security mode
 */
export function enableMaximumSecurity(): void {
  try {
    console.log('[SECURITY] Enabling maximum security mode');
    
    // Set all security features to maximum
    setSecurityFeatures(MAXIMUM_SECURITY_FEATURES);
    
    // Start collecting security metrics
    startMetricsCollection(30000); // Collect metrics every 30 seconds
    
    // Initialize events collector
    initializeEventsCollector();
    
    // Initialize all security components (if any: any)
    const components = securityFabric.getAllComponents();
    if (components.length > 0) {
      securityFabric.initializeAll()
        .then(() => {
          logSecurityEvent({
            category: SecurityEventCategory.SYSTEM,
            severity: SecurityEventSeverity.INFO,
            message: 'All security components initialized in maximum security mode',
            data: { componentsCount: components.length }
          });
        })
        .catch((error: any) => {
          logSecurityEvent({
            category: SecurityEventCategory.SYSTEM,
            severity: SecurityEventSeverity.ERROR,
            message: 'Error initializing security components in maximum security mode',
            data: { error: (error as Error).message }
          });
        });
    }
    
    // Log the maximum security mode activation
    logSecurityEvent({
      category: SecurityEventCategory.SYSTEM,
      severity: SecurityEventSeverity.INFO,
      message: 'Maximum security mode activated',
      data: { features: activeSecurityFeatures }
    });
  } catch (error: unknown) {
    console.error('[SECURITY] Error enabling maximum security mode:', error);
    
    // Log the error
    logSecurityEvent({
      category: SecurityEventCategory.SYSTEM,
      severity: SecurityEventSeverity.ERROR,
      message: 'Error enabling maximum security mode',
      data: { error: (error as Error).message, stack: (error as Error).stack }
    });
    
    throw error;
  }
}

/**
 * Check if a specific security feature is enabled
 */
export function isSecurityFeatureEnabled(feature: keyof SecurityFeatures): boolean {
  return activeSecurityFeatures[feature];
}

/**
 * Get performance impact warning
 */
export function getPerformanceImpactWarning(): string | null {
  const highImpactFeatures = [];
  
  if (activeSecurityFeatures.quantumResistance) {
    highImpactFeatures.push('Quantum-Resistant Cryptography');
  }
  
  if (activeSecurityFeatures.mlAnomalyDetection) {
    highImpactFeatures.push('ML-based Anomaly Detection');
  }
  
  if (activeSecurityFeatures.blockchainLogging) {
    highImpactFeatures.push('Blockchain Logging');
  }
  
  if (activeSecurityFeatures.deepScanning) {
    highImpactFeatures.push('Deep Scanning');
  }
  
  if (highImpactFeatures.length > 0) {
    return `Warning: The following security features may impact performance: ${highImpactFeatures.join(', ')}`;
  }
  
  return null;
}