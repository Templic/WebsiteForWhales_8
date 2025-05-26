# Troubleshooting Guide ## Overview This guide provides comprehensive solutions for common issues encountered in the security management platform. It consolidates troubleshooting information from multiple documentation files into a single, easy-to-reference resource. ## Table of Contents 1. [Server Issues](#server-issue

s)

2. [Database Issues](#database-issues) 3. [Authentication Issues](#authentication-issues) 4. [CSRF Protection Issues](#csrf-protection-issues) 5. [Rate Limiting Issues](#rate-limiting-issues) 6. [Frontend Issues](#frontend-issues) 7. [TypeScript Errors](#typescript-errors) 8. [Performance Issues](#performance-issues) 9. [Deployment Issues](#deployment-issues) 10. [Diagnostic Tools](#diagnostic-tools) ## Server Issues ### Server Won't Start **Symptoms:** - Server fails to star

t

- Error messages in console **Possible Causes and Solutions:** 1. **Port Already in Use**

```

 Error: listen EADDRINUSE: address already in use :::3000

``` **Solution:** - Check for processes using the port:

```bash
 lsof -i :3000

``` - Kill the process:

```bash
 kill -9 <PID>

``` - Or configure the server to use a different port:

```bash
 PORT=3001 npm run dev

``` 2. **Missing Dependencies**

```

 Cannot find module 'some-package'

``` **Solution:** - Install missing dependencies:

```bash
 npm install

``` - If specific package is missing:

```bash
 npm install some-package

``` 3. **TypeScript Compilation Errors**

```

 TypeScript error: Cannot find module...

``` **Solution:** - Run the TypeScript error fixing system:

```bash
 npx ts-node run-typescript-error-system.ts

``` - Check `tsconfig.json` for correct configuration - See [TypeScript Errors](#typescript-errors) section for more details 4. **Environment Configuration**

```

 Error: Environment variable DATABASE_URL is required

``` **Solution:** - Check that all required environment variables are set in `.env` - Create a `.env` file in the project root if it doesn't exist - Compare with `.env.example` for required variables ### Server Crashes **Symptom

s:**
- Server stops unexpectedly
- Out of memory errors
- Unhandled exceptions **Possible Causes and Solutions:** 1. **Memory Leaks**

```

 <--- Last few GCs --->
 [95812:0x3321eb0] 51880264 ms: Mark-sweep 2035.5 (2101.8) -> 2027.4 (2089.8) MB

``` **Solution:** - Check for memory leaks using Node.js memory profiling:

```bash
 node --inspect server/index.ts

``` - Use Chrome DevTools to analyze memory usage - Look for patterns of increasing memory usage 2. **Unhandled Promise Rejections**

```

 UnhandledPromiseRejectionWarning: Unhandled promise rejection

``` **Solution:** - Add proper error handling to all promises - Implement a global unhandled rejection handler:

```javascript
 process.on('unhandledRejection', (reason, promise) => {
 console.error('Unhandled Rejection at:', promise, 'reason:', reason);
 });

``` 3. **Database Connection Issues**

```

 Error: Connection terminated unexpectedly

``` **Solution:** - Check database connection status - Implement connection retry logic - See [Database Issues](#database-issues) section for more details ## Database Issues ### Connection Failures **Symptom

s:**
- Server cannot connect to database
- Database-related errors **Possible Causes and Solutions:** 1. **Invalid Connection String**

```

 Error: Invalid connection string

``` **Solution:** - Check `DATABASE_URL` environment variable - Verify connection string format:

```

 postgresql://username:password@hostname:port/database

``` - Test connection manually:

```bash
 psql "$DATABASE_URL"

``` 2. **Postgres Not Running**

```

 Error: Could not connect to server: Connection refused

``` **Solution:** - Check if PostgreSQL is running:

```bash
 pg_isready

``` - Start PostgreSQL if it's not running:

```bash
 # For systemd-based system

s
 sudo systemctl start postgresql

 # For MacO

S
 brew services start postgresql

``` 3. **Network Issues**

```

 Error: connect ETIMEDOUT

``` **Solution:** - Check network connectivity to the database host - Verify firewall rules allow database connections - Test with a simpler tool like `ping` or `telnet` ### Schema Migration Issues **Symptom

s:**
- Errors during schema migration
- Tables not created correctly **Possible Causes and Solutions:** 1. **Migration Conflicts**

```

 Error: Relation "users" already exists

``` **Solution:** - Check if tables already exist before creating - Use `IF NOT EXISTS` in CREATE TABLE statements - For Drizzle ORM, use the `drizzle-kit push` command:

```bash
 npx drizzle-kit push

``` 2. **Permission Issues**

```

 Error: permission denied for schema public

``` **Solution:** - Check database user permissions - Grant necessary permissions to the database user:

```sql
 GRANT ALL PRIVILEGES ON DATABASE database_name TO username;

``` 3. **Incompatible Schema Changes**

```

 Error: Cannot add a NOT NULL column with no default value

``` **Solution:** - Add a default value to not-null columns - Split migration into multiple steps: 1. Add column allowing NULL 2. Update data 3. Alter column to NOT NULL ### Query Performance Issues **Symptom

s:**
- Slow database queries
- Increasing response times **Possible Causes and Solutions:** 1. **Missing Indexes**

```

 Seq Scan on users (cost=0.00..155.00 rows=10000)

``` **Solution:** - Add indexes to frequently queried columns:

```sql
 CREATE INDEX idx_users_email ON users(email);

``` - For Drizzle ORM, add indexes in the schema definition:

```typescript
 export const users = pgTable('users', {
 // columns here
 }, (table) => {
 return {
 emailIdx: index('email_idx').on(table.email),
 };
 });

``` 2. **Inefficient Queries**

```

 Nested Loop Join (cost=0.00..10000.00 rows=10000)

``` **Solution:** - Optimize query patterns - Use appropriate JOIN types - Consider using query builder functions:

```typescript
 await db.select()
 .from(users)
 .leftJoin(orders, eq(users.id, orders.userId))
 .where(eq(users.email, 'test@example.com'));

``` 3. **Large Result Sets**

```

 Error: Query result exceeds the maximum allowed size

``` **Solution:** - Implement pagination:

```typescript
 await db.select()
 .from(users)
 .limit(20)
 .offset((page - 1) * 20);

``` - Use selective queries to return only needed data ## Authentication Issues ### Login Failures **Symptom

s:**
- Users cannot log in
- Authentication errors **Possible Causes and Solutions:** 1. **Invalid Credentials**

```

 Error: Invalid email or password

``` **Solution:** - Verify user credentials in the database - Add detailed logging for authentication attempts - Implement a password reset feature 2. **Session Issues**

```

 Error: Failed to save session

``` **Solution:** - Check session storage configuration - Verify session middleware is correctly configured:

```javascript
 app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: false,
 cookie: {
 secure: process.env.NODE_ENV === 'production',
 httpOnly: true,
 maxAge: 24 * 60 * 60 * 1000 // 24 hours
 }
 }));

``` 3. **CORS Issues**

```

 Error: Cross-Origin Request Blocked

``` **Solution:** - Configure CORS to allow requests from your frontend:

```javascript
 app.use(cors({
 origin: process.env.FRONTEND_URL,
 credentials: true
 }));

``` - Ensure credentials are included in fetch requests:

```javascript
 fetch('/api/auth/login', {
 credentials: 'include',
 // other options
 });

``` ### Two-Factor Authentication Issues **Symptom

s:**
- 2FA not working
- Users locked out of accounts **Possible Causes and Solutions:** 1. **Invalid TOTP Code**

```

 Error: Invalid authentication code

``` **Solution:** - Check time synchronization on server - Verify TOTP implementation is correct - Allow for time drift in TOTP validation:

```javascript
 totp.verify({
 token: userToken,
 secret: userSecret,
 window: 1 // Allow 1 step before/after current time
 });

``` 2. **Lost Recovery Codes**

```

 Error: No recovery method available

``` **Solution:** - Implement account recovery process via email - Store recovery codes securely - Provide clear instructions for users to save recovery codes ## CSRF Protection Issues ### Form Submissions Failing **Symptom

s:**
- Form submissions return 403 Forbidden
- CSRF token validation errors **Possible Causes and Solutions:** 1. **Missing CSRF Token**

```

 Error: Invalid CSRF token

``` **Solution:** - Include CSRF token in all forms:

```jsx
 <form>
 <input type="hidden" name="_csrf" value={csrfToken} />
 {/* form fields */}
 </form>

``` - For AJAX requests, include the token in headers:

```javascript
 fetch('/api/data', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'X-CSRF-Token': csrfToken
 },
 body: JSON.stringify(data)
 });

``` 2. **Expired CSRF Token**

```

 Error: CSRF token expired

``` **Solution:** - Refresh CSRF token periodically - Implement token rotation strategy - Increase token expiration time:

```javascript
 app.use(csrf({
 cookie: {
 maxAge: 3600000 // 1 hour
 }
 }));

``` 3. **Cross-Origin Requests**

```

 Error: CSRF token origin mismatch

``` **Solution:** - Configure CORS and CSRF policies to work together - Exempt specific routes from CSRF protection if needed:

```javascript
 app.post('/api/webhooks', (req, res, next) => {
 req.__skipCSRF = true;
 next();
 }, webhookHandler);

``` ## Rate Limiting Issues ### Too Many Requests **Symptom

s:**
- 429 Too Many Requests errors
- Throttled API access **Possible Causes and Solutions:** 1. **Rate Limit Exceeded**

```

 Error: Too many requests, please try again later

``` **Solution:** - Implement exponential backoff in client requests:

```javascript
 async function fetchWithBackoff(url, options, retries = 3, backoff = 300) {
 try {
 return await fetch(url, options);
 } catch (err) {
 if (retries === 0) throw err;
 await new Promise(r => setTimeout(r, backoff));
 return fetchWithBackoff(url, options, retries - 1, backoff * 2);
 }
 }

``` - Optimize client code to reduce unnecessary requests - Use batch operations where possible 2. **Shared IP Address**

```

 Error: Rate limit exceeded for IP X.X.X.X

``` **Solution:** - Implement user-based rate limiting instead of IP-based - Increase limits for specific routes - Configure rate limiting to account for proxies:

```javascript
 const limiter = rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 100, // limit each IP to 100 requests per windowMs
 standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
 legacyHeaders: false, // Disable the `X-RateLimit-*` headers
 keyGenerator: (req) => {
 return req.user?.id || req.ip;
 }
 });

``` ## Frontend Issues ### Rendering Problems **Symptom

s:**
- UI components not displaying correctly
- Visual glitches or layout issues **Possible Causes and Solutions:** 1. **CSS Issues**

```

 Warning: Prop `className` did not match

``` **Solution:** - Check for CSS conflicts - Verify Tailwind classes are included in purge configuration:

```javascript
 // tailwind.config.js
 module.exports = {
 content: [
 './client/src/**/*.{js,ts,jsx,tsx}',
 ],
 // other options
 };

``` - Use more specific selectors to avoid conflicts 2. **Component Errors**

```

 Error: Objects are not valid as a React child

``` **Solution:** - Check data types being passed to components - Add proper type checking:

```typescript
 interface UserProps {
 user: {
 id: string;
 name: string;
 email: string;
 } | null;
 }

 function UserProfile({ user }: UserProps) {
 if (!user) return <div>User not found</div>;

 return <div>{user.name}</div>;
 }

``` - Use conditional rendering to handle null/undefined values 3. **State Management Issues**

```

 Warning: Cannot update a component while rendering a different component

``` **Solution:** - Move state updates to useEffect:

```jsx
 useEffect(() => {
 if (condition) {
 setData(newData);
 }
 }, [condition, newData]);

``` - Review component lifecycle and state updates - Use proper state management patterns ### Data Fetching Issues **Symptom

s:**
- Data not loading
- Stale data displayed **Possible Causes and Solutions:** 1. **Query Errors**

```

 Error: Failed to fetch data

``` **Solution:** - Add error handling to queries:

```jsx
 const { data, error, isLoading } = useQuery({
 queryKey: ['/api/data'],
 retry: 3,
 });

 if (error) return <div>Error: {error.message}</div>;
 if (isLoading) return <div>Loading...</div>;

``` - Check network requests in browser developer tools - Verify API endpoints are functional 2. **Cache Invalidation**

```

 Warning: Query data not updated after mutation

``` **Solution:** - Invalidate queries after mutations:

```jsx
 const queryClient = useQueryClient();

 const mutation = useMutation({
 mutationFn: (data) => {
 return fetch('/api/resource', {
 method: 'POST',
 body: JSON.stringify(data)
 });
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['/api/resource'] });
 }
 });

``` - Use optimistic updates for better UX 3. **Stale Closures**

```

 Warning: React has detected a change in the order of Hooks

``` **Solution:** - Ensure hooks are called in the same order - Fix dependency arrays in useEffect, useMemo, useCallback:

```jsx
 useEffect(() => {
 // effect code
 }, [dep1, dep2]); // Include all dependencies

``` ## TypeScript Errors ### Common TypeScript Errors **Symptom

s:**
- TypeScript compilation errors
- Type-related warnings **Possible Causes and Solutions:** 1. **Type Mismatches**

```

 Type 'string | undefined' is not assignable to type 'string'

``` **Solution:** - Add proper type guards:

```typescript
 function processValue(value: string | undefined): string {
 if (value === undefined) {
 return '';
 }
 return value.toUpperCase();
 }

``` - Use the TypeScript Error Management System:

```bash
 npx ts-node run-typescript-error-system.ts

``` 2. **Missing Type Definitions**

```

 Could not find a declaration file for module 'some-module'

``` **Solution:** - Install type definitions:

```bash
 npm install --save-dev @types/some-module

``` - Create custom type definitions if necessary:

```typescript
 // src/types/some-module.d.ts
 declare module 'some-module' {
 export function someFunction(): void;
 export interface SomeInterface {
 // properties
 }
 }

``` 3. **Configuration Issues**

```

 Cannot find module '...' or its corresponding type declarations

``` **Solution:** - Check tsconfig.json paths and includes:

```json
 {
 "compilerOptions": {
 "paths": {
 "@/*": ["./client/src/*"]
 }
 },
 "include": ["client/src/**/*", "server/**/*", "shared/**/*"]
 }

``` - Use the advanced TypeScript tools:

```bash
 npx ts-node advanced-ts-error-finder.ts

``` ### Using the TypeScript Error Management System For comprehensive TypeScript error resolution: 1. **Run the Error Detection Syste

m**

```bash
 npx ts-node run-typescript-error-system.ts --deep

``` 2. **Apply Automated Fixes**

```bash
 npx ts-node run-typescript-error-system.ts --fix

``` 3. **Review Results** The system will generate a report of fixed errors and remaining issues. ## Performance Issues ### Slow Application Performance **Symptom

s:**
- Slow page loads
- UI lag
- High resource usage **Possible Causes and Solutions:** 1. **Frontend Performance**

```

 Warning: Component took too long to render

``` **Solution:** - Profile component rendering:

```jsx
 import { Profiler } from 'react';

 function onRenderCallback(id, phase, actualDuration) {
 console.log(`${id} rendered in ${actualDuration}ms`);
 }

 // In your component
 return (
 <Profiler id="SlowComponent" onRender={onRenderCallback}>
 <YourComponent />
 </Profiler>
 );

``` - Memoize expensive components - Implement virtualization for long lists - See [Performance Guide](../performance/consolidated-performance-guide.md) for more details 2. **Database Performance**

```

 Slow query detected: query took 2500ms

``` **Solution:** - Optimize database queries - Add indexes to frequently queried columns - Implement query caching - Use database monitoring tools 3. **Memory Usage**

```

 Warning: High memory usage detected

``` **Solution:** - Check for memory leaks - Optimize large data structures - Implement pagination for large data sets - Enable Speed Mode for temporary performance boost:

```bash
 node enable-speed-mode.sh

``` ## Deployment Issues ### Deployment Failures **Symptom

s:**
- Application fails to deploy
- Build errors during deployment **Possible Causes and Solutions:** 1. **Build Failures**

```

 Error: Build failed with exit code 1

``` **Solution:** - Check build logs for specific errors - Verify all dependencies are installed - Test build process locally:

```bash
 npm run build

``` 2. **Environment Variables**

```

 Error: Missing required environment variables

``` **Solution:** - Set all required environment variables in deployment environment - Check for typos in variable names - Use a `.env.example` file to document required variables 3. **Permission Issues**

```

 Error: EACCES: permission denied

``` **Solution:** - Check file and directory permissions - Verify the deployment user has necessary permissions - Use correct service account permissions ### Post-Deployment Issues **Symptom

s:**
- Application deployed but not functioning correctly
- Runtime errors in production **Possible Causes and Solutions:** 1. **API Connection Issues**

```

 Error: Failed to connect to API at https://api.example.com

``` **Solution:** - Check API endpoint configuration - Verify API is accessible from deployment environment - Test API connections with curl or similar tool 2. **Database Connection Issues**

```

 Error: Could not connect to database

``` **Solution:** - Verify database connection string - Check database firewall settings - Ensure database service is running 3. **Incorrect Build Configuration**

```

 Error: Unexpected token '<'

``` **Solution:** - Verify build output - Check for incorrect path configurations - Ensure all assets are correctly referenced ## Diagnostic Tools ### Server Diagnostics Use these tools to diagnose server issues: 1. **Server Log

s**

```bash
 # View recent log

s
 tail -f logs/server.log

 # Search for specific error

s
 grep "Error" logs/server.log

``` 2. **Process Monitoring**

```bash
 # Check Node.js processe

s
 ps aux | grep node

 # Monitor resource usag

e
 top -p $(pgrep -d',' -f node)

``` 3. **Network Diagnostics**

```bash
 # Check open port

s
 netstat -tuln

 # Test API endpoin

t
 curl -v http://localhost:3000/api/health

``` ### Database Diagnostics Use these tools to diagnose database issues: 1. **Database Connection Tes

t**

```bash
 # Test PostgreSQL connectio

n
 psql -U username -d database -c "SELECT 1"

``` 2. **Query Analysis**

```sql
 -- Analyze a query
 EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

``` 3. **Database Status**

```sql
 -- Check active connections
 SELECT * FROM pg_stat_activity;

 -- Check table stats
 SELECT * FROM pg_stat_user_tables;

``` ### Frontend Diagnostics Use these tools to diagnose frontend issues: 1. **Browser Developer Tools** - Network tab for API requests - Console for JavaScript errors - Performance tab for rendering issues 2. **React Developer Tools** - Component profiling - State inspection - Render tracking 3. **Lighthouse Audits** - Performance scoring - Accessibility checks - Best practices validation ### Diagnostic Scripts The application includes several diagnostic scripts: 1. **API Validatio

n**

```bash
 node test-api-validation.js

``` 2. **Auth Diagnostics**

```bash
 node auth-diagnostic.js

``` 3. **Rate Limit Testing**

```bash
 node rate-limit-test.js

``` ## Additional Resources - [Performance Optimization Guide](../performance/consolidated-performance-guide.m

d)
- [Security Guide](../security/consolidated-security-guide.md)
- [TypeScript Error Management](../typescript/consolidated-typescript-error-management.md)
- [API Documentation](../api/consolidated-api-documentation.md) *Last updated: 2025-05-11* ## See Also - [Getting Started Guide](GETTING_STARTED.md) - 16% matc

h
- [Dale Loves Whales Quick Reference Guide](QUICK_REFERENCE.md) - 16% match