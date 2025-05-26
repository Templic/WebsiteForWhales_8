# Security Configuration for Embedded Conten

t

This document provides a reference guide for security configuration related to embedded external content such as YouTube videos and Google Maps.

## Security Architecture Overview Our application employs a multi-layered security architecture with specific accommodations for embedded conten

t:

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
│ ┌────────────────────────────────────────┐ │
│ │ Security Middleware │ │
│ │ ┌─────────────────┐ ┌──────────────┐ │ │
│ │ │CSRF Protection │ │CSP Management│ │ │
│ │ └─────────────────┘ └──────────────┘ │ │
│ └────────────────────────────────────────┘ │
└─────────────┬────────────────┬───────────────┘
 │ │
 ▼ ▼
┌─────────────────────┐ ┌─────────────────────┐
│YouTube Proxy Service│ │Google Maps Proxy Svc│
└─────────────────────┘ └─────────────────────┘
```

## CSRF Protection Configuration ### Exempt Routes The following routes are exempted from CSRF protectio

n:

```typescript

const csrfExemptRoutes = [
 // Other exempt routes...
 '/api/embed/youtube/*', // YouTube embed proxy
 '/api/embed/maps/*', // Google Maps embed proxy
 '/api/iframe/*', // All iframe endpoints
];
``` ### Implementation CSRF exemption is applied at multiple levels: 1. **Global Route Configuration**: Routes defined in `csrfExemptRoute

s`

2. **Direct Request Flagging**: Setting `req.__skipCSRF = true` on the request object

3. **Path-Based Detection**: Using functions like `isEmbeddedContentRoute(path)` Example in `embedContentCsrfBypass.ts`:

```typescript

if (isEmbeddedContentRoute(req.path)) {
 console.log(`[Embedded Content] Completely bypassing CSRF protection for: ${req.path}`);
 (req as any).__skipCSRF = true;
 // Additional security relaxations...
}
```

## Content Security Policy (CSP) Configuration ### Default CSP Our default CSP is strict and doesn't allow embedded conten

t:

```

default-src 'self';

script-src 'self';

style-src 'self' 'unsafe-inline';

img-src 'self' data:;

connect-src 'self';

frame-src 'none';
``` ### Modified CSP for Embedded Content For embedded content routes, we apply a more permissive CSP: #### YouTube Prox

y:

```

default-src 'self' https://*.youtube.com https://*.youtube-nocookie.com https://*.ytimg.com;

script-src 'self' 'unsafe-inline' https://*.youtube.com https://*.youtube-nocookie.com;

style-src 'self' 'unsafe-inline' https://*.youtube.com;

frame-src https://*.youtube.com https://*.youtube-nocookie.com;

img-src 'self' https://*.ytimg.com https://*.youtube.com https://*.youtube-nocookie.com;

media-src https://*.youtube.com https://*.youtube-nocookie.com;

connect-src https://*.youtube.com https://*.youtube-nocookie.com;

frame-ancestors 'self';
``` #### Google Maps Prox

y:

```

default-src 'self' https://*.google.com https://*.googleapis.com https://*.gstatic.com;

script-src 'self' 'unsafe-inline' https://*.google.com https://*.googleapis.com https://*.gstatic.com;

style-src 'self' 'unsafe-inline' https://*.google.com https://*.googleapis.com;

frame-src https://*.google.com https://*.gstatic.com;

img-src 'self' https://*.googleapis.com https://*.gstatic.com https://*.google.com data:;

media-src https://*.google.com https://*.googleapis.com;

connect-src https://*.google.com https://*.googleapis.com https://*.gstatic.com;

frame-ancestors 'self';
``` ### Implementation CSP modifications happen at multiple levels: 1. **Proxy Route Handlers**: Set custom CSP for each embed typ

e

2. **Security Middleware**: Path-based CSP modifications

3. **Header Removal**: Removing restrictive headers before setting permissive ones Example in `embed-proxy-routes.ts`:

```typescript
// Set CSP that allows YouTube embedding with properly relaxed policies

res.setHeader('Content-Security-Policy',
 "default-src 'self' https://*.youtube.com https://*.youtube-nocookie.com https://*.ytimg.com; " +
 // Additional CSP directives...
);
```

## Security Headers Configuration For embedded content routes, several security headers are modified: | Header | Default | For Embeds | Purpos

e |

|--------|---------|------------|---------|

| `Content-Security-Policy` | Strict | Permissive | Controls allowed resources |
| `X-Frame-Options` | DENY | Removed | Allows framing content |

| `Cross-Origin-Embedder-Policy` | require-corp | unsafe-none | Allows loading cross-origin resources |
| `Cross-Origin-Opener-Policy` | same-origin | unsafe-none | Allows window interactions |

| `Cross-Origin-Resource-Policy` | same-origin | cross-origin | Allows cross-origin resource loading |

## Middleware Registration Order The order of middleware registration is critical for proper security configuratio

n:

```typescript

// Apply content API CSRF bypass middleware BEFORE other middleware

app.use(contentApiCsrfBypass);

// Apply validation API CSRF bypass middleware

app.use(validationApiCsrfBypass);

// Apply third-party integration middleware

app.use(thirdPartyIntegrationMiddleware);

// Setup CSRF protection with exemptions

setupCSRFProtection(app);

// Register embed proxy routes with explicit security bypass

app.use('/api/embed', securityBypassMiddleware);

app.use('/api/embed', embedProxyRoutes);
```

## Security Bypass Implementation The embed proxy routes have a dedicated security bypass middlewar

e:

```typescript

// These routes completely bypass CSRF and CSP restrictions

app.use('/api/embed', (req, res, next) => {
 // Mark request to bypass all security checks
 (req as any).__skipCSRF = true;
 (req as any).__skipSecurity = true;
 (req as any).isIntegration = true;

 // Remove any security headers that might block content
 res.removeHeader('Content-Security-Policy');
 res.removeHeader('Content-Security-Policy-Report-Only');
 res.removeHeader('X-Frame-Options');

 // Log the bypass
 console.log(`[Embedded Content] Completely bypassing CSRF protection for: ${req.originalUrl}`);
 console.log(`[Integration] Setting integration exemption for: ${req.originalUrl}`);

 next();
});
```

## Allowed Domains & Sources ### YouTube - `youtube.co

m`

- `youtube-nocookie.com`
- `youtu.be`
- `ytimg.com`
- All subdomains of the above ### Google Maps - `google.co

m`
- `googleapis.com`
- `gstatic.com`
- `maps.google.com`
- `maps.googleapis.com`
- All subdomains of the above

## Security Logging The security system logs all security bypass activities for audit and debuggin

g:

```

[Embedded Content] Completely bypassing CSRF protection for: /api/embed/youtube/jzpvkq3Krjg
[Integration] Setting integration exemption for: /api/embed/youtube/jzpvkq3Krjg
[CSRF Debug] Exempting special path from CSRF: /api/embed/youtube/jzpvkq3Krjg
[CSP Bypass] Applying highly permissive CSP for embedded content on path: /api/embed/youtube/jzpvkq3Krjg
[EmbedProxy] Serving YouTube video: jzpvkq3Krjg
```

## Security Considerations While this implementation enables embedded content, it introduces several security considerations: 1. **Increased Attack Surface**: The proxy services introduce potential attack vectors 2. **CSP Relaxation**: More permissive CSP could allow unintended script execution 3. **Input Validation**: Critical to prevent injection attacks through video IDs or map queries 4. **Implicit Trust**: We implicitly trust content from YouTube and Google Maps domain

s

## Configuration Options Security settings can be modified through environment variables: | Variable | Default | Descriptio

n |

|----------|---------|-------------|

| `DISABLE_SECURITY_HEADERS` | `false` | Completely disable security headers |
| `ALLOW_EMBEDDED_CONTENT` | `true` | Enable embedded content security bypasses |

| `ENABLE_CSP_REPORTING` | `false` | Enable CSP violation reporting |
| `CSP_REPORT_URI` | `/api/security/csp-report` | Endpoint for CSP violation reports |

| `CSRF_TOKEN_LIFETIME` | `3600000` | CSRF token lifetime in milliseconds |

## Implementation Files The security configuration for embedded content spans several files: | File | Purpos

e |

|------|---------|

| `server/routes/embed-proxy-routes.ts` | Proxy route handlers for YouTube and Google Maps |
| `server/middleware/embedContentCsrfBypass.ts` | CSRF bypass for embedded content routes |

| `server/middleware/cspBypassMiddleware.ts` | CSP modifications for embedded content |
| `server/routes.ts` | Route registration and middleware configuration |

| `client/src/components/security/ProxyYouTubeEmbed.tsx` | YouTube embed component |
| `client/src/components/security/ProxyGoogleMapEmbed.tsx` | Google Maps embed component |

| `client/src/components/security/ExternalEmbedContext.tsx` | Context provider for embed security |

## Conclusion This security configuration enables safe embedding of external content while maintaining robust security throughout the rest of the application. The multi-layered approach ensures that security bypasses are applied precisely only where needed, minimizing potential security risk

s.

## See Also - [Embedded Content Security Changelog](EMBEDDED-CONTENT-CHANGELOG.md) - 67% matc

h

- [Embedded Content Security Configuration Guide](SECURITY-CONFIGURATION-EMBEDDED-CONTENT-QUICK-FIX.md) - 54% match
- [Embedded Content Security Guide (Updated May 2025)](security-guides/5-embedded-content-guide.md) - 50% match
- [Embedded Content Security Implementation](EMBEDDED-CONTENT-SECURITY.md) - 43% match
- [Content Security Policy (CSP) Configuration Guide](CONTENT_SECURITY_POLICY.md) - 33% match