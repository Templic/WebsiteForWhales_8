# Security Quick Referenc

e

This document provides quick reference examples for common security-related tasks in our application.

## CSRF Protection ### Frontend: Include CSRF Token in Fetch Request

s

```typescript

// Get token from meta tag

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

// Include in fetch request

const response = await fetch('/api/endpoint', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'X-CSRF-Token': csrfToken
 },
 body: JSON.stringify(data)
});
``` ### Frontend: Include CSRF Token in Form

s

```tsx

function MyForm() {
 const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

 return (
 <form method="POST" action="/api/endpoint">
 <input type="hidden" name="_csrf" value={csrfToken} />
 {/* Form fields */}
 <button type="submit">Submit</button>
 </form>
 );
}
``` ### Backend: Exempt a Route from CSRF Protectio

n

```typescript
// In server/routes/your-route.ts

import { Router } from 'express';

import { csrfExemptMiddleware } from '../middleware/csrfExemptMiddleware';

const router = Router();

// Apply exemption middleware to specific routes

router.post('/webhook-callback', csrfExemptMiddleware, (req, res) => {
 // Handle webhook
});

export { router };
```

## Rate Limiting ### Apply Custom Rate Limits to a Rout

e

```typescript

// In server/routes/your-route.ts

import { Router } from 'express';

import { createRateLimitMiddleware } from '../middleware/rateLimitMiddleware';

const router = Router();

// Create custom rate limit middleware

const apiRateLimit = createRateLimitMiddleware({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 100, // limit each IP to 100 requests per windowMs
 message: {
 error: 'Too many requests, please try again later',
 code: 'RATE_LIMIT_EXCEEDED'
 }
});

// Apply to routes

router.use('/high-demand', apiRateLimit);

router.get('/high-demand/data', (req, res) => {
 // Handle request
});

export { router };
``` ### Record Custom Rate Limiting Event

s

```typescript
// In your controller

import { rateLimitingSystem } from '../security/advanced/threat/RateLimitingSystem';

function handleUserAction(req, res) {
 const ip = req.ip;
 const sessionId = req.session?.id;

 // Record the event (will affect rate limiting)
 rateLimitingSystem.recordEvent('custom-action', {
 ip,
 sessionId,
 timestamp: Date.now(),
 path: req.path
 });

 // Continue processing
}
```

## AI Security ### Add AI Validation to a Rout

e

```typescript

// In server/routes/your-route.ts

import { Router } from 'express';

import { createAIValidationMiddleware } from '../middleware/aiValidationMiddleware';

const router = Router();

// Apply AI validation middleware

router.post('/user-content', createAIValidationMiddleware({
 contentType: 'user',
 threshold: 0.7
}), (req, res) => {
 // Access validation result
 const validationResult = req.validationResult;

 // Process validated content
 // ...

 res.json({ success: true });
});

export { router };
``` ### Perform Custom AI Security Analysi

s

```typescript
// In your service

import { aiConnector } from '../security/advanced/ai/ValidationAIConnector';

async function validateUserContent(content, userId) {
 // Perform AI validation
 const result = await aiConnector.validate(content, {
 contentType: 'user',
 detailedAnalysis: true,
 customContext: `Content submitted by user ${userId}`,
 threshold: 0.8
 });

 return {
 passed: result.passed,
 score: result.securityScore,
 warnings: result.warnings
 };
}
```

## Embedded Content ### Embed a YouTube Vide

o

```tsx

// In your component

import { ProxyYouTubeEmbed } from '../components/security/ProxyYouTubeEmbed';

function VideoSection() {
 return (
 <div className="video-section">
 <h2>Featured Video</h2>
 <ProxyYouTubeEmbed
 videoId="jzpvkq3Krjg"
 title="Tour Video"
 height={450}
 />
 </div>
 );
}
``` ### Embed a Google Ma

p

```tsx
// In your component

import { ProxyGoogleMapEmbed } from '../components/security/ProxyGoogleMapEmbed';

function LocationSection() {
 return (
 <div className="location-section">
 <h2>Find Us</h2>
 <ProxyGoogleMapEmbed
 query="123 Example Street, Anytown, USA"
 title="Our Location"
 height={400}
 zoom={15}
 />
 </div>
 );
}
```

## TypeScript Error Management ### Run Complete Error Detectio

n

```bash

# From the command lin

e

npx ts-node scan-and-fix-typescript-errors.ts --deep

# With specific option

s

npx ts-node scan-and-fix-typescript-errors.ts --deep --categories=TypeSafety,SecurityVulnerability --max-errors=100
``` ### Fix Only Security-Critical Error

s

```typescript
// In your script

import { findTypeScriptErrors } from './advanced-ts-error-finder';

import { applyBatchFixes } from './ts-batch-fixer';

async function fixSecurityCriticalErrors() {
 // Find only security-critical errors
 const result = await findTypeScriptErrors({
 projectRoot: './src',
 categories: ['SecurityVulnerability'],
 minSeverity: 'critical',
 maxErrors: 50
 });

 // Apply fixes only for security-critical errors
 const fixResult = await applyBatchFixes({
 errors: result.errors,
 dependencies: {}, // No dependency tracking for simple fixes
 categories: ['SecurityVulnerability'],
 securityValidation: true
 });

 console.log(`Fixed ${fixResult.fixedErrors} security-critical errors`);
}
```

## Security Logging ### Log Security Event

s

```typescript

// In your code

import { securityLogger } from '../utils/securityLogger';

function processUserAction(req, user, action) {
 try {
 // Process the action
 // ...

 // Log successful action
 securityLogger.info('User action processed', {
 userId: user.id,
 action,
 path: req.path,
 ip: req.ip
 });
 } catch (error) {
 // Log security error
 securityLogger.error('Failed to process user action', {
 userId: user.id,
 action,
 path: req.path,
 ip: req.ip,
 error: error.message
 });

 throw error;
 }
}
```

## Security Configuration ### Enable/Disable Security Feature

s

```typescript

// In your configuration setup

import { configureSecurityFeatures } from '../security/advanced/config/SecurityConfig';

function setupSecurityConfig() {
 configureSecurityFeatures({
 csrfProtection: true,
 rateLimiting: true,
 aiSecurity: true,
 embeddedContentSecurity: true,
 advancedThreatDetection: process.env.NODE_ENV === 'production'
 });
}
``` ### Adjust Security Parameter

s

```typescript
// In your configuration setup

import { configureSecurityParameters } from '../security/advanced/config/SecurityConfig';

function setupSecurityParameters() {
 configureSecurityParameters({
 rateLimiting: {
 defaultTokens: 100,
 refillRate: 2,
 maxTokens: 100
 },
 aiSecurity: {
 threshold: 0.8,
 performancePriority: true
 },
 csrfProtection: {
 cookieOptions: {
 secure: true,
 sameSite: 'strict'
 }
 }
 });
}
```

## Security Testing ### Test CSRF Protectio

n

```typescript

// In your test script

async function testCsrfProtection() {
 // 1. Get a CSRF token
 const tokenResponse = await fetch('/api/csrf-token');
 const { csrfToken } = await tokenResponse.json();

 // 2. Test with valid token
 const validResponse = await fetch('/api/protected', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'X-CSRF-Token': csrfToken
 },
 body: JSON.stringify({ data: 'test' })
 });

 console.log('Valid token response:', await validResponse.json());

 // 3. Test with invalid token
 const invalidResponse = await fetch('/api/protected', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'X-CSRF-Token': 'invalid-token'
 },
 body: JSON.stringify({ data: 'test' })
 });

 console.log('Invalid token response:', await invalidResponse.json());
}
``` ### Test Rate Limitin

g

```typescript
// In your test script

async function testRateLimiting() {
 const maxRequests = 10;
 const results = [];

 // Make multiple requests to trigger rate limiting
 for (let i = 0; i < maxRequests; i++) {
 const response = await fetch('/api/rate-limited-endpoint');
 const status = response.status;

 results.push({
 requestNumber: i + 1,
 status,
 rateLimited: status === 429
 });

 // Add small delay to avoid overwhelming the server
 await new Promise(resolve => setTimeout(resolve, 100));
 }

 console.table(results);
}
```

## See Also - [Security Implementation Guide](../SECURITY-IMPLEMENTATION-GUIDE.md) - 31% matc

h

- [Security System Overview](1-security-system-overview.md) - 29% match
- [Context-Aware Rate Limiting System](../RATE-LIMITING-SYSTEM.md) - 24% match
- [Security Documentation Index](../SECURITY-INDEX.md) - 24% match
- [Comprehensive Security Guide](../security/consolidated-security-guide.md) - 24% match