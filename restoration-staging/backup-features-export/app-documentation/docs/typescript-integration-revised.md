# TypeScript Integration and Audit Logging Implementation P

l

a n our comprehensive approach for integrating TypeScript across our security management platform while implementing robust audit logging capabilities.

## Week 0: System Preparation ### Codebase Analysis - [ ] Run `./run-typescript-tools.sh scan` to establish baseline TypeScript metric s - [ ] Identify top 10 components for priority migration based on usage analytic s - [ ] Create dependency graph of key components to plan migration sequenc

e

- [ ] Document current TypeScript settings in `tsconfig.json` ### Configuration Updates - [ ] Update `tsconfig.json` with appropriate strictness setting

s:

```json
{
 "compilerOptions": {
 "strict": true,
 "noImplicitAny": true,
 "strictNullChecks": true,
 "noUnusedLocals": true,
 "noUnusedParameters": true,
 "jsx": "react",
 "esModuleInterop": true,
 "allowSyntheticDefaultImports": true,
 "moduleResolution": "node",
 "target": "es2018",
 "lib": ["dom", "dom.iterable", "esnext"],
 "skipLibCheck": true,
 "forceConsistentCasingInFileNames": true,
 "resolveJsonModule": true,
 "isolatedModules": true,
 "noEmit": true,
 "baseUrl": ".",
 "paths": {
 "@/*": ["src/*"],
 "@components/*": ["src/components/*"],
 "@utils/*": ["src/utils/*"],
 "@services/*": ["src/services/*"]
 }
 },
 "include": ["src/**/*.ts", "src/**/*.tsx"],
 "exclude": ["node_modules", "build", "dist"]
}
``` - [ ] Configure ESLint rules for TypeScript in `.eslintrc.typescript.js`:

```javascript

module.exports = {
 extends: [
 'eslint:recommended',
 'plugin:@typescript-eslint/recommended',
 'plugin:react/recommended',
 'plugin:react-hooks/recommended'
 ],
 parser: '@typescript-eslint/parser',
 plugins: ['@typescript-eslint', 'react', 'react-hooks'],
 rules: {
 '@typescript-eslint/explicit-function-return-type': 'off',
 '@typescript-eslint/explicit-module-boundary-types': 'off',
 '@typescript-eslint/no-explicit-any': 'warn',
 '@typescript-eslint/no-unused-vars': ['error', {
 argsIgnorePattern: '^_',
 varsIgnorePattern: '^_'
 }],
 'react/prop-types': 'off' // We're using TypeScript for props validation
 },
 settings: {
 react: {
 version: 'detect'
 }
 }
}
``` - [ ] Create type checking pre-commit hook using Husky ### Audit Foundation - [ ] Implement core audit log types in `shared/schema.t

s`:

```typescript

export interface AuditLogEntry {
 id: string;
 timestamp: Date;
 userId: string | null;
 action: string;
 resource: string;
 resourceId: string | null;
 details: Record<string, unknown>;
 ipAddress: string;
 userAgent: string;
 sessionId?: string;
 severity?: 'low' | 'medium' | 'high' | 'critical';
 success?: boolean;
}
``` - [ ] Set up secure audit log storage with PostgreSQL
- [ ] Configure audit log retention policies and data lifecycle management
- [ ] Implement security controls for audit log access ### Team Preparation - [ ] Schedule TypeScript training session for all developer

s
- [ ] Create comprehensive documentation for TypeScript patterns with examples
- [ ] Set up shared TypeScript snippets library for common patterns
- [ ] Establish TypeScript code review guidelines and checklist

## Week 1: Core Components Typing ### UI Component Typing - [ ] Implement types for Button componen

t:

```typescript

interface ButtonProps {
 label: string;
 onClick: () => void;
 variant?: 'primary' | 'secondary' | 'outline' | 'danger';
 size?: 'sm' | 'md' | 'lg';
 disabled?: boolean;
 icon?: React.ReactNode;
 className?: string;
 type?: 'button' | 'submit' | 'reset';
 form?: string;
 ariaLabel?: string;
 testId?: string;
}

const Button: React.FC<ButtonProps> = ({
 label,
 onClick,
 variant = 'primary',
 size = 'md',
 disabled = false,
 icon,
 className = '',
 type = 'button',
 form,
 ariaLabel,
 testId
}) => {
 // Implementation
};
``` - [ ] Add types to Card component:

```typescript

interface CardProps {
 title?: string;
 children: React.ReactNode;
 footer?: React.ReactNode;
 className?: string;
 elevation?: 0 | 1 | 2 | 3;
 onClick?: () => void;
}
``` - [ ] Add types to Form components:

```typescript

interface FormFieldProps {
 name: string;
 label: string;
 type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea';
 required?: boolean;
 placeholder?: string;
 value?: string | number | boolean;
 onChange?: (value: any) => void;
 error?: string;
 disabled?: boolean;
 options?: Array<{ value: string | number; label: string }>;
}
``` - [ ] Create generic List component with proper typing:

```typescript

interface ListProps<T> {
 items: T[];
 renderItem: (item: T, index: number) => React.ReactNode;
 keyExtractor: (item: T, index: number) => string;
 emptyMessage?: string;
 loading?: boolean;
 onItemClick?: (item: T) => void;
 className?: string;
}

function List<T>({
 items,
 renderItem,
 keyExtractor,
 emptyMessage = 'No items found',
 loading = false,
 onItemClick,
 className = ''
}: ListProps<T>): JSX.Element {
 // Implementation
}
``` ### Audit Integration - [ ] Implement UI component audit loggin

g:

```typescript

interface ComponentAuditEvent {
 componentType: string;
 componentId?: string;
 action: 'render' | 'interaction' | 'error';
 details: Record<string, unknown>;
 timestamp?: Date;
 userId?: string;
 sessionId?: string;
}

function logComponentEvent(event: ComponentAuditEvent): void {
 const enrichedEvent = {
 ...event,
 timestamp: event.timestamp || new Date(),
 clientInfo: {
 userAgent: navigator.userAgent,
 screenSize: `${window.innerWidth}x${window.innerHeight}`,
 language: navigator.language
 }
 };

 // Send to server or store locally
 console.log('Component Event:', enrichedEvent);
 // Implementation: API call to log event
}
``` - [ ] Add audit logging to sensitive UI interactions (login, permission changes, etc.)
- [ ] Create audit visualization component with filtering and timeline views
- [ ] Implement real-time audit log updates using WebSockets ### Testing & Documentation - [ ] Write tests for typed components using Jest and React Testing Librar

y
- [ ] Implement proper TypeScript typings in test files:

```typescript
// Example of typed component test

import { render, screen, fireEvent } from '@testing-library/react';

import Button from './Button';

describe('Button component', () => {
 test('renders with correct label', () => {
 render(<Button label="Click me" onClick={jest.fn()} />);
 expect(screen.getByText('Click me')).toBeInTheDocument();
 });

 test('calls onClick handler when clicked', () => {
 const handleClick = jest.fn();
 render(<Button label="Click me" onClick={handleClick} />);
 fireEvent.click(screen.getByText('Click me'));
 expect(handleClick).toHaveBeenCalledTimes(1);
 });
});
``` - [ ] Update component documentation with type information and usage examples
- [ ] Create storybook examples of properly typed components

## Week 2: API Data Typing ### API Response Types - [ ] Define types for all API responses in `shared/schema.t

s`:

```typescript

export interface ApiResponse<T> {
 data: T;
 success: boolean;
 message?: string;
 errors?: Record<string, string[]>;
 meta?: {
 page?: number;
 pageSize?: number;
 totalCount?: number;
 totalPages?: number;
 };
}

// Common response types

export interface ErrorResponse {
 success: false;
 message: string;
 errors?: Record<string, string[]>;
 code?: string;
}

export interface SuccessResponse<T> {
 success: true;
 data: T;
 message?: string;
 meta?: {
 page?: number;
 pageSize?: number;
 totalCount?: number;
 totalPages?: number;
 };
}

// Type guard for error responses

export function isErrorResponse(response: any): response is ErrorResponse {
 return response && response.success === false;
}
``` - [ ] Implement Zod schemas for API validation with proper error handling:

```typescript

import { z } from 'zod';

import { fromZodError } from 'zod-validation-error';

// User schema

const userResponseSchema = z.object({
 id: z.string().uuid(),
 name: z.string().min(1, "Name cannot be empty"),
 email: z.string().email("Invalid email format"),
 role: z.enum(['admin', 'analyst', 'user', 'guest'], {
 errorMap: () => ({ message: "Invalid user role" })
 }),
 createdAt: z.string().datetime(),
 isActive: z.boolean().default(true)
});

// Derive type from schema

type UserResponse = z.infer<typeof userResponseSchema>;

// Schema validation helper

export function validateApiData<T>(
 schema: z.ZodType<T>,
 data: unknown
): { success: true; data: T } | { success: false; error: string; details: Record<string, string[]> } {
 try {
 const result = schema.parse(data);
 return { success: true, data: result };
 } catch (error) {
 if (error instanceof z.ZodError) {
 const validationError = fromZodError(error);

 // Format errors for API response
 const details: Record<string, string[]> = {};
 error.errors.forEach(err => {
 const path = err.path.join('.');
 if (!details[path]) {
 details[path] = [];
 }
 details[path].push(err.message);
 });

 return {
 success: false,
 error: validationError.message,
 details
 };
 }

 return {
 success: false,
 error: 'Validation failed',
 details: { '_global': ['Unknown validation error'] }
 };
 }
}
``` - [ ] Create utility types for common API patterns:

```typescript
// Pagination request type

export interface PaginationParams {
 page?: number;
 pageSize?: number;
 sortBy?: string;
 sortOrder?: 'asc' | 'desc';
}

// Filter parameters with generic support

export type FilterParams<T> = {
 [K in keyof T]?: T[K] | T[K][];
};

// Combined parameters for paginated, filtered requests

export type QueryParams<T> = PaginationParams & FilterParams<T>;

// Type-safe HTTP methods

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
``` ### API Request Audit Logging - [ ] Implement API request audit loggin

g:

```typescript
// Types for API audit logging

interface ApiAuditLog {
 id?: string;
 endpoint: string;
 method: HttpMethod;
 requestId: string;
 userId: string | null;
 requestTimestamp: Date;
 responseTimestamp: Date | null;
 statusCode: number | null;
 responseSize?: number;
 duration?: number;
 errorMessage: string | null;
 ipAddress: string;
 userAgent: string;
 requestHeaders?: Record<string, string>;
 requestBody?: unknown;
 responseBody?: unknown;
}

// Higher-order function to wrap API requests with audit logging

function withAuditLogging<T>(
 endpoint: string,
 method: HttpMethod,
 handler: () => Promise<T>,
 options?: {
 userId?: string;
 requestId?: string;
 requestHeaders?: Record<string, string>;
 requestBody?: unknown;
 sensitive?: boolean; // Flag for sensitive operations
 }
): Promise<T> {
 const requestId = options?.requestId || crypto.randomUUID();
 const requestTimestamp = new Date();

 // Create initial audit log entry
 const auditLog: Omit<ApiAuditLog, 'id'> = {
 endpoint,
 method,
 requestId,
 userId: options?.userId || null,
 requestTimestamp,
 responseTimestamp: null,
 statusCode: null,
 errorMessage: null,
 ipAddress: getCurrentIpAddress(), // Implement this function
 userAgent: getCurrentUserAgent(), // Implement this function
 requestHeaders: options?.sensitive
 ? undefined
 : options?.requestHeaders,
 requestBody: options?.sensitive
 ? undefined
 : options?.requestBody
 };

 return handler()
 .then(response => {
 // Update audit log with success information
 const responseTimestamp = new Date();
 const updatedAuditLog = {
 ...auditLog,
 responseTimestamp,
 statusCode: 200, // Or extract from response if available
 duration: responseTimestamp.getTime() - requestTimestamp.getTime(),
 responseBody: options?.sensitive
 ? undefined
 : response
 };

 // Save audit log
 saveApiAuditLog(updatedAuditLog).catch(console.error);

 return response;
 })
 .catch(error => {
 // Update audit log with error information
 const responseTimestamp = new Date();
 const updatedAuditLog = {
 ...auditLog,
 responseTimestamp,
 statusCode: error.status || 500,
 duration: responseTimestamp.getTime() - requestTimestamp.getTime(),
 errorMessage: error.message || 'Unknown error'
 };

 // Save audit log
 saveApiAuditLog(updatedAuditLog).catch(console.error);

 throw error;
 });
}
``` - [ ] Add audit logging middleware to API routes
- [ ] Implement audit log querying interface ### API Client Integration - [ ] Update API client with type-safe method

s:

```typescript
// Type-safe API client

export class ApiClient {
 private baseUrl: string;
 private defaultHeaders: Record<string, string>;

 constructor(
 baseUrl: string = '/api',
 defaultHeaders: Record<string, string> = {}
 ) {
 this.baseUrl = baseUrl;
 this.defaultHeaders = {
 'Content-Type': 'application/json',
 ...defaultHeaders
 };
 }

 // Generic request method with type parameters for request/response types
 async request<TResponse, TRequest = undefined>(
 method: HttpMethod,
 endpoint: string,
 options?: {
 body?: TRequest;
 headers?: Record<string, string>;
 params?: Record<string, string | number | boolean | undefined>;
 }
 ): Promise<TResponse> {
 // Build URL with query parameters
 let url = `${this.baseUrl}${endpoint}`;

 if (options?.params) {
 const queryParams = new URLSearchParams();

 Object.entries(options.params).forEach(([key, value]) => {
 if (value !== undefined) {
 queryParams.append(key, String(value));
 }
 });

 const queryString = queryParams.toString();
 if (queryString) {
 url += `?${queryString}`;
 }
 }

 // Build headers
 const headers = {
 ...this.defaultHeaders,
 ...options?.headers
 };

 // Build request configuration
 const config: RequestInit = {
 method,
 headers,
 credentials: 'include' // Include cookies for session authentication
 };

 // Add body for POST/PUT/PATCH requests
 if (method !== 'GET' && method !== 'DELETE' && options?.body) {
 config.body = JSON.stringify(options.body);
 }

 // Execute request with type-safe error handling
 const response = await fetch(url, config);

 // Handle JSON responses
 const contentType = response.headers.get('content-type');
 if (contentType?.includes('application/json')) {
 const data = await response.json();

 // Check for API error format
 if (isErrorResponse(data)) {
 throw new ApiError(data.message, data.errors, response.status);
 }

 return data as TResponse;
 }

 // Handle non-JSON responses
 if (!response.ok) {
 throw new ApiError('Request failed', undefined, response.status);
 }

 // For non-JSON success responses, return as-is
 return response as unknown as TResponse;
 }

 // Convenience methods for common HTTP verbs
 async get<T>(
 endpoint: string,
 params?: Record<string, string | number | boolean | undefined>,
 headers?: Record<string, string>
 ): Promise<T> {
 return this.request<T>('GET', endpoint, { params, headers });
 }

 async post<TResponse, TRequest = undefined>(
 endpoint: string,
 body?: TRequest,
 headers?: Record<string, string>
 ): Promise<TResponse> {
 return this.request<TResponse, TRequest>('POST', endpoint, { body, headers });
 }
}

// Custom error class for API errors

export class ApiError extends Error {
 public errors?: Record<string, string[]>;
 public status: number;

 constructor(message: string, errors?: Record<string, string[]>, status = 500) {
 super(message);
 this.name = 'ApiError';
 this.errors = errors;
 this.status = status;
 }
}
``` - [ ] Add error type handling for API failures
- [ ] Implement response validation with type guards

## Week 3: Incremental Component Migration ### Component Prioritization - [ ] Migrate Security Dashboard component to TypeScript: - Convert `.jsx` to `.tsx` - Add interface for component props - Type state variables and event handlers - Add return type annotations - [ ] Migrate Authentication components to TypeScript: - Login form with proper field validation types - Authentication context with user type - Protected route components - [ ] Migrate User Management components to TypeScript: - User list with pagination types - User detail form with validation - Role management interface - [ ] Update component tests with TypeScript ### User Action Audit Logging - [ ] Implement user action audit loggin

g:

```typescript

type UserAction = 'login' | 'logout' | 'profile_update' | 'password_change';

// Type for mapping actions to their metadata

interface UserActionMetadata {
 login: {
 ipAddress: string;
 deviceInfo: string;
 authMethod: 'password' | 'oauth' | '2fa' | 'sso';
 };
 logout: {
 reason: 'user_initiated' | 'session_timeout' | 'forced';
 };
 profile_update: {
 fields: string[];
 previousValues: Record<string, unknown>;
 newValues: Record<string, unknown>;
 };
 password_change: {
 requiredReset: boolean;
 };
}

interface UserActionAudit<T extends UserAction> {
 action: T;
 userId: string;
 timestamp: Date;
 successful: boolean;
 metadata: UserActionMetadata[T];
 sessionId: string;
}

// Usage

function logUserAction<T extends UserAction>(audit: UserActionAudit<T>): void {
 // Implementation to send to server
 console.log('User action:', audit);
}

// Example usage

logUserAction({
 action: 'login',
 userId: user.id,
 timestamp: new Date(),
 successful: true,
 metadata: {
 ipAddress: '192.168.1.1',
 deviceInfo: 'Chrome/Windows',
 authMethod: 'password'
 },
 sessionId: session.id
});
``` - [ ] Add audit points to user workflow components
- [ ] Create user activity timeline component ### Documentation - [ ] Update migration guide

s
- [ ] Document common TypeScript patterns found during migration
- [ ] Create troubleshooting guide for common issues

## Week 4: Developer Tooling Enhancement ### Code Generation Tools - [ ] Improve TypeScript template generato r - [ ] Create component scaffolding too

l:

```typescript

// Example usage:
// npm run generate component Button --props="label:string,onClick:()=>void"
``` - [ ] Implement automatic prop type generation from usage ### Developer Activity Tracking - [ ] Create developer activity audit syste

m:

```typescript

interface DeveloperActivity {
 developer: string;
 action: 'create' | 'update' | 'delete';
 component: string;
 timestamp: Date;
 linesChanged: number;
 filesModified: string[];
}
``` - [ ] Implement metrics dashboard for TypeScript adoption
- [ ] Create TypeScript error heat map visualization ### TypeScript Performance Optimization - [ ] Configure incremental compilatio

n
- [ ] Implement type-checking caching
- [ ] Optimize build pipeline for TypeScript

## Week 5: Security-Enhanced Typing ### Security Operation Types - [ ] Implement security operation audit loggin

g:

```typescript

interface SecurityOperationAudit {
 operationType: 'user_permission_change' | 'role_assignment' | 'access_grant' | 'access_revocation';
 performedBy: {
 userId: string;
 userName: string;
 userRole: string;
 };
 targetUser?: {
 userId: string;
 userName: string;
 affectedRole?: string;
 };
 targetResource?: {
 resourceId: string;
 resourceType: 'document' | 'feature' | 'api' | 'data';
 resourceName: string;
 };
 timestamp: Date;
 transactionId: string;
 previousState: unknown;
 newState: unknown;
 ipAddress: string;
 successful: boolean;
 failureReason?: string;
 systemAuthorizationCheck: {
 authorized: boolean;
 authMethod: 'role_based' | 'permission_based' | 'ownership_based';
 policyApplied: string[];
 };
}
``` - [ ] Add branded types for security-sensitive IDs:

```typescript
// Branded types for IDs to prevent mixing different ID types

export type UserId = string & { readonly _brand: unique symbol };

export type RoleId = string & { readonly _brand: unique symbol };

export type PermissionId = string & { readonly _brand: unique symbol };

// Create functions to generate branded types

export function createUserId(id: string): UserId {
 return id as UserId;
}

export function createRoleId(id: string): RoleId {
 return id as RoleId;
}

export function createPermissionId(id: string): PermissionId {
 return id as PermissionId;
}

// Usage example

function assignRoleToUser(userId: UserId, roleId: RoleId): void {
 // Implementation
}

// This will work

assignRoleToUser(createUserId('user-123'), createRoleId('role-456'));

// This will cause TypeScript error - types don't match
// assignRoleToUser(createRoleId('role-456'), createUserId('user-123'));
``` ### Vulnerability Management Types - [ ] Create vulnerability tracking type

s:

```typescript

interface Vulnerability {
 id: string;
 title: string;
 description: string;
 severity: 'low' | 'medium' | 'high' | 'critical';
 status: 'open' | 'in_progress' | 'closed' | 'wontfix';
 discoveredAt: Date;
 affectedComponents: string[];
 remediationSteps: string[];
 cveId?: string;
}
``` - [ ] Implement security scanning result types
- [ ] Create security metric types ### Security Dashboard Enhancements - [ ] Add type-safe security dashboard component

s
- [ ] Implement real-time audit log visualization
- [ ] Create security anomaly detection interface

## Week 6: Audit System Completion ### Comprehensive Audit Dashboard - [ ] Implement audit log filterin

g:

```typescript

interface AuditLogFilter {
 startDate?: Date;
 endDate?: Date;
 userId?: string;
 actions?: string[];
 resources?: string[];
 severity?: 'low' | 'medium' | 'high' | 'critical';
}
``` - [ ] Create audit log export functionality
- [ ] Implement audit log search capabilities ### Compliance Reporting - [ ] Create compliance report generato

r:

```typescript

interface ComplianceReport {
 reportType: 'soc2' | 'hipaa' | 'gdpr' | 'pci';
 generatedAt: Date;
 timeRange: {
 start: Date;
 end: Date;
 };
 sections: {
 title: string;
 status: 'compliant' | 'non_compliant' | 'needs_review';
 findings: string[];
 evidenceIds: string[];
 }[];
 summary: string;
 remediationItems: string[];
}
``` - [ ] Implement evidence collection system
- [ ] Create compliance dashboard ### Final Review - [ ] Conduct TypeScript coverage audi

t
- [ ] Review security implications of type system
- [ ] Document final TypeScript patterns and guidelines
- [ ] Create plan for ongoing TypeScript maintenance

## Success Metrics - **TypeScript Coverage**: Aim for >80% of codebase with proper TypeScrip t - **Error Reduction**: 60% reduction in type-related runtime error s - **Build Performance**: TypeScript compilation under 45 second

s

- **Audit Completeness**: 100% of security operations audited
- **Compliance**: Fully compliant audit trails for SOC 2 and GDPR This implementation plan provides a structured approach to integrating TypeScript with robust audit logging across our security management platform over a 6-week period, with clear tasks, code examples, and success metrics for each phase.

## See Also - [TypeScript Integration and Audit Logging Implementation Pla](typescript-integration-plan.md) - 82% matc h - [Security Implementation Plan](SECURITY-IMPLEMENTATION-PLAN.md) - 33% matc

h

- [Security Implementation: Next Steps](SECURITY-NEXT-STEPS.md) - 25% match
- [Security Dashboard Integration Templat](SECURITY_DASHBOARD_INTEGRATION_TEMPLATE.md) - 25% match
- [Creating a New React Component with TypeScrip](new-component-setup-guide.md) - 25% match