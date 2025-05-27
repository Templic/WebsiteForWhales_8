# Dale Loves Whales Quick Reference Guid

e

This guide provides a quick reference to key aspects of the Dale Loves Whales application for developers.

## Tech Stack at a Glance | Component | Technolog

y |

|-----------|------------|

| Frontend | Next.js with React |
| Database | PostgreSQL (Neon serverless) |

| Styling | Tailwind CSS + Shadcn/ui |
| ORM | Drizzle |

| State Management | React Query |
| Routing | wouter |

| Authentication | JWT + OAuth 2.0 |
| Form Handling | React Hook Form + Zod |

## Important Directories | Directory | Purpos

e |

|-----------|---------|

| `client/src/components/` | React components |
| `client/src/pages/` | Page components |

| `client/src/hooks/` | Custom React hooks |
| `client/src/lib/` | Utility functions |

| `server/` | Backend code |
| `shared/` | Shared code (types, schema) |

| `docs/` | Documentation |
| `scripts/` | Utility scripts |

## Common Command

s

```bash

# Start development serve

r

npm run dev

# Run database migration

s

npm run db:push

# Run TypeScript type checkin

g

npm run typecheck

# Run lintin

g

npm run lint

# Run TypeScript error managemen

t

ts-node typescript-error-management.ts scan
```

## Database Updates To update the database structure: 1. Add/modify Drizzle models in `shared/schema.t

s`

2. Update `server/storage.ts` to reflect changes

3. Run `npm run db:push` to apply changes

```typescript
// Example schema addition in shared/schema.ts

export const newTable = pgTable('new_table', {
 id: serial('id').primaryKey(),
 name: text('name').notNull(),
 createdAt: timestamp('created_at').defaultNow().notNull()
});

// Create select and insert types

export type NewTable = typeof newTable.$inferSelect;

export const insertNewTableSchema = createInsertSchema(newTable).omit({ id: true });

export type InsertNewTable = z.infer<typeof insertNewTableSchema>;
```

## Authentication Authentication is handled via JWT tokens with the following routes: | Route | Method | Purpos

e |

|-------|--------|---------|

| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |

| `/api/auth/logout` | POST | User logout |
| `/api/auth/refresh` | POST | Refresh token |

| `/api/user` | GET | Get current user |

Authentication middleware function:

```typescript
// Authenticate a request

app.use('/api/secured-endpoint', authenticate, (req, res) => {
 // Only authenticated users can access this endpoint
 res.json({ message: 'Secured data' });
});
```

## Route Structure Routes are defined in `server/routes.ts` and organized by featur

e:

```javascript

// Example of route registration

export function registerRoutes(app: Express) {
 // Auth routes
 app.use('/api/auth', authRoutes);

 // User routes
 app.use('/api/user', userRoutes);

 // Feature-specific routes
 app.use('/api/music', musicRoutes);
 app.use('/api/cosmic', cosmicRoutes);
 app.use('/api/shop', shopRoutes);
 app.use('/api/community', communityRoutes);
}
```

## Security Features The application includes several security features: | Feature | Location | Purpos

e |

|---------|----------|---------|

| CSRF Protection | `server/middleware/csrf.ts` | Prevent cross-site request forgery |
| Rate Limiting | `server/middleware/rate-limit.ts` | Prevent abuse |

| Validation | `shared/validation/` | Validate input data |
| Content Security | `server/middleware/content-security.ts` | Prevent XSS |

## Common Error Solutions | Error | Solutio

n |

|-------|----------|

| TypeScript errors | Use the TypeScript Error Management System (`ts-node typescript-error-management.ts scan`) |
| Database connection issues | Check `DATABASE_URL` in environment variables |

| CSRF errors | Ensure your request includes the CSRF token from `req.csrfToken()` |
| Authorization errors | Check that the user has the required permissions |

| Rate limiting errors | Wait for the rate limit window to reset |

## Performance Optimization Key performance components: | Component | Purpos

e |

|-----------|---------|

| VirtualizedList | Optimize rendering of large lists |
| OptimizedImage | Performance-optimized image rendering |

| LazyLoad | Lazy loading of components |
| use-memory-tracker | Track memory usage |

## Documentation Key documentation: | Document | Purpos

e |

|----------|---------|

| [Documentation Guide](../DOCUMENTATION.md) | Main documentation index |
| [TypeScript Error Management](../typescript/TYPESCRIPT-ERROR-MANAGEMENT.md) | TS error handling |

| [Security Overview](../security/SECURITY.md) | Security features |
| [Component Guide](../components/COMPONENT_DOCUMENTATION_GUIDE.md) | Component standards |

## Getting Help If you encounter issues: 1. Check the documentation in the `docs/` director

y

2. Look for relevant examples in the codebase

3. Review TypeScript errors using the Error Management System

4. Check the security logs in the admin panel Last updated: May 11, 2025

## See Also - [Security Guides Index (Updated May 2025)](../security-guides/SECURITY-GUIDES-INDEX.md) - 29% matc

h

- [Documentation Guide](../DOCUMENTATION.md) - 24% match
- [Documentation Summary](../SUMMARY.md) - 24% match
- [Security Management Platform Documentation](../consolidated-index.md) - 24% match
- [Getting Started Guide](GETTING_STARTED.md) - 22% match