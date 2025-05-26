# React TypeScript Cheatsh

e

e t This quick reference guide provides code snippets for common React TypeScript patterns to ensure your components match our codebase requirements.

## Component Definitions ### Basic Functional Componen

t

```tsx

interface ButtonProps {
 label: string;
 onClick: () => void;
 disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
 label,
 onClick,
 disabled = false
}) => {
 return (
 <button onClick={onClick} disabled={disabled}>
 {label}
 </button>
 );
};
``` ### Component with Childre

n

```tsx

interface CardProps {
 title: string;
 children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
 return (
 <div className="card">
 <div className="card-header">{title}</div>
 <div className="card-body">{children}</div>
 </div>
 );
};
```

## Event Handling ### Mouse Event

s

```tsx

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
 console.log('Button clicked', e.currentTarget);
};

<button onClick={handleClick}>Click Me</button>
``` ### Form Event

s

```tsx

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 // Form submission logic
};

<form onSubmit={handleSubmit}>
 {/* Form fields */}
</form>
``` ### Input Change

s

```tsx

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setInputValue(e.target.value);
};

<input type="text" onChange={handleChange} value={inputValue} />
```

## State Hooks ### Basic useStat

e

```tsx

const [count, setCount] = useState<number>(0);

const [text, setText] = useState<string>('');

const [isActive, setIsActive] = useState<boolean>(false);
``` ### Complex State Type

s

```tsx

interface User {
 id: string;
 name: string;
 email: string;
}

const [user, setUser] = useState<User | null>(null);

const [users, setUsers] = useState<User[]>([]);
``` ### Union Type Stat

e

```tsx

type Status = 'idle' | 'loading' | 'success' | 'error';

const [status, setStatus] = useState<Status>('idle');
```

## useReducer with TypeScrip

t

```tsx

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

// In component

const [state, dispatch] = useReducer(reducer, { count: 0, loading: false });
```

## Data Fetching with React Quer

y

```tsx

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiRequest } from '@lib/queryClient';

import { User } from '@shared/schema';

// Fetch users

const { data, isLoading, error } = useQuery<User[]>({
 queryKey: ['/api/users'],
 queryFn: () => apiRequest('/api/users')
});

// Create user mutation

const queryClient = useQueryClient();

const mutation = useMutation({
 mutationFn: (newUser: Omit<User, 'id'>) =>
 apiRequest('/api/users', { method: 'POST', body: newUser }),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['/api/users'] });
 }
});

// Usage

mutation.mutate({ name: 'John', email: 'john@example.com' });
```

## Form Handling with React Hook For

m

```tsx

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

// Define schema

const formSchema = z.object({
 email: z.string().email('Invalid email'),
 password: z.string().min(8, 'Password must be at least 8 characters')
});

// Infer type

type FormData = z.infer<typeof formSchema>;

// Form component

function LoginForm() {
 const {
 register,
 handleSubmit,
 formState: { errors }
 } = useForm<FormData>({
 resolver: zodResolver(formSchema)
 });

 const onSubmit = (data: FormData) => {
 console.log(data);
 };

 return (
 <form onSubmit={handleSubmit(onSubmit)}>
 <div>
 <input {...register('email')} />
 {errors.email && <p>{errors.email.message}</p>}
 </div>

 <div>
 <input type="password" {...register('password')} />
 {errors.password && <p>{errors.password.message}</p>}
 </div>

 <button type="submit">Login</button>
 </form>
 );
}
```

## Custom Hook

s

```tsx

// Hook with return type

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
 const [storedValue, setStoredValue] = useState<T>(() => {
 try {
 const item = window.localStorage.getItem(key);
 return item ? JSON.parse(item) : initialValue;
 } catch (error) {
 console.error(error);
 return initialValue;
 }
 });

 const setValue = (value: T) => {
 try {
 setStoredValue(value);
 window.localStorage.setItem(key, JSON.stringify(value));
 } catch (error) {
 console.error(error);
 }
 };

 return [storedValue, setValue];
}

// Usage

const [user, setUser] = useLocalStorage<User | null>('user', null);
```

## Type Guard

s

```tsx

// Type guard function

function isUser(data: unknown): data is User {
 return (
 typeof data === 'object' &&
 data !== null &&
 'id' in data &&
 'name' in data &&
 'email' in data
 );
}

// Usage

function processApiResponse(data: unknown) {
 if (isUser(data)) {
 // TypeScript knows data is User here
 console.log(data.name);
 } else {
 console.error('Invalid user data');
 }
}
```

## Integration with Database Schem

a

```tsx

import { User, InsertUser } from '@shared/schema';

// Component props with schema types

interface UserFormProps {
 onSubmit: (data: InsertUser) => void;
 initialData?: Partial<User>;
 isLoading?: boolean;
}

// Component implementation

export const UserForm: React.FC<UserFormProps> = ({
 onSubmit,
 initialData = {},
 isLoading = false
}) => {
 // Form implementation
};
```

## Generic Component

s

```tsx

interface ListProps<T> {
 items: T[];
 renderItem: (item: T) => React.ReactNode;
 keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
 return (
 <ul>
 {items.map(item => (
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

<List<User>
 items={users}
 renderItem={(user) => <span>{user.name}</span>}
 keyExtractor={(user) => user.id}
/>
```

## Using Template References To quickly generate properly typed components, use the template generato

r:

```bash

./scripts/generate-ts-template.js
``` This interactive tool will guide you through creating TypeScript components that match our codebase requirements.

## See Also - [React Component TypeScript Guid](react-component-typescript-guide.md) - 43% matc h - [TypeScript React Component Pattern](typescript-react-component-patterns.md) - 43% matc

h

- [TypeScript React Component Pattern](typescript-react-patterns.md) - 43% match
- [React TypeScript Best Practice](react-typescript-best-practices.md) - 33% match
- [Component Optimization Implementations](COMPONENT_OPTIMIZATION_IMPLEMENTATIONS.md) - 25% match