## Utility 1: Component Architecture Optimizer **Purpose:** Ensures components follow proper structure, separation of concerns, and performance patterns **Key Feature s:** - Identifies oversized components (>300 lines) for splittin

g

- Enforces proper hook usage patterns
- Validates component prop interfaces
- Checks for proper state management patterns
- Ensures cosmic theme consistency **Target Files:** React components in `client/src/components/` ---

## Utility 2: API Standards Enforcer **Purpose:** Validates API endpoints follow REST conventions and security best practices **Key Feature s:** - Enforces proper HTTP method usag

e

- Validates request/response schemas
- Checks authentication middleware implementation
- Ensures error handling consistency
- Validates rate limiting implementation **Target Files:** API routes in `server/routes/` ---

## Utility 3: Security Compliance Scanner **Purpose:** Ensures security best practices across the entire codebase **Key Feature s:** - Validates input sanitizatio

n

- Checks for SQL injection vulnerabilities
- Ensures proper authentication flows
- Validates CORS configuration
- Checks for sensitive data exposure **Target Files:** All server-side code and security components ---

## Utility 4: Performance Optimization Detector **Purpose:** Identifies performance bottlenecks and optimization opportunities **Key Feature s:** - Detects unnecessary re-render

s

- Identifies missing memoization opportunities
- Validates bundle size optimization
- Checks for proper lazy loading
- Ensures efficient database queries **Target Files:** All performance-critical code paths