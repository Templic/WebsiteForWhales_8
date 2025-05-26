# Validation Framewor

k

This document provides a comprehensive overview of the validation framework implemented in the Dale Loves Whales application.

## Table of Contents 1. [Introduction](#introductio

n)

2. [Architecture](#architecture)

3. [Validation Types](#validation-types)

4. [Implementation](#implementation)

5. [Integration](#integration)

6. [Examples](#examples)

7. [Best Practices](#best-practices)

8. [Troubleshooting](#troubleshooting)

## Introduction The validation framework is a critical component of the application's security architecture, providing comprehensive protection against a wide range of security threats by ensuring that all data entering the system is valid, properly formatted, and safe for processing. ### Key Features - **Comprehensive Validation**: Validates all data entering the syste

m

- **Multi-level Validation**: Applies validation at multiple levels
- **Schema-based Validation**: Uses schemas to define expected data structures
- **Type Safety**: Ensures data types are correct
- **Custom Validation Rules**: Supports custom validation logic
- **Error Handling**: Provides detailed error messages
- **Integration**: Integrates with other security components

## Architecture The validation framework is designed with a layered architecture: ### 1. Input Layer - **Request Validation**: Validates HTTP request

s

- **Form Validation**: Validates form submissions
- **API Validation**: Validates API requests
- **File Validation**: Validates file uploads ### 2. Processing Layer - **Schema Validation**: Validates data against predefined schema

s
- **Type Validation**: Ensures data types are correct
- **Business Rule Validation**: Applies business rules
- **Cross-field Validation**: Validates related fields ### 3. Security Layer - **Sanitization**: Removes potentially harmful conten

t
- **Escaping**: Escapes special characters
- **Content Validation**: Validates content against allowlists
- **Security Rule Validation**: Applies security-specific rules ### 4. Output Layer - **Response Validation**: Validates HTTP response

s
- **Data Export Validation**: Validates exported data
- **API Response Validation**: Validates API responses
- **Format Validation**: Ensures correct output format

## Validation Types The framework supports several types of validation: ### Schema Validation Schema validation ensures that data conforms to a predefined structur

e:

```typescript

// Schema definition using Zod

const userSchema = z.object({
 id: z.string().uuid(),
 name: z.string().min(2).max(100),
 email: z.string().email(),
 age: z.number().int().min(18).optional(),
 role: z.enum(['user', 'admin']),
 preferences: z.object({
 theme: z.enum(['light', 'dark']).default('light'),
 notifications: z.boolean().default(true),
 }).optional(),
});

// Usage

const validateUser = (data: unknown): User => {
 return userSchema.parse(data);
};
``` ### Type Validation Type validation ensures that data has the correct typ

e:

```typescript
// Type definition

type User = {
 id: string;
 name: string;
 email: string;
 age?: number;
 role: 'user' | 'admin';
 preferences?: {
 theme: 'light' | 'dark';
 notifications: boolean;
 };
};

// Validation

const isUser = (data: unknown): data is User => {
 return userSchema.safeParse(data).success;
};
``` ### Business Rule Validation Business rule validation applies domain-specific rule

s:

```typescript
// Business rule validation

const validateUserBusinessRules = (user: User): ValidationResult => {
 const errors: ValidationError[] = [];

 // Email domain validation
 if (!user.email.endsWith('@example.com')) {
 errors.push({
 field: 'email',
 message: 'Email must be from example.com domain',
 });
 }

 // Age validation for certain roles
 if (user.role === 'admin' && (user.age || 0) < 21) {
 errors.push({
 field: 'age',
 message: 'Admin users must be at least 21 years old',
 });
 }

 return {
 valid: errors.length === 0,
 errors,
 };
};
``` ### Security Validation Security validation applies security-specific rule

s:

```typescript
// Security validation

const validateUserSecurity = (user: User): ValidationResult => {
 const errors: ValidationError[] = [];

 // Password complexity
 if (user.password && !isPasswordComplex(user.password)) {
 errors.push({
 field: 'password',
 message: 'Password does not meet complexity requirements',
 });
 }

 // Name XSS prevention
 if (user.name && containsXSS(user.name)) {
 errors.push({
 field: 'name',
 message: 'Name contains potentially unsafe content',
 });
 }

 return {
 valid: errors.length === 0,
 errors,
 };
};
```

## Implementation The validation framework is implemented using several components: ### Validation Schemas Validation schemas define the expected structure of dat

a:

```typescript

// User schema

export const userSchema = z.object({
 id: z.string().uuid(),
 name: z.string().min(2).max(100),
 email: z.string().email(),
 age: z.number().int().min(18).optional(),
 role: z.enum(['user', 'admin']),
 preferences: z.object({
 theme: z.enum(['light', 'dark']).default('light'),
 notifications: z.boolean().default(true),
 }).optional(),
});

// Create user schema

export const createUserSchema = userSchema.omit({ id: true });

// Update user schema

export const updateUserSchema = userSchema.partial();
``` ### Validation Functions Validation functions apply validation rules to dat

a:

```typescript
// Validate user

export const validateUser = (data: unknown): ValidationResult<User> => {
 try {
 const user = userSchema.parse(data);
 const businessRuleResult = validateUserBusinessRules(user);
 const securityResult = validateUserSecurity(user);

 if (!businessRuleResult.valid || !securityResult.valid) {
 return {
 valid: false,
 errors: [
 ...businessRuleResult.errors,
 ...securityResult.errors,
 ],
 data: null,
 };
 }

 return {
 valid: true,
 errors: [],
 data: user,
 };
 } catch (error) {
 if (error instanceof z.ZodError) {
 return {
 valid: false,
 errors: error.errors.map(err => ({
 field: err.path.join('.'),
 message: err.message,
 })),
 data: null,
 };
 }

 return {
 valid: false,
 errors: [{ field: '', message: 'Unknown validation error' }],
 data: null,
 };
 }
};
``` ### Validation Middleware Validation middleware applies validation to HTTP request

s:

```typescript
// Request validation middleware

export const validateRequest = (schema: z.ZodSchema) => {
 return (req: Request, res: Response, next: NextFunction) => {
 try {
 schema.parse(req.body);
 next();
 } catch (error) {
 if (error instanceof z.ZodError) {
 res.status(400).json({
 success: false,
 errors: error.errors.map(err => ({
 field: err.path.join('.'),
 message: err.message,
 })),
 });
 } else {
 res.status(500).json({
 success: false,
 errors: [{ field: '', message: 'Unknown validation error' }],
 });
 }
 }
 };
};
``` ### Validation Service The validation service provides centralized validation functionalit

y:

```typescript
// Validation service

export class ValidationService {
 private schemas: Map<string, z.ZodSchema> = new Map();

 // Register a schema
 public registerSchema(name: string, schema: z.ZodSchema): void {
 this.schemas.set(name, schema);
 }

 // Get a schema
 public getSchema(name: string): z.ZodSchema | null {
 return this.schemas.get(name) || null;
 }

 // Validate data against a schema
 public validate<T>(name: string, data: unknown): ValidationResult<T> {
 const schema = this.getSchema(name);

 if (!schema) {
 return {
 valid: false,
 errors: [{ field: '', message: `Schema '${name}' not found` }],
 data: null,
 };
 }

 try {
 const result = schema.parse(data);
 return {
 valid: true,
 errors: [],
 data: result as T,
 };
 } catch (error) {
 if (error instanceof z.ZodError) {
 return {
 valid: false,
 errors: error.errors.map(err => ({
 field: err.path.join('.'),
 message: err.message,
 })),
 data: null,
 };
 }

 return {
 valid: false,
 errors: [{ field: '', message: 'Unknown validation error' }],
 data: null,
 };
 }
 }
}
```

## Integration The validation framework integrates with other components of the application: ### Form Validation Integration with form validatio

n:

```tsx

// Form validation using react-hook-form and zod

const UserForm: React.FC = () => {
 const form = useForm<User>({
 resolver: zodResolver(userSchema),
 defaultValues: {
 name: '',
 email: '',
 role: 'user',
 preferences: {
 theme: 'light',
 notifications: true,
 },
 },
 });

 const onSubmit = (data: User) => {
 // Data is already validated
 createUser(data);
 };

 return (
 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)}>
 <FormField
 control={form.control}
 name="name"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Name</FormLabel>
 <FormControl>
 <Input {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 {/* Other form fields */}
 <Button type="submit">Submit</Button>
 </form>
 </Form>
 );
};
``` ### API Validation Integration with API validatio

n:

```typescript
// API validation

app.post('/api/users', validateRequest(createUserSchema), (req, res) => {
 // Request body is validated
 const user = req.body;

 // Create user
 const newUser = createUser(user);

 // Return response
 res.status(201).json(newUser);
});
``` ### Database Validation Integration with database validatio

n:

```typescript
// Database validation

export const insertUser = async (data: unknown): Promise<User> => {
 // Validate data
 const validationResult = validateUser(data);

 if (!validationResult.valid) {
 throw new ValidationError('Invalid user data', validationResult.errors);
 }

 // Insert user
 const user = validationResult.data!;
 const result = await db.insert(users).values(user).returning();

 return result[0];
};
```

## Examples ### Simple Validatio

n

```typescript

// Simple validation

const validateEmail = (email: string): boolean => {
 const emailSchema = z.string().email();
 return emailSchema.safeParse(email).success;
};
``` ### Complex Validatio

n

```typescript
// Complex validation

const validateOrder = (data: unknown): ValidationResult<Order> => {
 try {
 // Step 1: Schema validation
 const order = orderSchema.parse(data);

 // Step 2: Business rule validation
 if (order.items.length === 0) {
 return {
 valid: false,
 errors: [{ field: 'items', message: 'Order must have at least one item' }],
 data: null,
 };
 }

 // Step 3: Pricing validation
 const totalPrice = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
 if (Math.abs(totalPrice - order.totalPrice) > 0.01) {
 return {
 valid: false,
 errors: [{ field: 'totalPrice', message: 'Total price does not match item prices' }],
 data: null,
 };
 }

 // Step 4: Availability validation
 for (const item of order.items) {
 const isAvailable = checkItemAvailability(item.id, item.quantity);
 if (!isAvailable) {
 return {
 valid: false,
 errors: [{ field: `items[${item.id}].quantity`, message: 'Item is not available in the requested quantity' }],
 data: null,
 };
 }
 }

 return {
 valid: true,
 errors: [],
 data: order,
 };
 } catch (error) {
 if (error instanceof z.ZodError) {
 return {
 valid: false,
 errors: error.errors.map(err => ({
 field: err.path.join('.'),
 message: err.message,
 })),
 data: null,
 };
 }

 return {
 valid: false,
 errors: [{ field: '', message: 'Unknown validation error' }],
 data: null,
 };
 }
};
``` ### Form Validation Exampl

e

```tsx
// Form validation example

const ProductForm: React.FC = () => {
 const form = useForm<Product>({
 resolver: zodResolver(productSchema),
 defaultValues: {
 name: '',
 description: '',
 price: 0,
 category: '',
 inStock: true,
 },
 });

 const onSubmit = (data: Product) => {
 createProduct(data);
 };

 return (
 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
 <FormField
 control={form.control}
 name="name"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Product Name</FormLabel>
 <FormControl>
 <Input {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="description"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Description</FormLabel>
 <FormControl>
 <Textarea {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="price"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Price</FormLabel>
 <FormControl>
 <Input
 type="number"
 {...field}
 onChange={(e) => field.onChange(parseFloat(e.target.value))}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="category"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Category</FormLabel>
 <Select
 onValueChange={field.onChange}
 defaultValue={field.value}
 >
 <FormControl>
 <SelectTrigger>
 <SelectValue placeholder="Select a category" />
 </SelectTrigger>
 </FormControl>
 <SelectContent>
 <SelectItem value="electronics">Electronics</SelectItem>
 <SelectItem value="clothing">Clothing</SelectItem>
 <SelectItem value="books">Books</SelectItem>
 <SelectItem value="home">Home</SelectItem>
 </SelectContent>
 </Select>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="inStock"
 render={({ field }) => (
 <FormItem className="flex items-center gap-2">
 <FormControl>
 <Checkbox
 checked={field.value}
 onCheckedChange={field.onChange}
 />
 </FormControl>
 <FormLabel>In Stock</FormLabel>
 <FormMessage />
 </FormItem>
 )}
 />

 <Button type="submit">Submit</Button>
 </form>
 </Form>
 );
};
```

## Best Practices When using the validation framework, follow these best practices: 1. **Validate Early, Validate Often**: Apply validation at all entry point

s

2. **Use Schemas**: Define schemas for all data structures

3. **Type Safety**: Use TypeScript types for compile-time validation

4. **Error Handling**: Provide clear error messages

5. **Centralize Validation**: Use the validation service

6. **Test Validation**: Write tests for validation logic

7. **Layer Validation**: Apply validation at multiple layers

8. **Be Strict**: Reject invalid data early

9. **Be Specific**: Provide specific error messages

10. **Default Values**: Use default values for optional fields

## Troubleshooting If you encounter issues with the validation framework, try these troubleshooting steps: 1. **Check Schema Definitions**: Ensure schemas are correctly define

d

2. **Inspect Validation Errors**: Examine error messages

3. **Validate Input Data**: Verify input data is correct

4. **Check Integration**: Ensure validation is properly integrated

5. **Test Isolated**: Test validation logic in isolation

6. **Enable Debug Logging**: Enable debug logging for validation

7. **Review Usage**: Ensure validation is used correctly

8. **Check Custom Rules**: Verify custom validation rules

9. **Validate Manually**: Manually validate data to compare

10. **Review Documentation**: Consult documentation for guidance

## Related Documentation - [Security Overview](SECURITY.m

d)

- [API Security Implementation](API_SECURITY_IMPLEMENTATION.md)
- [CSRF Protection System](CSRF-PROTECTION-SYSTEM.md)
- [Rate Limiting System](RATE-LIMITING-SYSTEM.md) Last updated: May 11, 2025

## See Also - [AI Security Integration Documentation](../AI-SECURITY-INTEGRATION.md) - 18% matc

h

- [API Security Implementation](../API_SECURITY_IMPLEMENTATION.md) - 18% match
- [Application Architecture](../ARCHITECTURE.md) - 18% match
- [Security Audit Checklist](../SECURITY_AUDIT_CHECKLIST.md) - 18% match
- [Security Overview](SECURITY.md) - 18% match