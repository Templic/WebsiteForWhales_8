# Embedded Content Security Guide (Updated May 202

5)

 how to securely embed third-party content, such as YouTube videos and Google Maps, while maintaining the overall security of the application. > **Important Update (May 2025)**: This document has been updated to reflect current best practices for content security policies and embedded content handling. Previous approaches using basic CSP are now considered legacy and have been replaced with our context-aware CSP system.

## Embedded Content Security Overview Our embedded content security system allows you to: 1. Securely embed third-party content like YouTube videos and Google Map

s

2. Bypass CSRF protection for specific embedded content routes

3. Apply custom CSP rules for embedded content

4. Proxy external content through our server for additional security

## Architecture The embedded content security system consists of these component

s:

```

┌─────────────────────────────────────────────┐
│ Client Application │
│ ┌─────────────────┐ ┌─────────────────┐ │
│ │ ProxyYouTubeEmbed│ │ProxyGoogleMapEmbed│ │
│ └────────┬────────┘ └────────┬────────┘ │
└──────────┬─────────────────────┬─────────────┘
 │ │
 ▼ ▼
┌──────────────────────────────────────────────┐
│ API Gateway │
│ ┌────────────────┐ ┌─────────────────┐ │
│ │ CSRF Exemption │ │ CSP Modification│ │
│ └────────┬───────┘ └────────┬────────┘ │
└──────────┬─────────────────────┬─────────────┘
 │ │
 ▼ ▼
┌──────────────────────────────────────────────┐
│ Content Proxies │
│ ┌────────────────┐ ┌─────────────────┐ │
│ │ YouTube Proxy │ │ Maps Proxy │ │
│ └────────┬───────┘ └────────┬────────┘ │
└──────────┬─────────────────────┬─────────────┘
 │ │
 ▼ ▼
 YouTube API Google Maps API
```

## Server-Side Implementation ### CSRF Exemption for Embedded Content Routes for embedded content bypass CSRF protectio

n:

```typescript

// In server/middleware/csrfProtectionMiddleware.ts

function setupCSRFProtection(app: Express) {
 // ... other CSRF setup ...

 // Define CSRF exempt paths
 const csrfOptions = {
 ignorePaths: [
 // ... other exempt paths ...
 '/api/embed/youtube/',
 '/api/embed/maps/',
 // ... other embed paths ...
 ]
 };

 // Apply CSRF protection to non-GET requests (except for exempt routes)
 app.use(function(req: Request, res: Response, next: NextFunction) {
 // Skip GET requests
 if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
 return next();
 }

 // Skip exempt routes
 const isExempt = csrfOptions.ignorePaths.some(pattern => {
 if (typeof pattern === 'string') {
 return req.path === pattern || req.path.startsWith(pattern);
 } else if (pattern instanceof RegExp) {
 return pattern.test(req.path);
 }
 return false;
 });

 if (isExempt) {
 console.log(`[CSRF Debug] Exempting path: ${req.path}`);
 return next();
 }

 // ... CSRF validation logic ...
 });
}
``` ### Content Security Policy Modification Custom CSP rules are applied for embedded conten

t:

```typescript
// In server/middleware/contentSecurityPolicyMiddleware.ts

function setupCSP(app: Express) {
 // Define standard CSP
 const standardCSP = {
 directives: {
 defaultSrc: ["'self'"],
 scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
 styleSrc: ["'self'", "'unsafe-inline'"],
 imgSrc: ["'self'", "data:", "blob:"],
 connectSrc: ["'self'", "wss:", "https://api.example.com"],
 fontSrc: ["'self'", "data:"],
 objectSrc: ["'none'"],
 mediaSrc: ["'self'"],
 frameSrc: ["'self'"]
 }
 };

 // Define relaxed CSP for embedded content
 const embeddedContentCSP = {
 directives: {
 defaultSrc: ["'self'", "*.youtube.com", "*.googlevideo.com", "*.googleapis.com", "*.gstatic.com"],
 scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "*.youtube.com", "*.googlevideo.com"],
 styleSrc: ["'self'", "'unsafe-inline'", "*.youtube.com", "*.googleapis.com"],
 imgSrc: ["'self'", "data:", "blob:", "*.youtube.com", "*.ytimg.com", "*.gstatic.com"],
 connectSrc: ["'self'", "wss:", "*.youtube.com", "*.googlevideo.com", "*.googleapis.com"],
 fontSrc: ["'self'", "data:", "*.gstatic.com"],
 objectSrc: ["'none'"],
 mediaSrc: ["'self'", "*.youtube.com", "*.googlevideo.com"],
 frameSrc: ["'self'", "*.youtube.com", "*.google.com", "*.gstatic.com"]
 }
 };

 // Apply standard CSP by default
 app.use((req, res, next) => {
 // Check if this is an embedded content route
 if (req.path.startsWith('/api/embed/')) {
 console.log(`[CSP Bypass] Applying highly permissive CSP for embedded content on path: ${req.path}`);

 // Apply relaxed CSP for embedded content
 helmet.contentSecurityPolicy(embeddedContentCSP)(req, res, next);
 } else {
 // Apply standard CSP
 helmet.contentSecurityPolicy(standardCSP)(req, res, next);
 }
 });
}
``` ### Content Proxy Implementation Content proxying is implemented for each provide

r:

```typescript
// In server/routes/embed/youtubeProxyRoute.ts

router.get('/youtube/:videoId', (req, res) => {
 const videoId = req.params.videoId;

 // Log the embedded content request
 console.log(`[EmbedProxy] Serving YouTube video: ${videoId}`);

 try {
 // Validate video ID format
 if (!validateYouTubeVideoId(videoId)) {
 return res.status(400).json({
 error: 'Invalid YouTube video ID format',
 code: 'INVALID_VIDEO_ID'
 });
 }

 // Construct the YouTube embed HTML
 const embedHtml = `
 <!DOCTYPE html>
 <html>
 <head>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <title>YouTube Video</title>
 <style>
 body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
 .video-container { position: relative; width: 100%; height: 100%; }
 iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
 </style>
 </head>
 <body>
 <div class="video-container">
 <iframe
 src="https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0"
 frameborder="0"
 allowfullscreen
 allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture">
 </iframe>
 </div>
 </body>
 </html>
 `;

 // Set content type and send the response
 res.setHeader('Content-Type', 'text/html');
 res.send(embedHtml);
 } catch (error) {
 console.error(`[EmbedProxy] Error serving YouTube video: ${error}`);
 res.status(500).json({
 error: 'Failed to embed YouTube video',
 code: 'EMBED_ERROR'
 });
 }
});

// Helper function to validate YouTube video ID format

function validateYouTubeVideoId(videoId: string): boolean {
 // YouTube video IDs are typically 11 characters long and contain alphanumeric chars, underscores, and hyphens
 return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}
```

## Client-Side Implementation ### YouTube Video Component A React component for embedding YouTube video

s:

```tsx

// In client/src/components/security/ProxyYouTubeEmbed.tsx

import React from 'react';

interface ProxyYouTubeEmbedProps {
 videoId: string;
 title?: string;
 width?: number | string;
 height?: number | string;
 className?: string;
 allowFullScreen?: boolean;
}

export function ProxyYouTubeEmbed({
 videoId,
 title = 'YouTube Video',
 width = '100%',
 height = 315,
 className = '',
 allowFullScreen = true
}: ProxyYouTubeEmbedProps) {
 // Construct the embed URL through our proxy
 const embedUrl = `/api/embed/youtube/${videoId}`;

 return (
 <div className={`youtube-embed-container ${className}`}>
 <iframe
 src={embedUrl}
 title={title}
 width={width}
 height={height}
 frameBorder="0"
 allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
 allowFullScreen={allowFullScreen}
 />
 </div>
 );
}
``` ### Google Maps Component A React component for embedding Google Map

s:

```tsx
// In client/src/components/security/ProxyGoogleMapEmbed.tsx

import React from 'react';

interface ProxyGoogleMapEmbedProps {
 query: string;
 title?: string;
 width?: number | string;
 height?: number | string;
 zoom?: number;
 className?: string;
}

export function ProxyGoogleMapEmbed({
 query,
 title = 'Google Map',
 width = '100%',
 height = 450,
 zoom = 14,
 className = ''
}: ProxyGoogleMapEmbedProps) {
 // Encode the query for URL
 const encodedQuery = encodeURIComponent(query);

 // Construct the embed URL through our proxy
 const embedUrl = `/api/embed/maps?q=${encodedQuery}&zoom=${zoom}`;

 return (
 <div className={`google-map-embed-container ${className}`}>
 <iframe
 src={embedUrl}
 title={title}
 width={width}
 height={height}
 frameBorder="0"
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 />
 </div>
 );
}
```

## Using Embedded Content Components ### Embedding a YouTube Vide

o

```tsx

import { ProxyYouTubeEmbed } from '../components/security/ProxyYouTubeEmbed';

function TourPage() {
 return (
 <div className="tour-page">
 <h2>Tour Video Highlights</h2>
 <ProxyYouTubeEmbed
 videoId="jzpvkq3Krjg"
 title="Dale's Big Island Concert - Celestial Harmonies"
 height={450}
 />
 </div>
 );
}
``` ### Embedding a Google Ma

p

```tsx

import { ProxyGoogleMapEmbed } from '../components/security/ProxyGoogleMapEmbed';

function ContactPage() {
 return (
 <div className="contact-page">
 <h2>Visit Our Studio</h2>
 <ProxyGoogleMapEmbed
 query="123 Music Studio Way, Honolulu, HI"
 title="Studio Location"
 height={400}
 zoom={15}
 />
 </div>
 );
}
```

## Security Considerations ### Allowed Domains Our embedded content security allows these domains: For YouTub

e:

- `youtube.com`
- `youtube-nocookie.com`
- `googlevideo.com`
- `ytimg.com` For Google Maps:
- `google.com`
- `googleapis.com`
- `gstatic.com`
- `maps.google.com`
- `maps.googleapis.com` ### Increased Attack Surface Be aware of these security considerations: 1. **Input Validation**: Always validate video IDs and map querie

s

2. **CSP Relaxation**: The relaxed CSP could allow unintended script execution

3. **Third-Party Content**: You implicitly trust content from allowed domains

4. **Resource Consumption**: Embedded content can consume significant resources

## Troubleshooting Common embedded content issues and solutions: 1. **Content fails to load** - Check browser console for CSP violations - Verify the video ID or map query is valid - Ensure the proxy route is correctly implemented 2. **CSRF errors despite exemption** - Confirm the path matches exactly what's in the exemption list - Check if any middleware is interfering with the exemption - Verify the exemption logic is being reached (check logs) 3. **Security warnings in the console** - Review the CSP directives for the embedded content - Check if any resource is being loaded from a non-whitelisted domain - Make sure all required domains are included in the CS

P

## Best Practices 1. **Validate all input parameters** - Prevent injection attack

s

2. **Limit embedded content** - Only embed necessary content

3. **Use content sanitization** - Filter any user-provided content

4. **Monitor resource usage** - Watch for performance impacts

5. **Regular security testing** - Test embedded content regularly

6. **Keep dependencies updated** - Maintain up-to-date YouTube/Maps APIs

## See Also - [Embedded Content Security Changelog](../EMBEDDED-CONTENT-CHANGELOG.md) - 50% matc

h

- [Security Configuration for Embedded Content](../SECURITY-CONFIGURATION-EMBEDDED-CONTENT.md) - 50% match
- [Embedded Content Security Configuration Guide](../SECURITY-CONFIGURATION-EMBEDDED-CONTENT-QUICK-FIX.md) - 40% match
- [Security System Overview](1-security-system-overview.md) - 38% match
- [Embedded Content Security Implementation](../EMBEDDED-CONTENT-SECURITY.md) - 31% match