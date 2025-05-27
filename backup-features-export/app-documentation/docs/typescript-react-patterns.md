# TypeScript React Component Patte

r

n s the common React component patterns used in our project and how to properly type them with TypeScript.

## Basic Component Patterns ### 1. Function Components with Explicit Prop Interfaces Always define explicit interfaces for component prop

s:

```typescript

interface ButtonProps {
 label: string;
 onClick: () => void;
 disabled?: boolean;
 variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = ({
 label,
 onClick,
 disabled = false,
 variant = 'primary'
}: ButtonProps) => {
 return (
 <button
 className={`btn btn-${variant}`}
 onClick={onClick}
 disabled={disabled}
 >
 {label}
 </button>
 );
};
``` ### 2. Components with Children For components that accept children, use React.ReactNode in the interfac

e:

```typescript

interface CardProps {
 title: string;
 children: React.ReactNode;
 footer?: React.ReactNode;
}

export const Card = ({ title, children, footer }: CardProps) => {
 return (
 <div className="card">
 <div className="card-header">{title}</div>
 <div className="card-body">{children}</div>
 {footer && <div className="card-footer">{footer}</div>}
 </div>
 );
};
``` ### 3. Generic Components For reusable components that work with different data type

s:

```typescript

interface DataListProps<T> {
 items: T[];
 renderItem: (item: T) => React.ReactNode;
 keyExtractor: (item: T) => string;
}

export function DataList<T>({
 items,
 renderItem,
 keyExtractor
}: DataListProps<T>) {
 return (
 <ul className="data-list">
 {items.map((item) => (
 <li key={keyExtractor(item)}>
 {renderItem(item)}
 </li>
 ))}
 </ul>
 );
}

// Usage

interface User {
 id: string;
 name: string;
}

const users: User[] = [/* user data */];

<DataList<User>
 items={users}
 renderItem={(user) => <span>{user.name}</span>}
 keyExtractor={(user) => user.id}
/>
```

## Form Component Patterns ### 1. Form Components with React Hook For

m

```typescript

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

// Define validation schema

const loginSchema = z.object({
 email: z.string().email('Invalid email address'),
 password: z.string().min(8, 'Password must be at least 8 characters')
});

// Infer type from schema

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
 onSubmit: (data: LoginFormData) => void;
 isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
 const {
 register,
 handleSubmit,
 formState: { errors }
 } = useForm<LoginFormData>({
 resolver: zodResolver(loginSchema)
 });

 return (
 <form onSubmit={handleSubmit(onSubmit)}>
 <div>
 <label htmlFor="email">Email</label>
 <input id="email" {...register('email')} />
 {errors.email && <p>{errors.email.message}</p>}
 </div>

 <div>
 <label htmlFor="password">Password</label>
 <input id="password" type="password" {...register('password')} />
 {errors.password && <p>{errors.password.message}</p>}
 </div>

 <button type="submit" disabled={isLoading}>
 {isLoading ? 'Loading...' : 'Login'}
 </button>
 </form>
 );
};
```

## Data Fetching Patterns ### 1. Typed Data Fetching with React Quer

y

```typescript

import { useQuery, useMutation } from '@tanstack/react-query';

interface User {
 id: string;
 name: string;
 email: string;
}

// Define API response type

interface ApiResponse<T> {
 data: T;
 message: string;
 success: boolean;
}

// Get user function with proper typing

const getUser = async (id: string): Promise<ApiResponse<User>> => {
 const response = await fetch(`/api/users/${id}`);
 if (!response.ok) {
 throw new Error('Failed to fetch user');
 }
 return response.json();
};

// Component using the typed query

export const UserProfile = ({ userId }: { userId: string }) => {
 const { data, isLoading, error } = useQuery<ApiResponse<User>, Error>({
 queryKey: ['/api/users', userId],
 queryFn: () => getUser(userId)
 });

 if (isLoading) return <div>Loading...</div>;
 if (error) return <div>Error: {error.message}</div>;

 return (
 <div>
 <h1>{data?.data.name}</h1>
 <p>{data?.data.email}</p>
 </div>
 );
};
```

## Event Handler Patterns ### 1. Typed Event Handler

s

```typescript

interface ButtonProps {
 onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
 label: string;
}

export const Button = ({ onClick, label }: ButtonProps) => {
 return <button onClick={onClick}>{label}</button>;
};

// Form event handlers

interface FormProps {
 onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const Form = ({ onSubmit, children }: FormProps & { children: React.ReactNode }) => {
 return <form onSubmit={onSubmit}>{children}</form>;
};

// Input handlers with specific types

interface InputProps {
 value: string;
 onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
 placeholder?: string;
}

export const Input = ({ value, onChange, placeholder }: InputProps) => {
 return <input value={value} onChange={onChange} placeholder={placeholder} />;
};
```

## State Management Patterns ### 1. Typed useState Hoo

k

```typescript

// For primitive values

const [count, setCount] = useState<number>(0);

// For complex objects

interface User {
 id: string;
 name: string;
}

const [user, setUser] = useState<User | null>(null);

// For arrays

const [items, setItems] = useState<string[]>([]);

// For union types

type Status = 'idle' | 'loading' | 'success' | 'error';

const [status, setStatus] = useState<Status>('idle');
``` ### 2. Typed useReduce

r

```typescript

interface State {
 count: number;
 loading: boolean;
}

type Action =
 | { type: 'INCREMENT' }
 | { type: 'DECREMENT' }
 | { type: 'SET_LOADING'; payload: boolean };

function reducer(state: State, action: Action): State {
 switch (action.type) {
 case 'INCREMENT':
 return { ...state, count: state.count + 1 };
 case 'DECREMENT':
 return { ...state, count: state.count - 1 };
 case 'SET_LOADING':
 return { ...state, loading: action.payload };
 default:
 return state;
 }
}

function Counter() {
 const [state, dispatch] = useReducer(reducer, { count: 0, loading: false });

 return (
 <div>
 <p>Count: {state.count}</p>
 <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
 <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
 <button
 onClick={() => dispatch({ type: 'SET_LOADING', payload: !state.loading })}
 >
 Toggle Loading
 </button>
 </div>
 );
}
```

## Common TypeScript Error Fixes for React Components ### 1. Fixing "Property does not exist on typ

e"

```typescript

// Error: Property 'variant' does not exist on type '{ children: ReactNode; }'
<Button variant="primary">Click me</Button>

// Fix: Define variant in the props interface

interface ButtonProps {
 variant?: 'primary' | 'secondary';
 children: React.ReactNode;
}
``` ### 2. Fixing Event Handler Type Error

s

```typescript
// Error: Type 'string' is not assignable to type 'number'

function Counter() {
 const [count, setCount] = useState(0);

 // This will cause a type error
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setCount(e.target.value); // Error: string to number
 };

 // Fix: Convert string to number
 const handleChangeFixed = (e: React.ChangeEvent<HTMLInputElement>) => {
 setCount(Number(e.target.value));
 };

 return <input type="number" value={count} onChange={handleChangeFixed} />;
}
``` ### 3. Fixing Children Prop Error

s

```typescript
// Error: Type '{ title: string; }' is missing the following properties from type '{ title: string; children: ReactNode; }'
<Card title="Card Title" /> // Missing children prop

// Fix: Add children or make it optional

interface CardProps {
 title: string;
 children?: React.ReactNode; // Make children optional
}

// Or provide children when using the component
<Card title="Card Title">Content goes here</Card>
``` By following these patterns, you'll ensure consistent component typing across the codebase and minimize TypeScript errors.

## See Also - [TypeScript React Component Pattern](typescript-react-component-patterns.md) - 54% matc h - [React Component TypeScript Guid](react-component-typescript-guide.md) - 43% matc

h

- [React TypeScript Best Practice](react-typescript-best-practices.md) - 43% match
- [React TypeScript Cheatshee](react-typescript-cheatsheet.md) - 43% match
- [TypeScript Implementation Strategy for Security Management Platfor](typescript-implementation-strategy.md) - 43% match