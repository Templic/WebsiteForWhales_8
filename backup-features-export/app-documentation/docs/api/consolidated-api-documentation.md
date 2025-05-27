# API Documentatio

n

## Overview This document provides comprehensive documentation for all API endpoints in the application. It covers authentication, request/response formats, error handling, and security consideration

s.

## Overview This document provides comprehensive documentation for all API endpoints in the application. It covers authentication, request/response formats, error handling, and security consideration

s.

## API Structure The API follows a RESTful structure with the following main categorie

s:

```

/api
├── /auth - Authentication endpoints
├── /users - User management
├── /security - Security operations
├── /content - Content management
├── /shop - E-commerce functionality
└── /admin - Administrative functions
```

## Authentication ### Authentication Methods The API supports the following authentication methods: 1. **Session-based Authentication** - Cookie-based authentication using Express Session - Suitable for browser-based clients 2. **API Key Authentication** - Header-based authentication using API keys - For service-to-service communication 3. **OAuth Authentication** - OAuth 2.0 flow for third-party applications - Enables secure delegated access ### Authentication Endpoints #### Logi

n

```

POST /api/auth/login
``` **Request Body:**
```json
{
 "email": "user@example.com",
 "password": "securePassword123"
}
``` **Response:**
```json
{
 "success": true,
 "user": {
 "id": "user_123",
 "email": "user@example.com",
 "name": "Example User",
 "role": "user"
 },
 "token": "session_token_data"
}
``` **Status Codes:**
- 200: Success
- 401: Invalid credentials
- 429: Too many login attempts #### Logou

t

```

POST /api/auth/logout
``` **Response:**
```json
{
 "success": true,
 "message": "Logged out successfully"
}
``` **Status Codes:**
- 200: Success
- 401: Not authenticated #### Registe

r

```

POST /api/auth/register
``` **Request Body:**
```json
{
 "email": "newuser@example.com",
 "password": "securePassword123",
 "name": "New User"
}
``` **Response:**
```json
{
 "success": true,
 "user": {
 "id": "user_456",
 "email": "newuser@example.com",
 "name": "New User",
 "role": "user"
 }
}
``` **Status Codes:**
- 201: Successfully created
- 400: Validation error
- 409: Email already exists #### Two-Factor Authentication Setu

p

```

POST /api/auth/2fa/setup
``` **Response:**
```json
{
 "success": true,
 "secretKey": "ABCDEFGHIJKLMNOP",
 "qrCode": "data:image/png;base64,..."
}
``` **Status Codes:**
- 200: Success
- 401: Not authenticated #### Two-Factor Authentication Verif

y

```

POST /api/auth/2fa/verify
``` **Request Body:**
```json
{
 "token": "123456"
}
``` **Response:**
```json
{
 "success": true,
 "message": "Two-factor authentication enabled"
}
``` **Status Codes:**
- 200: Success
- 401: Invalid token

## User Management ### User Endpoints #### Get Current Use

r

```

GET /api/users/me
``` **Response:**
```json
{
 "id": "user_123",
 "email": "user@example.com",
 "name": "Example User",
 "role": "user",
 "createdAt": "2025-01-15T12:00:00Z",
 "settings": {
 "theme": "dark",
 "notifications": true
 }
}
``` **Status Codes:**
- 200: Success
- 401: Not authenticated #### Update User Profil

e

```

PATCH /api/users/me
``` **Request Body:**
```json
{
 "name": "Updated Name",
 "settings": {
 "theme": "light"
 }
}
``` **Response:**
```json
{
 "success": true,
 "user": {
 "id": "user_123",
 "email": "user@example.com",
 "name": "Updated Name",
 "settings": {
 "theme": "light",
 "notifications": true
 }
 }
}
``` **Status Codes:**
- 200: Success
- 400: Validation error
- 401: Not authenticated #### Get User by ID (Admin onl

y)

```

GET /api/users/:id
``` **Response:**
```json
{
 "id": "user_456",
 "email": "other@example.com",
 "name": "Other User",
 "role": "user",
 "createdAt": "2025-02-20T14:30:00Z",
 "lastLogin": "2025-05-10T08:15:00Z"
}
``` **Status Codes:**
- 200: Success
- 401: Not authenticated
- 403: Not authorized
- 404: User not found

## Security ### Security Endpoints #### Security Sca

n

```

POST /api/security/scan
``` **Request Body:**
```json
{
 "scanType": "vulnerability",
 "target": "dependencies",
 "depth": "deep"
}
``` **Response:**
```json
{
 "scanId": "scan_123",
 "status": "in_progress",
 "estimatedTimeSeconds": 60
}
``` **Status Codes:**
- 202: Accepted
- 400: Invalid scan parameters
- 401: Not authenticated
- 403: Not authorized #### Get Security Scan Result

s

```

GET /api/security/scan/:scanId
``` **Response:**
```json
{
 "scanId": "scan_123",
 "status": "completed",
 "startTime": "2025-05-11T10:00:00Z",
 "endTime": "2025-05-11T10:01:30Z",
 "findings": [
 {
 "id": "finding_1",
 "severity": "high",
 "category": "vulnerability",
 "description": "Outdated dependency with known security vulnerability",
 "details": "Package xyz@1.2.3 has CVE-2025-1234",
 "recommendation": "Update to xyz@1.3.0 or later"
 }
 ],
 "summary": {
 "high": 1,
 "medium": 3,
 "low": 7
 }
}
``` **Status Codes:**
- 200: Success
- 202: Still processing
- 404: Scan not found #### Security Health Chec

k

```

GET /api/security/health
``` **Response:**
```json
{
 "status": "healthy",
 "lastScan": "2025-05-10T12:00:00Z",
 "metrics": {
 "csrfProtection": "enabled",
 "rateLimiting": "enabled",
 "contentSecurity": "configured",
 "dataEncryption": "enabled"
 },
 "securityScore": 92
}
``` **Status Codes:**
- 200: Success
- 401: Not authenticated

## Content Management ### Content Endpoints #### Get Content by Ke

y

```

GET /api/content/key/:contentKey
``` **Response:**
```json
{
 "id": "content_123",
 "key": "home-hero-title",
 "value": "Welcome to Our Platform",
 "type": "text",
 "locale": "en-US",
 "lastUpdated": "2025-04-30T15:45:00Z"
}
``` **Status Codes:**
- 200: Success
- 404: Content not found #### Update Content (Admin onl

y)

```

PUT /api/content/key/:contentKey
``` **Request Body:**
```json
{
 "value": "Welcome to Our Amazing Platform",
 "locale": "en-US"
}
``` **Response:**
```json
{
 "success": true,
 "content": {
 "id": "content_123",
 "key": "home-hero-title",
 "value": "Welcome to Our Amazing Platform",
 "type": "text",
 "locale": "en-US",
 "lastUpdated": "2025-05-11T11:30:00Z"
 }
}
``` **Status Codes:**
- 200: Success
- 400: Validation error
- 401: Not authenticated
- 403: Not authorized #### List Content by Typ

e

```

GET /api/content/type/:contentType
``` **Response:**
```json
{
 "items": [
 {
 "id": "content_123",
 "key": "home-hero-title",
 "value": "Welcome to Our Platform",
 "type": "text",
 "locale": "en-US"
 },
 {
 "id": "content_124",
 "key": "home-hero-subtitle",
 "value": "Discover amazing features",
 "type": "text",
 "locale": "en-US"
 }
 ],
 "total": 2
}
``` **Status Codes:**
- 200: Success
- 400: Invalid content type

## Admin ### Admin Endpoints #### Get Security Dashboard Dat

a

```

GET /api/admin/security/dashboard
``` **Response:**
```json
{
 "securityScore": 92,
 "threatStats": {
 "detected": 15,
 "blocked": 15,
 "pending": 0
 },
 "securityEvents": [
 {
 "id": "event_123",
 "type": "rate_limit_exceeded",
 "severity": "medium",
 "timestamp": "2025-05-11T09:15:00Z",
 "source": "123.456.789.0",
 "details": "Rate limit exceeded for authentication endpoint"
 }
 ],
 "vulnerabilityStats": {
 "high": 0,
 "medium": 2,
 "low": 5
 }
}
``` **Status Codes:**
- 200: Success
- 401: Not authenticated
- 403: Not authorized #### Get System Healt

h

```

GET /api/admin/system/health
``` **Response:**
```json
{
 "status": "healthy",
 "services": {
 "database": {
 "status": "healthy",
 "latency": 15
 },
 "fileStorage": {
 "status": "healthy",
 "latency": 25
 },
 "cache": {
 "status": "healthy",
 "latency": 5
 }
 },
 "metrics": {
 "cpuUsage": 25,
 "memoryUsage": 40,
 "requestsPerMinute": 150
 }
}
``` **Status Codes:**
- 200: Success
- 401: Not authenticated
- 403: Not authorized

## Error Handling All API endpoints follow a consistent error handling forma

t:

```json

{
 "error": true,
 "code": "VALIDATION_ERROR",
 "message": "The request data is invalid",
 "details": [
 {
 "field": "email",
 "message": "Must be a valid email address"
 }
 ]
}
``` ### Common Error Codes | Code | Descriptio

n |

|------|-------------|
| `AUTHENTICATION_REQUIRED` | Authentication is required |

| `INVALID_CREDENTIALS` | Invalid username or password |
| `PERMISSION_DENIED` | Insufficient permissions |

| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `VALIDATION_ERROR` | Request data validation failed |

| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |

## Security Considerations ### CSRF Protection All non-GET requests require a CSRF token, which can be obtained fro

m:

```

GET /api/auth/csrf-token
``` Include the token in subsequent requests as either:
- A header: `X-CSRF-Token: token_value`
- A request body parameter: `_csrf: token_value` ### Rate Limiting API endpoints are protected by rate limiting to prevent abuse. The following headers are included in API responses: - `X-RateLimit-Limit`: Maximum requests allowed in the windo

w
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time (in seconds) until the rate limit resets When rate limit is exceeded, the API returns a 429 Too Many Requests status code. ### Content Security The API implements strict Content-Security-Policy headers fo

r:
- Script execution control
- Frame loading restrictions
- Resource loading restrictions

## API Clients ### JavaScript Clien

t

```javascript

// Example using fetch

async function loginUser(email, password) {
 const response = await fetch('/api/auth/login', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify({ email, password }),
 credentials: 'include'
 });

 return await response.json();
}
``` ### React Query Integratio

n

```javascript
// Example using TanStack Query

import { useMutation } from '@tanstack/react-query';

function useLogin() {
 return useMutation({
 mutationFn: async ({ email, password }) => {
 const response = await fetch('/api/auth/login', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify({ email, password }),
 credentials: 'include'
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.message);
 }

 return await response.json();
 }
 });
}
```

## Versioning The current API version is v1. All endpoints are accessible without a version prefix for backward compatibility. *Last updated: 2025-05-1

1*