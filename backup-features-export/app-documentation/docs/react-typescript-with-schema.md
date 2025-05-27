# React TypeScript Integration with Sch

e

m a This guide demonstrates how to integrate our database schema types with React components, ensuring type safety across the full stack.

## Table of Contents 1. [Understanding Our Schema Structure](#understanding-our-schema-struct

u

r

e) 2. [Creating Type-Safe React Components](#creating-type-safe-react-components) 3. [Working with Form Components](#working-with-form-components) 4. [Data Fetching with Type Safety](#data-fetching-with-type-safety) 5. [Best Practices](#best-practices) ## Understanding Our Schema Structure Our database schema is defined in `shared/schema.ts` and uses Drizzle ORM with PostgreSQL. The file exports both table definitions and TypeScript type

s:

```typescript

// From shared/schema.ts

import { z } from 'zod';

// Table definitions (simplified example)

export const users = pgTable('users', {
 id: varchar('id').primaryKey(),
 username: text('username').notNull(),
 email: text('email'),
 role: text('role').default('user'),
 // other fields...
});

// Insert schemas with Zod

export const insertUserSchema = createInsertSchema(users).omit({
 id: true,
 created_at: true,
 updated_at: true,
 last_login: true
});

// Inferred types from these schemas

export type InsertUser = z.infer<typeof insertUserSchema>;

export type User = typeof users.$inferSelect;
```

## Creating Type-Safe React Components When creating React components that work with our schema data, import the relevant type

s:

```typescript

// UserCard.tsx

import React from 'react';

import { User } from '@shared/schema';

interface UserCardProps {
 user: User;
 onEdit?: (userId: string) => void;
 highlight?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
 user,
 onEdit,
 highlight = false
}) => {
 return (
 <div className={`user-card ${highlight ? 'highlight' : ''}`}>
 <h3>{user.username}</h3>
 {user.email && <p>{user.email}</p>}
 <div className="role-badge">{user.role}</div>

 {onEdit && (
 <button onClick={() => onEdit(user.id)}>
 Edit User
 </button>
 )}
 </div>
 );
};
```

## Working with Form Components When creating forms that create or update database records, use the insert schema

s:

```typescript

// UserForm.tsx

import React from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { insertUserSchema, InsertUser, User } from '@shared/schema';

import { z } from 'zod';

// Extend the schema with additional validation if needed

const userFormSchema = insertUserSchema.extend({
 password: z.string().min(8, 'Password must be at least 8 characters'),
 confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
 message: "Passwords don't match",
 path: ['confirmPassword']
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
 onSubmit: (data: InsertUser) => void;
 initialData?: Partial<User>;
 isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
 onSubmit,
 initialData = {},
 isLoading = false
}) => {
 const {
 register,
 handleSubmit,
 formState: { errors }
 } = useForm<UserFormData>({
 resolver: zodResolver(userFormSchema),
 defaultValues: {
 username: initialData.username || '',
 email: initialData.email || '',
 role: initialData.role || 'user',
 password: '',
 confirmPassword: ''
 }
 });

 const handleFormSubmit = (data: UserFormData) => {
 // Remove confirmPassword before submitting
 const { confirmPassword, ...userData } = data;
 onSubmit(userData);
 };

 return (
 <form onSubmit={handleSubmit(handleFormSubmit)}>
 <div>
 <label htmlFor="username">Username</label>
 <input id="username" {...register('username')} />
 {errors.username && <p>{errors.username.message}</p>}
 </div>

 <div>
 <label htmlFor="email">Email</label>
 <input id="email" type="email" {...register('email')} />
 {errors.email && <p>{errors.email.message}</p>}
 </div>

 <div>
 <label htmlFor="role">Role</label>
 <select id="role" {...register('role')}>
 <option value="user">User</option>
 <option value="admin">Admin</option>
 <option value="moderator">Moderator</option>
 </select>
 {errors.role && <p>{errors.role.message}</p>}
 </div>

 <div>
 <label htmlFor="password">Password</label>
 <input id="password" type="password" {...register('password')} />
 {errors.password && <p>{errors.password.message}</p>}
 </div>

 <div>
 <label htmlFor="confirmPassword">Confirm Password</label>
 <input id="confirmPassword" type="password" {...register('confirmPassword')} />
 {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
 </div>

 <button type="submit" disabled={isLoading}>
 {isLoading ? 'Saving...' : 'Save User'}
 </button>
 </form>
 );
};
```

## Data Fetching with Type Safety Use React Query with our schema types for type-safe data fetchin

g:

```typescript

// UserList.tsx

import React from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { User, InsertUser } from '@shared/schema';

import { UserCard } from './UserCard';

import { UserForm } from './UserForm';

import { apiRequest } from '@lib/queryClient';

export const UserList: React.FC = () => {
 const queryClient = useQueryClient();
 const [isEditing, setIsEditing] = React.useState(false);
 const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

 // Type-safe query
 const { data, isLoading, error } = useQuery<User[]>({
 queryKey: ['/api/users'],
 queryFn: () => apiRequest('/api/users')
 });

 // Type-safe mutation
 const createMutation = useMutation({
 mutationFn: (userData: InsertUser) =>
 apiRequest('/api/users', { method: 'POST', body: userData }),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['/api/users'] });
 setIsEditing(false);
 }
 });

 const updateMutation = useMutation({
 mutationFn: ({ id, data }: { id: string; data: Partial<InsertUser> }) =>
 apiRequest(`/api/users/${id}`, { method: 'PATCH', body: data }),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['/api/users'] });
 setIsEditing(false);
 setSelectedUser(null);
 }
 });

 const handleEdit = (userId: string) => {
 const user = data?.find(u => u.id === userId) || null;
 setSelectedUser(user);
 setIsEditing(true);
 };

 const handleSubmit = (formData: InsertUser) => {
 if (selectedUser) {
 updateMutation.mutate({ id: selectedUser.id, data: formData });
 } else {
 createMutation.mutate(formData);
 }
 };

 if (isLoading) return <div>Loading users...</div>;
 if (error) return <div>Error loading users: {error.message}</div>;

 return (
 <div className="user-management">
 <h2>User Management</h2>

 {isEditing ? (
 <div>
 <h3>{selectedUser ? 'Edit User' : 'Create User'}</h3>
 <UserForm
 onSubmit={handleSubmit}
 initialData={selectedUser || {}}
 isLoading={createMutation.isPending || updateMutation.isPending}
 />
 <button onClick={() => {
 setIsEditing(false);
 setSelectedUser(null);
 }}>
 Cancel
 </button>
 </div>
 ) : (
 <button onClick={() => setIsEditing(true)}>Add User</button>
 )}

 <div className="user-list">
 {data?.map(user => (
 <UserCard
 key={user.id}
 user={user}
 onEdit={handleEdit}
 highlight={selectedUser?.id === user.id}
 />
 ))}

 {data?.length === 0 && (
 <p>No users found. Create your first user!</p>
 )}
 </div>
 </div>
 );
};
```

## Working with Security Features When working with security-related features from our schem

a:

```typescript

// SecurityEventsTable.tsx

import React from 'react';

import { useQuery } from '@tanstack/react-query';

import { SecurityEvent } from '@shared/schema';

import { formatDate } from '@lib/utils';

interface SecurityEventsTableProps {
 limit?: number;
 showResolved?: boolean;
}

export const SecurityEventsTable: React.FC<SecurityEventsTableProps> = ({
 limit = 10,
 showResolved = false
}) => {
 // Type-safe query with security events
 const { data, isLoading } = useQuery<SecurityEvent[]>({
 queryKey: ['/api/security/events', { limit, showResolved }],
 queryFn: () => apiRequest(
 `/api/security/events?limit=${limit}&showResolved=${showResolved}`
 )
 });

 if (isLoading) return <div>Loading security events...</div>;

 return (
 <table className="security-events-table">
 <thead>
 <tr>
 <th>Type</th>
 <th>Message</th>
 <th>Severity</th>
 <th>Timestamp</th>
 <th>Status</th>
 </tr>
 </thead>
 <tbody>
 {data?.map(event => (
 <tr
 key={event.id}
 className={`severity-${event.severity}`}
 >
 <td>{event.type}</td>
 <td>{event.message}</td>
 <td>
 <span className={`badge severity-${event.severity}`}>
 {event.severity}
 </span>
 </td>
 <td>{formatDate(event.timestamp)}</td>
 <td>{event.resolved ? 'Resolved' : 'Open'}</td>
 </tr>
 ))}

 {(!data || data.length === 0) && (
 <tr>
 <td colSpan={5}>No security events found.</td>
 </tr>
 )}
 </tbody>
 </table>
 );
};
```

## Best Practices 1. **Import Types Directly**: Always import types directly from `@shared/schema`. 2. **Use Schema Validation**: For forms, use the schema validation from Drizzle with Zod. 3. **Type API Responses**: Ensure all API calls have proper return type annotations. 4. **Shared Interfaces**: For complex components, consider creating interface files in `client/src/types/` that extend the schema types. 5. **Type Guards for API Data**: Use type guards to validate API responses match your expected type

s:

```typescript

function isUser(data: unknown): data is User {
 return (
 typeof data === 'object' &&
 data !== null &&
 'id' in data &&
 'username' in data
 );
}

// Usage

const fetchUser = async (id: string): Promise<User> => {
 const response = await fetch(`/api/users/${id}`);
 const data = await response.json();

 if (!isUser(data)) {
 throw new Error('Invalid user data received from API');
 }

 return data;
};
``` By following these patterns, you'll ensure your React components are tightly integrated with your database schema, providing end-to-end type safety throughout your application.

## See Also - [TypeScript React Component Pattern](typescript-react-component-patterns.md) - 33% matc h - [React TypeScript Best Practice](react-typescript-best-practices.md) - 25% matc

h

- [React TypeScript Cheatshee](react-typescript-cheatsheet.md) - 25% match
- [Security Integration Anti-Patterns and Best Practice](SECURITY_INTEGRATION_ANTIPATTERNS.md) - 18% match
- [Creating a New React Component with TypeScrip](new-component-setup-guide.md) - 18% match