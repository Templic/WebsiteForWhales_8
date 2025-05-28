/**
 * Secure Embed Bypass Routes for YouTube Content
 * Implements the documented security bypass for embedded content
 */

import express from 'express';
const router = express.Router();

// Security bypass middleware for embedded content
router.use('/youtube', (req, res, next) => {
  // Mark request to bypass all security checks as documented
  (req as any).__skipCSRF = true;
  (req as any).__skipSecurity = true;
  (req as any).isIntegration = true;

  // Remove security headers that block YouTube embeds
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('Content-Security-Policy-Report-Only');
  res.removeHeader('X-Frame-Options');

  // Set headers to allow YouTube iframe embedding
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "frame-src 'self' youtube.com *.youtube.com youtube-nocookie.com *.youtube-nocookie.com youtu.be *.youtu.be; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' youtube.com *.youtube.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: youtube.com *.youtube.com ytimg.com *.ytimg.com; " +
    "connect-src 'self' youtube.com *.youtube.com;"
  );

  console.log(`[Embedded Content] Bypassing security for YouTube embed: ${req.originalUrl}`);
  next();
});

// YouTube embed proxy route
router.get('/youtube/:videoId', (req, res) => {
  const { videoId } = req.params;
  
  // Generate clean YouTube embed HTML
  const embedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>YouTube Video</title>
      <style>
        body { margin: 0; padding: 0; background: #000; }
        iframe { width: 100%; height: 100vh; border: none; }
      </style>
    </head>
    <body>
      <iframe 
        src="https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1&fs=1&autoplay=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(embedHtml);
});

export default router;