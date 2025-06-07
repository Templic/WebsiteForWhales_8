#!/bin/bash

# Dale Loves Whales - Automated Fork Setup Script
# This script automates the complete setup process for forking the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Utility functions
print_header() {
    echo -e "${BLUE}=================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}=================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

check_command() {
    if command -v "$1" &> /dev/null; then
        print_success "$1 is installed"
        return 0
    else
        print_error "$1 is not installed"
        return 1
    fi
}

# Main setup function
main() {
    print_header "Dale Loves Whales Fork Setup"
    
    echo "Starting automated setup process..."
    echo
    
    # Check prerequisites
    print_header "Checking Prerequisites"
    
    local missing_deps=0
    
    if ! check_command "node"; then
        print_error "Node.js is required. Please install Node.js 18+ from https://nodejs.org"
        missing_deps=1
    else
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -lt 18 ]; then
            print_error "Node.js version 18+ is required. Current version: $(node --version)"
            missing_deps=1
        else
            print_success "Node.js $(node --version) detected"
        fi
    fi
    
    if ! check_command "npm"; then
        print_error "npm is required"
        missing_deps=1
    fi
    
    if ! check_command "git"; then
        print_error "Git is required"
        missing_deps=1
    fi
    
    if [ $missing_deps -eq 1 ]; then
        print_error "Please install missing dependencies before continuing"
        exit 1
    fi
    
    echo
    
    # Install dependencies
    print_header "Installing Dependencies"
    
    echo "Installing npm packages..."
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
    
    echo
    
    # Setup environment
    print_header "Environment Configuration"
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Created .env file from template"
            print_warning "Please edit .env file with your actual configuration values"
        else
            print_error ".env.example file not found"
            exit 1
        fi
    else
        print_warning ".env file already exists, skipping creation"
    fi
    
    echo
    
    # Database setup check
    print_header "Database Configuration"
    
    if grep -q "postgresql://username:password@localhost:5432/dale_loves_whales" .env; then
        print_warning "Default database URL detected in .env"
        print_warning "Please update DATABASE_URL in .env with your actual database connection"
        
        echo
        echo "Database setup options:"
        echo "1. Local PostgreSQL: postgresql://localhost:5432/dale_loves_whales"
        echo "2. Replit Database: Automatically configured"
        echo "3. Cloud Database: Use your provider's connection string"
        echo
    fi
    
    # Check if we can connect to database
    if command -v psql &> /dev/null; then
        DATABASE_URL=$(grep DATABASE_URL .env | cut -d'=' -f2 | tr -d '"')
        if [ ! -z "$DATABASE_URL" ] && [ "$DATABASE_URL" != "postgresql://username:password@localhost:5432/dale_loves_whales" ]; then
            echo "Testing database connection..."
            if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
                print_success "Database connection successful"
                
                # Run database migration
                echo "Setting up database schema..."
                if npm run db:push; then
                    print_success "Database schema setup complete"
                else
                    print_warning "Database schema setup failed - you may need to configure it manually"
                fi
            else
                print_warning "Could not connect to database - please verify DATABASE_URL in .env"
            fi
        fi
    fi
    
    echo
    
    # TypeScript check
    print_header "TypeScript Validation"
    
    echo "Running TypeScript type checking..."
    if npm run check; then
        print_success "TypeScript validation passed"
    else
        print_warning "TypeScript validation issues detected - check output above"
    fi
    
    echo
    
    # API Keys validation
    print_header "API Keys Validation"
    
    # Check for placeholder API keys
    if grep -q "your-openai-key-here" .env; then
        print_warning "OpenAI API key not configured - AI features will be limited"
    fi
    
    if grep -q "your-anthropic-key-here" .env; then
        print_warning "Anthropic API key not configured - AI features will be limited"
    fi
    
    if grep -q "your-gemini-key-here" .env; then
        print_warning "Google Gemini API key not configured - AI features will be limited"
    fi
    
    echo
    
    # Final setup
    print_header "Final Setup"
    
    # Create necessary directories
    mkdir -p logs
    mkdir -p uploads
    mkdir -p dist
    
    print_success "Created necessary directories"
    
    # Setup Git hooks (if .git exists)
    if [ -d ".git" ]; then
        echo "Setting up Git hooks..."
        if [ ! -f ".git/hooks/pre-commit" ]; then
            cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Run TypeScript checks before commit
npm run check
EOF
            chmod +x .git/hooks/pre-commit
            print_success "Git pre-commit hook installed"
        fi
    fi
    
    echo
    
    # Setup completion
    print_header "Setup Complete!"
    
    echo "Your Dale Loves Whales fork is ready!"
    echo
    echo "Next steps:"
    echo "1. Edit .env file with your actual configuration values"
    echo "2. Configure your database connection"
    echo "3. Add your API keys for full functionality"
    echo "4. Start the development server with: npm run dev"
    echo
    echo "The application will be available at:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend:  http://localhost:3000"
    echo
    echo "For detailed configuration instructions, see FORK_SETUP_GUIDE.md"
    
    # Offer to start development server
    echo
    read -p "Would you like to start the development server now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_success "Starting development server..."
        npm run dev
    else
        echo "You can start the development server later with: npm run dev"
    fi
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi