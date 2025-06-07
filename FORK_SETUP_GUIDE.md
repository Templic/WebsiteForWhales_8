# Dale Loves Whales - Fork Setup Guide

Complete CLI instructions for setting up a fork of the Dale Loves Whales multi-modal AI consciousness platform.

## Prerequisites

### Required Software
- **Node.js 18+** (recommended: 20.x LTS)
- **npm 9+** or **yarn 1.22+**
- **PostgreSQL 14+** (local or cloud instance)
- **Git 2.30+**
- **TypeScript 5.6+** (installed globally recommended)

### System Requirements
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 2GB free space for dependencies and build artifacts
- **OS**: macOS, Linux, or Windows with WSL2

## Quick Start (5 Minutes)

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/dale-loves-whales-fork.git
cd dale-loves-whales-fork

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# 4. Set up database
npm run db:push

# 5. Start development server
npm run dev
```

## Detailed Setup Instructions

### 1. Repository Setup

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/dale-loves-whales-fork.git
cd dale-loves-whales-fork

# Add upstream remote for updates
git remote add upstream https://github.com/original/dale-loves-whales.git

# Verify remotes
git remote -v
```

### 2. Environment Configuration

Create and configure your environment file:

```bash
# Copy the example environment file
cp .env.example .env
```

Required environment variables in `.env`:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/dale_loves_whales"

# API Keys (Optional but recommended for full functionality)
OPENAI_API_KEY="sk-your-openai-key-here"
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key-here"
GOOGLE_GEMINI_API_KEY="your-gemini-key-here"

# Stripe (for payment processing)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"

# Security Configuration
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
SESSION_SECRET="your-session-secret-key-min-32-chars"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Development Settings
NODE_ENV="development"
PORT="3000"
```

### 3. Database Setup

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql
brew services start postgresql

# Create database
createdb dale_loves_whales

# Set DATABASE_URL in .env
DATABASE_URL="postgresql://localhost:5432/dale_loves_whales"
```

#### Option B: Replit Database

```bash
# If using Replit, the DATABASE_URL is automatically provided
# Just ensure it's set in your environment
echo $DATABASE_URL
```

#### Option C: External Database (Neon, Supabase, etc.)

```bash
# Use your cloud database connection string
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"
```

### 4. Dependency Installation

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0

# Optional: Install global TypeScript tools
npm install -g typescript tsx drizzle-kit
```

### 5. Database Migration

```bash
# Push schema to database (creates tables)
npm run db:push

# Verify tables were created
npm run check
```

### 6. Development Server

```bash
# Start the development server
npm run dev

# The application will be available at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

## Project Structure Overview

```
dale-loves-whales/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── cosmic/     # Sacred geometry components
│   │   │   ├── admin/      # Admin dashboard
│   │   │   ├── audio/      # Audio/music components
│   │   │   └── theme/      # Theme system
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Frontend utilities
│   └── index.html
├── server/                 # Express.js backend
│   ├── routes/             # API endpoints
│   ├── middleware/         # Express middleware
│   ├── security/           # Security implementations
│   ├── consciousness/      # AI consciousness features
│   └── index.ts
├── shared/                 # Shared types and schemas
│   ├── schema.ts           # Database schema (Drizzle)
│   └── validation/         # Validation schemas
├── package.json
├── vite.config.ts          # Vite configuration
├── drizzle.config.ts       # Database configuration
├── tsconfig.json           # TypeScript configuration
└── theme.json              # UI theme configuration
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run check            # Type checking

# Database
npm run db:push          # Push schema changes to database

# Testing
npm test                 # Run tests (if available)

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code
```

## API Keys Setup

### Required for Full Functionality

1. **OpenAI API Key**
   ```bash
   # Get from: https://platform.openai.com/api-keys
   OPENAI_API_KEY="sk-your-key-here"
   ```

2. **Anthropic API Key**
   ```bash
   # Get from: https://console.anthropic.com/
   ANTHROPIC_API_KEY="sk-ant-your-key-here"
   ```

3. **Google Gemini API Key**
   ```bash
   # Get from: https://makersuite.google.com/app/apikey
   GOOGLE_GEMINI_API_KEY="your-key-here"
   ```

### Optional Keys

4. **Stripe Keys** (for payments)
   ```bash
   # Get from: https://dashboard.stripe.com/apikeys
   STRIPE_SECRET_KEY="sk_test_your-key"
   STRIPE_PUBLISHABLE_KEY="pk_test_your-key"
   ```

## Configuration Files

### Theme Customization

Edit `theme.json` to customize the application appearance:

```json
{
  "variant": "vibrant",
  "primary": "hsl(180, 100%, 46%)",
  "appearance": "dark",
  "radius": 0.5
}
```

### TypeScript Paths

The application uses path aliases defined in `tsconfig.json`:

```typescript
// Import examples
import { Button } from "@/components/ui/button";
import { schema } from "@shared/schema";
```

## Advanced Features Setup

### 1. Sacred Geometry Rendering

No additional setup required. Three.js and canvas-based rendering work out of the box.

### 2. AI Consciousness Features

Requires API keys for OpenAI, Anthropic, and Google Gemini for full functionality.

### 3. Audio/Music Features

Uses Web Audio API. No additional dependencies required.

### 4. Admin Dashboard

Access at `/admin` after starting the server. Default credentials may need to be set up.

### 5. Security Features

The application includes comprehensive security middleware. Review `server/security/` for configuration options.

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check DATABASE_URL format
   echo $DATABASE_URL
   
   # Test connection
   psql $DATABASE_URL -c "SELECT version();"
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill process or use different port
   PORT=3001 npm run dev
   ```

3. **TypeScript Errors**
   ```bash
   # Clear TypeScript cache
   rm -rf node_modules/.cache
   
   # Reinstall dependencies
   npm ci
   ```

4. **Build Failures**
   ```bash
   # Clear build cache
   rm -rf dist/
   rm -rf client/dist/
   
   # Rebuild
   npm run build
   ```

### Performance Optimization

```bash
# Monitor memory usage
npm run dev -- --inspect

# Analyze bundle size
npm run build -- --analyze

# Run performance audit
npm audit
```

## Deployment Options

### Option 1: Replit Deployment

```bash
# Configure for Replit
# Ensure .replit file is configured
# Use Replit's deployment features
```

### Option 2: Vercel/Netlify

```bash
# Build for static deployment
npm run build

# Deploy dist/ folder
```

### Option 3: Docker

```bash
# Create Dockerfile (example provided separately)
docker build -t dale-loves-whales .
docker run -p 3000:3000 dale-loves-whales
```

## Contributing to Fork

### Setting Up Development Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### Keeping Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your main
git checkout main
git merge upstream/main

# Push updated main to your fork
git push origin main
```

## Production Deployment

### Environment Variables for Production

```env
NODE_ENV="production"
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret-64-chars-minimum"
SESSION_SECRET="your-production-session-secret-64-chars-minimum"
```

### Build and Start

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Support and Resources

- **Documentation**: Check the `/docs` folder for detailed feature documentation
- **API Reference**: Available at `/api-docs` when server is running
- **Performance Guide**: See `PERFORMANCE_OPTIMIZATION_STATUS.md`
- **Security Guide**: Review `server/security/README.md`

## License

This fork maintains the original MIT license. Ensure compliance with any licensing requirements for your use case.

---

**Setup Time**: ~15-30 minutes depending on your environment
**First Build**: ~5-10 minutes for dependency installation and initial build
**Development Ready**: Immediate after successful setup

Happy coding with your Dale Loves Whales fork! 🐋✨