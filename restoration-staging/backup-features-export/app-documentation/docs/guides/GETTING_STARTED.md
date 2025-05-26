# Getting Started Guid

e

This guide will help new developers get started with the Dale Loves Whales application.

## Table of Contents 1. [Prerequisites](#prerequisite

s)

2. [Repository Setup](#repository-setup)

3. [Environment Configuration](#environment-configuration)

4. [Running the Application](#running-the-application)

5. [Project Structure](#project-structure)

6. [Development Workflow](#development-workflow)

7. [Common Tasks](#common-tasks)

8. [Troubleshooting](#troubleshooting)

9. [Resources](#resources)

## Prerequisites Before you begin, make sure you have the following installed: - Node.js (v14 or late

r)

- npm (v7 or later)
- PostgreSQL or access to a PostgreSQL database
- Git

## Repository Setup 1. **Clone the Repositor

y**

```bash

 git clone <repository-url>
 cd dale-loves-whales


``` 2. **Install Dependencies**

```bash
 npm install


```

## Environment Configuration 1. **Create Environment File** Create a `.env` file in the root directory with the following variable

s:

```

 DATABASE_URL=postgresql://username:password@localhost:5432/dale_loves_whales
 SESSION_SECRET=your-session-secret
 JWT_SECRET=your-jwt-secret


``` 2. **Configure Database** Set up your PostgreSQL database. You can use a local database or a cloud service like Neon.

```bash
 # Create local databas

e
 createdb dale_loves_whales

 # Or use the provided script to connect to Neo

n
 node scripts/setup-neon-db.js


```

## Running the Application Use the provided Replit workflow to start the application: 1. **Start the Application** Click on the "Run" button in Replit or use the "Start application" workflow. The workflow will execute `npm run dev`, which starts both the Next.js frontend and Express backend. 2. **Access the Application** Once started, the application will be available at the URL provided by Repli

t.

## Project Structure The project follows a well-organized directory structure: - **`client/`**: Frontend code - **`src/`**: Source code - **`components/`**: React components - **`pages/`**: Page components - **`hooks/`**: Custom React hooks - **`lib/`**: Utility functions - **`store/`**: State management - **`utils/`**: Utility functions - **`workers/`**: Web workers - **`server/`**: Backend code - **`routes.ts`**: API route definitions - **`storage.ts`**: Data storage interface - **`index.ts`**: Entry point - **`shared/`**: Shared code - **`schema.ts`**: Shared data model definitions - **`docs/`**: Documentation - **`DOCUMENTATION.md`**: Documentation guide - **`scripts/`**: Utility scripts For more details, see the [Repository Structure](../REPOSITORY_STRUCTURE.md) documen

t.

## Development Workflow ### Making Changes 1. **Frontend Changes** Edit files in the `client/src/` directory. The development server will automatically reload. 2. **Backend Changes** Edit files in the `server/` directory. The workflow will automatically restart. 3. **Database Changes** Update the schema in `shared/schema.ts`, then ru

n:

```bash

 npm run db:push


``` ### Code Standards - Follow the existing code styl

e
- Use TypeScript for all files
- Follow the component documentation standards in [Component Documentation Guide](../components/COMPONENT_DOCUMENTATION_GUIDE.md)
- Use the TypeScript Error Management System to check for errors ### Testing Your Changes - Check for TypeScript errors: `npm run typechec

k`
- Run linting: `npm run lint`
- Verify that your changes work as expected in the browser

## Common Tasks ### Adding a New Page 1. Create a new file in `client/src/page

s/`

2. Register the route in `client/src/App.tsx`

3. Update documentation if necessary

```tsx
// Example new page: client/src/pages/NewPage.tsx

import React from 'react';

export default function NewPage() {
 return (
 <div className="container mx-auto p-4">
 <h1 className="text-2xl font-bold">New Page</h1>
 <p>This is a new page.</p>
 </div>
 );
}

// In App.tsx

import NewPage from './pages/NewPage';

// Add to routes
<Route path="/new-page" component={NewPage} />
``` ### Adding a New API Route 1. Create a new route file in `server/route

s/`

2. Register the route in `server/routes.ts`

```typescript
// Example new route: server/routes/newRoute.ts

import { Router } from 'express';

import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, (req, res) => {
 res.json({ message: 'New route' });
});

export default router;

// In server/routes.ts

import newRoute from './routes/newRoute';

app.use('/api/new-route', newRoute);
``` ### Adding a New Database Table 1. Add the table definition to `shared/schema.t

s`

2. Create select and insert types

3. Update `server/storage.ts` with CRUD methods

4. Run `npm run db:push` to create the table

```typescript
// In shared/schema.ts

export const newTable = pgTable('new_table', {
 id: serial('id').primaryKey(),
 name: text('name').notNull(),
 createdAt: timestamp('created_at').defaultNow().notNull()
});

// Create select and insert types

export type NewTable = typeof newTable.$inferSelect;

export const insertNewTableSchema = createInsertSchema(newTable).omit({ id: true });

export type InsertNewTable = z.infer<typeof insertNewTableSchema>;

// In server/storage.ts
// Add CRUD methods

async getNewTableItems(): Promise<NewTable[]> {
 return await db.select().from(newTable);
}

async createNewTableItem(data: InsertNewTable): Promise<NewTable> {
 const result = await db.insert(newTable).values(data).returning();
 return result[0];
}
```

## Troubleshooting ### Common Issues - **TypeScript Errors**: Use the TypeScript Error Management System to identify and fix error

s

```bash

 ts-node typescript-error-management.ts scan


``` - **Database Connection Issues**: Verify your `DATABASE_URL` environment variable - **CSRF Errors**: Ensure your requests include the CSRF token

```javascript
 // In your frontend code
 fetch('/api/endpoint', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'X-CSRF-Token': csrfToken // Get this from the server
 },
 body: JSON.stringify(data)
 })


``` - **Rate Limiting Errors**: Wait for the rate limit window to reset or increase limits for development

## Resources - [Documentation Guide](../DOCUMENTATION.md) - Main documentation inde

x

- [Quick Reference](QUICK_REFERENCE.md) - Quick reference guide
- [Repository Structure](../REPOSITORY_STRUCTURE.md) - Detailed repository structure
- [TypeScript Error Management](../typescript/TYPESCRIPT-ERROR-MANAGEMENT.md) - TS error handling
- [Security Overview](../security/SECURITY.md) - Security features
- [Component Guide](../components/COMPONENT_DOCUMENTATION_GUIDE.md) - Component standards Last updated: May 11, 2025

## See Also - [Development Workflow](DEVELOPMENT_WORKFLOW.md) - 22% matc

h

- [Dale Loves Whales Quick Reference Guide](QUICK_REFERENCE.md) - 22% match
- [Documentation Maintenance Guide](../maintenance/CONSOLIDATED_DOCUMENTATION_MAINTENANCE.md) - 22% match
- [Documentation Planning Guide](../DOCUMENTATION_PLANNING_GUIDE.md) - 17% match
- [Document Title](../DOCUMENTATION_TEMPLATE.md) - 17% match