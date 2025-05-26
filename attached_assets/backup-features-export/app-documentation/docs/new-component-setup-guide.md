# Creating a New React Component with TypeScr

i

p t This guide will walk you through creating a new React component that follows our project's TypeScript standards and coding conventions.

## Step 1: Choose the Component Type Decide which type of component you need to create: - **UI Component**: Basic UI elements (buttons, inputs, cards, et c.) - **Feature Component**: More complex components with business logi c - **Page Component**: Top-level components that represent a rout

e

- **Layout Component**: Structural components for page layout

## Step 2: Create the Component File Create a new file in the appropriate directory: - UI components go in `client/src/components/u i/` - Feature components go in `client/src/components/feature s/` - Page components go in `client/src/page

s/`

- Layout components go in `client/src/components/layout/` Use PascalCase for the component file name (e.g., `UserCard.tsx`).

## Step 3: Define the Component Props Interface Start by defining a TypeScript interface for your component's prop

s:

```typescript

interface ButtonProps {
 // Required props
 label: string;
 onClick: () => void;

 // Optional props (note the ?)
 variant?: 'primary' | 'secondary' | 'outline';
 disabled?: boolean;
 size?: 'sm' | 'md' | 'lg';
 icon?: React.ReactNode;
}
```

## Step 4: Create the Component Use the defined interface with a functional componen

t:

```typescript

import React from 'react';

const Button: React.FC<ButtonProps> = ({
 label,
 onClick,
 variant = 'primary',
 disabled = false,
 size = 'md',
 icon
}) => {
 return (
 <button
 className={`btn btn-${variant} btn-${size}`}
 onClick={onClick}
 disabled={disabled}
 >
 {icon && <span className="mr-2">{icon}</span>}
 {label}
 </button>
 );
};

export default Button;
```

## Step 5: Add Component Documentation Add JSDoc comments to document your componen

t:

```typescript

/**
 * Button component for user interactions
 *
 * @example
 * <Button
 * label="Submit"
 * onClick={() => console.log('Clicked')}
 * variant="primary"
 * />
 */

const Button: React.FC<ButtonProps> = ({
 // props
}) => {
 // component implementation
};
```

## Step 6: Handle Events Properly Ensure event handlers use the correct TypeScript type

s:

```typescript

// Button click handler

const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
 // Implementation
};

// Input change handler

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 // Implementation
};

// Form submit handler

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
 event.preventDefault();
 // Implementation
};
```

## Step 7: Test Your Component After creating your component, verify it with our TypeScript error checking tool

s:

```bash

./run-typescript-tools.sh check:components
```

## Complete Example of a Well-Typed Component Here's a complete example of a well-typed button componen

t:

```typescript

import React from 'react';

/**
 * Available button variant styles
 */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

/**
 * Available button sizes
 */

type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Button component
 */

interface ButtonProps {
 /** Text label to display on the button */
 label: string;

 /** Function called when the button is clicked */
 onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;

 /** Visual style variant of the button */
 variant?: ButtonVariant;

 /** Whether the button is disabled */
 disabled?: boolean;

 /** Size of the button */
 size?: ButtonSize;

 /** Optional icon to display before the label */
 icon?: React.ReactNode;

 /** Additional CSS class names */
 className?: string;

 /** Type of the button HTML element */
 type?: 'button' | 'submit' | 'reset';
}

/**
 * Button component for user interactions
 *
 * @example
 * <Button
 * label="Submit"
 * onClick={() => console.log('Clicked')}
 * variant="primary"
 * />
 */

const Button: React.FC<ButtonProps> = ({
 label,
 onClick,
 variant = 'primary',
 disabled = false,
 size = 'md',
 icon,
 className = '',
 type = 'button'
}) => {
 // Dynamically build class names
 const baseClass = 'btn';
 const variantClass = `btn-${variant}`;
 const sizeClass = `btn-${size}`;
 const disabledClass = disabled ? 'btn-disabled' : '';

 const buttonClasses = [
 baseClass,
 variantClass,
 sizeClass,
 disabledClass,
 className
 ].filter(Boolean).join(' ');

 return (
 <button
 type={type}
 className={buttonClasses}
 onClick={onClick}
 disabled={disabled}
 >
 {icon && <span className="btn-icon">{icon}</span>}
 <span className="btn-text">{label}</span>
 </button>
 );
};

export default Button;
```

## Common TypeScript Components Patterns ### Component with Childre

n

```typescript

interface CardProps {
 title: string;
 children: React.ReactNode;
 footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, footer }) => {
 return (
 <div className="card">
 <div className="card-header">{title}</div>
 <div className="card-body">{children}</div>
 {footer && <div className="card-footer">{footer}</div>}
 </div>
 );
};
``` ### Generic Componen

t

```typescript

interface ListProps<T> {
 items: T[];
 renderItem: (item: T) => React.ReactNode;
 keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
 return (
 <ul className="list">
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

<List<User>
 items={users}
 renderItem={(user) => <span>{user.name}</span>}
 keyExtractor={(user) => user.id}
/>
``` ### Form Component with React Hook For

m

```typescript

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

// Define schema with Zod

const formSchema = z.object({
 email: z.string().email('Invalid email address'),
 password: z.string().min(8, 'Password must be at least 8 characters')
});

// Infer TypeScript type from schema

type LoginFormData = z.infer<typeof formSchema>;

interface LoginFormProps {
 onSubmit: (data: LoginFormData) => void;
 isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
 const {
 register,
 handleSubmit,
 formState: { errors }
 } = useForm<LoginFormData>({
 resolver: zodResolver(formSchema)
 });

 return (
 <form onSubmit={handleSubmit(onSubmit)}>
 <div>
 <label>Email</label>
 <input {...register('email')} />
 {errors.email && <p>{errors.email.message}</p>}
 </div>

 <div>
 <label>Password</label>
 <input type="password" {...register('password')} />
 {errors.password && <p>{errors.password.message}</p>}
 </div>

 <button type="submit" disabled={isLoading}>
 {isLoading ? 'Loading...' : 'Login'}
 </button>
 </form>
 );
};
```

## Beyond Components Remember, proper TypeScript usage extends beyond components: - Use TypeScript for API service function s - Type your state management (Redux/Contex t) - Create shared type definitions in `client/src/type

s/`

- Use TypeScript for utility functions Always run TypeScript checks on your components to ensure they match our codebase requirements.

## See Also - [TypeScript Implementation Strategy for Security Management Platfor](typescript-implementation-strategy.md) - 33% matc h - [TypeScript Integration and Audit Logging Implementation Pla](typescript-integration-plan.md) - 33% matc

h

- [TypeScript React Component Pattern](typescript-react-component-patterns.md) - 33% match
- [Implementation Plan](IMPLEMENTATION_PLAN.md) - 25% match
- [React Component TypeScript Guid](react-component-typescript-guide.md) - 25% match