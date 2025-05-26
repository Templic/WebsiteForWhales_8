# React Component TypeScript Gu

i

d e This guide provides specific guidelines for creating React components with proper TypeScript definitions for our project. Following these standards will ensure consistent typing across all components, which helps with error prevention and code maintainability.

## Table of Contents 1. [Component Creation](#component-creat

i

o

n) 2. [Props Typing](#props-typing) 3. [State Management](#state-management) 4. [Event Handlers](#event-handlers) 5. [API Integration](#api-integration) 6. [Forms](#forms) 7. [Common Error Patterns](#common-error-patterns) 8. [TypeScript Checking Tools](#typescript-checking-tools) ## Component Creation ### Functional Components Always define functional components with explicit prop interface

s:

```typescript

// Example of a properly typed functional component

import React from 'react';

// Define the props interface

interface UserCardProps {
 user: {
 id: string;
 name: string;
 email: string;
 role: 'admin' | 'user';
 };
 onEdit: (userId: string) => void;
 isSelected?: boolean;
}

// Use the React.FC type with the props interface

export const UserCard: React.FC<UserCardProps> = ({
 user,
 onEdit,
 isSelected = false
}) => {
 return (
 <div className={`card ${isSelected ? 'selected' : ''}`}>
 <h3>{user.name}</h3>
 <p>{user.email}</p>
 <span className="badge">{user.role}</span>
 <button onClick={() => onEdit(user.id)}>Edit</button>
 </div>
 );
};
```

## Props Typing ### Required vs Optional Props Mark optional props with the `?` operator and provide default value

s:

```typescript

interface ButtonProps {
 label: string; // Required prop
 onClick: () => void; // Required prop
 variant?: 'primary' | 'secondary' | 'danger'; // Optional prop
 disabled?: boolean; // Optional prop
 icon?: React.ReactNode; // Optional prop
}

export const Button: React.FC<ButtonProps> = ({
 label,
 onClick,
 variant = 'primary', // Default value for optional prop
 disabled = false, // Default value for optional prop
 icon
}) => {
 return (
 <button
 className={`btn btn-${variant}`}
 onClick={onClick}
 disabled={disabled}
 >
 {icon && <span className="icon">{icon}</span>}
 {label}
 </button>
 );
};
``` ### Children Prop When a component accepts children, explicitly type the

m:

```typescript

interface CardProps {
 title: string;
 children: React.ReactNode; // Type for any valid React children
 footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, footer }) => {
 return (
 <div className="card">
 <div className="card-header">{title}</div>
 <div className="card-body">{children}</div>
 {footer && <div className="card-footer">{footer}</div>}
 </div>
 );
};
``` ### Generic Components For reusable components that work with different data type

s:

```typescript

interface DataTableProps<T> {
 data: T[];
 columns: {
 key: string;
 header: string;
 render?: (item: T) => React.ReactNode;
 }[];
 onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, any>>({
 data,
 columns,
 onRowClick
}: DataTableProps<T>) {
 return (
 <table className="data-table">
 <thead>
 <tr>
 {columns.map(column => (
 <th key={column.key}>{column.header}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {data.map((item, index) => (
 <tr
 key={index}
 onClick={() => onRowClick && onRowClick(item)}
 >
 {columns.map(column => (
 <td key={column.key}>
 {column.render
 ? column.render(item)
 : item[column.key]
 }
 </td>
 ))}
 </tr>
 ))}
 </tbody>
 </table>
 );
}

// Usage:

interface User {
 id: string;
 name: string;
 email: string;
}

<DataTable<User>
 data={users}
 columns={[
 { key: 'name', header: 'Name' },
 { key: 'email', header: 'Email' },
 {
 key: 'actions',
 header: 'Actions',
 render: (user) => (
 <button onClick={() => handleEdit(user.id)}>Edit</button>
 )
 }
 ]}
 onRowClick={handleRowClick}
/>
```

## State Management ### useState Hook Always provide explicit types with useStat

e:

```typescript

// For primitive values, TypeScript can infer the type

const [count, setCount] = useState(0);

const [name, setName] = useState('');

const [isActive, setIsActive] = useState(false);

// For complex types or when starting with null/undefined, use explicit typing

interface User {
 id: string;
 name: string;
 email: string;
}

// Option 1: Type argument on useState

const [user, setUser] = useState<User | null>(null);

// Option 2: Type inference from initial value

const [users, setUsers] = useState<User[]>([]);

// For union types

type Status = 'idle' | 'loading' | 'success' | 'error';

const [status, setStatus] = useState<Status>('idle');
``` ### useReducer Hook Define explicit action and state type

s:

```typescript
// Define the state type

interface CounterState {
 count: number;
 step: number;
}

// Define action types using discriminated unions

type CounterAction =
 | { type: 'INCREMENT' }
 | { type: 'DECREMENT' }
 | { type: 'RESET' }
 | { type: 'SET_COUNT'; payload: number }
 | { type: 'SET_STEP'; payload: number };

// Implement the reducer function

function counterReducer(state: CounterState, action: CounterAction): CounterState {
 switch (action.type) {
 case 'INCREMENT':
 return { ...state, count: state.count + state.step };
 case 'DECREMENT':
 return { ...state, count: state.count - state.step };
 case 'RESET':
 return { ...state, count: 0 };
 case 'SET_COUNT':
 return { ...state, count: action.payload };
 case 'SET_STEP':
 return { ...state, step: action.payload };
 default:
 return state;
 }
}

// Use in a component

function Counter() {
 const [state, dispatch] = useReducer(counterReducer, { count: 0, step: 1 });

 return (
 <div>
 <p>Count: {state.count}</p>
 <div>
 <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
 <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
 <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
 </div>
 <label>
 Step:
 <input
 type="number"
 value={state.step}
 onChange={(e) => dispatch({
 type: 'SET_STEP',
 payload: parseInt(e.target.value, 10) || 1
 })}
 />
 </label>
 </div>
 );
}
```

## Event Handlers ### Basic Event Handlers Use specific event types for handler

s:

```typescript

// Button click handler

const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
 console.log('Button clicked');
};

// Input change handler

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 setValue(event.target.value);
};

// Form submit handler

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
 event.preventDefault();
 // Form submission logic
};

// Focus events

const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
 console.log('Input focused');
};

// Drag events

const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
 // Drag handling logic
};

// Keyboard events

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
 if (event.key === 'Enter') {
 // Handle Enter key press
 }
};
``` ### Event Handler Props When defining event handler props, use the specific event type

s:

```typescript

interface InputProps {
 value: string;
 onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
 onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
 onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
 onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
 value,
 onChange,
 onFocus,
 onBlur,
 onKeyDown
}) => {
 return (
 <input
 value={value}
 onChange={onChange}
 onFocus={onFocus}
 onBlur={onBlur}
 onKeyDown={onKeyDown}
 />
 );
};
```

## API Integration ### Define Response Types Create explicit types for API requests and response

s:

```typescript

// Define API response types

interface ApiResponse<T> {
 data: T;
 message: string;
 success: boolean;
}

interface User {
 id: string;
 name: string;
 email: string;
 role: 'admin' | 'user';
 createdAt: string;
}

// Define fetch function with proper typing

async function fetchUser(id: string): Promise<ApiResponse<User>> {
 const response = await fetch(`/api/users/${id}`);
 if (!response.ok) {
 throw new Error('Failed to fetch user');
 }
 return response.json();
}

// Using React Query with proper typing

import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
 const { data, isLoading, error } = useQuery<ApiResponse<User>, Error>({
 queryKey: ['/api/users', userId],
 queryFn: () => fetchUser(userId)
 });

 if (isLoading) return <div>Loading...</div>;
 if (error) return <div>Error: {error.message}</div>;

 return (
 <div>
 <h1>{data?.data.name}</h1>
 <p>{data?.data.email}</p>
 <span>{data?.data.role}</span>
 </div>
 );
}
```

## Forms ### React Hook Form with Zod Our project uses React Hook Form with Zod validatio

n:

```typescript

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

// Define the form schema using Zod

const loginSchema = z.object({
 email: z.string().email('Invalid email address'),
 password: z.string().min(8, 'Password must be at least 8 characters'),
 rememberMe: z.boolean().optional().default(false)
});

// Infer the type from the schema

type LoginFormValues = z.infer<typeof loginSchema>;

// Form component with proper typing

export function LoginForm() {
 const {
 register,
 handleSubmit,
 formState: { errors, isSubmitting }
 } = useForm<LoginFormValues>({
 resolver: zodResolver(loginSchema),
 defaultValues: {
 email: '',
 password: '',
 rememberMe: false
 }
 });

 const onSubmit = async (data: LoginFormValues) => {
 try {
 // Form submission logic
 console.log('Form data:', data);
 } catch (error) {
 console.error('Login error:', error);
 }
 };

 return (
 <form onSubmit={handleSubmit(onSubmit)}>
 <div>
 <label htmlFor="email">Email</label>
 <input id="email" type="email" {...register('email')} />
 {errors.email && <p>{errors.email.message}</p>}
 </div>

 <div>
 <label htmlFor="password">Password</label>
 <input id="password" type="password" {...register('password')} />
 {errors.password && <p>{errors.password.message}</p>}
 </div>

 <div>
 <label>
 <input type="checkbox" {...register('rememberMe')} />
 Remember me
 </label>
 </div>

 <button type="submit" disabled={isSubmitting}>
 {isSubmitting ? 'Logging in...' : 'Login'}
 </button>
 </form>
 );
}
```

## Common Error Patterns ### Fixing "Property does not exist on typ

e"

```typescript

// Error: Property 'variant' does not exist on type '{ children: ReactNode; }'
<Button variant="primary">Click me</Button>

// Fix: Define variant in the props interface

interface ButtonProps {
 variant?: 'primary' | 'secondary';
 children: React.ReactNode;
}
``` ### Fixing "Type 'string' is not assignable to type 'numbe

r'"

```typescript
// Error

function Counter() {
 const [count, setCount] = useState(0);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setCount(e.target.value); // Type error: string to number
 };

 // Fix: Convert string to number
 const handleChangeFixed = (e: React.ChangeEvent<HTMLInputElement>) => {
 setCount(Number(e.target.value));
 };
}
``` ### Fixing non-null assertion issue

s

```typescript
// Bad practice: Using non-null assertion (!)

function Component() {
 const ref = useRef<HTMLDivElement>(null);

 useEffect(() => {
 // This could crash if ref.current is null
 ref.current!.focus();
 }, []);

 // Fix: Use optional chaining or check for null
 useEffect(() => {
 // Option 1: Optional chaining
 ref.current?.focus();

 // Option 2: Null check
 if (ref.current) {
 ref.current.focus();
 }
 }, []);
}
```

## TypeScript Checking Tools Our project includes several tools to help ensure proper TypeScript usage: 1. **React Component TypeScript Checker**: Check for React-specific TypeScript issue

s

```bash

 npm run check:react-components

``` 2. **TypeScript Error Finder**: Scan for general TypeScript errors

```bash
 npm run ts:scan

``` 3. **TypeScript Error Fixer**: Automatically fix common TypeScript errors

```bash
 npm run ts:fix

``` When a TypeScript error is detected in a React component, refer to this guide for solutions and best practices. Using the correct TypeScript patterns will help maintain code quality and prevent runtime errors.

## See Also - [React TypeScript Cheatshee](react-typescript-cheatsheet.md) - 43% matc h - [TypeScript React Component Pattern](typescript-react-component-patterns.md) - 43% matc

h

- [TypeScript React Component Pattern](typescript-react-patterns.md) - 43% match
- [React TypeScript Best Practice](react-typescript-best-practices.md) - 33% match
- [Creating a New React Component with TypeScrip](new-component-setup-guide.md) - 25% match