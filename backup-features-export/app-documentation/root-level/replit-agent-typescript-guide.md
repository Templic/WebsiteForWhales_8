# TypeScript Code Generation Guide for Replit Age

n

t This document provides guidelines for generating TypeScript code that matches our codebase requirements. It's designed to ensure consistent, high-quality TypeScript code generation.

## Core TypeScript Requirements When generating TypeScript code for this project, always ensure: 1. **Explicit typing** for all variables, parameters, and return value s 2. **No `any` types** unless absolutely necessary 3. **Interface definitions** for object structures, especially component props 4. **Union types** instead of enums where appropriate 5. **Proper event typing** in React components 6. **Schema integration** with our database model

s

## React Component Standards ### Component Structure Follow this structure for React component

s:

```typescript

import React from 'react';
// Import other dependencies

// 1. Define props interface

interface ComponentNameProps {
 // Required props
 requiredProp: PropType;

 // Optional props with default values in component
 optionalProp?: PropType;
}

// 2. Define component with React.FC type

export const ComponentName: React.FC<ComponentNameProps> = ({
 requiredProp,
 optionalProp = defaultValue
}) => {
 // Component implementation
 return (
 <div>
 {/* Component JSX */}
 </div>
 );
};
``` ### Event Handler Types Always use specific event type

s:

```typescript
// Button click handler

const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
 // Handler implementation
};

// Input change handler

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 // Handler implementation
};

// Form submit handler

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
 event.preventDefault();
 // Handler implementation
};
``` ### State Hooks Always provide explicit types with hook

s:

```typescript
// Simple primitives (type inference works)

const [count, setCount] = useState(0);

const [name, setName] = useState('');

// Complex types or initially undefined/null values

const [user, setUser] = useState<User | null>(null);

const [items, setItems] = useState<Item[]>([]);

// Union types

type Status = 'idle' | 'loading' | 'success' | 'error';

const [status, setStatus] = useState<Status>('idle');
```

## API Integration ### Data Fetching with React Query Use this pattern with React Quer

y:

```typescript

import { useQuery } from '@tanstack/react-query';

import { apiRequest } from '@lib/queryClient';

import { SomeDataType } from '@shared/schema';

// Define the component

const DataComponent: React.FC = () => {
 // Use explicit type parameters with useQuery
 const { data, isLoading, error } = useQuery<SomeDataType[], Error>({
 queryKey: ['/api/some-endpoint'],
 queryFn: () => apiRequest('/api/some-endpoint')
 });

 // Handle loading and error states
 if (isLoading) return <div>Loading...</div>;
 if (error) return <div>Error: {error.message}</div>;

 // Render the data
 return (
 <div>
 {data?.map(item => (
 <div key={item.id}>{item.name}</div>
 ))}
 </div>
 );
};
``` ### Mutations For data mutation

s:

```typescript

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiRequest } from '@lib/queryClient';

import { InsertDataType } from '@shared/schema';

const DataForm: React.FC = () => {
 const queryClient = useQueryClient();

 // Type the mutation properly
 const mutation = useMutation({
 mutationFn: (newData: InsertDataType) =>
 apiRequest('/api/some-endpoint', {
 method: 'POST',
 body: newData
 }),

 onSuccess: () => {
 // Invalidate related queries
 queryClient.invalidateQueries({ queryKey: ['/api/some-endpoint'] });
 }
 });

 const handleSubmit = (formData: InsertDataType) => {
 mutation.mutate(formData);
 };

 // Component implementation
};
```

## Form Handling ### React Hook Form with Zod Use this pattern for form

s:

```typescript

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

// Define schema with Zod

const formSchema = z.object({
 email: z.string().email('Invalid email address'),
 password: z.string().min(8, 'Password must be at least 8 characters')
});

// Infer type from schema

type FormData = z.infer<typeof formSchema>;

// Component implementation

const FormComponent: React.FC = () => {
 const {
 register,
 handleSubmit,
 formState: { errors }
 } = useForm<FormData>({
 resolver: zodResolver(formSchema)
 });

 const onSubmit = (data: FormData) => {
 // Handle form submission
 };

 return (
 <form onSubmit={handleSubmit(onSubmit)}>
 {/* Form fields */}
 </form>
 );
};
```

## Database Schema Integration Always import types from our schema fil

e:

```typescript

import { User, InsertUser } from '@shared/schema';

// Use these types in components

interface UserCardProps {
 user: User;
 onEdit?: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
 // Component implementation
};
```

## Utility Functions For utility functions, always provide explicit return type

s:

```typescript

// String utilities

export function capitalize(str: string): string {
 return str.charAt(0).toUpperCase() + str.slice(1);
}

// Number utilities

export function formatCurrency(amount: number, currency = 'USD'): string {
 return new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency
 }).format(amount);
}

// Complex transformations

export function transformData<T, R>(
 data: T[],
 transformer: (item: T) => R
): R[] {
 return data.map(transformer);
}
```

## Type Guards Use type guards for runtime type checkin

g:

```typescript

// Type guard for user data

export function isUser(data: unknown): data is User {
 return (
 typeof data === 'object' &&
 data !== null &&
 'id' in data &&
 'username' in data
 );
}

// Usage

const handleApiResponse = (data: unknown) => {
 if (isUser(data)) {
 // TypeScript knows data is User here
 console.log(data.username);
 } else {
 console.error('Invalid user data');
 }
};
```

## Common Mistakes to Avoid 1. ❌ **Using `any` typ

e**

```typescript

 // Bad
 function processData(data: any) { ... }

 // Good
 function processData<T>(data: T) { ... }

``` 2. ❌ **Missing prop interfaces**

```typescript
 // Bad
 const Button = ({ label, onClick }) => { ... }

 // Good
 interface ButtonProps {
 label: string;
 onClick: () => void;
 }
 const Button: React.FC<ButtonProps> = ({ label, onClick }) => { ... }

``` 3. ❌ **Untyped event handlers**

```typescript
 // Bad
 const handleClick = (e) => { ... }

 // Good
 const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }

``` 4. ❌ **Non-null assertions**

```typescript
 // Bad
 const element = document.getElementById('root')!;

 // Good
 const element = document.getElementById('root');
 if (element) { ... }

``` 5. ❌ **Implicit any in array methods**

```typescript
 // Bad
 const numbers = [1, 2, 3];
 numbers.map(num => num.toString());

 // Good - TS infers correctly here, but be explicit in complex scenarios
 const numbers = [1, 2, 3];
 numbers.map((num: number) => num.toString());

```

## Type Safe Resource Access When accessing APIs or external resource

s:

```typescript

// Define response type

interface ApiResponse<T> {
 data: T;
 message: string;
 success: boolean;
}

// Get user function with proper typing

async function getUser(id: string): Promise<ApiResponse<User>> {
 try {
 const response = await fetch(`/api/users/${id}`);

 if (!response.ok) {
 throw new Error(`Failed to fetch user: ${response.statusText}`);
 }

 const data: unknown = await response.json();

 // Validate the response shape
 if (
 !data ||
 typeof data !== 'object' ||
 !('data' in data) ||
 !('success' in data)
 ) {
 throw new Error('Invalid API response format');
 }

 return data as ApiResponse<User>;
 } catch (error) {
 console.error('Error fetching user:', error);
 throw error;
 }
}
``` By following these guidelines, you'll ensure that all generated TypeScript code matches our codebase requirements and maintains high quality standards.