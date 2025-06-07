# Dale Loves Whales - Quick Start Guide

Get your fork running in under 5 minutes.

## 🚀 Fastest Setup (Linux/macOS)

```bash
# 1. Clone and enter directory
git clone https://github.com/YOUR_USERNAME/dale-loves-whales-fork.git
cd dale-loves-whales-fork

# 2. Run automated setup
chmod +x setup.sh
./setup.sh

# 3. Edit environment (opens in default editor)
nano .env

# 4. Start development server
npm run dev
```

## 🪟 Windows Setup

```batch
REM 1. Clone repository
git clone https://github.com/YOUR_USERNAME/dale-loves-whales-fork.git
cd dale-loves-whales-fork

REM 2. Run Windows setup
setup.bat

REM 3. Edit .env file with your settings
notepad .env

REM 4. Start development server
npm run dev
```

## 🐳 Docker Setup (Any Platform)

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/dale-loves-whales-fork.git
cd dale-loves-whales-fork

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start with Docker
docker-compose up -d

# 4. Check status
docker-compose ps
```

## ⚡ Essential Configuration

### Minimum Required (.env file)
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="your-64-character-secret-key"
SESSION_SECRET="your-64-character-session-key"
```

### For Full Features (add to .env)
```env
OPENAI_API_KEY="sk-your-openai-key"
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
GOOGLE_GEMINI_API_KEY="your-gemini-key"
```

## 🔧 Verify Installation

```bash
# Check if running
curl http://localhost:3000/health

# Check frontend
open http://localhost:5173

# Check database
npm run check
```

## 📍 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:5173/admin
- **Health Check**: http://localhost:3000/health

## 🆘 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
kill -9 $(lsof -t -i:3000)
# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"
# Fix: Update DATABASE_URL in .env
```

### Dependencies Error
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. **Read Full Guide**: [FORK_SETUP_GUIDE.md](FORK_SETUP_GUIDE.md)
2. **CLI Commands**: [CLI_COMMANDS.md](CLI_COMMANDS.md)
3. **Deployment**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
4. **Configure Features**: Edit theme.json and components
5. **Add Content**: Start building your consciousness platform

## 🎯 Development Workflow

```bash
# Daily development
git pull origin main
npm run dev

# Adding features
git checkout -b feature/your-feature
# Make changes
git add .
git commit -m "feat: your feature"
git push origin feature/your-feature

# Database changes
# Edit shared/schema.ts
npm run db:push

# Production build
npm run build
npm start
```

Your Dale Loves Whales fork is ready for cosmic consciousness development! 🐋✨