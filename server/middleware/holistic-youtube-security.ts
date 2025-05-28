/**
 * Holistic YouTube Security Middleware
 * Addresses ALL 30+ security layers to enable YouTube embedding
 */

import { Request, Response, NextFunction } from 'express';

export const holisticYouTubeSecurityMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only apply YouTube-specific security for music routes and YouTube API
  const isYouTubeRoute = req.path.includes('/music') || 
                        req.path.includes('/api/youtube') ||
                        req.path.includes('/embed');

  if (!isYouTubeRoute) {
    return next();
  }

  console.log('[Holistic YouTube Security] Configuring all security layers for:', req.path);

  // 1. CRITICAL: Content Security Policy - Most restrictive layer
  const youtubeCSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.gstatic.com https://apis.google.com https://s.ytimg.com",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
    "img-src 'self' data: blob: https://i.ytimg.com https://yt3.ggpht.com https://s.ytimg.com",
    "style-src 'self' 'unsafe-inline' https://www.youtube.com https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://www.googleapis.com https://www.youtube.com https://youtubei.googleapis.com",
    "media-src 'self' blob: data: https://www.youtube.com https://www.youtube-nocookie.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "worker-src 'self' blob:"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', youtubeCSP);

  // 2. CRITICAL: X-Frame-Options - Allow YouTube iframes
  res.removeHeader('X-Frame-Options'); // Remove restrictive setting

  // 3. HIGH: Cross-Origin Policies for YouTube
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none'); // Allow YouTube embeds
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups'); // YouTube compatibility
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Allow YouTube resources

  // 4. HIGH: Permissions Policy - Enable YouTube features
  const permissionsPolicy = [
    'autoplay=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
    'encrypted-media=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
    'picture-in-picture=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
    'fullscreen=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
    'accelerometer=(self "https://www.youtube.com")',
    'gyroscope=(self "https://www.youtube.com")',
    'microphone=()',
    'camera=()'
  ].join(', ');
  
  res.setHeader('Permissions-Policy', permissionsPolicy);

  // 5. MEDIUM: Referrer Policy for YouTube
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. CORS Configuration for YouTube API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false'); // YouTube doesn't need credentials

  // 7. Cookie Security for YouTube (SameSite=None for cross-origin)
  if (req.path.includes('/api/youtube')) {
    res.setHeader('Set-Cookie', [
      'youtube-consent=granted; SameSite=None; Secure; Path=/',
      'youtube-player=enabled; SameSite=None; Secure; Path=/'
    ]);
  }

  // 8. Security Headers that remain compatible
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // 9. Cache Control for YouTube resources
  if (req.path.includes('/api/youtube')) {
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5-minute cache
  }

  // 10. Custom headers for consciousness security integration
  res.setHeader('X-Consciousness-Level', '1'); // Basic level for YouTube access
  res.setHeader('X-Whale-Wisdom-Approved', 'true');
  res.setHeader('X-YouTube-Security-Mode', 'holistic');

  console.log('[Holistic YouTube Security] All security layers configured for YouTube compatibility');
  next();
};

// CSRF exemption for YouTube API routes
export const youTubeCSRFExemption = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path.includes('/api/youtube')) {
    // Skip CSRF validation for YouTube API calls
    (req as any).skipCSRF = true;
  }
  next();
};

// Rate limiting exemption for YouTube
export const youTubeRateLimitExemption = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path.includes('/api/youtube')) {
    // Increase rate limits for YouTube API
    (req as any).rateLimitMultiplier = 10;
  }
  next();
};