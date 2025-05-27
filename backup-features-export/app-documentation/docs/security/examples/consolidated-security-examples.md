# Security Implementation Example

s

## Overview This document provides practical code examples for implementing security features in the application. It consolidates code examples from multiple security documentation files into a single, comprehensive referenc

e.

## Overview This document provides practical code examples for implementing security features in the application. It consolidates code examples from multiple security documentation files into a single, comprehensive referenc

e.

## Authentication Examples ### User Registratio

n

```typescript

// server/routes.ts

app.post('/api/auth/register', async (req, res) => {
 try {
 // Validate input
 const schema = z.object({
 email: z.string().email(),
 password: z.string().min(8),
 name: z.string().min(2)
 });

 const result = schema.safeParse(req.body);
 if (!result.success) {
 return res.status(400).json({
 error: true,
 message: 'Invalid input data',
 details: result.error.flatten()
 });
 }

 const { email, password, name } = result.data;

 // Check if user exists
 const existingUser = await db.select()
 .from(users)
 .where(eq(users.email, email))
 .limit(1);

 if (existingUser.length > 0) {
 return res.status(409).json({
 error: true,
 message: 'User already exists'
 });
 }

 // Hash password
 const hashedPassword = await bcrypt.hash(password, 10);

 // Create user
 const [newUser] = await db.insert(users)
 .values({
 email,
 password: hashedPassword,
 name,
 role: 'user'
 })
 .returning({
 id: users.id,
 email: users.email,
 name: users.name,
 role: users.role
 });

 // Create session
 req.session.user = {
 id: newUser.id,
 email: newUser.email,
 role: newUser.role
 };

 return res.status(201).json({
 success: true,
 user: {
 id: newUser.id,
 email: newUser.email,
 name: newUser.name,
 role: newUser.role
 }
 });
 } catch (error) {
 console.error('Registration error:', error);
 return res.status(500).json({
 error: true,
 message: 'An error occurred during registration'
 });
 }
});
``` ### User Logi

n

```typescript
// server/routes.ts

app.post('/api/auth/login', async (req, res) => {
 try {
 // Validate input
 const schema = z.object({
 email: z.string().email(),
 password: z.string()
 });

 const result = schema.safeParse(req.body);
 if (!result.success) {
 return res.status(400).json({
 error: true,
 message: 'Invalid input data',
 details: result.error.flatten()
 });
 }

 const { email, password } = result.data;

 // Find user
 const user = await db.select()
 .from(users)
 .where(eq(users.email, email))
 .limit(1);

 if (user.length === 0) {
 return res.status(401).json({
 error: true,
 message: 'Invalid email or password'
 });
 }

 // Verify password
 const passwordMatch = await bcrypt.compare(password, user[0].password);
 if (!passwordMatch) {
 return res.status(401).json({
 error: true,
 message: 'Invalid email or password'
 });
 }

 // Check if 2FA is enabled
 if (user[0].twoFactorEnabled) {
 // Set partial session for 2FA verification
 req.session.partialAuth = {
 userId: user[0].id,
 email: user[0].email,
 requiresTwoFactor: true
 };

 return res.json({
 success: true,
 requiresTwoFactor: true
 });
 }

 // Create full session
 req.session.user = {
 id: user[0].id,
 email: user[0].email,
 role: user[0].role
 };

 // Update last login timestamp
 await db.update(users)
 .set({ lastLogin: new Date() })
 .where(eq(users.id, user[0].id));

 return res.json({
 success: true,
 user: {
 id: user[0].id,
 email: user[0].email,
 name: user[0].name,
 role: user[0].role
 }
 });
 } catch (error) {
 console.error('Login error:', error);
 return res.status(500).json({
 error: true,
 message: 'An error occurred during login'
 });
 }
});
``` ### Two-Factor Authenticatio

n

```typescript
// server/routes.ts - Setup 2FA

app.post('/api/auth/2fa/setup', async (req, res) => {
 try {
 // Check if user is authenticated
 if (!req.session.user) {
 return res.status(401).json({
 error: true,
 message: 'Authentication required'
 });
 }

 // Generate secret
 const secret = authenticator.generateSecret();

 // Generate QR code
 const otpauth = authenticator.keyuri(
 req.session.user.email,
 'Security Platform',
 secret
 );

 const qrCode = await QRCode.toDataURL(otpauth);

 // Store secret temporarily in session
 req.session.twoFactorSecret = secret;

 return res.json({
 success: true,
 secretKey: secret,
 qrCode
 });
 } catch (error) {
 console.error('2FA setup error:', error);
 return res.status(500).json({
 error: true,
 message: 'An error occurred during 2FA setup'
 });
 }
});

// server/routes.ts - Verify 2FA

app.post('/api/auth/2fa/verify', async (req, res) => {
 try {
 // Validate input
 const schema = z.object({
 token: z.string().length(6).regex(/^\d+$/)
 });

 const result = schema.safeParse(req.body);
 if (!result.success) {
 return res.status(400).json({
 error: true,
 message: 'Invalid token format',
 details: result.error.flatten()
 });
 }

 const { token } = result.data;

 // Check session
 if (!req.session.user && !req.session.partialAuth) {
 return res.status(401).json({
 error: true,
 message: 'Authentication required'
 });
 }

 // Get user ID and secret
 let userId, secret;

 if (req.session.partialAuth) {
 // Coming from login flow
 userId = req.session.partialAuth.userId;

 // Get secret from database
 const user = await db.select()
 .from(users)
 .where(eq(users.id, userId))
 .limit(1);

 if (user.length === 0) {
 return res.status(401).json({
 error: true,
 message: 'User not found'
 });
 }

 secret = user[0].twoFactorSecret;
 } else {
 // Coming from setup flow
 userId = req.session.user.id;
 secret = req.session.twoFactorSecret;

 if (!secret) {
 return res.status(400).json({
 error: true,
 message: '2FA setup not initiated'
 });
 }
 }

 // Verify token
 const isValid = authenticator.verify({
 token,
 secret,
 window: 1 // Allow 1 step before/after for time drift
 });

 if (!isValid) {
 return res.status(401).json({
 error: true,
 message: 'Invalid authentication code'
 });
 }

 if (req.session.partialAuth) {
 // Complete login flow
 const user = await db.select()
 .from(users)
 .where(eq(users.id, userId))
 .limit(1);

 // Create full session
 req.session.user = {
 id: user[0].id,
 email: user[0].email,
 role: user[0].role
 };

 // Clear partial auth
 delete req.session.partialAuth;

 // Update last login timestamp
 await db.update(users)
 .set({ lastLogin: new Date() })
 .where(eq(users.id, user[0].id));

 return res.json({
 success: true,
 user: {
 id: user[0].id,
 email: user[0].email,
 name: user[0].name,
 role: user[0].role
 }
 });
 } else {
 // Complete setup flow
 await db.update(users)
 .set({
 twoFactorEnabled: true,
 twoFactorSecret: secret
 })
 .where(eq(users.id, userId));

 // Clear setup secret
 delete req.session.twoFactorSecret;

 return res.json({
 success: true,
 message: 'Two-factor authentication enabled'
 });
 }
 } catch (error) {
 console.error('2FA verification error:', error);
 return res.status(500).json({
 error: true,
 message: 'An error occurred during 2FA verification'
 });
 }
});
``` ### Authentication Middlewar

e

```typescript
// server/middlewares/auth.ts

export const requireAuth = (req, res, next) => {
 if (!req.session.user) {
 return res.status(401).json({
 error: true,
 message: 'Authentication required'
 });
 }
 next();
};

export const requireRole = (roles) => {
 return (req, res, next) => {
 if (!req.session.user) {
 return res.status(401).json({
 error: true,
 message: 'Authentication required'
 });
 }

 if (!roles.includes(req.session.user.role)) {
 return res.status(403).json({
 error: true,
 message: 'Insufficient permissions'
 });
 }

 next();
 };
};

// Usage

app.get('/api/admin/users', requireRole(['admin']), async (req, res) => {
 // Admin-only endpoint
});
```

## CSRF Protection Examples ### CSRF Middleware Setu

p

```typescript

// server/middlewares/csrf.ts

import csrf from 'csurf';

export const setupCsrf = (app) => {
 // Configure CSRF protection
 const csrfProtection = csrf({
 cookie: {
 key: 'csrf',
 httpOnly: true,
 sameSite: 'lax',
 secure: process.env.NODE_ENV === 'production'
 }
 });

 // Apply CSRF protection to all routes
 app.use((req, res, next) => {
 // Skip CSRF for certain routes
 if (req.__skipCSRF ||
 req.path === '/api/webhooks' ||
 req.path.startsWith('/api/content/') ||
 req.path === '/service-worker.js') {
 return next();
 }

 csrfProtection(req, res, next);
 });

 // Provide CSRF token endpoint
 app.get('/api/auth/csrf-token', csrfProtection, (req, res) => {
 res.json({ csrfToken: req.csrfToken() });
 });

 // Handle CSRF errors
 app.use((err, req, res, next) => {
 if (err.code === 'EBADCSRFTOKEN') {
 // Log CSRF failure
 console.error('CSRF validation failed', {
 ip: req.ip,
 path: req.path,
 headers: req.headers,
 method: req.method
 });

 return res.status(403).json({
 error: true,
 code: 'CSRF_ERROR',
 message: 'Invalid CSRF token. Please refresh the page and try again.'
 });
 }

 next(err);
 });
};
``` ### CSRF Token Usage in Fronten

d

```jsx
// client/src/lib/csrf.ts

export async function fetchCsrfToken() {
 try {
 const response = await fetch('/api/auth/csrf-token');
 const data = await response.json();
 return data.csrfToken;
 } catch (error) {
 console.error('Failed to fetch CSRF token:', error);
 throw error;
 }
}

// client/src/hooks/useCsrf.ts

import { useState, useEffect } from 'react';

import { fetchCsrfToken } from '../lib/csrf';

export function useCsrf() {
 const [csrfToken, setCsrfToken] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
 async function loadCsrfToken() {
 try {
 const token = await fetchCsrfToken();
 setCsrfToken(token);
 setLoading(false);
 } catch (err) {
 setError(err);
 setLoading(false);
 }
 }

 loadCsrfToken();
 }, []);

 return { csrfToken, loading, error };
}

// client/src/components/Form.jsx - Example usage

import { useCsrf } from '../hooks/useCsrf';

function ContactForm() {
 const { csrfToken, loading } = useCsrf();
 const [formData, setFormData] = useState({ name: '', email: '', message: '' });

 const handleSubmit = async (e) => {
 e.preventDefault();

 if (!csrfToken) {
 console.error('CSRF token not available');
 return;
 }

 try {
 const response = await fetch('/api/contact', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'X-CSRF-Token': csrfToken
 },
 body: JSON.stringify(formData)
 });

 const data = await response.json();
 // Handle success
 } catch (error) {
 // Handle error
 }
 };

 if (loading) return <div>Loading...</div>;

 return (
 <form onSubmit={handleSubmit}>
 <input type="hidden" name="_csrf" value={csrfToken} />
 {/* Form fields */}
 <button type="submit">Submit</button>
 </form>
 );
}
```

## Rate Limiting Examples ### Basic Rate Limitin

g

```typescript

// server/middlewares/rateLimiting.ts

import rateLimit from 'express-rate-limit';

import { RateLimitStore } from '../services/rateLimitStore';

const store = new RateLimitStore();

export const createRateLimiter = (options = {}) => {
 return rateLimit({
 windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes by default
 max: options.max || 100, // 100 requests per window by default
 standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
 legacyHeaders: false, // Disable the `X-RateLimit-*` headers
 message: options.message || 'Too many requests, please try again later.',
 store,
 keyGenerator: (req) => {
 // Use IP address as default key
 return req.ip || 'unknown';
 },
 ...options
 });
};

// server/index.ts - Apply rate limiting

import { createRateLimiter } from './middlewares/rateLimiting';

// Global rate limiter

app.use(createRateLimiter());

// Route-specific rate limiters

const loginLimiter = createRateLimiter({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 5, // 5 login attempts per window
 message: 'Too many login attempts, please try again later.'
});

app.post('/api/auth/login', loginLimiter, loginHandler);

const apiLimiter = createRateLimiter({
 windowMs: 60 * 1000, // 1 minute
 max: 60, // 60 requests per minute
 message: 'Too many API requests, please slow down.'
});

app.use('/api/', apiLimiter);
``` ### Advanced Rate Limitin

g

```typescript
// server/services/rateLimitStore.ts

import { RedisClient } from './redis';

export class RateLimitStore {
 // Use in-memory store for development, Redis for production
 private store = process.env.NODE_ENV === 'production'
 ? new RedisClient()
 : new Map();

 // Incrementing counters with expiration
 async increment(key, options) {
 const windowMs = options.windowMs || 60 * 1000;
 const now = Date.now();
 const windowExpire = now + windowMs;

 if (process.env.NODE_ENV === 'production') {
 // Redis implementation
 const result = await this.store.multi()
 .incr(key)
 .pexpire(key, windowMs)
 .exec();

 return {
 totalHits: parseInt(result[0][1]),
 resetTime: windowExpire
 };
 } else {
 // In-memory implementation
 let counter = this.store.get(key) || { hits: 0, expire: windowExpire };

 // Reset if expired
 if (counter.expire <= now) {
 counter = { hits: 0, expire: windowExpire };
 }

 counter.hits += 1;
 this.store.set(key, counter);

 return {
 totalHits: counter.hits,
 resetTime: counter.expire
 };
 }
 }

 // Check if rate limited
 async isRateLimited(key, options) {
 const result = await this.increment(key, options);
 return result.totalHits > options.max;
 }

 // Reset a key
 async reset(key) {
 if (process.env.NODE_ENV === 'production') {
 await this.store.del(key);
 } else {
 this.store.delete(key);
 }
 }
}

// server/middlewares/rateLimiting.ts - Progressive delay

export const progressiveDelayMiddleware = () => {
 const attempts = new Map();

 return async (req, res, next) => {
 const key = req.ip || 'unknown';
 const now = Date.now();

 const attempt = attempts.get(key) || { count: 0, lastAttempt: 0 };

 // Reset if more than 1 hour since last attempt
 if (now - attempt.lastAttempt > 60 * 60 * 1000) {
 attempt.count = 0;
 }

 attempt.count += 1;
 attempt.lastAttempt = now;

 attempts.set(key, attempt);

 // Calculate delay based on attempt count
 // 0ms, 100ms, 400ms, 900ms, 1600ms, etc.
 const delay = (attempt.count > 1) ? Math.pow(attempt.count - 1, 2) * 100 : 0;

 if (delay > 0) {
 await new Promise(resolve => setTimeout(resolve, delay));
 }

 next();
 };
};
```

## Content Security Policy Examples ### CSP Middlewar

e

```typescript

// server/middlewares/contentSecurity.ts

export const setupContentSecurity = (app) => {
 app.use((req, res, next) => {
 // Generate a unique nonce for inline scripts
 const nonce = Buffer.from(crypto.randomBytes(16)).toString('base64');
 res.locals.nonce = nonce;

 // Set Content-Security-Policy header
 res.setHeader(
 'Content-Security-Policy',
 `default-src 'self';
 script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net;
 style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
 img-src 'self' data: https://images.unsplash.com;
 font-src 'self' https://fonts.gstatic.com;
 connect-src 'self' https://api.example.com;
 frame-src 'self' https://www.youtube.com;
 object-src 'none';
 base-uri 'self';
 form-action 'self';
 frame-ancestors 'self';
 upgrade-insecure-requests;`
 );

 next();
 });
};
``` ### Using CSP Nonce in Template

s

```jsx
// client/src/components/Layout.jsx

function Layout({ children }) {
 const [nonce, setNonce] = useState('');

 useEffect(() => {
 // Get nonce from meta tag
 const metaNonce = document.querySelector('meta[name="csp-nonce"]');
 if (metaNonce) {
 setNonce(metaNonce.getAttribute('content'));
 }
 }, []);

 return (
 <>
 <script
 nonce={nonce}
 dangerouslySetInnerHTML={{
 __html: `
 // Inline initialization script
 console.log('Initialization complete');
 `
 }}
 />
 <main>{children}</main>
 </>
 );
}

// server/renderMiddleware.ts - Adding nonce to meta tag

app.use((req, res, next) => {
 const originalSend = res.send;

 res.send = function(body) {
 if (typeof body === 'string' && body.includes('<head>') && res.locals.nonce) {
 // Insert nonce meta tag
 body = body.replace(
 '<head>',
 `<head><meta name="csp-nonce" content="${res.locals.nonce}">`
 );
 }

 return originalSend.call(this, body);
 };

 next();
});
```

## Input Validation Examples ### Request Validation Middlewar

e

```typescript

// server/middlewares/validation.ts

import { z } from 'zod';

export const validateRequest = (schema) => {
 return (req, res, next) => {
 try {
 const result = schema.safeParse(req.body);

 if (!result.success) {
 return res.status(400).json({
 error: true,
 message: 'Validation failed',
 details: result.error.flatten()
 });
 }

 // Replace req.body with validated data
 req.body = result.data;
 next();
 } catch (error) {
 next(error);
 }
 };
};

// server/routes.ts - Example usage

import { validateRequest } from './middlewares/validation';

const userSchema = z.object({
 name: z.string().min(2).max(100),
 email: z.string().email(),
 age: z.number().int().min(18).optional()
});

app.post('/api/users', validateRequest(userSchema), async (req, res) => {
 // req.body has been validated and typed
 const { name, email, age } = req.body;

 // Process the request
});
``` ### Form Validation with Zod and React Hook For

m

```tsx
// client/src/components/UserForm.tsx

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import { Button } from '@/components/ui/button';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Input } from '@/components/ui/input';

// Define schema

const userFormSchema = z.object({
 name: z.string().min(2, {
 message: 'Name must be at least 2 characters.',
 }).max(100),
 email: z.string().email({
 message: 'Please enter a valid email address.',
 }),
 age: z.preprocess(
 (val) => (val === '' ? undefined : Number(val)),
 z.number().int().min(18, {
 message: 'You must be at least 18 years old.',
 }).optional()
 )
});

// Infer type from schema

type UserFormValues = z.infer<typeof userFormSchema>;

export function UserForm() {
 const form = useForm<UserFormValues>({
 resolver: zodResolver(userFormSchema),
 defaultValues: {
 name: '',
 email: '',
 age: undefined
 },
 });

 function onSubmit(values: UserFormValues) {
 // Submit form data
 console.log(values);
 }

 return (
 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
 <FormField
 control={form.control}
 name="name"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Name</FormLabel>
 <FormControl>
 <Input placeholder="Your name" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="email"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Email</FormLabel>
 <FormControl>
 <Input placeholder="your.email@example.com" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="age"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Age (optional)</FormLabel>
 <FormControl>
 <Input type="number" {...field} value={field.value || ''} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <Button type="submit">Submit</Button>
 </form>
 </Form>
 );
}
```

## Error Handling Examples ### Global Error Handle

r

```typescript

// server/middlewares/errorHandler.ts

export const errorHandler = (err, req, res, next) => {
 // Log error
 console.error('Unhandled error:', err);

 // Security error handling
 if (err.name === 'UnauthorizedError') {
 return res.status(401).json({
 error: true,
 code: 'UNAUTHORIZED',
 message: 'Authentication required'
 });
 }

 if (err.code === 'EBADCSRFTOKEN') {
 return res.status(403).json({
 error: true,
 code: 'CSRF_ERROR',
 message: 'Invalid CSRF token'
 });
 }

 // Validation errors
 if (err.name === 'ValidationError') {
 return res.status(400).json({
 error: true,
 code: 'VALIDATION_ERROR',
 message: 'Validation failed',
 details: err.details
 });
 }

 // Database errors
 if (err.code === '23505') { // PostgreSQL unique violation
 return res.status(409).json({
 error: true,
 code: 'DUPLICATE_ENTRY',
 message: 'A duplicate entry was found'
 });
 }

 // Default error response
 const statusCode = err.statusCode || 500;
 const message = process.env.NODE_ENV === 'production'
 ? 'An unexpected error occurred'
 : err.message;

 res.status(statusCode).json({
 error: true,
 code: err.code || 'INTERNAL_ERROR',
 message
 });
};

// server/index.ts

import { errorHandler } from './middlewares/errorHandler';

// Register routes and middleware

app.use('/api', apiRoutes);

// Error handler should be registered last

app.use(errorHandler);
``` ### Frontend Error Boundar

y

```tsx
// client/src/components/ErrorBoundary.tsx

import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
 fallback?: ReactNode;
 children: ReactNode;
 onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
 hasError: boolean;
 error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
 constructor(props: ErrorBoundaryProps) {
 super(props);
 this.state = { hasError: false };
 }

 static getDerivedStateFromError(error: Error): ErrorBoundaryState {
 return { hasError: true, error };
 }

 componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
 // Log error
 console.error('Error caught by ErrorBoundary:', error, errorInfo);

 // Call onError callback if provided
 if (this.props.onError) {
 this.props.onError(error, errorInfo);
 }
 }

 render(): ReactNode {
 if (this.state.hasError) {
 if (this.props.fallback) {
 return this.props.fallback;
 }

 return (
 <div className="error-boundary">
 <h2>Something went wrong</h2>
 <p>{this.state.error?.message || 'An unknown error occurred'}</p>
 <button onClick={() => this.setState({ hasError: false })}>
 Try again
 </button>
 </div>
 );
 }

 return this.props.children;
 }
}

// client/src/App.tsx - Usage

import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
 return (
 <ErrorBoundary
 fallback={<div>Something went wrong. Please refresh the page.</div>}
 onError={(error, errorInfo) => {
 // Send error to logging service
 reportError(error, errorInfo);
 }}
 >
 <MainApp />
 </ErrorBoundary>
 );
}
```

## Secure File Upload Examples ### Backend File Upload Handlin

g

```typescript

// server/middlewares/fileUpload.ts

import fileUpload from 'express-fileupload';

import { v4 as uuidv4 } from 'uuid';

import path from 'path';

import fs from 'fs';

// Allowed file types and their corresponding MIME types

const ALLOWED_TYPES = {
 image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
 document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
 spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
};

export const setupFileUpload = (app) => {
 // Configure file upload middleware
 app.use(fileUpload({
 limits: {
 fileSize: 10 * 1024 * 1024, // 10MB max file size
 files: 5 // Max 5 files at once
 },
 abortOnLimit: true,
 useTempFiles: true,
 tempFileDir: '/tmp/',
 preserveExtension: true,
 safeFileNames: true,
 createParentPath: true
 }));

 // Validate file types
 app.use('/api/upload', (req, res, next) => {
 if (!req.files || Object.keys(req.files).length === 0) {
 return next();
 }

 const fileType = req.query.type || 'image';
 const allowedMimeTypes = ALLOWED_TYPES[fileType] || ALLOWED_TYPES.image;

 // Get array of files
 const files = req.files.file ?
 (Array.isArray(req.files.file) ? req.files.file : [req.files.file]) :
 [];

 // Check each file
 for (const file of files) {
 if (!allowedMimeTypes.includes(file.mimetype)) {
 return res.status(400).json({
 error: true,
 message: `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`
 });
 }
 }

 next();
 });
};

// server/routes.ts - File upload endpoint

app.post('/api/upload', requireAuth, async (req, res) => {
 try {
 if (!req.files || Object.keys(req.files).length === 0) {
 return res.status(400).json({
 error: true,
 message: 'No files were uploaded'
 });
 }

 // Process files
 const files = req.files.file ?
 (Array.isArray(req.files.file) ? req.files.file : [req.files.file]) :
 [];

 const uploadResults = [];

 for (const file of files) {
 // Generate unique filename
 const fileExt = path.extname(file.name);
 const fileName = `${uuidv4()}${fileExt}`;
 const uploadPath = path.join(__dirname, '../uploads', fileName);

 // Move file to upload directory
 await file.mv(uploadPath);

 // Store file metadata in database
 const [fileRecord] = await db.insert(files)
 .values({
 fileName,
 originalName: file.name,
 mimeType: file.mimetype,
 size: file.size,
 userId: req.session.user.id,
 path: `/uploads/${fileName}`
 })
 .returning({
 id: files.id,
 path: files.path
 });

 uploadResults.push(fileRecord);
 }

 return res.status(200).json({
 success: true,
 files: uploadResults
 });
 } catch (error) {
 console.error('File upload error:', error);
 return res.status(500).json({
 error: true,
 message: 'An error occurred during file upload'
 });
 }
});
``` ### Frontend File Upload Componen

t

```tsx
// client/src/components/FileUpload.tsx

import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import { useMutation } from '@tanstack/react-query';

import { useCsrf } from '../hooks/useCsrf';

interface FileUploadProps {
 onSuccess?: (files: any[]) => void;
 allowedTypes?: string[];
 maxSize?: number; // in bytes
 maxFiles?: number;
}

export function FileUpload({
 onSuccess,
 allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
 maxSize = 5 * 1024 * 1024, // 5MB
 maxFiles = 1
}: FileUploadProps) {
 const [files, setFiles] = useState<File[]>([]);
 const [error, setError] = useState<string | null>(null);
 const { csrfToken } = useCsrf();

 const { register, handleSubmit, formState } = useForm();

 const uploadMutation = useMutation({
 mutationFn: async (formData: FormData) => {
 const response = await fetch('/api/upload', {
 method: 'POST',
 headers: {
 'X-CSRF-Token': csrfToken
 },
 body: formData,
 credentials: 'include'
 });

 if (!response.ok) {
 const errorData = await response.json();
 throw new Error(errorData.message || 'Upload failed');
 }

 return response.json();
 },
 onSuccess: (data) => {
 if (onSuccess) {
 onSuccess(data.files);
 }
 }
 });

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setError(null);

 if (!e.target.files || e.target.files.length === 0) {
 return;
 }

 const fileList = Array.from(e.target.files);

 // Check number of files
 if (fileList.length > maxFiles) {
 setError(`You can only upload ${maxFiles} file(s) at a time`);
 return;
 }

 // Validate each file
 for (const file of fileList) {
 // Check file type
 if (!allowedTypes.includes(file.type)) {
 setError(`File type ${file.type} is not allowed`);
 return;
 }

 // Check file size
 if (file.size > maxSize) {
 setError(`File size exceeds ${formatBytes(maxSize)}`);
 return;
 }
 }

 setFiles(fileList);
 };

 const onSubmit = () => {
 if (files.length === 0) {
 setError('Please select a file to upload');
 return;
 }

 const formData = new FormData();

 for (const file of files) {
 formData.append('file', file);
 }

 uploadMutation.mutate(formData);
 };

 // Format bytes to human-readable format
 function formatBytes(bytes: number): string {
 if (bytes === 0) return '0 Bytes';
 const k = 1024;
 const sizes = ['Bytes', 'KB', 'MB', 'GB'];
 const i = Math.floor(Math.log(bytes) / Math.log(k));
 return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
 }

 return (
 <div className="file-upload">
 <form onSubmit={handleSubmit(onSubmit)}>
 <div className="mb-4">
 <input
 type="file"
 id="file"
 multiple={maxFiles > 1}
 accept={allowedTypes.join(',')}
 onChange={handleFileChange}
 className="hidden"
 {...register('file')}
 />
 <label
 htmlFor="file"
 className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center"
 >
 <svg
 className="w-8 h-8 text-gray-400"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 xmlns="http://www.w3.org/2000/svg"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
 />
 </svg>
 <span className="mt-2 text-gray-600">
 Drop files here or click to browse
 </span>
 <span className="mt-1 text-xs text-gray-500">
 Allowed: {allowedTypes.join(', ')} (Max: {formatBytes(maxSize)})
 </span>
 </label>
 </div>

 {files.length > 0 && (
 <div className="mb-4">
 <h3 className="text-sm font-medium">Selected Files:</h3>
 <ul className="mt-1 space-y-1">
 {files.map((file, index) => (
 <li key={index} className="text-sm text-gray-600">
 {file.name} ({formatBytes(file.size)})
 </li>
 ))}
 </ul>
 </div>
 )}

 {error && (
 <div className="mb-4 text-sm text-red-600">{error}</div>
 )}

 <Button
 type="submit"
 disabled={files.length === 0 || uploadMutation.isPending}
 >
 {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
 </Button>
 </form>
 </div>
 );
}
```

## Security Headers Examples ### Security Headers Middlewar

e

```typescript

// server/middlewares/securityHeaders.ts

export const setupSecurityHeaders = (app) => {
 app.use((req, res, next) => {
 // HTTP Strict Transport Security
 res.setHeader(
 'Strict-Transport-Security',
 'max-age=31536000; includeSubDomains; preload'
 );

 // X-Content-Type-Options
 res.setHeader('X-Content-Type-Options', 'nosniff');

 // X-Frame-Options
 res.setHeader('X-Frame-Options', 'SAMEORIGIN');

 // X-XSS-Protection
 res.setHeader('X-XSS-Protection', '1; mode=block');

 // Referrer-Policy
 res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

 // Permissions-Policy
 res.setHeader(
 'Permissions-Policy',
 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
 );

 // Feature-Policy
 res.setHeader(
 'Feature-Policy',
 "camera 'none'; microphone 'none'; geolocation 'self'"
 );

 next();
 });
};
```

## Additional Security Examples ### Secure Cookie Configuratio

n

```typescript

// server/index.ts

import session from 'express-session';

app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: false,
 name: 'sid', // Custom cookie name (not the default 'connect.sid')
 cookie: {
 httpOnly: true, // JavaScript cannot access the cookie
 secure: process.env.NODE_ENV === 'production', // HTTPS only in production
 sameSite: 'lax', // Restricts cross-site cookie usage
 maxAge: 24 * 60 * 60 * 1000 // 24 hours
 }
}));
``` ### Password Reset Implementatio

n

```typescript
// server/routes.ts - Password reset request

app.post('/api/auth/reset-password', async (req, res) => {
 try {
 const { email } = req.body;

 // Find user
 const user = await db.select()
 .from(users)
 .where(eq(users.email, email))
 .limit(1);

 if (user.length === 0) {
 // Don't reveal user existence, but still return success
 return res.json({
 success: true,
 message: 'If your email is registered, you will receive a password reset link'
 });
 }

 // Generate reset token
 const token = crypto.randomBytes(32).toString('hex');
 const expiry = new Date();
 expiry.setHours(expiry.getHours() + 1); // Token valid for 1 hour

 // Store token
 await db.update(users)
 .set({
 resetToken: token,
 resetTokenExpiry: expiry
 })
 .where(eq(users.id, user[0].id));

 // Send reset email (example implementation)
 await sendEmail({
 to: email,
 subject: 'Password Reset',
 body: `Click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`
 });

 return res.json({
 success: true,
 message: 'If your email is registered, you will receive a password reset link'
 });
 } catch (error) {
 console.error('Password reset request error:', error);
 return res.status(500).json({
 error: true,
 message: 'An error occurred while processing your request'
 });
 }
});

// server/routes.ts - Password reset confirmation

app.post('/api/auth/reset-password/confirm', async (req, res) => {
 try {
 const { token, password } = req.body;

 // Validate password
 if (!password || password.length < 8) {
 return res.status(400).json({
 error: true,
 message: 'Password must be at least 8 characters long'
 });
 }

 // Find user with this token
 const user = await db.select()
 .from(users)
 .where(eq(users.resetToken, token))
 .limit(1);

 if (user.length === 0) {
 return res.status(400).json({
 error: true,
 message: 'Invalid or expired reset token'
 });
 }

 // Check token expiry
 if (new Date() > new Date(user[0].resetTokenExpiry)) {
 return res.status(400).json({
 error: true,
 message: 'Reset token has expired'
 });
 }

 // Hash new password
 const hashedPassword = await bcrypt.hash(password, 10);

 // Update user password and clear token
 await db.update(users)
 .set({
 password: hashedPassword,
 resetToken: null,
 resetTokenExpiry: null
 })
 .where(eq(users.id, user[0].id));

 return res.json({
 success: true,
 message: 'Password has been reset successfully'
 });
 } catch (error) {
 console.error('Password reset confirmation error:', error);
 return res.status(500).json({
 error: true,
 message: 'An error occurred while processing your request'
 });
 }
});
```

## Security Scanning Examples ### Vulnerability Scanning Implementatio

n

```typescript

// server/services/securityScan.ts

import { execPromise } from '../utils/exec';

import { db } from '../db';

import { securityScans, securityVulnerabilities } from '../../shared/schema';

export async function runSecurityScan(scanType = 'all') {
 try {
 console.log(`Starting security scan: ${scanType}`);

 // Create scan record
 const [scan] = await db.insert(securityScans)
 .values({
 type: scanType,
 status: 'running',
 startTime: new Date()
 })
 .returning();

 let vulnerabilities = [];

 switch (scanType) {
 case 'dependency':
 vulnerabilities = await scanDependencies();
 break;
 case 'code':
 vulnerabilities = await scanCode();
 break;
 case 'api':
 vulnerabilities = await scanApi();
 break;
 case 'all':
 const depVulns = await scanDependencies();
 const codeVulns = await scanCode();
 const apiVulns = await scanApi();
 vulnerabilities = [...depVulns, ...codeVulns, ...apiVulns];
 break;
 default:
 throw new Error(`Unknown scan type: ${scanType}`);
 }

 // Store vulnerabilities
 if (vulnerabilities.length > 0) {
 await db.insert(securityVulnerabilities)
 .values(vulnerabilities.map(v => ({
 scanId: scan.id,
 type: v.type,
 severity: v.severity,
 description: v.description,
 location: v.location,
 recommendation: v.recommendation
 })));
 }

 // Update scan status
 await db.update(securityScans)
 .set({
 status: 'completed',
 endTime: new Date(),
 vulnerabilityCount: vulnerabilities.length
 })
 .where(eq(securityScans.id, scan.id));

 return {
 scanId: scan.id,
 vulnerabilities
 };
 } catch (error) {
 console.error('Security scan error:', error);
 throw error;
 }
}

// Scan dependencies for vulnerabilities

async function scanDependencies() {
 try {
 // Run npm audit
 const { stdout } = await execPromise('npm audit --json');
 const auditResult = JSON.parse(stdout);

 // Transform results
 const vulnerabilities = [];

 for (const [id, vuln] of Object.entries(auditResult.vulnerabilities || {})) {
 vulnerabilities.push({
 type: 'dependency',
 severity: vuln.severity,
 description: `${vuln.name}@${vuln.version}: ${vuln.title}`,
 location: `node_modules/${vuln.name}`,
 recommendation: vuln.recommendation || `Update to ${vuln.name}@${vuln.fixAvailable.version}`
 });
 }

 return vulnerabilities;
 } catch (error) {
 console.error('Dependency scan error:', error);
 return [];
 }
}

// Scan code for vulnerabilities

async function scanCode() {
 try {
 // This is a simplified example - in a real application,
 // you would use a tool like ESLint with security plugins
 // or a dedicated security scanner

 const vulnerabilities = [];

 // Example: Scanning for eval usage
 const { stdout: grepResult } = await execPromise('grep -r "eval(" --include="*.js" --include="*.ts" --include="*.tsx" ./client ./server || true');

 if (grepResult.trim()) {
 const lines = grepResult.split('\n').filter(Boolean);

 for (const line of lines) {
 const [file, ...rest] = line.split(':');

 vulnerabilities.push({
 type: 'code',
 severity: 'high',
 description: 'Use of eval() detected, which can lead to code injection vulnerabilities',
 location: file,
 recommendation: 'Avoid using eval(). Consider safer alternatives.'
 });
 }
 }

 return vulnerabilities;
 } catch (error) {
 console.error('Code scan error:', error);
 return [];
 }
}

// Scan API for vulnerabilities

async function scanApi() {
 // This would involve checking API endpoints for common vulnerabilities
 // Like missing authentication, improper access controls, etc.
 // This is a simplified placeholder
 return [];
}
``` *Last updated: 2025-05-11*

## See Also - [WebSocket Security Implementation](../../README-websocket-security.md) - 33% matc

h

- [Comprehensive Security Guide](../consolidated-security-guide.md) - 33% match
- [Security Developer Guide](../developer-security-guide.md) - 33% match
- [Security Implementation Documentation](../../security.md) - 33% match
- [API Security Implementation](../../API_SECURITY_IMPLEMENTATION.md) - 25% match