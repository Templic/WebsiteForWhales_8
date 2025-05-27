# Security Troubleshooting Guide: Resolving Feature Conflict

s

This comprehensive guide provides solutions for resolving conflicts between security measures and legitimate application functionality, focusing on issues that prevent proper operation of key features.

## Table of Contents 1. [CSRF Protection Conflicts](#csrf-protection-conflict

s)

2. [Embedded Content Issues](#embedded-content-issues)

3. [Admin Dashboard Access](#admin-dashboard-access)

4. [OpenAI Integration Issues](#openai-integration-issues)

5. [Security Scanning Problems](#security-scanning-problems)

6. [User Authentication/Profile Issues](#user-authentication-profile-issues)

7. [External Integrations](#external-integrations)

8. [Security Configuration Quick Reference](#security-configuration-quick-reference)

## CSRF Protection Conflicts ### Key Symptom

s

- **Dashboard/Admin Access Denied**: Unable to access admin or security dashboard with CSRF errors
- **API Errors**: 403 Forbidden responses with message "CSRF token validation failed"
- **Interactive Features Broken**: Forms or interactive elements don't work properly
- **Embedded Content Not Loading**: YouTube, Google Maps, or other embedded content doesn't display ### Root Cause

s

1. **Over-Aggressive CSRF Protection**: The CSRF protection system is blocking legitimate requests

2. **Missing Route Exemptions**: Routes that should be exempted from CSRF protection are not properly configured

3. **Token Inconsistency**: CSRF tokens in requests don't match tokens in session/cookies

4. **Middleware Order Issues**: Security middleware is applied in incorrect order ### Solutions #### 1. Add Missing CSRF Exempt Route

s

If certain routes should be exempt from CSRF protection, add them to the exemption list:

```typescript
// In server/security/advanced/csrf/CSRFProtection.ts or server/middleware/csrfProtection.ts

const additionalExemptRoutes = [
 '/admin/security',
 '/api/security/dashboard',
 '/api/content/*',
 '/api/user/*',
 '/api/scan/*',
 '/api/openai/*'
];

// Merge with existing exemptions

const csrfExemptRoutes = [
 ...existingExemptRoutes,
 ...additionalExemptRoutes
];
``` #### 2. Fix Middleware Orde

r

Ensure CSRF bypass middleware is registered BEFORE CSRF protection middleware:

```typescript
// In server/index.ts or main server setup file
// 1. First apply bypass middleware

app.use(contentApiCsrfBypass);

app.use(securityApiCsrfBypass);

app.use(adminDashboardCsrfBypass);

app.use(embeddedContentCsrfBypass);

// 2. Then apply CSRF protection (which will respect the bypass flags)

app.use(csrfProtection({ cookie: true }));
``` #### 3. Create a Comprehensive Bypass Middlewar

e

Create a single middleware that handles all special cases:

```typescript
// Create in server/middleware/comprehensive-csrf-bypass.ts

export function createComprehensiveCsrfBypassMiddleware() {
 return (req, res, next) => {
 // Check if the route should bypass CSRF
 if (
 // Admin and Security
 req.path.startsWith('/admin/') ||
 req.path.startsWith('/api/security/') ||

 // Content and User APIs
 req.path.startsWith('/api/content/') ||
 req.path.startsWith('/api/user/') ||

 // External content
 req.path.includes('/embed/') ||
 req.path.includes('/youtube/') ||
 req.path.includes('/maps/') ||

 // OpenAI integration
 req.path.startsWith('/api/openai/') ||
 req.path.startsWith('/api/ai/') ||

 // Special paths
 req.path === '/service-worker.js'
 ) {
 // Skip CSRF protection
 (req as any).__skipCSRF = true;
 console.log(`[CSRF Bypass] Bypassing CSRF protection for: ${req.path}`);
 }

 next();
 };
}
``` #### 4. Implement a Debug Mode for CSRF Issue

s

Add a debug mode to help diagnose CSRF issues:

```typescript
// Add to server/security/advanced/csrf/CSRFProtection.ts

export function enableCsrfDebugMode() {
 return (req, res, next) => {
 // Log request details
 console.log('[CSRF Debug]', {
 path: req.path,
 method: req.method,
 csrfToken: req.headers['x-csrf-token'] || req.body?._csrf,
 cookies: req.cookies,
 skipCsrf: (req as any).__skipCSRF
 });

 next();
 };
}

// Apply in development or troubleshooting environments

if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_CSRF === 'true') {
 app.use(enableCsrfDebugMode());
}
```

## Embedded Content Issues ### Key Symptom

s

- YouTube videos, Google Maps or other embedded content not displaying
- Console errors related to Content Security Policy (CSP) or CSRF
- Iframe content showing access denied or security errors ### Solutions #### 1. Fix Content Security Policy for Embedded Conten

t

Create a dedicated middleware for embedded content routes:

```typescript
// Create embedded-content-security.ts

export function createEmbeddedContentSecurityMiddleware() {
 return (req, res, next) => {
 // Check if this is an embedded content route
 if (
 req.path.includes('/youtube') ||
 req.path.includes('/maps') ||
 req.path.includes('/embed') ||
 req.path === '/tour' ||
 req.path === '/music' ||
 req.path === '/new-music' ||
 req.path === '/archived-music'
 ) {
 // Remove restrictive headers
 res.removeHeader('Content-Security-Policy');
 res.removeHeader('X-Frame-Options');

 // Set permissive CSP for embedded content
 res.setHeader('Content-Security-Policy',
 "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
 "frame-ancestors 'self'; " +
 "frame-src * data: blob:; " +
 "connect-src * data: blob:; " +
 "img-src * data: blob:; " +
 "media-src * data: blob:;"
 );

 // Skip CSRF protection
 (req as any).__skipCSRF = true;
 (req as any)._skipCsrf = true; // For backward compatibility
 (req as any).isEmbeddedContent = true;

 console.log(`[Embedded Content] Security headers configured for: ${req.path}`);
 }

 next();
 };
}
``` #### 2. Register the Middleware Early in the Pipelin

e

Make sure the middleware is registered early:

```typescript
// In server/index.ts

app.use(createEmbeddedContentSecurityMiddleware());
// ... other middleware
``` #### 3. Update the Proxy Components to Handle CSRF Properl

y

Fix the React components that handle embedded content:

```tsx
// In ProxyYouTubeEmbed.tsx, add error handling and optional props

export const ProxyYouTubeEmbed: React.FC<ProxyYouTubeEmbedProps> = ({
 videoId,
 title = 'YouTube Video',
 width = '100%',
 height = 315,
 className = '',
 allowFullscreen = true,
 loading = 'lazy'
}) => {
 const [error, setError] = useState<string | null>(null);

 // Validate videoId to prevent security issues
 if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
 return <div className="embed-error">Invalid YouTube video ID</div>;
 }

 return (
 <>
 {error && <div className="embed-error">{error}</div>}
 <iframe
 src={`/api/embed/youtube/${videoId}`}
 title={title}
 width={width}
 height={height}
 className={`youtube-embed ${className}`}
 frameBorder="0"
 loading={loading}
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 allowFullScreen={allowFullscreen}
 onError={() => setError("Failed to load YouTube video")}
 />
 </>
 );
};
```

## Admin Dashboard Access ### Key Symptom

s

- Admin dashboard or security pages return 403 errors
- CSRF token validation errors when accessing admin features
- Authentication issues specific to admin routes ### Solutions #### 1. Create Admin-Specific Security Configuratio

n

Create specialized security configuration for admin routes:

```typescript
// Create admin-security-configuration.ts

export function createAdminSecurityMiddleware() {
 return (req, res, next) => {
 if (req.path.startsWith('/admin/') || req.path.startsWith('/api/admin/')) {
 // Set admin-specific security flags
 (req as any).__adminRoute = true;

 // Exempt from CSRF checks for dashboard views (GET requests only)
 if (req.method === 'GET') {
 (req as any).__skipCSRF = true;
 }

 // Modify CSP to allow admin dashboard features
 res.setHeader('Content-Security-Policy',
 "default-src 'self'; " +
 "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
 "style-src 'self' 'unsafe-inline'; " +
 "img-src 'self' data: blob:; " +
 "connect-src 'self' https://*.openai.com; " + // Allow OpenAI API connections
 "frame-src 'self'; " +
 "font-src 'self' data:;"
 );

 console.log(`[Admin Security] Applied admin security configuration to: ${req.path}`);
 }

 next();
 };
}
``` #### 2. Automatically Generate CSRF Tokens for Admin Page

s

Ensure admin pages always have a valid CSRF token:

```typescript
// Add to admin route handler

router.get('/admin/*', (req, res, next) => {
 // Generate a fresh CSRF token for the admin page
 if (typeof req.csrfToken === 'function') {
 res.locals.csrfToken = req.csrfToken();
 console.log(`[Admin] Generated CSRF token for admin page: ${req.path}`);
 }
 next();
});
```

## OpenAI Integration Issues ### Key Symptom

s

- OpenAI API calls failing with security or CSRF errors
- AI-powered features not functioning
- Security scanning AI analysis not working ### Solutions #### 1. Configure Security for OpenAI Integratio

n

Create middleware to handle OpenAI API access:

```typescript
// Create openai-security-middleware.ts

export function createOpenAISecurityMiddleware() {
 return (req, res, next) => {
 // Check if route is related to OpenAI
 if (
 req.path.startsWith('/api/openai/') ||
 req.path.startsWith('/api/ai/') ||
 req.path.startsWith('/api/security/scan')
 ) {
 // Skip CSRF checks for OpenAI API routes
 (req as any).__skipCSRF = true;

 // Modify CSP to allow OpenAI API connections
 const currentCSP = res.getHeader('Content-Security-Policy') || '';
 const newCSP = currentCSP.toString().replace(
 /connect-src ([^;]+);/,
 `connect-src $1 https://*.openai.com;`
 );

 res.setHeader('Content-Security-Policy', newCSP);

 console.log(`[OpenAI Security] Applied OpenAI security configuration to: ${req.path}`);
 }

 next();
 };
}
``` #### 2. Improve Error Handling for OpenAI API Call

s

Add better error handling for OpenAI API calls:

```typescript
// In ValidationAIConnector.ts or similar class

public async validate(content: any, options: ValidationAIOptions): Promise<ValidationAIResult> {
 try {
 // Check if OpenAI API key is available
 if (!process.env.OPENAI_API_KEY) {
 console.warn('[AI Security] Missing OpenAI API key');
 return this.createFallbackResult('No API key available', options);
 }

 // Attempt to call OpenAI API
 const response = await this.callOpenAI(content, options);
 return this.processResponse(response, options);
 } catch (error) {
 console.error('[AI Security] OpenAI API error:', error);

 // Check if CSRF or security error
 if (error.message?.includes('CSRF') || error.message?.includes('forbidden')) {
 console.error('[AI Security] Possible security middleware conflict with OpenAI API');
 }

 // Return fallback result
 return this.createFallbackResult(error.message, options);
 }
}

private createFallbackResult(errorMessage: string, options: ValidationAIOptions): ValidationAIResult {
 // Create a fallback result when AI validation fails
 return {
 passed: true, // Fail open for availability
 securityScore: 0.5,
 error: errorMessage,
 warnings: [`AI validation unavailable: ${errorMessage}`],
 recommendations: ['Manually review this content for security issues']
 };
}
```

## Security Scanning Problems ### Key Symptom

s

- Security scanning not running or not completing
- No security scan results displayed in dashboard
- Errors in scan results storage or retrieval ### Solutions #### 1. Fix Security Scan Queue Syste

m

Address issues in the security scan queue:

```typescript
// In server/security/securityScanQueue.ts
// Add error handling and retry logic

export class SecurityScanQueue {
 // ... existing implementation ...

 // Add improved error handling
 public async processNextScan(): Promise<void> {
 try {
 const nextScan = await this.getNextPendingScan();
 if (!nextScan) return;

 console.log(`[Security] Processing scan ${nextScan.id} of type ${nextScan.type}`);

 // Process scan with timeout protection
 const timeoutPromise = new Promise<void>((_, reject) => {
 setTimeout(() => reject(new Error('Scan timeout')), 60000);
 });

 const scanPromise = this.processScan(nextScan);
 await Promise.race([scanPromise, timeoutPromise]);
 } catch (error) {
 console.error('[Security] Error processing scan:', error);

 // Check for common issues
 if (error.message?.includes('CSRF')) {
 console.error('[Security] CSRF conflict detected in security scan. ' +
 'Check that security scan routes are exempted from CSRF protection.');
 }

 // Continue processing next scan regardless of errors
 setTimeout(() => this.processNextScan(), 5000);
 }
 }

 // Improve scan execution with bypassing security where needed
 private async processScan(scan: SecurityScan): Promise<void> {
 try {
 // Get appropriate scanner based on scan type
 const scanner = this.getScannerForType(scan.type);
 if (!scanner) {
 throw new Error(`No scanner found for type: ${scan.type}`);
 }

 // Set scan as running
 await this.updateScanStatus(scan.id, 'RUNNING');

 // Execute scan with security bypasses
 const scanContext = {
 __skipCSRF: true,
 __skipSecurity: true,
 scanId: scan.id,
 startTime: new Date()
 };

 const result = await scanner.performScan(scanContext);

 // Store result
 await this.storeScanResult(scan.id, result);

 // Update scan status
 await this.updateScanStatus(scan.id, 'COMPLETED');
 } catch (error) {
 console.error(`[Security] Scan ${scan.id} failed:`, error);
 await this.updateScanStatus(scan.id, 'FAILED', error.message);
 }
 }
}
``` #### 2. Fix AI Analysis in Security Scannin

g

Update the AI analysis component to handle security conflicts:

```typescript
// In server/security/scanners/CoreSecurityScanner.ts

public async performAiSecurityAnalysis(scanResults: ScanResult[]): Promise<AIRecommendation> {
 try {
 // Check for OpenAI API key
 if (!process.env.OPENAI_API_KEY) {
 console.warn('[Security] Missing OpenAI API key for security analysis');
 return this.createFallbackAIRecommendation();
 }

 // Create detailed prompt for AI analysis
 const prompt = this.createAIPrompt(scanResults);

 // Create security bypass for OpenAI request
 const originalFetch = global.fetch;
 const secureOpenAIFetch: typeof fetch = async (url, options) => {
 // Add security bypass headers for internal use
 if (url.toString().includes('openai.com')) {
 options = options || {};
 options.headers = {
 ...options.headers,
 'X-Security-Bypass': 'true',
 'X-Internal-Request': 'true'
 };
 }
 return originalFetch(url, options);
 };

 // Temporarily replace fetch for this request
 global.fetch = secureOpenAIFetch;

 try {
 // Make OpenAI API request
 const response = await openai.chat.completions.create({
 model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
 messages: [
 {
 role: "system",
 content: "You are a cybersecurity expert analyzing security scan results."
 },
 {
 role: "user",
 content: prompt
 }
 ],
 response_format: { type: "json_object" }
 });

 // Parse and return the result
 const content = response.choices[0].message.content;
 return JSON.parse(content);
 } finally {
 // Restore original fetch
 global.fetch = originalFetch;
 }
 } catch (error) {
 console.error('[Security] AI analysis error:', error);
 return this.createFallbackAIRecommendation();
 }
}

private createFallbackAIRecommendation(): AIRecommendation {
 return {
 summary: "AI analysis unavailable - review scan results manually",
 criticalFindings: [],
 highPriorityFindings: [],
 recommendations: [
 "Check system logs for security errors",
 "Verify that security features aren't conflicting with app functionality",
 "Ensure OpenAI API key is properly configured"
 ],
 securityScore: 0.5,
 priorities: []
 };
}
```

## User Authentication/Profile Issues ### Key Symptom

s

- Login or registration failures
- Profile updates not working
- Session management issues ### Solutions #### 1. Fix Authentication Security Conflict

s

Update the authentication middleware to bypass unnecessary restrictions:

```typescript
// Create auth-security-fixes.ts

export function createAuthSecurityFixesMiddleware() {
 return (req, res, next) => {
 // Check if this is an authentication route
 if (
 req.path.startsWith('/api/auth/') ||
 req.path.startsWith('/api/user/') ||
 req.path === '/api/login' ||
 req.path === '/api/register' ||
 req.path === '/api/logout' ||
 req.path === '/api/profile'
 ) {
 // Skip CSRF for GET requests and login/logout operations
 if (req.method === 'GET' ||
 req.path === '/api/login' ||
 req.path === '/api/logout') {
 (req as any).__skipCSRF = true;
 }

 // Log the bypass
 console.log(`[AUTH] Security configuration applied to: ${req.path}`);
 }

 next();
 };
}
``` #### 2. Improve Session Managemen

t

Fix session handling for better reliability:

```typescript
// Update session configuration in server/index.ts

app.use(session({
 secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
 resave: false,
 saveUninitialized: false,
 cookie: {
 secure: process.env.NODE_ENV === 'production',
 httpOnly: true,
 maxAge: 24 * 60 * 60 * 1000 // 24 hours
 },
 store: new PgStore({
 pool: pgPool,
 createTableIfMissing: true,
 pruneSessionInterval: 60 * 15 // 15 minutes
 })
}));

// Clear expired sessions regularly

setInterval(() => {
 pgStore.pruneSessions((err) => {
 if (err) console.error('[Session] Error pruning sessions:', err);
 });
}, 60 * 60 * 1000); // Every hour
```

## External Integrations ### Key Symptom

s

- External content (YouTube, Google Maps) not loading
- Social media embeds failing
- Third-party API integrations not working ### Solutions #### 1. Create a Unified External Content Configuratio

n

Implement a comprehensive solution for external content:

```typescript
// Create external-content-manager.ts

export class ExternalContentManager {
 // External content types supported
 private contentTypes = {
 youtube: {
 domains: ['youtube.com', 'youtube-nocookie.com', 'ytimg.com', 'googlevideo.com'],
 csrfExempt: true,
 csrfHeader: false
 },
 googleMaps: {
 domains: ['google.com', 'googleapis.com', 'gstatic.com', 'maps.google.com'],
 csrfExempt: true,
 csrfHeader: false
 },
 // Add other external content types as needed
 };

 // Apply security configuration for external content
 public applySecurityConfig(req, res, next) {
 // Determine content type from path
 const contentType = this.identifyContentType(req.path);

 if (contentType) {
 // Apply appropriate security settings
 this.configureSecurityForContent(contentType, req, res);
 console.log(`[External Content] Applied security for ${contentType} on ${req.path}`);
 }

 next();
 }

 // Identify content type from path
 private identifyContentType(path: string): string | null {
 if (path.includes('/youtube') || path.includes('/embed/youtube')) {
 return 'youtube';
 }
 if (path.includes('/maps') || path.includes('/embed/maps')) {
 return 'googleMaps';
 }
 // Add other content type identification
 return null;
 }

 // Configure security for identified content type
 private configureSecurityForContent(contentType: string, req, res) {
 const config = this.contentTypes[contentType];
 if (!config) return;

 // Apply CSRF exemption if needed
 if (config.csrfExempt) {
 (req as any).__skipCSRF = true;
 }

 // Build CSP with allowed domains
 let csp = "default-src 'self'; ";

 // Add connect-src directives
 csp += `connect-src 'self' ${config.domains.map(d => `https://*.${d}`).join(' ')}; `;

 // Add frame-src directives
 csp += `frame-src 'self' ${config.domains.map(d => `https://*.${d}`).join(' ')}; `;

 // Add img-src directives
 csp += `img-src 'self' data: ${config.domains.map(d => `https://*.${d}`).join(' ')}; `;

 // Add media-src directives
 csp += `media-src 'self' ${config.domains.map(d => `https://*.${d}`).join(' ')}; `;

 // Add script-src directives (if needed)
 csp += `script-src 'self' 'unsafe-inline' ${config.domains.map(d => `https://*.${d}`).join(' ')}; `;

 // Set the CSP header
 res.setHeader('Content-Security-Policy', csp);

 // Remove restrictive headers
 res.removeHeader('X-Frame-Options');
 }
}

// Create middleware factory

export function createExternalContentMiddleware() {
 const manager = new ExternalContentManager();
 return (req, res, next) => manager.applySecurityConfig(req, res, next);
}
```

## Security Configuration Quick Reference ### Environment Variables for Quick Fixes Add these environment variables for easy configuratio

n:

```

# Security Configuration Quick Fixe

s

DISABLE_CSRF=false # Set to true to completely disable CSRF protectio

n

SECURITY_LEVEL=STANDARD # Options: MINIMUM, STANDARD, MAXIMU

M

ENABLE_SECURITY_DEBUG=false # Set to true for detailed security log

s

DISABLE_RATE_LIMITING=false # Set to true to disable rate limitin

g

ALLOW_EMBEDDED_CONTENT=true # Set to false to disable embedded content suppor

t

CSRF_EXEMPT_PATHS=/api/content,/api/embed,/api/user,/api/openai
``` ### Quick Fix Command-Line Tool Create a security quick fix script (`fix-security.j

s`):

```javascript
/**
 * Security Quick Fix Utility
 *
 * This script patches security configuration to fix common issues
 * without requiring code changes.
 *
 * Usage: node fix-security.js [options]
 * Options:
 * --disable-csrf Disable CSRF protection
 * --fix-embedded-content Fix embedded content issues
 * --fix-admin-dashboard Fix admin dashboard access
 * --fix-openai Fix OpenAI integration
 * --fix-all Apply all fixes
 */

const fs = require('fs');

const path = require('path');

// Main function

async function main() {
 const args = process.argv.slice(2);

 // Parse arguments
 const options = {
 disableCsrf: args.includes('--disable-csrf'),
 fixEmbeddedContent: args.includes('--fix-embedded-content'),
 fixAdminDashboard: args.includes('--fix-admin-dashboard'),
 fixOpenai: args.includes('--fix-openai'),
 fixAll: args.includes('--fix-all')
 };

 // If --fix-all is specified, enable all fixes
 if (options.fixAll) {
 Object.keys(options).forEach(key => {
 if (key !== 'fixAll') options[key] = true;
 });
 }

 console.log('Applying security fixes with options:', options);

 // Apply fixes
 if (options.disableCsrf) {
 await disableCsrf();
 }

 if (options.fixEmbeddedContent) {
 await fixEmbeddedContent();
 }

 if (options.fixAdminDashboard) {
 await fixAdminDashboard();
 }

 if (options.fixOpenai) {
 await fixOpenAiIntegration();
 }

 console.log('Security fixes applied successfully.');
}

// Disable CSRF protection

async function disableCsrf() {
 console.log('Disabling CSRF protection...');

 // Create a .env.disable-csrf file
 const envContent = `
# CSRF Protection Disabled for Troubleshootin

g

# This file temporarily disables CSRF protectio

n

DISABLE_CSRF=true

SECURITY_LEVEL=MINIMUM

ENABLE_SECURITY_DEBUG=true
 `.trim();

 fs.writeFileSync('.env.disable-csrf', envContent);

 console.log('Created .env.disable-csrf file. To apply, run:');
 console.log('node -r dotenv/config server/index.js dotenv_config_path=.env.disable-csrf');
}

// Fix embedded content issues

async function fixEmbeddedContent() {
 // Implementation details
}

// Fix admin dashboard access

async function fixAdminDashboard() {
 // Implementation details
}

// Fix OpenAI integration

async function fixOpenAiIntegration() {
 // Implementation details
}

// Run the main function

main().catch(error => {
 console.error('Error applying security fixes:', error);
 process.exit(1);
});
``` ### Recommended Security Middleware Order Use this middleware order to ensure proper operation: 1. Parsing middleware (body-parser, et

c.)

2. Session middleware

3. Security bypass middleware (for special cases)

4. CSRF protection middleware

5. Main security middleware

6. Route handlers Example:

```typescript
// 1. Parsing middleware

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// 2. Session middleware

app.use(session({ /* configuration */ }));

// 3. Security bypass middleware (processes special cases)

app.use(createComprehensiveCsrfBypassMiddleware());

app.use(createEmbeddedContentSecurityMiddleware());

app.use(createOpenAISecurityMiddleware());

app.use(createAdminSecurityMiddleware());

app.use(createAuthSecurityFixesMiddleware());

app.use(createExternalContentMiddleware());

// 4. CSRF protection (applied after bypasses are set)

app.use(csrfProtection({ cookie: true }));

// 5. Main security middleware

app.use(securityHeadersMiddleware);

app.use(rateLimitingMiddleware);

app.use(threatDetectionMiddleware);

// 6. Route handlers

app.use('/api', apiRoutes);

app.use('/admin', adminRoutes);
// ...other routes
```

## Additional Resources - [CSRF Protection Guide](./security-guides/2-csrf-protection-guide.m

d)

- [Embedded Content Security Guide](./EMBEDDED-CONTENT-SECURITY.md)
- [AI Security Guide](./security-guides/4-ai-security-guide.md)
- [Security Architecture Overview](./SECURITY-ARCHITECTURE.md)

## See Also - [Embedded Content Security Configuration Guide](SECURITY-CONFIGURATION-EMBEDDED-CONTENT-QUICK-FIX.md) - 33% matc

h

- [Security Documentation Index](SECURITY-GUIDES-INDEX.md) - 33% match
- [Embedded Content Security Changelog](EMBEDDED-CONTENT-CHANGELOG.md) - 25% match
- [Embedded Content Security Implementation](EMBEDDED-CONTENT-SECURITY.md) - 25% match
- [Security Configuration for Embedded Content](SECURITY-CONFIGURATION-EMBEDDED-CONTENT.md) - 25% match