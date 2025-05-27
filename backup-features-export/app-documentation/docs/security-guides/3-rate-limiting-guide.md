# Rate Limiting Guid

e

 how to work with our comprehensive rate limiting system, which protects the application from various abuse scenarios.

## How Rate Limiting Works Our rate limiting system implements a token bucket algorithm: 1. Each client (identified by IP and optional session ID) has a "bucket" of token

s

2. Tokens regenerate over time up to a maximum capacity

3. Each request consumes one or more tokens

4. When a bucket is empty, requests are rejected until tokens regenerate

5. Different endpoints can have different token requirements

## Rate Limiting Components ### Token Bucket Implementation The core of our rate limiting is implemented in `TokenBucketRateLimite

r`:

```typescript

class TokenBucketRateLimiter {
 private buckets: Map<string, TokenBucket>;
 private options: TokenBucketRateLimiterOptions;

 constructor(options: TokenBucketRateLimiterOptions) {
 this.options = {
 defaultTokens: 60, // Default tokens per bucket
 refillRate: 1, // Tokens refilled per second
 maxTokens: 60, // Maximum tokens in a bucket
 ...options
 };
 this.buckets = new Map();
 }

 // Get or create a bucket for a client
 private getBucket(key: string): TokenBucket {
 // ... implementation ...
 }

 // Check if a request can proceed
 public allowRequest(key: string, cost: number = 1): boolean {
 // ... implementation ...
 }

 // Consume tokens for a successful request
 public consumeTokens(key: string, cost: number = 1): boolean {
 // ... implementation ...
 }
}
``` ### Integration with Security Events The rate limiting system integrates with security event

s:

```typescript
// When a security event occurs

function handleSecurityEvent(type: string, ip: string, sessionId?: string): void {
 const key = sessionId ? `${ip}:${sessionId}` : ip;

 switch (type) {
 case 'login-failure':
 // Penalize failed logins more heavily
 rateLimiter.consumeTokens(key, 5);
 break;
 case 'csrf-failure':
 // CSRF failures are suspicious
 rateLimiter.consumeTokens(key, 3);
 break;
 case 'successful-auth':
 // Reward successful authentication
 const bucket = rateLimiter.getBucket(key);
 bucket.refill(2); // Add bonus tokens
 break;
 // ... other event types ...
 }
}
```

## Using Rate Limiting in Your Code ### Checking if a Request is Allowed To check if a request should be allowe

d:

```typescript

import { rateLimitingSystem } from '../security/advanced/threat/RateLimitingSystem';

function handleExpensiveRequest(req: Request, res: Response, next: NextFunction) {
 const ip = req.ip;
 const sessionId = req.session?.id;

 // Check if the request is allowed (cost of 5 tokens)
 if (!rateLimitingSystem.checkRateLimit(ip, sessionId, 5)) {
 return res.status(429).json({
 error: 'Too many requests. Please try again later.',
 code: 'RATE_LIMIT_EXCEEDED'
 });
 }

 // Process the request
 next();
}
``` ### Custom Rate Limits for Specific Routes For routes requiring custom rate limit

s:

```typescript

import { createRateLimitMiddleware } from '../middleware/rateLimitMiddleware';

// Create middleware with custom options

const apiRateLimit = createRateLimitMiddleware({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 100, // limit each IP to 100 requests per windowMs
 standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
 message: {
 error: 'Too many requests from this IP, please try again after 15 minutes',
 code: 'API_RATE_LIMIT_EXCEEDED'
 }
});

// Apply to routes

router.use('/api/high-demand', apiRateLimit);
``` ### Recording Custom Events To record custom events that affect rate limitin

g:

```typescript

function processUserAction(req: Request, action: string) {
 const ip = req.ip;
 const sessionId = req.session?.id;

 // Record the event with context
 rateLimitingSystem.recordEvent(action, {
 ip,
 sessionId,
 timestamp: Date.now(),
 path: req.path,
 userAgent: req.headers['user-agent']
 });

 // Process action...
}
```

## Rate Limiting Configuration Rate limiting can be configured through environment variables and the security configuratio

n:

```typescript

// In .env or similar configuration

RATE_LIMIT_DEFAULT_TOKENS=100

RATE_LIMIT_REFILL_RATE=2

RATE_LIMIT_MAX_TOKENS=100

RATE_LIMIT_STORAGE_TYPE=memory // or 'redis', 'database'

// In rate limiting initialization

const rateLimitOptions = {
 defaultTokens: parseInt(process.env.RATE_LIMIT_DEFAULT_TOKENS || '60'),
 refillRate: parseFloat(process.env.RATE_LIMIT_REFILL_RATE || '1'),
 maxTokens: parseInt(process.env.RATE_LIMIT_MAX_TOKENS || '60'),
 storageType: process.env.RATE_LIMIT_STORAGE_TYPE || 'memory'
};

const rateLimiter = new TokenBucketRateLimiter(rateLimitOptions);
```

## Special Rate Limiting Scenarios ### API Endpoints API endpoints often need stricter rate limitin

g:

```typescript

// API rate limiting middleware

function apiRateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
 const ip = req.ip;
 const apiKey = req.headers['x-api-key'] as string;

 // Use API key as part of the rate limit key if available
 const keyBase = apiKey ? `api:${apiKey}` : `ip:${ip}`;

 // Check rate limit with a cost based on endpoint
 const pathCost = getPathCost(req.path);

 if (!rateLimitingSystem.checkRateLimit(keyBase, undefined, pathCost)) {
 return res.status(429).json({
 error: 'API rate limit exceeded',
 code: 'API_RATE_LIMIT_EXCEEDED'
 });
 }

 next();
}

// Helper to determine cost based on endpoint

function getPathCost(path: string): number {
 if (path.includes('/api/high-cost/')) return 5;
 if (path.includes('/api/search/')) return 2;
 return 1; // Default cost
}
``` ### Embedded Content Embedded content may need special handlin

g:

```typescript
// Special rate limiting for embedded content

function embeddedContentRateLimit(req: Request, res: Response, next: NextFunction) {
 const ip = req.ip;
 const contentType = req.path.includes('/youtube/') ? 'youtube' : 'maps';

 // Check rate limit with lower cost for embedded content
 if (!rateLimitingSystem.checkRateLimit(`embed:${ip}`, undefined, 0.5)) {
 return res.status(429).json({
 error: 'Too many embedded content requests',
 code: 'EMBED_RATE_LIMIT_EXCEEDED'
 });
 }

 next();
}
```

## Monitoring Rate Limiting Our system provides tools for monitoring rate limitin

g:

```typescript

// Get current rate limiting statistics

function getRateLimitStats() {
 return {
 activeClients: rateLimitingSystem.getActiveBucketCount(),
 rejectedRequests: rateLimitingSystem.getRejectedRequestCount(),
 topConsumers: rateLimitingSystem.getTopConsumers(10),
 recentRejections: rateLimitingSystem.getRecentRejections()
 };
}
```

## Best Practices 1. **Use appropriate costs for different endpoints** - Higher costs for expensive operation

s

2. **Include session IDs when available** - Provides more accurate limiting for logged-in users

3. **Monitor rate limit events** - Watch for patterns that might indicate abuse

4. **Implement graceful degradation** - When rate limits are reached, provide useful feedback

5. **Consider user tiers** - Different rate limits for different user categories

## Troubleshooting Common rate limiting issues and solutions: 1. **Legitimate users being rate limited** - Adjust rate limits for specific endpoints or user categories - Implement progressive rate limiting that scales with usage patterns 2. **Rate limiting not working as expected** - Verify the correct keys are being used (IP, session ID, etc.) - Check that all entry points are protected by rate limiting middleware 3. **High load causing false positives** - Implement burst allowances for temporary traffic spikes - Consider distributed rate limiting for high-scale application

s

## See Also - [Advanced Context-Aware Rate Limiting System](../RATE_LIMITING.md) - 31% matc

h

- [Security System Overview](1-security-system-overview.md) - 29% match
- [Context-Aware Rate Limiting System](../RATE-LIMITING-SYSTEM.md) - 24% match
- [Security Quick Reference](security-quick-reference.md) - 22% match
- [API Security Implementation](../security/api-security.md) - 17% match