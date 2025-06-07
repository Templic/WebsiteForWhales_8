# Dale Loves Whales - Deployment Guide

Complete deployment instructions for various platforms and environments.

## Platform Deployment Options

### 1. Replit Deployment (Recommended for Beginners)

#### Prerequisites
- Replit account
- Forked repository on GitHub

#### Steps
```bash
# 1. Import repository to Replit
# - Go to Replit.com
# - Click "Create Repl"
# - Select "Import from GitHub"
# - Enter your fork URL

# 2. Configure environment
# Environment variables are auto-configured in Replit
# Additional configuration in Secrets tab:
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_GEMINI_API_KEY=your-gemini-key

# 3. Database setup (automatic)
# Replit provides PostgreSQL database automatically
# DATABASE_URL is auto-configured

# 4. Deploy
npm run db:push
npm run build
npm start
```

### 2. Vercel Deployment

#### Prerequisites
- Vercel account
- GitHub repository

#### Configuration
```bash
# 1. Connect GitHub repository to Vercel
# 2. Configure build settings
Build Command: npm run build
Output Directory: dist/public
Install Command: npm install

# 3. Environment variables in Vercel dashboard
DATABASE_URL=your-database-url
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_GEMINI_API_KEY=your-gemini-key
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

#### Vercel.json Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**/*",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ]
}
```

### 3. Netlify Deployment

#### Configuration
```bash
# 1. Connect repository to Netlify
# 2. Build settings
Build command: npm run build
Publish directory: dist/public

# 3. Environment variables
DATABASE_URL=your-database-url
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_GEMINI_API_KEY=your-gemini-key
```

#### Netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist/public"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. Railway Deployment

#### Steps
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
railway init
railway add postgresql
railway deploy

# 3. Set environment variables
railway variables set OPENAI_API_KEY=your-key
railway variables set ANTHROPIC_API_KEY=your-key
railway variables set GOOGLE_GEMINI_API_KEY=your-key
```

### 5. Docker Deployment

#### Using Docker Compose
```bash
# 1. Clone repository
git clone your-fork-url
cd dale-loves-whales-fork

# 2. Configure environment
cp .env.example .env
# Edit .env with production values

# 3. Deploy with Docker Compose
docker-compose up -d

# 4. Check status
docker-compose ps
docker-compose logs app
```

#### Manual Docker Build
```bash
# Build image
docker build -t dale-loves-whales .

# Run container
docker run -d \
  --name dale-loves-whales \
  -p 3000:3000 \
  -e DATABASE_URL=your-database-url \
  -e OPENAI_API_KEY=your-openai-key \
  dale-loves-whales
```

### 6. AWS Deployment

#### EC2 Deployment
```bash
# 1. Launch EC2 instance (Ubuntu 22.04 LTS)
# 2. Install dependencies
sudo apt update
sudo apt install nodejs npm postgresql git

# 3. Clone and setup
git clone your-fork-url
cd dale-loves-whales-fork
npm install
npm run build

# 4. Configure PM2 for process management
npm install -g pm2
pm2 start npm --name "dale-loves-whales" -- start
pm2 startup
pm2 save
```

#### ECS Deployment
```yaml
# task-definition.json
{
  "family": "dale-loves-whales",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "dale-loves-whales",
      "image": "your-ecr-repo/dale-loves-whales:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:name"
        }
      ]
    }
  ]
}
```

## Database Setup for Production

### PostgreSQL Configuration

#### Local PostgreSQL
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createuser --createdb --pwprompt daleapp
sudo -u postgres createdb -O daleapp dale_loves_whales

# Connection string
DATABASE_URL="postgresql://daleapp:password@localhost:5432/dale_loves_whales"
```

#### Cloud Database Options

##### Neon (Recommended)
```bash
# 1. Create account at neon.tech
# 2. Create database
# 3. Get connection string
DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"
```

##### Supabase
```bash
# 1. Create project at supabase.com
# 2. Get connection string from settings
DATABASE_URL="postgresql://postgres:password@host.supabase.co:5432/postgres"
```

##### AWS RDS
```bash
# 1. Create RDS PostgreSQL instance
# 2. Configure security groups
# 3. Get endpoint
DATABASE_URL="postgresql://username:password@endpoint.region.rds.amazonaws.com:5432/dbname"
```

## Environment Variables for Production

### Required Variables
```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret-64-chars-minimum
SESSION_SECRET=your-production-session-secret-64-chars-minimum
```

### API Keys (Required for full functionality)
```env
OPENAI_API_KEY=sk-your-production-openai-key
ANTHROPIC_API_KEY=sk-ant-your-production-anthropic-key
GOOGLE_GEMINI_API_KEY=your-production-gemini-key
```

### Optional Services
```env
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
SMTP_HOST=your-smtp-host
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## Performance Optimization for Production

### Build Optimization
```bash
# Production build with optimizations
NODE_ENV=production npm run build

# Analyze bundle size
npm run build -- --analyze
```

### Caching Configuration
```nginx
# Nginx caching configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /api/ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_content_created_at ON content(created_at);
CREATE INDEX CONCURRENTLY idx_sessions_expires_at ON sessions(expires_at);

-- Analyze tables
ANALYZE;
```

## Monitoring and Health Checks

### Health Check Endpoint
```typescript
// Add to server/routes.ts
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

### Monitoring Setup
```bash
# PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M

# Log monitoring
tail -f logs/application.log
```

## SSL Certificate Setup

### Let's Encrypt with Certbot
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare SSL
```bash
# 1. Add domain to Cloudflare
# 2. Set SSL/TLS mode to "Full (strict)"
# 3. Configure origin certificates
# 4. Update DNS records
```

## Security Checklist for Production

### Application Security
- [ ] All API keys in environment variables
- [ ] HTTPS enabled and enforced
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention active
- [ ] XSS protection enabled
- [ ] CSRF protection configured

### Server Security
- [ ] Firewall configured
- [ ] SSH key authentication only
- [ ] Regular security updates
- [ ] Non-root user for application
- [ ] Log monitoring enabled

### Database Security
- [ ] Strong passwords
- [ ] Connection encryption (SSL)
- [ ] Regular backups
- [ ] Access control configured
- [ ] Audit logging enabled

## Backup and Recovery

### Database Backup
```bash
# Automated backup script
#!/bin/bash
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
pg_dump $DATABASE_URL > $BACKUP_FILE
aws s3 cp $BACKUP_FILE s3://your-backup-bucket/
```

### Application Backup
```bash
# Full application backup
tar -czf app_backup_$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=logs \
  .
```

## Troubleshooting Production Issues

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs dale-loves-whales

# Check environment variables
pm2 show dale-loves-whales

# Restart application
pm2 restart dale-loves-whales
```

#### Database Connection Issues
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### Performance Issues
```bash
# Monitor resource usage
htop
iotop

# Check application performance
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/

# Database performance
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

## Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Session storage (Redis)
- Database read replicas
- CDN for static assets

### Vertical Scaling
- CPU and memory optimization
- Database connection pooling
- Caching strategies
- Asset optimization

---

This deployment guide covers all major platforms and production considerations for your Dale Loves Whales fork deployment.