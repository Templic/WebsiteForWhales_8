# CSRF Protection Guide (Updated May 202

5)

 how to work with our Cross-Site Request Forgery (CSRF) protection system, both on the server and client sides. > **Important Update (May 2025)**: This document has been updated to reflect current best practices and implementation details. Previous approaches using simple token validation are now considered legacy and have been replaced with our multi-layered security architecture.

## How CSRF Protection Works Our enhanced CSRF protection system uses a sophisticated multi-layered approach: 1. **Token-Based Verification**: - A unique token is generated for each session with strong entropy - The token is included in all forms and AJAX requests - The server validates the token for all state-changing requests (non-GET) - Requests with invalid or missing tokens are rejected 2. **Origin and Referer Validation**: - The Origin and Referer headers are validated against the expected host - Requests with mismatched origins are flagged as suspicious 3. **Token Entropy Verification**: - Tokens are verified to have sufficient cryptographic entropy - This prevents token prediction attacks 4. **Rate Limiting Integration**: - CSRF failures are tracked in the rate limiting system - Unusual patterns of CSRF failures may trigger security alerts 5. **Security Headers**: - SameSite cookie attributes provide an additional layer of protection - Strict Content Security Policy headers prevent unauthorized script executio

n

## Server-Side Implementation ### Middleware Configuration The CSRF protection is configured in `server/middleware/csrfProtectionMiddleware.t

s`:

```typescript

// Server-side CSRF setup

export function setupCSRFProtection(app: Express): void {
 // Initialize integration with rate limiting
 initializeRateLimitingAndCsrf();

 // Setup CSRF middleware
 app.use(csrf({ cookie: true }));

 // Add token provider middleware
 app.use(function(req: Request, res: Response, next: NextFunction) {
 res.locals.csrfToken = req.csrfToken();
 next();
 });

 // Apply CSRF protection to non-GET requests (except for exempt routes)
 app.use(function(req: Request, res: Response, next: NextFunction) {
 // ... CSRF verification logic ...
 });
}
``` ### Exempt Routes Some routes are exempt from CSRF protectio

n:

```typescript

const csrfOptions = {
 ignorePaths: [
 '/api/webhook/',
 '/api/embed/',
 '/api/public/',
 '/api/no-csrf/',
 // ... other exempt paths ...
 /\/api\/integration\/.*/,
 ]
};
``` ### Error Handling When CSRF verification fails, an error is triggered and handle

d:

```typescript

app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
 if (err && err.code === 'EBADCSRFTOKEN') {
 console.error('[Security] CSRF token validation failed for path:', req.path);

 // Record CSRF error in rate limiting system
 recordCsrfError(req);

 // Return a JSON error for API requests
 if (req.path.startsWith('/api/')) {
 return res.status(403).json({
 error: 'CSRF token validation failed',
 code: 'CSRF_ERROR'
 });
 }

 // For non-API requests, redirect to error page
 return res.status(403).render('error', {
 message: 'Security verification failed. Please try again.'
 });
 }

 next(err);
});
```

## Client-Side Implementation ### Getting a CSRF Token To get a CSRF token for your client-side cod

e:

```typescript

// Method 1: From meta tag

function getCSRFToken(): string {
 return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

// Method 2: From API endpoint

async function fetchCSRFToken(): Promise<string> {
 const response = await fetch('/api/csrf-token');
 const data = await response.json();
 return data.csrfToken;
}
``` ### Including CSRF Token in Requests When making AJAX requests, include the CSRF toke

n:

```typescript
// Fetch API example

async function fetchWithCsrf(url: string, options: RequestInit = {}): Promise<Response> {
 const csrfToken = getCSRFToken();

 // Set up headers
 const headers = {
 ...options.headers,
 'X-CSRF-Token': csrfToken,
 'Content-Type': 'application/json'
 };

 // Make the request
 return fetch(url, {
 ...options,
 headers
 });
}

// Axios example

import axios from 'axios';

axios.defaults.headers.common['X-CSRF-Token'] = getCSRFToken();
``` ### React Forms Example In React forms, include the CSRF toke

n:

```tsx

import { useForm } from 'react-hook-form';

function ContactForm() {
 const { register, handleSubmit } = useForm();
 const csrfToken = getCSRFToken();

 const onSubmit = (data) => {
 // Form submission logic
 };

 return (
 <form onSubmit={handleSubmit(onSubmit)}>
 <input type="hidden" name="_csrf" value={csrfToken} />
 {/* Other form fields */}
 <button type="submit">Submit</button>
 </form>
 );
}
```

## Special Considerations ### Embedded Content For embedded content that requires CSRF exemptio

n:

```typescript

// In your component

import { ProxyYouTubeEmbed } from '../components/security/ProxyYouTubeEmbed';

function VideoSection() {
 return (
 <div>
 <ProxyYouTubeEmbed
 videoId="jzpvkq3Krjg"
 title="Featured Video"
 height={450}
 />
 </div>
 );
}

// The component handles CSRF exemption internally
``` ### Testing with CSRF When writing tests that interact with protected endpoint

s:

```typescript

async function testProtectedEndpoint() {
 // 1. Get a CSRF token
 const tokenResponse = await fetch('/api/csrf-token');
 const { csrfToken } = await tokenResponse.json();

 // 2. Use the token in the protected request
 const response = await fetch('/api/protected-endpoint', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'X-CSRF-Token': csrfToken
 },
 body: JSON.stringify({ data: 'test' })
 });

 // 3. Process the response
 const result = await response.json();

 // 4. Assertions...
}
```

## Troubleshooting Common CSRF-related issues and solutions: 1. **"CSRF token validation failed" errors** - Check if the token is included in the request - Verify that the token is current (not from an expired session) - Ensure no middleware is modifying the request before validation 2. **CSRF protection interfering with third-party services** - Add the route to `csrfOptions.ignorePaths` in the middleware - For complex cases, implement a custom exemption in the middleware 3. **CSRF tokens not available in your component** - Ensure the `csrfToken` middleware is properly configured - Check that you're using the correct method to retrieve the toke

n

## Security Best Practices 1. **Never disable CSRF protection globally** - Always use targeted exemption

s

2. **Keep exempt routes to a minimum** - Only exempt routes that absolutely require it

3. **Monitor CSRF failures** - Unusual patterns may indicate attack attempts

4. **Consider using SameSite cookies** - Adds an extra layer of protection

## See Also - [CSRF Protection Developer Guide](../security/csrf-protection-guide.md) - 38% matc

h

- [CSRF Protection System](../CSRF-PROTECTION-SYSTEM.md) - 31% match
- [Security Enhancements Documentation](../SECURITY-ENHANCEMENTS.md) - 31% match
- [Embedded Content Security Implementation](../EMBEDDED-CONTENT-SECURITY.md) - 24% match
- [Security Implementation Guide](../README-SECURITY.md) - 24% match