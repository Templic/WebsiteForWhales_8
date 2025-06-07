# Dale Loves Whales - CLI Command Reference

Complete command line reference for development, deployment, and maintenance of your fork.

## Development Commands

### Project Setup
```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/dale-loves-whales-fork.git
cd dale-loves-whales-fork
npm install

# Environment setup
cp .env.example .env
nano .env  # Edit configuration

# Database setup
npm run db:push

# Start development
npm run dev
```

### Development Server
```bash
# Start development server (frontend + backend)
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Start with different port
PORT=3001 npm run dev

# Start with debugging
DEBUG=* npm run dev
```

### Build Commands
```bash
# Production build
npm run build

# Type checking
npm run check

# Clean build
rm -rf dist/ && npm run build

# Build analysis
npm run build -- --analyze
```

## Database Management

### Schema Management
```bash
# Push schema changes to database
npm run db:push

# Generate migration files
npx drizzle-kit generate

# View database studio
npx drizzle-kit studio

# Reset database (caution!)
npx drizzle-kit drop
```

### Database Operations
```bash
# Connect to database
psql $DATABASE_URL

# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql

# Check database size
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size('dale_loves_whales'));"
```

## Code Quality & Testing

### TypeScript
```bash
# Type checking
npm run check

# Watch mode type checking
npx tsc --watch

# Build TypeScript
npx tsc

# Fix TypeScript errors
npx tsx server/utils/ts-error-fixer.ts
```

### Linting & Formatting
```bash
# Run ESLint
npx eslint . --ext .ts,.tsx

# Fix ESLint errors
npx eslint . --ext .ts,.tsx --fix

# Format code with Prettier
npx prettier --write .

# Check formatting
npx prettier --check .
```

### Security Scans
```bash
# Run security audit
npm audit

# Fix security issues
npm audit fix

# Advanced security scan
npx tsx server/tools/runAdvancedDeepScan.ts

# SQL injection scan
bash server/tools/inspect-sql-vulnerabilities.sh

# XSS vulnerability scan
bash server/tools/detect-xss.sh
```

## Performance & Optimization

### Performance Analysis
```bash
# Bundle analysis
npm run build -- --analyze

# Performance monitoring
npx tsx server/performance/ConsciousnessPerformanceOptimizer.ts

# Memory leak detection
node --inspect npm run dev

# Load testing
npx autocannon http://localhost:3000
```

### Optimization Tools
```bash
# Optimize images
npx imagemin src/assets/images/* --out-dir=dist/images

# Tree shaking analysis
npx webpack-bundle-analyzer dist/stats.json

# Performance audit
npx lighthouse http://localhost:3000 --output html --output-path ./performance-report.html
```

## Deployment Commands

### Docker Deployment
```bash
# Build Docker image
docker build -t dale-loves-whales .

# Run Docker container
docker run -d --name dale-loves-whales -p 3000:3000 dale-loves-whales

# Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Production Deployment
```bash
# Production build
NODE_ENV=production npm run build

# Start production server
NODE_ENV=production npm start

# PM2 process management
pm2 start npm --name "dale-loves-whales" -- start
pm2 startup
pm2 save

# Monitor with PM2
pm2 monit
pm2 logs dale-loves-whales
```

### Cloud Platform Deployment
```bash
# Vercel deployment
npm install -g vercel
vercel --prod

# Netlify deployment
npm install -g netlify-cli
netlify deploy --prod

# Railway deployment
npm install -g @railway/cli
railway deploy

# Heroku deployment
git push heroku main
heroku logs --tail
```

## Debugging Commands

### Application Debugging
```bash
# Debug backend with Node inspector
node --inspect server/index.ts

# Debug with VS Code
npm run dev:debug

# Verbose logging
DEBUG=* npm run dev

# Profile performance
node --prof server/index.ts
```

### Database Debugging
```bash
# Check database connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# View active queries
psql $DATABASE_URL -c "SELECT pid, query, state FROM pg_stat_activity WHERE state = 'active';"

# Check table sizes
psql $DATABASE_URL -c "SELECT schemaname,tablename,attname,n_distinct,correlation FROM pg_stats;"

# Analyze query performance
psql $DATABASE_URL -c "EXPLAIN ANALYZE SELECT * FROM users LIMIT 10;"
```

### Network Debugging
```bash
# Test API endpoints
curl -X GET http://localhost:3000/api/health

# Test with authentication
curl -H "Authorization: Bearer $JWT_TOKEN" http://localhost:3000/api/admin

# Check SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Network performance
ping yourdomain.com
traceroute yourdomain.com
```

## Maintenance Commands

### Log Management
```bash
# View application logs
tail -f logs/application.log

# Rotate logs
logrotate /etc/logrotate.d/dale-loves-whales

# Clear old logs
find logs/ -name "*.log" -mtime +30 -delete

# Analyze logs
grep ERROR logs/application.log | tail -100
```

### System Maintenance
```bash
# Update dependencies
npm update

# Security updates
npm audit fix --force

# Clean node_modules
rm -rf node_modules package-lock.json && npm install

# Clean build artifacts
npm run clean

# System health check
npx tsx server/tools/comprehensive-security-analyzer.ts
```

### Database Maintenance
```bash
# Vacuum database
psql $DATABASE_URL -c "VACUUM ANALYZE;"

# Reindex database
psql $DATABASE_URL -c "REINDEX DATABASE dale_loves_whales;"

# Update statistics
psql $DATABASE_URL -c "ANALYZE;"

# Check database integrity
psql $DATABASE_URL -c "SELECT * FROM pg_stat_database;"
```

## Development Utilities

### Code Generation
```bash
# Generate component
npx generate-react-component ComponentName

# Generate API route
npx generate-api-route routeName

# Generate database migration
npx drizzle-kit generate --name="migration_name"

# Generate TypeScript types
npx tsx server/utils/ts-type-analyzer.ts
```

### Testing Commands
```bash
# Run all tests
npm test

# Run specific test file
npm test -- ComponentName.test.ts

# Run tests in watch mode
npm test -- --watch

# Generate test coverage
npm test -- --coverage

# End-to-end tests
npx playwright test
```

### API Testing
```bash
# Test API endpoints
npm run test:api

# Load test specific endpoint
npx autocannon -c 10 -d 30 http://localhost:3000/api/health

# Test with authentication
curl -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"test": "data"}' \
     http://localhost:3000/api/test
```

## Environment Management

### Environment Variables
```bash
# Load environment from file
export $(cat .env | xargs)

# Check environment variables
printenv | grep DATABASE

# Set environment for single command
DATABASE_URL="new_url" npm run dev

# Environment-specific commands
NODE_ENV=development npm run dev
NODE_ENV=production npm start
NODE_ENV=test npm test
```

### Multi-Environment Setup
```bash
# Development environment
cp .env.development .env
npm run dev

# Staging environment
cp .env.staging .env
npm run build && npm start

# Production environment
cp .env.production .env
NODE_ENV=production npm start
```

## Git & Version Control

### Git Workflow
```bash
# Setup repository
git init
git remote add origin https://github.com/username/fork.git
git remote add upstream https://github.com/original/repo.git

# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Release Management
```bash
# Tag release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Generate changelog
npx conventional-changelog -p angular -i CHANGELOG.md -s

# Semantic versioning
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## Monitoring & Analytics

### Performance Monitoring
```bash
# Real-time performance metrics
npx clinic doctor -- node server/index.ts

# Memory profiling
npx clinic heapprofiler -- node server/index.ts

# CPU profiling
npx clinic flame -- node server/index.ts

# System monitoring
htop
iotop
netstat -tulpn
```

### Application Monitoring
```bash
# Health check
curl http://localhost:3000/health

# API response times
time curl http://localhost:3000/api/endpoint

# Database performance
psql $DATABASE_URL -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"

# Monitor logs in real-time
tail -f logs/application.log | grep ERROR
```

## Backup & Recovery

### Backup Commands
```bash
# Full application backup
tar --exclude=node_modules --exclude=dist -czf backup_$(date +%Y%m%d).tar.gz .

# Database backup
pg_dump $DATABASE_URL | gzip > db_backup_$(date +%Y%m%d).sql.gz

# Environment backup
cp .env .env.backup.$(date +%Y%m%d)

# Automated backup script
bash scripts/backup.sh
```

### Recovery Commands
```bash
# Restore application
tar -xzf backup_20241207.tar.gz

# Restore database
gunzip -c db_backup_20241207.sql.gz | psql $DATABASE_URL

# Restore environment
cp .env.backup.20241207 .env

# Full system recovery
bash scripts/restore.sh backup_20241207
```

## Troubleshooting Commands

### Common Issues
```bash
# Port already in use
lsof -i :3000
kill -9 $(lsof -t -i:3000)

# Node modules issues
rm -rf node_modules package-lock.json
npm install

# Permission issues
sudo chown -R $USER:$USER .
chmod +x setup.sh

# Memory issues
node --max-old-space-size=4096 server/index.ts
```

### Emergency Recovery
```bash
# Reset to last known good state
git reset --hard HEAD~1

# Emergency database restore
psql $DATABASE_URL < emergency_backup.sql

# Quick health check
bash scripts/health-check.sh

# Emergency shutdown
pkill -f "node.*server"
pm2 stop all
```

This CLI reference provides comprehensive command-line tools for all aspects of developing, deploying, and maintaining your Dale Loves Whales fork.