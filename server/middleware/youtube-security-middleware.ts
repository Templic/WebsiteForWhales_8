/**
 * YouTube Security Middleware - Route-Specific CSP Configuration
 * Allows YouTube embeds on music pages while maintaining security
 */

import { Request, Response, NextFunction } from 'express';

export function youtubeSecurityMiddleware(req: Request, res: Response, next: NextFunction) {
  // Apply YouTube-friendly security headers for music routes
  if (req.path === '/music' || req.path.startsWith('/api/youtube/')) {
    
    // YouTube-compatible Content Security Policy
    res.setHeader('Content-Security-Policy', `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.gstatic.com;
      style-src 'self' 'unsafe-inline' https://www.youtube.com;
      img-src 'self' data: blob: https://i.ytimg.com https://yt3.ggpht.com;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' https://www.googleapis.com https://www.youtube.com;
      frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
      media-src 'self' https://www.youtube.com https://*.googlevideo.com;
      child-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
    `.replace(/\s+/g, ' ').trim());

    // Allow YouTube iframes
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // YouTube-friendly referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    console.log(`[YouTube Security] Applied YouTube-compatible headers for: ${req.path}`);
  }
  
  next();
}