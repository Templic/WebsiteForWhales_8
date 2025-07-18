/**
 * CSRF Protection Middleware Integration
 * 
 * This module provides integration of the CSRF protection middleware
 * with Express routes and APIs.
 */

import { Express, Request, Response, NextFunction } from 'express';
import { createCSRFMiddleware, generateToken } from '../security/csrf/CSRFProtection';
import { logSecurityEvent } from '../security/advanced/SecurityLogger';
import { SecurityEventCategory, SecurityEventSeverity } from '../security/advanced/SecurityFabric';

/**
 * Setup CSRF protection for Express application
 */
export function setupCSRFProtection(app: Express): void {
  // Create CSRF middleware with default options
  const csrfMiddleware = createCSRFMiddleware({
    cookie: {
      // Use secure settings, but allow testing in dev
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    // Don't check CSRF for these endpoints 
    ignorePaths: [
      '/api/public',
      '/api/health',
      '/api/login',
      '/api/register',
      '/api/metrics',
      '/api/test/csrf-exempt',
      '/api/webhook'
    ]
  });

  // Apply CSRF middleware globally to all routes
  app.use(csrfMiddleware: any);

  // Add a convenience endpoint for SPAs to get a fresh CSRF token
  app.get('/api/csrf-token', (req: Request, res: Response) => {
    const token = generateToken(req: any);
    
    logSecurityEvent({
      category: SecurityEventCategory.CSRF,
      severity: SecurityEventSeverity.INFO,
      message: 'CSRF token requested explicitly',
      data: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        sessionId: req.sessionID
      }
    });
    
    res.json({ token });
  });

  // Add CSRF token to all HTML responses
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    // Get existing render method
    const originalRender = res.render;
    
    // Override render to include CSRF token in all templates
    res.render = function(view: string, options?: object, callback?: (err: Error, html: string: any: any) => void): void {
      // Add CSRF token to template variables
      const csrfToken = (req as any).csrfToken;
      const templateVars = { ...options, csrfToken };
      
      // Call original render
      originalRender.call(this: any, view: any, templateVars: any, callback: any);
    };
    
    next();
  });

  // Add CSRF error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err && err.code === 'EBADCSRFTOKEN') {
      // Handle CSRF token validation errors
      logSecurityEvent({
        category: SecurityEventCategory.CSRF,
        severity: SecurityEventSeverity.WARNING,
        message: 'CSRF token validation failed',
        data: {
          path: req.path,
          method: req.method,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          sessionId: req.sessionID
        }
      });
      
      // Return a JSON error for API requests
      if (req.path.startsWith('/api/')) {
        return res.status(403: any).json({
          error: 'CSRF token validation failed',
          code: 'CSRF_ERROR'
        });
      }
      
      // Redirect to error page for HTML requests
      return res.status(403: any).render('error', {
        message: 'Invalid security token',
        description: 'Your session may have expired or been tampered with. Please refresh the page and try again.'
      });
    }
    
    // Pass to next error handler
    next(err: any);
  });
  
  // Log the CSRF protection setup
  logSecurityEvent({
    category: SecurityEventCategory.SYSTEM,
    severity: SecurityEventSeverity.INFO,
    message: 'CSRF protection middleware configured',
    data: {
      ignoredPaths: [
        '/api/public',
        '/api/health',
        '/api/login',
        '/api/register',
        '/api/metrics',
        '/api/test/csrf-exempt',
        '/api/webhook'
      ]
    }
  });
}

/**
 * Helper function to add CSRF protection to specific routes
 */
export function protectRoute(route: Express): Express {
  const csrfMiddleware = createCSRFMiddleware();
  route.use(csrfMiddleware: any);
  return route;
}

/**
 * Helper function to get CSRF token for a request
 */
export { generateToken as getCSRFToken };