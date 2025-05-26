# Security Testing Patte

r

n s testing patterns for security components to ensure robust, resilient security implementation.

## Core Security Testing Principles 1. **Test Failure States First**: Always test how components behave when security systems fail before testing normal operatio n 2. **Verify Graceful Degradation**: Ensure components provide reduced functionality rather than complete failure 3. **Test Circular Dependencies**: Verify that components don't create circular dependencies that can deadlock 4. **Validate Fallback Mechanisms**: Confirm that fallback data is used when primary data sources are unavailable 5. **Test Security Bypasses**: Verify that security bypass configurations work as expecte

d

## Component Testing Patterns ### Security Dashboard Testing When testing security dashboards and monitoring tool

s:

```typescript

import { render, screen, waitFor } from '@testing-library/react';

import { SecurityDashboard } from './SecurityDashboard';

import { rest, server } from '../mocks/server';

describe('SecurityDashboard', () => {
 test('loads and displays security features', async () => {
 render(<SecurityDashboard />);

 // Check loading state appears first
 expect(screen.getByText('Loading security dashboard...')).toBeInTheDocument();

 // Wait for data to load
 await waitFor(() => {
 expect(screen.getByText('Security Features')).toBeInTheDocument();
 });

 // Verify specific data elements
 expect(screen.getByText('CSRF Protection')).toBeInTheDocument();
 expect(screen.getByText('Rate Limiting')).toBeInTheDocument();
 });

 test('shows fallback data when API fails', async () => {
 // Mock API failure
 server.use(
 rest.get('/api/security/direct/features', (req, res, ctx) => {
 return res(ctx.status(500));
 })
 );

 render(<SecurityDashboard />);

 // Wait for loading to complete
 await waitFor(() => {
 expect(screen.queryByText('Loading security dashboard...')).not.toBeInTheDocument();
 });

 // Verify fallback notification is shown
 expect(screen.getByText(/using fallback security data/i)).toBeInTheDocument();

 // Verify fallback data is displayed
 expect(screen.getByText('CSRF Protection')).toBeInTheDocument();
 });

 test('works without authentication', async () => {
 // Mock authentication as failed/unavailable
 jest.spyOn(window, 'fetch').mockImplementation(async (url) => {
 if (url.toString().includes('/auth/')) {
 return { ok: false, status: 401 } as Response;
 }

 // Allow direct security endpoints to work
 if (url.toString().includes('/api/security/direct/')) {
 return {
 ok: true,
 status: 200,
 json: async () => ({
 success: true,
 data: [{ id: 1, name: 'CSRF Protection', enabled: true }]
 })
 } as Response;
 }

 return { ok: false, status: 404 } as Response;
 });

 render(<SecurityDashboard />);

 // Verify dashboard still loads properly
 await waitFor(() => {
 expect(screen.getByText('CSRF Protection')).toBeInTheDocument();
 });
 });
});
``` ### Security Context Testing When testing the Security Context patter

n:

```typescript

import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { SecurityContextProvider, useSecurityContext } from './SecurityContext';

// Test component that uses the security context

const TestComponent = () => {
 const { isAllowedDomain, securityLogger } = useSecurityContext();

 const checkDomain = () => {
 const result = isAllowedDomain('example.com');
 securityLogger.logSecurityEvent({
 type: 'domain_check',
 details: { domain: 'example.com', result },
 severity: 'info'
 });
 return result;
 };

 return (
 <div>
 <div data-testid="allowed-domain">
 {isAllowedDomain('example.com') ? 'Allowed' : 'Blocked'}
 </div>
 <button onClick={checkDomain}>Check Domain</button>
 </div>
 );
};

describe('SecurityContext', () => {
 test('provides context values to components', () => {
 render(
 <SecurityContextProvider>
 <TestComponent />
 </SecurityContextProvider>
 );

 // Check that domain validation works
 expect(screen.getByTestId('allowed-domain')).toHaveTextContent('Blocked');
 });

 test('allows custom security configuration', () => {
 render(
 <SecurityContextProvider
 config={{
 embeddedContent: {
 allowedDomains: ['example.com']
 }
 }}
 >
 <TestComponent />
 </SecurityContextProvider>
 );

 // Check that custom domain allowlist works
 expect(screen.getByTestId('allowed-domain')).toHaveTextContent('Allowed');
 });

 test('logs security events correctly', async () => {
 const mockLogger = {
 logSecurityEvent: jest.fn(),
 getRecentEvents: jest.fn().mockReturnValue([])
 };

 render(
 <SecurityContextProvider logger={mockLogger}>
 <TestComponent />
 </SecurityContextProvider>
 );

 // Trigger an event
 await userEvent.click(screen.getByText('Check Domain'));

 // Verify logger was called with correct event
 expect(mockLogger.logSecurityEvent).toHaveBeenCalledWith(
 expect.objectContaining({
 type: 'domain_check',
 details: { domain: 'example.com', result: false },
 severity: 'info'
 })
 );
 });
});
``` ### Security Bypass Testing When testing security bypass configuration

s:

```typescript

import { isAuthExempt, isCsrfExempt, getRateLimitOverride } from './security-bypasses';

describe('Security Bypasses', () => {
 test('identifies auth exempt routes correctly', () => {
 // Test exact match
 expect(isAuthExempt('/api/health')).toBe(true);

 // Test wildcard match
 expect(isAuthExempt('/api/public/data')).toBe(true);
 expect(isAuthExempt('/api/security/direct/features')).toBe(true);

 // Test non-exempt routes
 expect(isAuthExempt('/api/protected/data')).toBe(false);
 });

 test('identifies CSRF exempt routes correctly', () => {
 expect(isCsrfExempt('/api/webhooks/github')).toBe(true);
 expect(isCsrfExempt('/api/public/data')).toBe(true);
 expect(isCsrfExempt('/api/security/direct/events')).toBe(true);

 expect(isCsrfExempt('/api/user/profile')).toBe(false);
 });

 test('retrieves correct rate limit overrides', () => {
 expect(getRateLimitOverride('/api/high-volume/data')).toEqual({
 points: 100,
 duration: 60
 });

 expect(getRateLimitOverride('/api/admin/users')).toEqual({
 points: 1000,
 duration: 60
 });

 expect(getRateLimitOverride('/api/security/direct/stats')).toEqual({
 points: 500,
 duration: 60
 });

 // Should return null for routes with no override
 expect(getRateLimitOverride('/api/user/profile')).toBeNull();
 });
});
```

## Testing for Circular Dependencies Circular dependencies can be difficult to detect through normal testing. Use these specialized techniques to identify potential circular dependencies: ### Static Analysis Use tools like `madge` to visualize and detect circular dependencie

s:

```bash

npx madge --circular --extension ts ./src
``` ### Runtime Dependency Tracking Create a specialized test that tracks dependency initialization orde

r:

```typescript

describe('Security System Initialization', () => {
 test('initializes without circular dependencies', () => {
 const initOrder: string[] = [];

 // Mock component initialization
 jest.spyOn(AuthService, 'initialize').mockImplementation(() => {
 initOrder.push('auth');
 return Promise.resolve();
 });

 jest.spyOn(SecurityApiClient, 'initialize').mockImplementation(() => {
 initOrder.push('api');
 return Promise.resolve();
 });

 jest.spyOn(SecurityDashboard, 'initialize').mockImplementation(() => {
 initOrder.push('dashboard');
 return Promise.resolve();
 });

 // Initialize the system
 return initializeSecuritySystem().then(() => {
 // Check for proper init order to avoid circular dependencies
 expect(initOrder.indexOf('api')).toBeLessThan(initOrder.indexOf('auth'));
 expect(initOrder.indexOf('auth')).toBeLessThan(initOrder.indexOf('dashboard'));
 });
 });
});
```

## Testing Fallback Mechanisms To thoroughly test fallback mechanisms: ### Data Source Switching Test

s

```typescript

describe('Security Feature Fallbacks', () => {
 test('switches to fallback data when API fails', async () => {
 // Mock API to initially succeed then fail
 const mockFetch = jest.fn()
 .mockImplementationOnce(() => Promise.resolve({
 ok: true,
 json: () => Promise.resolve({
 success: true,
 data: [{ id: 1, name: 'Live Feature', enabled: true }]
 })
 }))
 .mockImplementationOnce(() => Promise.reject(new Error('Network error')));

 global.fetch = mockFetch;

 const { rerender } = render(<SecurityFeatureList />);

 // Check that live data is displayed
 await waitFor(() => {
 expect(screen.getByText('Live Feature')).toBeInTheDocument();
 });

 // Force a refresh to trigger the API failure
 rerender(<SecurityFeatureList key="refresh" />);

 // Verify fallback data is shown with indicator
 await waitFor(() => {
 expect(screen.getByText('Using fallback data')).toBeInTheDocument();
 expect(screen.getByText('CSRF Protection')).toBeInTheDocument();
 });
 });

 test('indicates partial fallback when some APIs fail', async () => {
 // Mock multiple APIs with mixed results
 server.use(
 rest.get('/api/security/direct/features', (req, res, ctx) => {
 return res(ctx.json({
 success: true,
 data: [{ id: 1, name: 'Live Feature', enabled: true }]
 }));
 }),

 rest.get('/api/security/direct/events', (req, res, ctx) => {
 return res(ctx.status(500));
 }),

 rest.get('/api/security/direct/stats', (req, res, ctx) => {
 return res(ctx.json({
 success: true,
 data: { securityScore: 85 }
 }));
 })
 );

 render(<SecurityDashboard />);

 // Wait for loading to complete
 await waitFor(() => {
 expect(screen.queryByText('Loading')).not.toBeInTheDocument();
 });

 // Verify live data is shown for features
 expect(screen.getByText('Live Feature')).toBeInTheDocument();

 // Switch to events tab
 userEvent.click(screen.getByText('Security Events'));

 // Verify fallback data is shown for events
 expect(screen.getByText('Using fallback data for events')).toBeInTheDocument();
 });
});
``` ### State Restoration Test

s

```typescript

describe('State Restoration', () => {
 test('restores normal operation when API becomes available again', async () => {
 // Mock API to fail then succeed
 let apiAvailable = false;

 server.use(
 rest.get('/api/security/direct/features', (req, res, ctx) => {
 if (!apiAvailable) {
 return res(ctx.status(500));
 }

 return res(ctx.json({
 success: true,
 data: [{ id: 1, name: 'Restored Feature', enabled: true }]
 }));
 })
 );

 render(<SecurityFeatureList refreshInterval={100} />);

 // Verify fallback data is initially shown
 await waitFor(() => {
 expect(screen.getByText('Using fallback data')).toBeInTheDocument();
 });

 // Make API available
 apiAvailable = true;

 // Wait for refresh to happen
 await waitFor(
 () => {
 expect(screen.queryByText('Using fallback data')).not.toBeInTheDocument();
 expect(screen.getByText('Restored Feature')).toBeInTheDocument();
 },
 { timeout: 1000 }
 );
 });
});
```

## Testing Server-Side Security Bypasses When testing server-side security bypass configuration

s:

```typescript

import request from 'supertest';

import app from './app';

describe('Security API Routes', () => {
 test('direct security endpoints work without authentication', async () => {
 const response = await request(app)
 .get('/api/security/direct/features')
 .expect(200);

 expect(response.body.success).toBe(true);
 expect(response.body.data).toBeDefined();
 });

 test('direct security endpoints bypass CSRF protection', async () => {
 // No CSRF token provided
 const response = await request(app)
 .post('/api/security/direct/test-action')
 .send({ action: 'test' })
 .expect(200);

 expect(response.body.success).toBe(true);
 });

 test('protected security endpoints require authentication', async () => {
 const response = await request(app)
 .get('/api/security/protected/admin-features')
 .expect(401); // Should be unauthorized

 expect(response.body.success).toBe(false);
 });

 test('security dashboard page serves without authentication', async () => {
 const response = await request(app)
 .get('/security-dashboard')
 .expect(200);

 expect(response.text).toContain('Security Dashboard');
 });
});
```

## E2E Testing Security Integration Create full end-to-end tests that verify the entire security system works togethe

r:

```typescript

describe('Security System E2E', () => {
 test('security dashboard remains accessible when authentication fails', async () => {
 // Break authentication system
 await page.evaluate(() => {
 localStorage.clear();
 sessionStorage.clear();
 document.cookie.split(';').forEach(cookie => {
 const [name] = cookie.split('=');
 document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
 });
 });

 // Try to access security dashboard
 await page.goto('/security-dashboard');

 // Verify it loads with fallback data
 await page.waitForSelector('[data-testid="security-dashboard"]');

 // Check for fallback indicator
 const fallbackText = await page.$eval('[data-testid="fallback-indicator"]', el => el.textContent);
 expect(fallbackText).toContain('Using fallback security data');

 // Verify critical features exist
 await expect(page).toMatchElement('h2', { text: 'Security Features' });
 });

 test('system functions when security components fail progressively', async () => {
 // Mock progressive security system failures
 await page.evaluate(() => {
 // Mock failing components
 window.__testHooks = {
 failComponent: (name) => {
 window.__failedComponents = window.__failedComponents || {};
 window.__failedComponents[name] = true;
 }
 };
 });

 // Load security dashboard
 await page.goto('/security-dashboard');
 await page.waitForSelector('[data-testid="security-dashboard"]');

 // Verify dashboard initially works
 await expect(page).toMatchElement('[data-testid="security-score"]');

 // Make API client fail
 await page.evaluate(() => window.__testHooks.failComponent('apiClient'));

 // Verify dashboard adapts to API failure
 await page.waitForSelector('[data-testid="fallback-indicator"]');

 // Verify critical features still function
 await expect(page).toMatchElement('button', { text: 'Run Security Scan' });

 // Click the button and verify it handles the failure gracefully
 await page.click('button:text("Run Security Scan")');
 await expect(page).toMatchElement('[data-testid="error-message"]', {
 text: 'Cannot run scan: API unavailable'
 });
 });
});
```

## Security Vulnerability Simulation Testing To ensure security components properly detect and respond to security incident

s:

```typescript

describe('Security Incident Detection', () => {
 test('detects and responds to authentication attacks', async () => {
 // Simulate brute force attack
 for (let i = 0; i < 10; i++) {
 await request(app)
 .post('/api/auth/login')
 .send({ username: 'admin', password: `wrong-password-${i}` });
 }

 // Check security dashboard for alerts
 const response = await request(app)
 .get('/api/security/direct/events');

 // Verify brute force detection
 expect(response.body.data.some(event =>
 event.type === 'brute_force_attempt' &&
 event.details.username === 'admin'
 )).toBe(true);

 // Verify account lockout
 const loginResponse = await request(app)
 .post('/api/auth/login')
 .send({ username: 'admin', password: 'correct-password' });

 expect(loginResponse.status).toBe(403);
 expect(loginResponse.body.error).toContain('account locked');
 });

 test('detects and blocks suspicious API patterns', async () => {
 // Simulate API abuse pattern
 const promises = Array(50).fill(0).map(() =>
 request(app).get('/api/users/123')
 );

 await Promise.all(promises);

 // Verify rate limiting kicked in
 const response = await request(app)
 .get('/api/users/123');

 expect(response.status).toBe(429); // Too many requests

 // Verify event was logged
 const eventsResponse = await request(app)
 .get('/api/security/direct/events');

 expect(eventsResponse.body.data.some(event =>
 event.type === 'rate_limit_exceeded'
 )).toBe(true);
 });
});
```

## Common Testing Pitfalls to Avoid 1. **Testing only happy paths**: Always test failure modes first, then success case s 2. **Ignoring circular dependencies**: Be vigilant about direct and indirect circular dependencies 3. **Insufficient fallback testing**: Test all fallback scenarios, not just complete API failure 4. **Missing integration tests**: Component tests alone are insufficient for security testing 5. **Disabling security for tests**: Test with security enabled to catch integration issue

s

## Testing Security Dashboard Integration When testing security dashboard integration specificall

y:

```typescript

describe('Security Dashboard Integration', () => {
 beforeEach(() => {
 // Reset mock counters
 jest.clearAllMocks();
 });

 test('can access security features without authentication', async () => {
 // Mock authentication as failed
 jest.spyOn(AuthService, 'isAuthenticated').mockReturnValue(false);

 render(<SecurityDashboard />);

 // Verify dashboard loads successfully
 await waitFor(() => {
 expect(screen.getByText('Security Features')).toBeInTheDocument();
 });

 // Verify the right API endpoints were called
 expect(fetch).toHaveBeenCalledWith('/api/security/direct/features', expect.anything());
 expect(fetch).not.toHaveBeenCalledWith('/api/security/protected/features', expect.anything());
 });

 test('adapts interface based on authentication state', async () => {
 // Mock as unauthenticated initially
 let isAuthenticated = false;
 jest.spyOn(AuthService, 'isAuthenticated').mockImplementation(() => isAuthenticated);

 const { rerender } = render(<SecurityDashboard />);

 // Verify limited interface for unauthenticated users
 await waitFor(() => {
 expect(screen.queryByText('Run Security Scan')).not.toBeInTheDocument();
 expect(screen.getByText('Security Features')).toBeInTheDocument();
 });

 // Change to authenticated
 isAuthenticated = true;

 // Re-render component
 rerender(<SecurityDashboard key="rerender" />);

 // Verify full interface for authenticated users
 await waitFor(() => {
 expect(screen.getByText('Run Security Scan')).toBeInTheDocument();
 });
 });

 test('correctly switches between direct and protected endpoints', async () => {
 // Mock authentication state
 let isAuthenticated = false;
 jest.spyOn(AuthService, 'isAuthenticated').mockImplementation(() => isAuthenticated);

 // Mock fetch to track which endpoints are called
 const fetchMock = jest.fn().mockImplementation((url) => {
 return Promise.resolve({
 ok: true,
 json: () => Promise.resolve({
 success: true,
 data: url.includes('direct')
 ? [{ id: 1, name: 'Basic Feature', enabled: true }]
 : [{ id: 1, name: 'Basic Feature', enabled: true }, { id: 2, name: 'Advanced Feature', enabled: true }]
 })
 });
 });
 global.fetch = fetchMock;

 const { rerender } = render(<SecurityDashboard />);

 // Verify unauthenticated state uses direct endpoints
 await waitFor(() => {
 expect(fetchMock).toHaveBeenCalledWith('/api/security/direct/features', expect.anything());
 expect(screen.getByText('Basic Feature')).toBeInTheDocument();
 });

 fetchMock.mockClear();

 // Change to authenticated
 isAuthenticated = true;

 // Re-render component
 rerender(<SecurityDashboard key="rerender" />);

 // Verify authenticated state uses protected endpoints with more data
 await waitFor(() => {
 expect(fetchMock).toHaveBeenCalledWith('/api/security/protected/features', expect.anything());
 expect(screen.getByText('Basic Feature')).toBeInTheDocument();
 expect(screen.getByText('Advanced Feature')).toBeInTheDocument();
 });
 });
});
``` By following these testing patterns, you can ensure that your security components function correctly under all conditions, providing resilient security that gracefully handles failures and avoids circular dependencies.

## See Also - [Agent Security Integration Guid](AGENT_SECURITY_INTEGRATION_GUIDE.md) - 33% matc h - [API Security Integration Guid](API_SECURITY_INTEGRATION_TEMPLATE.md) - 25% matc

h

- [Integration Guide](INTEGRATION_GUIDE.md) - 25% match
- [Security Implementation Phase](SECURITY_IMPLEMENTATION_PHASES.md) - 25% match
- [Security Integration Anti-Patterns and Best Practice](SECURITY_INTEGRATION_ANTIPATTERNS.md) - 25% match