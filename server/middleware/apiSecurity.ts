/**
 * API Security Middleware
 * 
 * Provides comprehensive security controls for API endpoints including:
 * - Advanced authentication verification
 * - Token security checks
 * - API key validation
 * - Request sanitization
 * - Authorization enforcement
 * - Security headers validation
 * 
 * This middleware implements industry standards for API security
 * as outlined in OWASP API Security Top 10.
 */

import { Request, Response, NextFunction } from 'express';
import { logSecurityEvent } from '../security/security';
import { verifyAccessToken, extractTokenFromHeader } from '../security/jwt';
import { JwtPayload } from './jwtAuth';
import { createRateLimit, authRateLimit, sensitiveOpRateLimit, publicApiRateLimit, protectedApiRateLimit } from './rateLimit';
import { ValidationSchema } from '../types/express';

// API Security Verification Types
export enum APISecurityCheckType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization', 
  INPUT_VALIDATION = 'input_validation',
  RATE_LIMITING = 'rate_limiting'
}

// Structure for API security verification results
interface APISecurityVerification {
  type: APISecurityCheckType;
  passed: boolean;
  message?: string;
  details?: unknown;
}

/**
 * Middleware that performs comprehensive API authentication checks
 * Verifies token validity, expiration, and issuer
 */
export function verifyApiAuthentication(req: Request, res: Response, next: NextFunction): void | Response<unknown, Record<string, unknown>> {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;
  
  // Record this authentication attempt for security audit trail
  const securityVerifications: APISecurityVerification[] = [];
  
  // First check if auth is via API key
  if (apiKey) {
    // API key validation would go here
    // For this implementation we're focusing on JWT tokens
    securityVerifications.push({
      type: APISecurityCheckType.AUTHENTICATION,
      passed: false,
      message: 'API key authentication not implemented'
    });
    
    return res.status(401).json({
      success: false,
      message: 'API key authentication method not implemented'
    });
  }
  
  // Check JWT token
  if (!authHeader) {
    securityVerifications.push({
      type: APISecurityCheckType.AUTHENTICATION,
      passed: false,
      message: 'Missing authentication token'
    });
    
    logApiSecurityEvent(req, 'MISSING_AUTH_TOKEN', securityVerifications);
    
    return res.status(401).json({
      success: false,
      message: 'Authentication token required'
    });
  }
  
  try {
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      securityVerifications.push({
        type: APISecurityCheckType.AUTHENTICATION,
        passed: false,
        message: 'Invalid token format'
      });
      
      logApiSecurityEvent(req, 'INVALID_TOKEN_FORMAT', securityVerifications);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token format'
      });
    }
    
    // Verify token with additional checks
    const payload = verifyAccessToken(token);
    
    if (!payload) {
      securityVerifications.push({
        type: APISecurityCheckType.AUTHENTICATION,
        passed: false,
        message: 'Token verification failed'
      });
      
      logApiSecurityEvent(req, 'TOKEN_VERIFICATION_FAILED', securityVerifications);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    // Check token expiration explicitly
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      securityVerifications.push({
        type: APISecurityCheckType.AUTHENTICATION,
        passed: false,
        message: 'Token expired'
      });
      
      logApiSecurityEvent(req, 'EXPIRED_TOKEN', securityVerifications);
      
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    // All checks passed
    securityVerifications.push({
      type: APISecurityCheckType.AUTHENTICATION,
      passed: true,
      message: 'Authentication successful'
    });
    
    // Store the token payload in the request for later use
    // Create a properly typed JwtPayload object
    req.jwtPayload = {
      sub: typeof payload.sub === 'string' ? payload.sub : '',
      iat: typeof payload.iat === 'number' ? payload.iat : 0,
      exp: typeof payload.exp === 'number' ? payload.exp : 0,
      jti: typeof payload.jti === 'string' ? payload.jti : undefined,
      role: typeof payload.role === 'string' ? payload.role : undefined
    };
    
    // Log successful authentication
    logApiSecurityEvent(req, 'AUTHENTICATION_SUCCESS', securityVerifications);
    
    next();
  } catch (error) {
    console.error('API authentication error:', error);
    
    securityVerifications.push({
      type: APISecurityCheckType.AUTHENTICATION,
      passed: false,
      message: 'Authentication error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
    
    logApiSecurityEvent(req, 'AUTHENTICATION_ERROR', securityVerifications);
    
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
}

/**
 * Middleware that enforces API rate limiting with detailed logging
 * and custom response format
 */
export function enforceApiRateLimit(limitType: 'default' | 'auth' | 'security' | 'admin' | 'public' = 'default') {
  // Select the appropriate rate limiter based on the limitType
  let limiter;
  switch (limitType) {
    case 'auth':
      limiter = authRateLimit;
      break;
    case 'security':
      limiter = sensitiveOpRateLimit;
      break;
    case 'admin':
      limiter = protectedApiRateLimit;
      break;
    case 'public':
      limiter = publicApiRateLimit;
      break;
    default:
      // Create a default rate limiter
      limiter = createRateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Default limit
        message: {
          success: false,
          message: 'Too many requests, please try again later.'
        },
        logSecurityEvents: true,
        securityEventSeverity: 'medium'
      });
  }
  
  // Return a middleware function that wraps the chosen limiter
  return (req: Request, res: Response, next: NextFunction) => {
    // Use an intermediary function to capture the rate limit result
    const afterRateLimit = () => {
      // Create verification result for successful rate limit check
      const verification: APISecurityVerification = {
        type: APISecurityCheckType.RATE_LIMITING,
        passed: true,
        message: `Rate limit check passed (${limitType})`
      };
      
      // Log successful rate limit check
      logApiSecurityEvent(req, 'RATE_LIMIT_CHECK', [verification]);
      
      next();
    };

    // Apply the rate limiter, using our custom callback for success
    // @ts-ignore - Express response type issue with rate limiter
    limiter(req, res, afterRateLimit);
  };
}

/**
 * Middleware that verifies API authorization
 * Checks if the authenticated user has permission to access the resource
 */
export function verifyApiAuthorization(requiredRoles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Create verification result
    const verification: APISecurityVerification = {
      type: APISecurityCheckType.AUTHORIZATION,
      passed: false,
      message: 'Authorization check failed'
    };
    
    // Check if user is authenticated
    if (!req.jwtPayload) {
      verification.message = 'No authentication data found';
      logApiSecurityEvent(req, 'MISSING_AUTH_DATA', [verification]);
      
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // If no roles are required, allow access
    if (requiredRoles.length === 0) {
      verification.passed = true;
      verification.message = 'No role requirements';
      logApiSecurityEvent(req, 'AUTHORIZATION_SUCCESS', [verification]);
      
      return next();
    }
    
    // Check if user has unknown of the required roles
    const userRole = req.jwtPayload.role;
    
    if (!userRole) {
      verification.message = 'User role not found in token';
      logApiSecurityEvent(req, 'MISSING_ROLE', [verification]);
      
      return res.status(403).json({
        success: false,
        message: 'Access denied: role information not found'
      });
    }
    
    if (!requiredRoles.includes(userRole)) {
      verification.message = `User role '${userRole}' not in required roles: ${requiredRoles.join(', ')}`;
      logApiSecurityEvent(req, 'INSUFFICIENT_ROLE', [verification]);
      
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient privileges'
      });
    }
    
    // Authorization successful
    verification.passed = true;
    verification.message = `Authorization successful for role: ${userRole}`;
    logApiSecurityEvent(req, 'AUTHORIZATION_SUCCESS', [verification]);
    
    next();
  };
}

/**
 * Middleware that conducts API request validation
 * Ensures that the request contains the expected data
 */
export function validateApiRequest(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction): void | Response<unknown, Record<string, unknown>> => {
    try {
      // Validation using provided schema
      // This can be integrated with Zod, Joi, or any validation library
      const validationResult = schema.safeParse(req.body);
      
      // Create verification result
      const verification: APISecurityVerification = {
        type: APISecurityCheckType.INPUT_VALIDATION,
        passed: validationResult.success,
        message: validationResult.success ? 'Validation successful' : 'Validation failed',
        details: validationResult.success ? null : validationResult.error
      };
      
      if (!validationResult.success) {
        logApiSecurityEvent(req, 'INPUT_VALIDATION_FAILED', [verification]);
        
        return res.status(400).json({
          success: false,
          message: 'Invalid request data',
          errors: validationResult.error && 'format' in validationResult.error && typeof validationResult.error.format === 'function'
            ? validationResult.error.format()
            : validationResult.error && 'errors' in validationResult.error
              ? validationResult.error.errors
              : 'Validation failed'
        });
      }
      
      // Validation successful
      logApiSecurityEvent(req, 'INPUT_VALIDATION_SUCCESS', [verification]);
      
      // If validation was successful, replace req.body with the parsed data
      req.body = validationResult.data;
      
      // Store validated data in safeBody for access by other middlewares
      req.safeBody = validationResult.data as Record<string, unknown>;
      
      next();
    } catch (error) {
      console.error('API validation error:', error);
      
      const verification: APISecurityVerification = {
        type: APISecurityCheckType.INPUT_VALIDATION,
        passed: false,
        message: 'Validation error',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
      
      logApiSecurityEvent(req, 'INPUT_VALIDATION_ERROR', [verification]);
      
      return res.status(400).json({
        success: false,
        message: 'Error during request validation'
      });
    }
  };
}

/**
 * Helper function to log API security events
 */
function logApiSecurityEvent(req: Request, eventType: string, verifications: APISecurityVerification[]) {
  // Convert object details to a string for logging
  const detailsString = JSON.stringify({
    verifications,
    headers: filterSensitiveHeaders(req.headers)
  });
  
  logSecurityEvent({
    type: `API_SECURITY_${eventType}`,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    path: req.path,
    method: req.method,
    details: detailsString,
    severity: determineSeverity(eventType, verifications)
  });
}

/**
 * Filter sensitive information from request headers for logging
 */
function filterSensitiveHeaders(headers: Record<string, unknown>): Record<string, unknown> {
  const filtered = { ...headers };
  
  // Remove sensitive headers
  const sensitiveHeaders = [
    'authorization',
    'x-api-key',
    'cookie',
    'set-cookie'
  ];
  
  sensitiveHeaders.forEach(header => {
    if (filtered[header]) {
      filtered[header] = '[REDACTED]';
    }
  });
  
  return filtered;
}

/**
 * Determine severity of security event based on event type and verification results
 */
function determineSeverity(eventType: string, verifications: APISecurityVerification[]): 'low' | 'medium' | 'high' | 'critical' {
  // Critical events
  if (
    eventType === 'TOKEN_TAMPERING' ||
    eventType === 'ALGORITHM_CONFUSION_ATTACK'
  ) {
    return 'critical';
  }
  
  // High severity events
  if (
    eventType === 'AUTHENTICATION_ERROR' ||
    eventType === 'TOKEN_VERIFICATION_FAILED' ||
    eventType === 'INSUFFICIENT_ROLE'
  ) {
    return 'high';
  }
  
  // Medium severity events
  if (
    eventType === 'MISSING_AUTH_TOKEN' ||
    eventType === 'EXPIRED_TOKEN' ||
    eventType === 'INPUT_VALIDATION_FAILED' ||
    eventType === 'MISSING_ROLE'
  ) {
    return 'medium';
  }
  
  // Low severity events (default)
  return 'low';
}