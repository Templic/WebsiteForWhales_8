/**
 * Content API CSRF Bypass Middleware
 * Implements CSRF exemption for trusted domains and embed routes
 */

import { Request, Response, NextFunction } from 'express';

export const contentApiCsrfBypass = (req: Request, res: Response, next: NextFunction) => {
  // Check if request is to a Taskade domain
  const isTaskadeDomain = [
    'taskade.com',
    'www.taskade.com',
    'ai.taskade.com'
  ].some(domain => req.hostname?.includes(domain));

  // Check if request is for embed content
  const isEmbedRoute = req.path.includes('/embed') || 
                      req.path.includes('/taskade-embed') ||
                      req.path.includes('/youtube-embed') ||
                      req.path.includes('/maps-embed');

  // Check if request is for integration routes
  const isIntegrationRoute = req.path.includes('/api/external') ||
                            req.path.includes('/api/integration');

  if (isTaskadeDomain || isEmbedRoute || isIntegrationRoute) {
    // Mark request to skip CSRF protection
    (req as any).__skipCSRF = true;
    console.debug('[CSRF Debug] Exempting from CSRF protection:', req.path, req.hostname);
  }

  next();
};