# Embedded Content Security Configuration Guid

e

This guide provides instructions for properly configuring security settings to allow embedded content while maintaining strong security protections.

## Overview Modern web applications often need to embed third-party content such a

s:

- YouTube videos
- Google Maps
- Social media feeds and widgets
- Payment processing forms (Stripe)
- Collaboration tools (Taskade) However, strict security measures like Content Security Policy (CSP) and CSRF protection can block these legitimate embedded resources. how to configure security settings to allow embedded content without compromising your application's security posture.

## Quick Fix Checklist If embedded content is not loading properly, check that: 1. ✅ The adminCsrfBypass middleware is correctly registered (for admin dashboard conten

t)

2. ✅ CSRF exemptions are properly set for embedded content paths

3. ✅ Content Security Policy allows necessary domains

4. ✅ Frame-ancestors and frame-src directives are properly configured

5. ✅ X-Frame-Options is not conflicting with frame embedding

## CSRF Bypass for Embedded Content The application includes middleware to exempt embedded content from CSRF protectio

n:

```typescript

// In server/middleware/embedContentCsrfBypass.ts

export function setupEmbedContentCsrfBypassMiddleware(app) {
 app.use((req, res, next) => {
 // Check if this is an embedded content request
 if (
 req.path.includes('/embed/') ||
 req.path.includes('/iframe/') ||
 req.path.startsWith('/api/embed/')
 ) {
 // Set flag to bypass CSRF protection
 (req as any).__skipCSRF = true;

 console.log(`[EMBED CSRF] Bypassing CSRF protection for embed route: ${req.path}`);
 }
 next();
 });
}
``` Make sure this middleware is registered **early** in your Express middleware chain.

## Content Security Policy Configuration The CSP headers must be configured to allow embedded conten

t:

```typescript

// Example CSP configuration for embedded content

app.use(
 helmet({
 contentSecurityPolicy: {
 directives: {
 defaultSrc: ["'self'"],
 scriptSrc: [
 "'self'",
 "'unsafe-inline'",
 "'unsafe-eval'",
 "https://*.googleapis.com",
 "https://*.youtube.com",
 "https://js.stripe.com",
 "https://*.taskade.com"
 ],
 styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
 imgSrc: ["'self'", "data:", "https://*.ytimg.com", "https://*.stripe.com"],
 connectSrc: [
 "'self'",
 "https://*.youtube.com",
 "https://api.stripe.com",
 "https://*.taskade.com",
 "https://*.openai.com" // For AI features
 ],
 frameSrc: [
 "'self'",
 "https://*.youtube.com",
 "https://*.stripe.com",
 "https://*.taskade.com",
 "https://maps.google.com"
 ],
 frameAncestors: ["'self'", "*"],
 workerSrc: ["'self'", "blob:"]
 }
 },
 // Disable X-Frame-Options to allow embedding
 xFrameOptions: false
 })
);
```

## Admin Dashboard Special Configuration The admin dashboard requires special security configuration

s:

```typescript

// In adminCsrfBypass.ts middleware

if (req.path === '/admin/security' || req.path.startsWith('/api/security/')) {
 // Remove any existing Content-Security-Policy header
 res.removeHeader('Content-Security-Policy');

 // Set a more permissive CSP for the admin dashboard
 res.setHeader('Content-Security-Policy',
 "default-src 'self'; " +
 "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
 "style-src 'self' 'unsafe-inline'; " +
 "img-src 'self' data: blob:; " +
 "connect-src 'self' https://*.openai.com; " + // Allow OpenAI API connections
 "frame-src 'self'; " +
 "font-src 'self' data:;"
 );
}
```

## YouTube Embedding For YouTube embeds specifically: 1. Use the privacy-enhanced mode with youtube-nocookie.co

m

2. Add the domains to your CSP configuration

3. Ensure the iframe-csrf-routes middleware handles YouTube URLs Example YouTube embed:

```html
<iframe
 src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
 width="560"
 height="315"
 frameborder="0"
 allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
 allowfullscreen>
</iframe>
```

## Troubleshooting If embedded content still doesn't load: 1. **Check Browser Console**: Look for CSP or CSRF related error

s

2. **Verify Middleware Order**: CSRF bypass middleware must be registered before CSRF protection

3. **Inspect Network Requests**: Look for 403 Forbidden responses

4. **Test with CSRF Debug Mode**: Enable debug mode for detailed CSRF logs

5. **Try in a New Browser**: Clear cookies and cache, or use incognito mode

## Security Considerations While enabling embedded content, keep these security considerations in mind: 1. Only allow trusted domains in your CSP configuratio

n

2. Regularly audit your CSP directives for unnecessary permissions

3. Consider using Subresource Integrity (SRI) for external scripts

4. Monitor for potential clickjacking attempts

5. Consider implementing additional security headers like Feature-Policy

## Related Resources - [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CS

P)

- [CSRF Protection Documentation](./SECURITY-TROUBLESHOOTING.md)
- [YouTube Embedded Players](https://developers.google.com/youtube/player_parameters)
- [Stripe Elements Security](https://stripe.com/docs/security/guide)
- [Taskade Embedding Guide](https://www.taskade.com/help/article/embedding-taskade)

## See Also - [Security Configuration for Embedded Content](SECURITY-CONFIGURATION-EMBEDDED-CONTENT.md) - 54% matc

h

- [Embedded Content Security Changelog](EMBEDDED-CONTENT-CHANGELOG.md) - 43% match
- [Embedded Content Security Guide (Updated May 2025)](security-guides/5-embedded-content-guide.md) - 40% match
- [Embedded Content Security Implementation](EMBEDDED-CONTENT-SECURITY.md) - 33% match
- [Security Documentation Index](SECURITY-GUIDES-INDEX.md) - 33% match