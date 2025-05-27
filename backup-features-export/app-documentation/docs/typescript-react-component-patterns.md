# TypeScript React Component Patte

r

n s our recommended patterns for React components using TypeScript. Following these patterns will ensure consistency across our security management platform.

## Function Component Patterns ### Basic Component with Props The preferred pattern for function components uses explicit prop interfaces and React.FC typin

g:

```tsx

interface UserProfileProps {
 userId: string;
 name: string;
 email: string;
 role: 'admin' | 'analyst' | 'user';
 onProfileUpdate?: (userId: string, updates: Partial<UserData>) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
 userId,
 name,
 email,
 role,
 onProfileUpdate
}) => {
 // Component implementation
 return (
 <div className="user-profile">
 <h2>{name}</h2>
 <div className="user-email">{email}</div>
 <div className="user-role">{role}</div>
 {onProfileUpdate && (
 <button onClick={() => onProfileUpdate(userId, { /* updates */ })}>
 Update Profile
 </button>
 )}
 </div>
 );
};

export default UserProfile;
``` ### Generic Components For components that work with different data types, use TypeScript generic

s:

```tsx

interface DataTableProps<T> {
 data: T[];
 columns: Array<{
 key: keyof T;
 header: string;
 render?: (item: T) => React.ReactNode;
 }>;
 keyExtractor: (item: T) => string;
 onRowClick?: (item: T) => void;
 isLoading?: boolean;
 emptyMessage?: string;
}

function DataTable<T>({
 data,
 columns,
 keyExtractor,
 onRowClick,
 isLoading = false,
 emptyMessage = 'No data available'
}: DataTableProps<T>): JSX.Element {
 if (isLoading) {
 return <div className="loading">Loading data...</div>;
 }

 if (data.length === 0) {
 return <div className="empty-state">{emptyMessage}</div>;
 }

 return (
 <table className="data-table">
 <thead>
 <tr>
 {columns.map(column => (
 <th key={String(column.key)}>{column.header}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {data.map(item => (
 <tr
 key={keyExtractor(item)}
 onClick={() => onRowClick && onRowClick(item)}
 className={onRowClick ? 'clickable' : ''}
 >
 {columns.map(column => (
 <td key={`${keyExtractor(item)}-${String(column.key)}`}>
 {column.render ? column.render(item) : String(item[column.key])}
 </td>
 ))}
 </tr>
 ))}
 </tbody>
 </table>
 );
}

// Usage example

interface User {
 id: string;
 name: string;
 email: string;
 role: string;
 lastLogin: string;
}

const UsersTable: React.FC<{ users: User[] }> = ({ users }) => {
 return (
 <DataTable<User>
 data={users}
 columns={[
 { key: 'name', header: 'Name' },
 { key: 'email', header: 'Email' },
 { key: 'role', header: 'Role' },
 {
 key: 'lastLogin',
 header: 'Last Login',
 render: (user) => new Date(user.lastLogin).toLocaleString()
 }
 ]}
 keyExtractor={(user) => user.id}
 onRowClick={(user) => console.log('Selected user:', user)}
 />
 );
};
``` ### Components with Children When working with components that accept children, explicitly type the children pro

p:

```tsx

interface CardProps {
 title: string;
 children: React.ReactNode;
 footer?: React.ReactNode;
 className?: string;
}

const Card: React.FC<CardProps> = ({
 title,
 children,
 footer,
 className = ''
}) => {
 return (
 <div className={`card ${className}`}>
 <div className="card-header">
 <h3>{title}</h3>
 </div>
 <div className="card-body">
 {children}
 </div>
 {footer && (
 <div className="card-footer">
 {footer}
 </div>
 )}
 </div>
 );
};

// Usage
<Card
 title="User Information"
 footer={<button>Save Changes</button>}
>
 <p>Card content goes here</p>
</Card>
```

## State Management in TypeScript ### UseState with TypeScript For simple state, let TypeScript infer the type from the initial valu

e:

```tsx

// TypeScript infers the correct types

const [count, setCount] = useState(0); // number

const [name, setName] = useState(''); // string

const [isActive, setIsActive] = useState(false); // boolean
``` For complex or nullable state, provide explicit type information:

```tsx
// Explicit typing for complex or nullable state

const [user, setUser] = useState<User | null>(null);

const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

const [selectedIds, setSelectedIds] = useState<string[]>([]);

// For objects with optional properties

interface FormData {
 name: string;
 email: string;
 age?: number;
 address?: {
 street?: string;
 city?: string;
 zipCode?: string;
 };
}

const [formData, setFormData] = useState<FormData>({
 name: '',
 email: ''
});

// Update nested state in a type-safe way

const updateFormField = (field: keyof FormData, value: any) => {
 setFormData(prev => ({
 ...prev,
 [field]: value
 }));
};

const updateAddressField = (field: keyof FormData['address'], value: string) => {
 setFormData(prev => ({
 ...prev,
 address: {
 ...prev.address,
 [field]: value
 }
 }));
};
``` ### UseReducer with TypeScript For complex state logic, use `useReducer` with typed actions and stat

e:

```tsx
// State interface

interface TodoState {
 todos: Todo[];
 filter: 'all' | 'active' | 'completed';
 loading: boolean;
 error: string | null;
}

// Define discriminated union for actions

type TodoAction =
 | { type: 'ADD_TODO'; payload: { text: string } }
 | { type: 'TOGGLE_TODO'; payload: { id: string } }
 | { type: 'REMOVE_TODO'; payload: { id: string } }
 | { type: 'SET_FILTER'; payload: TodoState['filter'] }
 | { type: 'FETCH_TODOS_START' }
 | { type: 'FETCH_TODOS_SUCCESS'; payload: { todos: Todo[] } }
 | { type: 'FETCH_TODOS_ERROR'; payload: { error: string } };

// Initial state

const initialState: TodoState = {
 todos: [],
 filter: 'all',
 loading: false,
 error: null
};

// Reducer function

function todoReducer(state: TodoState, action: TodoAction): TodoState {
 switch (action.type) {
 case 'ADD_TODO':
 return {
 ...state,
 todos: [
 ...state.todos,
 {
 id: Date.now().toString(),
 text: action.payload.text,
 completed: false
 }
 ]
 };
 case 'TOGGLE_TODO':
 return {
 ...state,
 todos: state.todos.map(todo =>
 todo.id === action.payload.id
 ? { ...todo, completed: !todo.completed }
 : todo
 )
 };
 case 'REMOVE_TODO':
 return {
 ...state,
 todos: state.todos.filter(todo => todo.id !== action.payload.id)
 };
 case 'SET_FILTER':
 return {
 ...state,
 filter: action.payload
 };
 case 'FETCH_TODOS_START':
 return {
 ...state,
 loading: true,
 error: null
 };
 case 'FETCH_TODOS_SUCCESS':
 return {
 ...state,
 loading: false,
 todos: action.payload.todos
 };
 case 'FETCH_TODOS_ERROR':
 return {
 ...state,
 loading: false,
 error: action.payload.error
 };
 default:
 return state;
 }
}

// Component using the reducer

const TodoApp: React.FC = () => {
 const [state, dispatch] = useReducer(todoReducer, initialState);

 // Type-safe dispatch examples
 const addTodo = (text: string) => {
 dispatch({ type: 'ADD_TODO', payload: { text } });
 };

 const toggleTodo = (id: string) => {
 dispatch({ type: 'TOGGLE_TODO', payload: { id } });
 };

 const fetchTodos = async () => {
 dispatch({ type: 'FETCH_TODOS_START' });
 try {
 const todos = await api.fetchTodos();
 dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: { todos } });
 } catch (error) {
 dispatch({
 type: 'FETCH_TODOS_ERROR',
 payload: { error: error instanceof Error ? error.message : 'Unknown error' }
 });
 }
 };

 return (
 // Component UI
 );
};
```

## Event Handling with TypeScript ### Form Event

s

```tsx

const LoginForm: React.FC = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 // Type-safe event handler
 const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setEmail(e.target.value);
 };

 const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setPassword(e.target.value);
 };

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 // Form submission logic
 };

 return (
 <form onSubmit={handleSubmit}>
 <div>
 <label htmlFor="email">Email</label>
 <input
 id="email"
 type="email"
 value={email}
 onChange={handleEmailChange}
 required
 />
 </div>
 <div>
 <label htmlFor="password">Password</label>
 <input
 id="password"
 type="password"
 value={password}
 onChange={handlePasswordChange}
 required
 />
 </div>
 <button type="submit">Login</button>
 </form>
 );
};
``` ### Mouse Event

s

```tsx

const ClickableCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
 const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
 // You can access properties like e.clientX, e.clientY
 onClick();
 };

 const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
 console.log(`Mouse position: (${e.clientX}, ${e.clientY})`);
 };

 return (
 <div
 className="clickable-card"
 onClick={handleClick}
 onMouseMove={handleMouseMove}
 >
 Click me!
 </div>
 );
};
``` ### Generic Event Handler Type

s

```tsx
// Generic handler for input changes

function createChangeHandler<T extends HTMLElement>(
 setter: React.Dispatch<React.SetStateAction<string>>
): (e: React.ChangeEvent<T>) => void {
 return (e) => {
 setter(e.target.value);
 };
}

// Usage

const [name, setName] = useState('');

const handleNameChange = createChangeHandler<HTMLInputElement>(setName);

<input value={name} onChange={handleNameChange} />
```

## Custom Hooks with TypeScrip

t

```tsx

// Custom hook with generic parameter and return type

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

const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);
```

## Context API with TypeScrip

t

```tsx

// Create a context with type

interface AuthContextType {
 user: User | null;
 login: (email: string, password: string) => Promise<void>;
 logout: () => void;
 isLoading: boolean;
 error: string | null;
}

// Default context value

const defaultAuthContext: AuthContextType = {
 user: null,
 login: async () => {
 throw new Error('login function not implemented');
 },
 logout: () => {
 throw new Error('logout function not implemented');
 },
 isLoading: false,
 error: null
};

// Create context

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Provider component

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
 const [user, setUser] = useState<User | null>(null);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const login = async (email: string, password: string) => {
 setIsLoading(true);
 setError(null);
 try {
 const userData = await api.login(email, password);
 setUser(userData);
 } catch (err) {
 setError(err instanceof Error ? err.message : 'Login failed');
 throw err;
 } finally {
 setIsLoading(false);
 }
 };

 const logout = () => {
 // Logout logic
 setUser(null);
 };

 return (
 <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
 {children}
 </AuthContext.Provider>
 );
};

// Custom hook to use the auth context

export const useAuth = (): AuthContextType => {
 const context = useContext(AuthContext);
 if (context === undefined) {
 throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
};

// Usage in components

const ProfilePage: React.FC = () => {
 const { user, logout } = useAuth();

 if (!user) {
 return <div>Please log in to view this page</div>;
 }

 return (
 <div>
 <h1>Profile: {user.name}</h1>
 <button onClick={logout}>Logout</button>
 </div>
 );
};
```

## Type Guards for Components Type guards help distinguish between different types in conditional logi

c:

```tsx

// Type guard for user roles

function isAdmin(user: User): user is User & { role: 'admin' } {
 return user.role === 'admin';
}

const UserActions: React.FC<{ user: User }> = ({ user }) => {
 // Type guard narrows the type
 if (isAdmin(user)) {
 // TypeScript knows user.role is 'admin' here
 return (
 <div className="admin-actions">
 <h3>Admin Actions</h3>
 <button>Manage Users</button>
 <button>System Settings</button>
 </div>
 );
 }

 // Regular user actions
 return (
 <div className="user-actions">
 <h3>User Actions</h3>
 <button>Edit Profile</button>
 <button>View Dashboard</button>
 </div>
 );
};

// For prop types with discriminated unions

type CardProps =
 | { variant: 'standard'; title: string; content: string }
 | { variant: 'image'; title: string; imageSrc: string; altText: string }
 | { variant: 'action'; title: string; actions: Array<{ label: string; onClick: () => void }> };

const Card: React.FC<CardProps> = (props) => {
 // Switch on discriminated union
 switch (props.variant) {
 case 'standard':
 return (
 <div className="card">
 <h3>{props.title}</h3>
 <p>{props.content}</p>
 </div>
 );
 case 'image':
 return (
 <div className="card">
 <h3>{props.title}</h3>
 <img src={props.imageSrc} alt={props.altText} />
 </div>
 );
 case 'action':
 return (
 <div className="card">
 <h3>{props.title}</h3>
 <div className="actions">
 {props.actions.map((action, index) => (
 <button key={index} onClick={action.onClick}>
 {action.label}
 </button>
 ))}
 </div>
 </div>
 );
 }
};
```

## Best Practices 1. **Always define explicit interfaces** for component prop s 2. **Use proper naming conventions**: - `InterfaceName` for interfaces - `TypeName` for type aliases - `EnumName` for enums 3. **Avoid the `any` type** - use `unknown` if the type is truly unknown 4. **Use union types** for props that can have multiple types 5. **Use type guards** to narrow types in conditional blocks 6. **Type event handlers** properly with React's event types 7. **Use discriminated unions** for complex props with different variants 8. **Document complex types** with JSDoc comments 9. **Consider extracting shared types** to separate files 10. **Use readonly** for immutable properties 11. **Use optional chaining and nullish coalescing** for potentially undefined values 12. **Leverage TypeScript's utility types** like `Partial<T>`, `Pick<T, K>`, and `Omit<T, K>` Following these patterns will lead to type-safe, maintainable, and self-documenting React component

s.

## See Also - [TypeScript React Component Pattern](typescript-react-patterns.md) - 54% matc h - [React Component TypeScript Guid](react-component-typescript-guide.md) - 43% matc

h

- [React TypeScript Best Practice](react-typescript-best-practices.md) - 43% match
- [React TypeScript Cheatshee](react-typescript-cheatsheet.md) - 43% match
- [Creating a New React Component with TypeScrip](new-component-setup-guide.md) - 33% match