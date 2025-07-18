/**
 * Security System
 * 
 * This is the main entry point for the security system, providing all security components
 * and middleware for use in the application.
 */

import * as express from 'express';
import { securityFabric } from './advanced/SecurityFabric';
import { securityBlockchain } from './advanced/blockchain/ImmutableSecurityLogs';
import { SecurityEventSeverity, SecurityEventCategory } from './advanced/blockchain/ImmutableSecurityLogs';
// Import RASP components directly from the RASP manager
import { 
  raspMiddleware as raspMw, 
  createRASPMiddleware, 
  RASPProtectionLevel, 
  RASPProtectionCategory,
  RASPManager,
  raspManager
} from './advanced/rasp/RASPManager';
// Import CSRF protection components
import { csrfProtection, csrfMiddleware, csrfTokenMiddleware } from './advanced/csrf';
import { csrfValidator } from './advanced/rasp/CSRFValidator';

// Create middleware instances with different protection levels
const raspMiddleware = raspMw;
const raspMonitoringMiddleware = createRASPMiddleware({ protectionLevel: RASPProtectionLevel.MONITORING });
const raspDetectionMiddleware = createRASPMiddleware({ protectionLevel: RASPProtectionLevel.DETECTION });
const secureRequestMiddleware = [raspMiddleware];

/**
 * Security system initialization options
 */
export interface SecurityInitializationOptions {
  /**
   * Whether to enable advanced security features
   */
  advanced?: boolean;
  
  /**
   * Security mode ('standard', 'elevated', 'high', 'maximum')
   */
  mode?: 'standard' | 'elevated' | 'high' | 'maximum';
  
  /**
   * API routes to secure
   */
  apiRoutes?: string[];
  
  /**
   * Admin routes to secure
   */
  adminRoutes?: string[];
  
  /**
   * Public routes (no authentication required: any)
   */
  publicRoutes?: string[];
  
  /**
   * Whether to log all requests
   */
  logAllRequests?: boolean;
  
  /**
   * Whether to enable RASP
   */
  enableRASP?: boolean;
  
  /**
   * RASP protection level
   */
  raspProtectionLevel?: RASPProtectionLevel;
}

/**
 * Default security initialization options
 */
const DEFAULT_SECURITY_OPTIONS: SecurityInitializationOptions = {
  advanced: true,
  mode: 'standard',
  apiRoutes: ['/api'],
  adminRoutes: ['/api/admin'],
  publicRoutes: ['/', '/login', '/register', '/public'],
  logAllRequests: true,
  enableRASP: true,
  raspProtectionLevel: RASPProtectionLevel.PREVENTION
};

/**
 * Initialize the security system
 */
export async function initializeSecurity(app: express.Application, options?: SecurityInitializationOptions): Promise<void> {
  const config = { ...DEFAULT_SECURITY_OPTIONS, ...options };
  
  console.log(`[Security] Initializing security system in ${config.mode} mode with advanced features ${config.advanced ? 'enabled' : 'disabled'}`);
  
  try {
    // Initialize security blockchain
    await securityBlockchain.initialize();
    
    // Register RASP as a security component
    securityFabric.registerComponent({
      name: 'RASP',
      description: 'Runtime Application Self-Protection',
      async processEvent(event: any) {
        console.log(`[RASP] Processing security event: ${event.message}`);
      },
      async getStatus() {
        return {
          enabled: true,
          protectionLevel: config.raspProtectionLevel,
          rules: 'Multiple protection rules active'
        };
      }
    });
    
    // Log initialization
    await securityBlockchain.addSecurityEvent({
      severity: SecurityEventSeverity.INFO,
      category: SecurityEventCategory.SYSTEM,
      message: `Security system initialized in ${config.mode} mode`,
      metadata: {
        mode: config.mode,
        advanced: config.advanced,
        rasp: config.enableRASP
      }
    });
    
    // Initialize components through security fabric
    await securityFabric.initializeComponents();
    
    // Apply RASP middleware if enabled
    if (config.enableRASP) {
      console.log('[Security] Applying RASP middleware...');
      
      // Apply RASP middleware based on protection level
      switch (config.raspProtectionLevel) {
        case RASPProtectionLevel.MONITORING:
          // Only monitor, don't block
          app.use(raspMonitoringMiddleware: any);
          break;
        case RASPProtectionLevel.DETECTION:
          // Detect and log, but don't block
          app.use(raspDetectionMiddleware: any);
          break;
        case RASPProtectionLevel.PREVENTION:
        default:
          // Full protection
          app.use(raspMiddleware: any);
          break;
      }
    }
    
    // Apply CSRF protection middleware on all non-API routes
    if (config.advanced && config.mode === 'maximum') {
      console.log('[Security] Applying CSRF protection middleware...');
      
      // Set CSRF token on all routes
      app.use(csrfTokenMiddleware: any);
      
      // Apply CSRF validation on non-API routes
      app.use((req: any, res: any, next: any) => {
        // Skip CSRF protection for API routes with token authentication
        if (req.path.startsWith('/api/') && req.headers.authorization) {
          return next();
        }
        
        // Skip for non-state-changing methods
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
          return next();
        }
        
        // Skip for auth routes
        if (req.path.includes('/auth/') || req.path.includes('/login') || req.path.includes('/register')) {
          return next();
        }
        
        // Apply CSRF middleware
        csrfMiddleware(req: any, res: any, next: any);
      });
      
      // Log initialization
      securityBlockchain.addSecurityEvent({
        severity: SecurityEventSeverity.INFO,
        category: SecurityEventCategory.SYSTEM,
        message: 'CSRF protection enabled',
        metadata: {
          protection: 'maximum',
          type: 'double-submit-cookie'
        }
      }).catch(error => {
        console.error('[Security] Error logging CSRF initialization:', error);
      });
    }
    
    // Log all requests if enabled
    if (config.logAllRequests) {
      app.use((req: any, res: any, next: any) => {
        securityBlockchain.addSecurityEvent({
          severity: SecurityEventSeverity.INFO,
          category: SecurityEventCategory.API,
          message: `Request: ${req.method} ${req.originalUrl}`,
          ipAddress: req.ip,
          metadata: {
            method: req.method,
            url: req.originalUrl,
            userAgent: req.headers['user-agent']
          }
        }).catch(error => {
          console.error('[Security] Error logging request:', error);
        });
        
        next();
      });
    }
    
    console.log('[Security] Security system initialized successfully');
  } catch (error: unknown) {
    console.error('[Security] Error initializing security system:', error);
    
    // Log initialization error
    await securityBlockchain.addSecurityEvent({
      severity: SecurityEventSeverity.CRITICAL,
      category: SecurityEventCategory.SYSTEM,
      message: 'Security system initialization failed',
      metadata: { error: error instanceof Error ? error.message : String(error: any) }
    });
    
    throw error;
  }
}

/**
 * Shutdown the security system
 */
export async function shutdownSecurity(): Promise<void> {
  console.log('[Security] Shutting down security system...');
  
  try {
    // Log shutdown
    await securityBlockchain.addSecurityEvent({
      severity: SecurityEventSeverity.INFO,
      category: SecurityEventCategory.SYSTEM,
      message: 'Security system shutdown initiated'
    });
    
    // Shut down components through security fabric
    await securityFabric.shutdownComponents();
    
    // Shut down blockchain
    await securityBlockchain.shutdown();
    
    console.log('[Security] Security system shut down successfully');
  } catch (error: unknown) {
    console.error('[Security] Error shutting down security system:', error);
    throw error;
  }
}

// Export security components
export {
  securityFabric,
  securityBlockchain,
  SecurityEventSeverity,
  SecurityEventCategory,
  raspMiddleware,
  raspMonitoringMiddleware,
  raspDetectionMiddleware,
  secureRequestMiddleware,
  raspManager,
  RASPManager,
  RASPProtectionLevel,
  RASPProtectionCategory,
  // CSRF components
  csrfProtection,
  csrfMiddleware,
  csrfTokenMiddleware,
  csrfValidator
};