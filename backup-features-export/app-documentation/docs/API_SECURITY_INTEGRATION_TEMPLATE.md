# API Security Integration Gu

i

d e how to securely integrate with APIs while maintaining robust security measures.

## API Security Principles When integrating with APIs, always follow these principles: 1. **Least Privilege**: Request and use the minimum permissions necessar y 2. **Defense in Depth**: Implement multiple layers of security controls 3. **Graceful Degradation**: Handle security failures without breaking core functionality 4. **Audit Trail**: Log all relevant API interactions for security analysi

s

## Authentication Patterns ### Pattern 1: Token-Based Authentication with Fallback This pattern ensures that API requests continue to work even when authentication services fai

l.

```typescript

import { useSecurityContext } from '@/hooks/useSecurityContext';

// API request function with authentication and fallback handling

async function secureApiRequest(
 endpoint: string,
 options: RequestInit = {},
 requiresAuth: boolean = true
): Promise<any> {
 const { securityLogger } = useSecurityContext();
 const controller = new AbortController();
 const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

 try {
 // Get authentication token
 let authToken = null;
 if (requiresAuth) {
 try {
 authToken = await getAuthToken();
 } catch (authError) {
 // Log authentication failure
 securityLogger.logSecurityEvent({
 type: 'auth_failure',
 details: { endpoint, error: authError.message },
 severity: 'high'
 });

 // If authentication is required but failed, throw error
 if (requiresAuth) {
 throw new Error(`Authentication required for ${endpoint}`);
 }
 }
 }

 // Prepare headers with authentication if available
 const headers = new Headers(options.headers || {});
 if (authToken) {
 headers.set('Authorization', `Bearer ${authToken}`);
 }

 // Add CSRF token if not in the excluded routes
 if (!isCsrfExempt(endpoint)) {
 const csrfToken = getCsrfToken();
 if (csrfToken) {
 headers.set('X-CSRF-Token', csrfToken);
 }
 }

 // Make the request with appropriate security headers
 const response = await fetch(endpoint, {
 ...options,
 headers,
 signal: controller.signal
 });

 // Clear timeout
 clearTimeout(timeoutId);

 // Handle different response status codes
 if (response.status === 401 || response.status === 403) {
 securityLogger.logSecurityEvent({
 type: 'api_auth_rejected',
 details: { endpoint, status: response.status },
 severity: 'medium'
 });
 throw new Error('Authorization failed for API request');
 }

 if (!response.ok) {
 throw new Error(`API request failed: ${response.status}`);
 }

 return await response.json();
 } catch (error) {
 // Log API error
 securityLogger.logSecurityEvent({
 type: 'api_request_error',
 details: { endpoint, error: error.message },
 severity: 'medium'
 });

 // Rethrow the error to be handled by the caller
 throw error;
 }
}

// Determine if a route is exempt from CSRF protection

function isCsrfExempt(endpoint: string): boolean {
 const csrfExemptPatterns = [
 '/api/webhooks/',
 '/api/public/',
 '/api/security/direct/'
 ];

 return csrfExemptPatterns.some(pattern =>
 endpoint.startsWith(pattern) ||
 endpoint.includes(pattern)
 );
}

// Get CSRF token (implementation depends on your app)

function getCsrfToken(): string | null {
 // Example implementation - adjust based on your app
 const tokenElement = document.querySelector('meta[name="csrf-token"]');
 return tokenElement ? tokenElement.getAttribute('content') : null;
}

// Get auth token (implementation depends on your auth system)

async function getAuthToken(): Promise<string> {
 // Example implementation - replace with your actual auth logic
 const token = sessionStorage.getItem('auth_token');
 if (token) {
 return token;
 }

 // If no token in storage, try to refresh
 const response = await fetch('/api/auth/refresh-token', {
 method: 'POST',
 credentials: 'include'
 });

 if (!response.ok) {
 throw new Error('Failed to refresh authentication token');
 }

 const { token: newToken } = await response.json();
 sessionStorage.setItem('auth_token', newToken);
 return newToken;
}
``` ### Pattern 2: API Security Context This pattern centralizes API security configurations to avoid repeated security logi

c.

```typescript

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

import { useSecurityContext } from '@/hooks/useSecurityContext';

// API Security Context interface

interface ApiSecurityContextValue {
 isAuthenticated: boolean;
 csrfToken: string | null;
 apiKeys: Record<string, string>;
 secureRequest: <T>(endpoint: string, options?: RequestInit) => Promise<T>;
 refreshAuth: () => Promise<boolean>;
}

// Create context with default values

const ApiSecurityContext = createContext<ApiSecurityContextValue>({
 isAuthenticated: false,
 csrfToken: null,
 apiKeys: {},
 secureRequest: async () => { throw new Error('ApiSecurityContext not initialized'); },
 refreshAuth: async () => false
});

// Provider component props

interface ApiSecurityProviderProps {
 children: ReactNode;
}

// Provider component implementation

export function ApiSecurityProvider({ children }: ApiSecurityProviderProps) {
 const { securityLogger } = useSecurityContext();
 const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
 const [csrfToken, setCsrfToken] = useState<string | null>(null);
 const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

 // Initialize security context
 useEffect(() => {
 const initApiSecurity = async () => {
 try {
 // Get initial CSRF token
 const initialCsrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
 setCsrfToken(initialCsrfToken);

 // Check authentication status
 const authResponse = await fetch('/api/auth/status', { credentials: 'include' });
 if (authResponse.ok) {
 const { authenticated } = await authResponse.json();
 setIsAuthenticated(authenticated);
 }

 // Load API keys for public services (if any)
 const publicKeysResponse = await fetch('/api/config/public-keys');
 if (publicKeysResponse.ok) {
 const keys = await publicKeysResponse.json();
 setApiKeys(keys);
 }
 } catch (error) {
 securityLogger.logSecurityEvent({
 type: 'api_security_init_error',
 details: { error: error.message },
 severity: 'high'
 });
 }
 };

 initApiSecurity();
 }, [securityLogger]);

 // Secure request implementation
 const secureRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
 const headers = new Headers(options.headers || {});

 // Add CSRF token if available and endpoint is not exempt
 if (csrfToken && !isCsrfExempt(endpoint)) {
 headers.set('X-CSRF-Token', csrfToken);
 }

 // Add authentication token if available and needed
 if (isAuthenticated && requiresAuth(endpoint)) {
 const authToken = await getAuthToken();
 if (authToken) {
 headers.set('Authorization', `Bearer ${authToken}`);
 }
 }

 try {
 const response = await fetch(endpoint, {
 ...options,
 headers,
 credentials: 'include'
 });

 // Update CSRF token if provided in response
 const newCsrfToken = response.headers.get('X-CSRF-Token');
 if (newCsrfToken) {
 setCsrfToken(newCsrfToken);
 }

 if (!response.ok) {
 throw new Error(`API request failed: ${response.status}`);
 }

 return await response.json();
 } catch (error) {
 securityLogger.logSecurityEvent({
 type: 'api_request_error',
 details: { endpoint, error: error.message },
 severity: 'medium'
 });

 throw error;
 }
 };

 // Authentication refresh function
 const refreshAuth = async (): Promise<boolean> => {
 try {
 const response = await fetch('/api/auth/refresh-token', {
 method: 'POST',
 credentials: 'include'
 });

 if (response.ok) {
 setIsAuthenticated(true);
 return true;
 } else {
 setIsAuthenticated(false);
 return false;
 }
 } catch (error) {
 securityLogger.logSecurityEvent({
 type: 'auth_refresh_error',
 details: { error: error.message },
 severity: 'high'
 });
 setIsAuthenticated(false);
 return false;
 }
 };

 const contextValue: ApiSecurityContextValue = {
 isAuthenticated,
 csrfToken,
 apiKeys,
 secureRequest,
 refreshAuth
 };

 return (
 <ApiSecurityContext.Provider value={contextValue}>
 {children}
 </ApiSecurityContext.Provider>
 );
}

// Helper function to check if an endpoint requires authentication

function requiresAuth(endpoint: string): boolean {
 const publicEndpoints = [
 '/api/public/',
 '/api/security/direct/',
 '/api/health'
 ];

 return !publicEndpoints.some(pattern =>
 endpoint.startsWith(pattern) ||
 endpoint.includes(pattern)
 );
}

// Helper function to check if an endpoint is exempt from CSRF protection

function isCsrfExempt(endpoint: string): boolean {
 const csrfExemptPatterns = [
 '/api/webhooks/',
 '/api/public/',
 '/api/security/direct/'
 ];

 return csrfExemptPatterns.some(pattern =>
 endpoint.startsWith(pattern) ||
 endpoint.includes(pattern)
 );
}

// Hook to use the API security context

export function useApiSecurity() {
 return useContext(ApiSecurityContext);
}
```

## Rate Limiting Management Proper handling of rate limits is crucial to maintain API stabilit

y:

```typescript

import { useSecurityContext } from '@/hooks/useSecurityContext';

// Rate limit handling with exponential backoff

async function fetchWithRateLimitHandling<T>(
 url: string,
 options: RequestInit = {},
 maxRetries: number = 3
): Promise<T> {
 const { securityLogger } = useSecurityContext();
 let retries = 0;

 while (retries <= maxRetries) {
 try {
 const response = await fetch(url, options);

 // Check rate limit headers
 const remainingRequests = parseInt(response.headers.get('X-RateLimit-Remaining') || '1', 10);
 const resetTime = parseInt(response.headers.get('X-RateLimit-Reset') || '0', 10);

 // Log if we're close to hitting rate limits
 if (remainingRequests <= 5) {
 securityLogger.logSecurityEvent({
 type: 'api_rate_limit_warning',
 details: {
 url,
 remainingRequests,
 resetTime: new Date(resetTime * 1000).toISOString()
 },
 severity: 'medium'
 });
 }

 // Check if we hit a rate limit
 if (response.status === 429) {
 const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
 const waitTime = retryAfter * 1000;

 securityLogger.logSecurityEvent({
 type: 'api_rate_limit_exceeded',
 details: {
 url,
 retryAfter,
 retryCount: retries
 },
 severity: 'medium'
 });

 // Wait before retrying
 await new Promise(resolve => setTimeout(resolve, waitTime));
 retries++;
 continue;
 }

 // For other errors, don't retry
 if (!response.ok) {
 throw new Error(`API request failed: ${response.status}`);
 }

 return await response.json();
 } catch (error) {
 // For network errors, retry with exponential backoff
 if (error instanceof TypeError && error.message.includes('network')) {
 const backoffTime = Math.pow(2, retries) * 1000 + Math.random() * 1000;

 securityLogger.logSecurityEvent({
 type: 'api_network_error',
 details: {
 url,
 error: error.message,
 retryCount: retries,
 backoffTime
 },
 severity: 'medium'
 });

 await new Promise(resolve => setTimeout(resolve, backoffTime));
 retries++;
 } else {
 // For other errors, don't retry
 throw error;
 }
 }
 }

 throw new Error(`Failed after ${maxRetries} retries`);
}
```

## API Key Security Secure handling of API keys is essential for maintaining securit

y:

```typescript

import { useSecurityContext } from '@/hooks/useSecurityContext';

// API key management

class ApiKeyManager {
 private static instance: ApiKeyManager;
 private apiKeys: Map<string, string> = new Map();
 private securityLogger: any;

 private constructor() {
 // Private constructor to force singleton pattern
 }

 // Get singleton instance
 public static getInstance(): ApiKeyManager {
 if (!ApiKeyManager.instance) {
 ApiKeyManager.instance = new ApiKeyManager();
 }
 return ApiKeyManager.instance;
 }

 // Initialize with security logger
 public initialize(securityLogger: any): void {
 this.securityLogger = securityLogger;
 }

 // Set API key
 public setKey(service: string, key: string): void {
 // Always validate key format before storing
 if (!this.isValidKeyFormat(service, key)) {
 this.securityLogger?.logSecurityEvent({
 type: 'invalid_api_key_format',
 details: { service },
 severity: 'high'
 });
 throw new Error(`Invalid API key format for ${service}`);
 }

 this.apiKeys.set(service, key);

 this.securityLogger?.logSecurityEvent({
 type: 'api_key_stored',
 details: { service },
 severity: 'info'
 });
 }

 // Get API key
 public getKey(service: string): string | null {
 const key = this.apiKeys.get(service);

 if (!key) {
 this.securityLogger?.logSecurityEvent({
 type: 'api_key_missing',
 details: { service },
 severity: 'medium'
 });
 return null;
 }

 return key;
 }

 // Check if API key is available
 public hasKey(service: string): boolean {
 return this.apiKeys.has(service);
 }

 // Validate key format (customize for specific services)
 private isValidKeyFormat(service: string, key: string): boolean {
 // Default validation - key must be non-empty
 if (!key || typeof key !== 'string' || key.trim() === '') {
 return false;
 }

 // Service-specific validation
 switch (service) {
 case 'openai':
 return /^sk-[a-zA-Z0-9]{32,}$/.test(key);
 case 'stripe':
 return /^sk_[a-zA-Z0-9]{24,}$/.test(key);
 default:
 // Generic validation for other services
 return key.length >= 16;
 }
 }
}

// Component to securely use API keys

function SecureApiComponent() {
 const { securityLogger } = useSecurityContext();
 const apiKeyManager = ApiKeyManager.getInstance();
 apiKeyManager.initialize(securityLogger);

 const callSecureApi = async () => {
 try {
 // Get API key for service
 const apiKey = apiKeyManager.getKey('example-service');

 if (!apiKey) {
 // Handle missing API key gracefully
 throw new Error('API key not available');
 }

 // Make authenticated API call
 const response = await fetch('https://api.example.com/data', {
 headers: {
 'Authorization': `Bearer ${apiKey}`,
 'Content-Type': 'application/json'
 }
 });

 if (!response.ok) {
 throw new Error(`API request failed: ${response.status}`);
 }

 return await response.json();
 } catch (error) {
 securityLogger.logSecurityEvent({
 type: 'secure_api_error',
 details: { error: error.message },
 severity: 'medium'
 });

 // Provide fallback or error handling
 return null;
 }
 };

 return (
 // Component implementation
 );
}
```

## Security Headers & CORS Always include proper security headers in API request

s:

```typescript

// Function to add security headers to fetch requests

function secureRequest(url: string, options: RequestInit = {}): Promise<Response> {
 const headers = new Headers(options.headers || {});

 // Add security headers
 headers.set('X-Content-Type-Options', 'nosniff');
 headers.set('X-Frame-Options', 'DENY');
 headers.set('X-XSS-Protection', '1; mode=block');

 // Merge with existing options
 const secureOptions: RequestInit = {
 ...options,
 headers,
 credentials: 'same-origin', // Include cookies for same-origin requests
 mode: 'cors', // Ensure CORS is respected
 cache: options.cache || 'no-store' // Default to no-store for security-sensitive requests
 };

 return fetch(url, secureOptions);
}
```

## API Error Handling Properly handle API errors to maintain security and user experienc

e:

```typescript

import { useSecurityContext } from '@/hooks/useSecurityContext';

// Enhanced API error handling

interface ApiError {
 status: number;
 message: string;
 code?: string;
 securityImpact?: 'none' | 'low' | 'medium' | 'high';
}

// API response handler with security awareness

async function handleApiResponse<T>(response: Response): Promise<T> {
 const { securityLogger } = useSecurityContext();

 // Check for security-related headers
 const securityHeaders = {
 contentSecurityPolicy: response.headers.get('Content-Security-Policy'),
 xContentTypeOptions: response.headers.get('X-Content-Type-Options'),
 xFrameOptions: response.headers.get('X-Frame-Options')
 };

 // Check missing security headers
 const missingHeaders = Object.entries(securityHeaders)
 .filter(([_, value]) => !value)
 .map(([key, _]) => key);

 if (missingHeaders.length > 0) {
 securityLogger.logSecurityEvent({
 type: 'missing_security_headers',
 details: { missingHeaders, url: response.url },
 severity: 'medium'
 });
 }

 // Handle different response status codes
 if (!response.ok) {
 let errorData: ApiError = {
 status: response.status,
 message: 'An error occurred',
 securityImpact: 'none'
 };

 try {
 // Try to parse error response
 const data = await response.json();
 errorData = { ...errorData, ...data };
 } catch (e) {
 // If response is not JSON, use status text
 errorData.message = response.statusText || errorData.message;
 }

 // Determine security impact based on status code
 switch (response.status) {
 case 401: // Unauthorized
 case 403: // Forbidden
 errorData.securityImpact = 'medium';
 break;
 case 429: // Too Many Requests
 errorData.securityImpact = 'low';
 break;
 case 500: // Server Error
 case 502: // Bad Gateway
 case 503: // Service Unavailable
 case 504: // Gateway Timeout
 errorData.securityImpact = 'medium';
 break;
 }

 // Log security-related errors
 if (errorData.securityImpact !== 'none') {
 securityLogger.logSecurityEvent({
 type: 'api_security_error',
 details: {
 status: errorData.status,
 message: errorData.message,
 code: errorData.code,
 url: response.url
 },
 severity: errorData.securityImpact
 });
 }

 throw errorData;
 }

 // Parse successful response
 return await response.json();
}
```

## OpenAI API Integration When integrating with OpenAI's API, follow these security practice

s:

```typescript

import OpenAI from 'openai';

import { useSecurityContext } from '@/hooks/useSecurityContext';

import { useApiSecurity } from './useApiSecurity';

// Secure OpenAI integration component

function SecureOpenAIComponent() {
 const { securityLogger } = useSecurityContext();
 const { apiKeys } = useApiSecurity();
 const [result, setResult] = useState(null);
 const [error, setError] = useState(null);
 const [loading, setLoading] = useState(false);

 const callOpenAI = async (prompt: string) => {
 setLoading(true);
 setError(null);

 try {
 // Validate input for security
 if (!prompt || prompt.trim().length < 3) {
 throw new Error('Invalid prompt');
 }

 // Check for API key
 const apiKey = apiKeys['openai'] || process.env.OPENAI_API_KEY;

 if (!apiKey) {
 securityLogger.logSecurityEvent({
 type: 'missing_api_key',
 details: { service: 'OpenAI' },
 severity: 'high'
 });
 throw new Error('OpenAI API key not available');
 }

 // Create OpenAI instance
 const openai = new OpenAI({ apiKey });

 // Log the API call (without sensitive data)
 securityLogger.logSecurityEvent({
 type: 'openai_api_call',
 details: {
 promptLength: prompt.length,
 model: 'gpt-4o'
 },
 severity: 'info'
 });

 // Make the API call with proper error handling
 const completion = await openai.chat.completions.create({
 model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
 messages: [{ role: "user", content: prompt }],
 max_tokens: 500,
 });

 // Process the result
 setResult(completion.choices[0].message.content);
 } catch (error) {
 // Handle and log errors
 securityLogger.logSecurityEvent({
 type: 'openai_api_error',
 details: { error: error.message },
 severity: 'medium'
 });

 setError(error.message || 'Error calling OpenAI API');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div>
 {/* Component UI */}
 {loading && <div>Loading...</div>}
 {error && <div className="error">{error}</div>}
 {result && <div className="result">{result}</div>}
 </div>
 );
}
```

## Integration Checklist Before integrating with any API, ensure: - [ ] Authentication mechanism is properly implemented with fallback s - [ ] CSRF tokens are included where necessar y - [ ] Rate limiting is handled gracefully with exponential backof

f

- [ ] API keys are stored and managed securely
- [ ] Security-relevant events are logged
- [ ] Proper error handling with security context
- [ ] API responses are validated before use
- [ ] Security headers are included in requests
- [ ] Fallback mechanisms exist for API failures

## See Also - [Agent Security Integration Guid](AGENT_SECURITY_INTEGRATION_GUIDE.md) - 33% matc h - [Comprehensive Security System Guide for Replit Agen](AGENT_SECURITY_SYSTEM_MASTER_GUIDE.md) - 33% matc

h

- [Agent Security Integration Guid](AGENT_SECURITY_INTEGRATION_GUIDE_FIXED.md) - 25% match
- [API Endpoints Documentation](API_ENDPOINTS.md) - 25% match
- [OpenAI API Integration Guid](OPENAI_API_INTEGRATION_GUIDE.md) - 25% match