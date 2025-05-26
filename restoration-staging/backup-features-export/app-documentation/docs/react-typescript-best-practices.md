# React TypeScript Best Practi

c

e s

## Introduction our recommended practices for using TypeScript with React components. Following these guidelines will help ensure that our codebase remains consistent, type-safe, and maintainabl

e.

## Component Definition ### Functional Components Use React.FC for function components with explicit typing for prop

s:

```typescript

// Preferred approach

interface ButtonProps {
 label: string;
 onClick: () => void;
 disabled?: boolean;
 variant?: 'primary' | 'secondary' | 'outline';
}

// Option 1: Using React.FC (Function Component)

const Button: React.FC<ButtonProps> = ({
 label,
 onClick,
 disabled = false,
 variant = 'primary'
}) => {
 return (
 <button
 className={`btn btn-${variant}`}
 disabled={disabled}
 onClick={onClick}
 >
 {label}
 </button>
 );
};

// Option 2: Using function declaration with explicit return type

function Button({
 label,
 onClick,
 disabled = false,
 variant = 'primary'
}: ButtonProps): JSX.Element {
 return (
 <button
 className={`btn btn-${variant}`}
 disabled={disabled}
 onClick={onClick}
 >
 {label}
 </button>
 );
}
``` ### Class Components For class components, explicitly type props and stat

e:

```typescript

interface CounterProps {
 initialCount: number;
 step?: number;
}

interface CounterState {
 count: number;
}

class Counter extends React.Component<CounterProps, CounterState> {
 constructor(props: CounterProps) {
 super(props);
 this.state = {
 count: props.initialCount
 };
 }

 increment = (): void => {
 this.setState(prevState => ({
 count: prevState.count + (this.props.step || 1)
 }));
 };

 render(): JSX.Element {
 return (
 <div>
 <p>Count: {this.state.count}</p>
 <button onClick={this.increment}>Increment</button>
 </div>
 );
 }
}
```

## Props Interface Design ### Naming Conventions - Name interfaces with the component name followed by `Props`: `ButtonProps`, `UserProfileProp s` - For shared prop interfaces, use descriptive names: `FormFieldProps`, `TableColumnProps` ### Required vs Optional Props - Mark truly optional props with the `?` operato r - Provide default values for optional props with default

s

```typescript

interface CardProps {
 title: string; // Required
 content: string; // Required
 footer?: React.ReactNode; // Optional
 className?: string; // Optional
 onClick?: () => void; // Optional
}

const Card: React.FC<CardProps> = ({
 title,
 content,
 footer,
 className = '',
 onClick
}) => {
 // Component implementation
};
``` ### Prop Composition Use composition to build complex prop interface

s:

```typescript
// Base props shared by multiple components

interface BaseButtonProps {
 className?: string;
 disabled?: boolean;
 children: React.ReactNode;
}

// Primary button with specific props

interface PrimaryButtonProps extends BaseButtonProps {
 variant: 'primary';
 color?: 'blue' | 'green';
}

// Secondary button with different props

interface SecondaryButtonProps extends BaseButtonProps {
 variant: 'secondary';
 outline?: boolean;
}

// Union type for all button props

type ButtonProps = PrimaryButtonProps | SecondaryButtonProps;

const Button: React.FC<ButtonProps> = (props) => {
 // Use type narrowing to handle different prop types
 if (props.variant === 'primary') {
 // PrimaryButtonProps available here
 const color = props.color || 'blue';
 // ...
 } else {
 // SecondaryButtonProps available here
 const outline = props.outline || false;
 // ...
 }

 // Component implementation
};
```

## Event Handling ### Event Types Use React's built-in event types for handler

s:

```typescript

interface FormProps {
 onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
 onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
 onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
``` ### Generic Event Handlers For reusable handlers, consider using generic

s:

```typescript
// Generic change handler

function handleChange<T extends HTMLElement>(
 setter: React.Dispatch<React.SetStateAction<string>>
) {
 return (e: React.ChangeEvent<T>) => {
 setter(e.currentTarget.value);
 };
}

// Usage

const [name, setName] = useState('');

const nameChangeHandler = handleChange<HTMLInputElement>(setName);

<input type="text" value={name} onChange={nameChangeHandler} />
```

## State Management ### useState with Type Inference Let TypeScript infer types when possibl

e:

```typescript

// Good: Type is inferred from initial value

const [count, setCount] = useState(0);

const [user, setUser] = useState<User | null>(null);
``` ### useState with Explicit Types Use explicit types for complex or union type

s:

```typescript

type Status = 'idle' | 'loading' | 'success' | 'error';

// Explicit typing needed for union types

const [status, setStatus] = useState<Status>('idle');

// For objects with potential undefined properties

interface FormData {
 name: string;
 email: string;
 age?: number;
}

const [formData, setFormData] = useState<FormData>({
 name: '',
 email: ''
});
``` ### useReducer with TypeScript Type actions and state for reducer

s:

```typescript
// Define state type

interface CounterState {
 count: number;
 step: number;
}

// Define action types

type CounterAction =
 | { type: 'INCREMENT' }
 | { type: 'DECREMENT' }
 | { type: 'SET_COUNT'; payload: number }
 | { type: 'SET_STEP'; payload: number };

// Implement typed reducer

function counterReducer(state: CounterState, action: CounterAction): CounterState {
 switch (action.type) {
 case 'INCREMENT':
 return { ...state, count: state.count + state.step };
 case 'DECREMENT':
 return { ...state, count: state.count - state.step };
 case 'SET_COUNT':
 return { ...state, count: action.payload };
 case 'SET_STEP':
 return { ...state, step: action.payload };
 default:
 return state;
 }
}

// Use in component

const [state, dispatch] = useReducer(counterReducer, { count: 0, step: 1 });

// Type-safe dispatch

dispatch({ type: 'INCREMENT' });

dispatch({ type: 'SET_COUNT', payload: 10 });
```

## Context API ### Typed Context Provider Create contexts with explicit type

s:

```typescript

interface ThemeContextType {
 theme: 'light' | 'dark';
 toggleTheme: () => void;
}

// Create context with a default value

const ThemeContext = React.createContext<ThemeContextType>({
 theme: 'light',
 toggleTheme: () => {}
});

// Provider component

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
 const [theme, setTheme] = useState<'light' | 'dark'>('light');

 const toggleTheme = () => {
 setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
 };

 return (
 <ThemeContext.Provider value={{ theme, toggleTheme }}>
 {children}
 </ThemeContext.Provider>
 );
};

// Custom hook for using this context

export const useTheme = () => useContext(ThemeContext);
```

## Refs ### Typed Ref

s

```typescript

// For DOM elements

const inputRef = useRef<HTMLInputElement>(null);

// For class components

const counterRef = useRef<Counter>(null);

// Usage
<input ref={inputRef} type="text" />
<Counter ref={counterRef} initialCount={0} />

// Safely accessing

if (inputRef.current) {
 inputRef.current.focus();
}
```

## Handling Children ### Children Prop Type

s

```typescript

// Basic children

interface PanelProps {
 children: React.ReactNode;
}

// Specific children types

interface ListProps {
 children: React.ReactElement<ListItemProps> | React.ReactElement<ListItemProps>[];
}

// Function children (render props)

interface CollapsibleProps {
 children: (isOpen: boolean) => React.ReactNode;
}

// Usage of render props
<Collapsible>
 {(isOpen) => (
 <div>
 {isOpen ? 'Content is visible' : 'Content is hidden'}
 </div>
 )}
</Collapsible>
```

## Type Guards for Components ### Custom Type Guard

s

```typescript

interface AdminUserProps {
 user: {
 name: string;
 role: 'admin';
 permissions: string[];
 };
}

interface RegularUserProps {
 user: {
 name: string;
 role: 'user';
 };
}

type UserProps = AdminUserProps | RegularUserProps;

// Type guard function

function isAdminUser(props: UserProps): props is AdminUserProps {
 return props.user.role === 'admin';
}

const UserProfile: React.FC<UserProps> = (props) => {
 if (isAdminUser(props)) {
 // AdminUserProps is available here
 return (
 <div>
 <h1>Admin: {props.user.name}</h1>
 <p>Permissions: {props.user.permissions.join(', ')}</p>
 </div>
 );
 }

 // RegularUserProps is available here
 return (
 <div>
 <h1>User: {props.user.name}</h1>
 </div>
 );
};
```

## Data Fetching ### Typed API Response

s

```typescript

interface User {
 id: number;
 name: string;
 email: string;
}

// Typed async function

async function fetchUser(id: number): Promise<User> {
 const response = await fetch(`/api/users/${id}`);
 if (!response.ok) {
 throw new Error(`Failed to fetch user: ${response.statusText}`);
 }
 return response.json() as Promise<User>;
}

// Usage in component

const UserDetails: React.FC<{userId: number}> = ({ userId }) => {
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<Error | null>(null);

 useEffect(() => {
 setLoading(true);
 fetchUser(userId)
 .then(data => {
 setUser(data);
 setError(null);
 })
 .catch(err => {
 setError(err);
 setUser(null);
 })
 .finally(() => {
 setLoading(false);
 });
 }, [userId]);

 if (loading) return <div>Loading...</div>;
 if (error) return <div>Error: {error.message}</div>;
 if (!user) return <div>No user found</div>;

 return (
 <div>
 <h1>{user.name}</h1>
 <p>{user.email}</p>
 </div>
 );
};
```

## HOC (Higher Order Components) ### Typed HOC

s

```typescript

// Props interface for the wrapped component

interface WithLoadingProps {
 loading: boolean;
}

// HOC function

function withLoading<P extends object>(
 Component: React.ComponentType<P>
): React.FC<P & WithLoadingProps> {
 return ({ loading, ...props }: WithLoadingProps & P) => {
 if (loading) {
 return <div>Loading...</div>;
 }

 return <Component {...props as P} />;
 };
}

// Original component

interface UserListProps {
 users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => (
 <ul>
 {users.map(user => (
 <li key={user.id}>{user.name}</li>
 ))}
 </ul>
);

// Enhanced component with HOC

const UserListWithLoading = withLoading(UserList);

// Usage
<UserListWithLoading loading={isLoading} users={users} />
```

## Common Patterns ### Conditional Renderin

g

```typescript

interface ConditionalProps<T> {
 condition: boolean;
 trueRender: () => T;
 falseRender: () => T;
}

function Conditional<T>({
 condition,
 trueRender,
 falseRender
}: ConditionalProps<T>): T {
 return condition ? trueRender() : falseRender();
}

// Usage
<Conditional
 condition={isLoggedIn}
 trueRender={() => <UserDashboard user={user} />}
 falseRender={() => <LoginScreen />}
/>
``` ### Flexible Component Prop

s

```typescript

type ButtonVariant = 'primary' | 'secondary' | 'danger';

// Base button props that all variants share

interface BaseButtonProps {
 children: React.ReactNode;
 onClick?: () => void;
 disabled?: boolean;
}

// Props specific to each variant

interface PrimaryButtonProps extends BaseButtonProps {
 variant: 'primary';
 size?: 'small' | 'medium' | 'large';
}

interface SecondaryButtonProps extends BaseButtonProps {
 variant: 'secondary';
 outline?: boolean;
}

interface DangerButtonProps extends BaseButtonProps {
 variant: 'danger';
 confirmText?: string;
}

// Union of all possible button props

type ButtonProps =
 | PrimaryButtonProps
 | SecondaryButtonProps
 | DangerButtonProps;

// Button component with type narrowing

const Button: React.FC<ButtonProps> = (props) => {
 const { variant, children, onClick, disabled } = props;

 // Common props for all buttons
 const baseProps = {
 onClick,
 disabled,
 className: `btn btn-${variant}`
 };

 // Type narrowing based on variant
 switch (variant) {
 case 'primary':
 const { size = 'medium' } = props;
 return (
 <button {...baseProps} className={`${baseProps.className} btn-${size}`}>
 {children}
 </button>
 );

 case 'secondary':
 const { outline = false } = props;
 return (
 <button {...baseProps} className={`${baseProps.className} ${outline ? 'outlined' : ''}`}>
 {children}
 </button>
 );

 case 'danger':
 const { confirmText } = props;
 const handleClick = () => {
 if (!confirmText || window.confirm(confirmText)) {
 onClick?.();
 }
 };

 return (
 <button {...baseProps} onClick={handleClick}>
 {children}
 </button>
 );
 }
};
```

## Optimization ### React.memo with TypeScrip

t

```typescript

interface ListItemProps {
 id: number;
 title: string;
 onSelect: (id: number) => void;
}

// Memoized component with properly typed props

const ListItem = React.memo<ListItemProps>(({ id, title, onSelect }) => (
 <li onClick={() => onSelect(id)}>{title}</li>
));

// With custom equality function

const areEqual = (
 prevProps: ListItemProps,
 nextProps: ListItemProps
) => {
 return prevProps.id === nextProps.id &&
 prevProps.title === nextProps.title;
};

const MemoizedListItem = React.memo<ListItemProps>(
 ({ id, title, onSelect }) => (
 <li onClick={() => onSelect(id)}>{title}</li>
 ),
 areEqual
);
``` ### Callback Memoizatio

n

```typescript

interface TodoItemProps {
 id: number;
 title: string;
 completed: boolean;
 onToggle: (id: number) => void;
 onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
 id,
 title,
 completed,
 onToggle,
 onDelete
}) => {
 // Memoized callbacks
 const handleToggle = useCallback(() => {
 onToggle(id);
 }, [id, onToggle]);

 const handleDelete = useCallback(() => {
 onDelete(id);
 }, [id, onDelete]);

 return (
 <div>
 <input
 type="checkbox"
 checked={completed}
 onChange={handleToggle}
 />
 <span style={{ textDecoration: completed ? 'line-through' : 'none' }}>
 {title}
 </span>
 <button onClick={handleDelete}>Delete</button>
 </div>
 );
};
```

## Form Handling ### Typed Form Event

s

```typescript

interface LoginFormProps {
 onSubmit: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');

 const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setUsername(e.target.value);
 };

 const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setPassword(e.target.value);
 };

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 onSubmit(username, password);
 };

 return (
 <form onSubmit={handleSubmit}>
 <div>
 <label htmlFor="username">Username:</label>
 <input
 id="username"
 type="text"
 value={username}
 onChange={handleUsernameChange}
 />
 </div>
 <div>
 <label htmlFor="password">Password:</label>
 <input
 id="password"
 type="password"
 value={password}
 onChange={handlePasswordChange}
 />
 </div>
 <button type="submit">Login</button>
 </form>
 );
};
```

## Custom Hooks ### Typed Custom Hook

s

```typescript

// Generic useLocalStorage hook

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
 // State to store our value
 const [storedValue, setStoredValue] = useState<T>(() => {
 try {
 // Get from local storage by key
 const item = window.localStorage.getItem(key);
 // Parse stored json or if none return initialValue
 return item ? JSON.parse(item) : initialValue;
 } catch (error) {
 // If error also return initialValue
 console.error(error);
 return initialValue;
 }
 });

 // Return a wrapped version of useState's setter function that
 // persists the new value to localStorage.
 const setValue = (value: T) => {
 try {
 // Allow value to be a function so we have same API as useState
 const valueToStore =
 value instanceof Function ? value(storedValue) : value;
 // Save state
 setStoredValue(valueToStore);
 // Save to local storage
 window.localStorage.setItem(key, JSON.stringify(valueToStore));
 } catch (error) {
 // A more advanced implementation would handle the error case
 console.error(error);
 }
 };

 return [storedValue, setValue];
}

// Usage

interface User {
 id: number;
 name: string;
 email: string;
}

function UserProfile() {
 const [user, setUser] = useLocalStorage<User | null>('user', null);

 // ...component code
}
```

## Error Boundaries ### Typed Error Boundarie

s

```typescript

interface ErrorBoundaryProps {
 fallback: React.ReactNode;
 children: React.ReactNode;
}

interface ErrorBoundaryState {
 hasError: boolean;
 error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
 constructor(props: ErrorBoundaryProps) {
 super(props);
 this.state = {
 hasError: false,
 error: null
 };
 }

 static getDerivedStateFromError(error: Error): ErrorBoundaryState {
 // Update state so the next render will show the fallback UI.
 return {
 hasError: true,
 error
 };
 }

 componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
 // You can also log the error to an error reporting service
 console.error("Uncaught error:", error, errorInfo);
 }

 render(): React.ReactNode {
 if (this.state.hasError) {
 // You can render any custom fallback UI
 return this.props.fallback;
 }

 return this.props.children;
 }
}

// Usage
<ErrorBoundary fallback={<div>Something went wrong</div>}>
 <MyComponent />
</ErrorBoundary>
```

## Best Practices Summary 1. **Always define explicit interfaces** for props and stat e 2. **Use discriminated unions** for complex component props 3. **Leverage type inference** when appropriate 4. **Apply proper typing** to event handlers 5. **Create reusable typed hooks** for common functionality 6. **Use type guards** to narrow types when needed 7. **Document component interfaces** with JSDoc comments 8. **Avoid `any` type** - use generic types or unknown instead 9. **Write tests** that validate type behavior 10. **Keep props interfaces focused** - split large interfaces into smaller one

s

## Tools - Use ESLint with TypeScript rules to ensure code qualit y - Run `npm run ts-react-checker -- path/to/component.tsx` to validate component type s - Configure IDE extensions for better TypeScript integration By following these guidelines, we can ensure that our React components are type-safe, maintainable, and consistent across our codebas

e.

## See Also - [TypeScript React Component Pattern](typescript-react-component-patterns.md) - 43% matc h - [TypeScript React Component Pattern](typescript-react-patterns.md) - 43% matc

h

- [React Component TypeScript Guid](react-component-typescript-guide.md) - 33% match
- [React TypeScript Cheatshee](react-typescript-cheatsheet.md) - 33% match
- [TypeScript Implementation Strategy for Security Management Platfor](typescript-implementation-strategy.md) - 33% match