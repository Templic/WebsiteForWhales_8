@echo off
REM Dale Loves Whales - Windows Setup Script
REM Automated fork setup for Windows environments

setlocal enabledelayedexpansion

echo ================================
echo   Dale Loves Whales Fork Setup
echo ================================
echo.

REM Check for Node.js
echo Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org
    echo.
    pause
    exit /b 1
)

for /f "tokens=1 delims=v" %%a in ('node --version') do set NODE_VERSION=%%a
echo SUCCESS: Node.js %NODE_VERSION% detected

REM Check for npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)
echo SUCCESS: npm is installed

REM Check for Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed
    echo Please install Git from https://git-scm.com
    pause
    exit /b 1
)
echo SUCCESS: Git is installed

echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo SUCCESS: Dependencies installed

echo.
echo Setting up environment configuration...
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo SUCCESS: Created .env file from template
        echo WARNING: Please edit .env file with your actual configuration values
    ) else (
        echo ERROR: .env.example file not found
        pause
        exit /b 1
    )
) else (
    echo WARNING: .env file already exists, skipping creation
)

echo.
echo Creating necessary directories...
if not exist "logs" mkdir logs
if not exist "uploads" mkdir uploads
if not exist "dist" mkdir dist
echo SUCCESS: Created necessary directories

echo.
echo Running TypeScript validation...
call npm run check
if %errorlevel% neq 0 (
    echo WARNING: TypeScript validation issues detected
) else (
    echo SUCCESS: TypeScript validation passed
)

echo.
echo Checking API key configuration...
findstr /c:"your-openai-key-here" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo WARNING: OpenAI API key not configured - AI features will be limited
)

findstr /c:"your-anthropic-key-here" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo WARNING: Anthropic API key not configured - AI features will be limited
)

findstr /c:"your-gemini-key-here" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo WARNING: Google Gemini API key not configured - AI features will be limited
)

echo.
echo ================================
echo   Setup Complete!
echo ================================
echo.
echo Your Dale Loves Whales fork is ready!
echo.
echo Next steps:
echo 1. Edit .env file with your actual configuration values
echo 2. Configure your database connection
echo 3. Add your API keys for full functionality
echo 4. Start the development server with: npm run dev
echo.
echo The application will be available at:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo.
echo For detailed configuration instructions, see FORK_SETUP_GUIDE.md
echo.

set /p start_server="Would you like to start the development server now? (y/n): "
if /i "%start_server%"=="y" (
    echo.
    echo Starting development server...
    call npm run dev
) else (
    echo.
    echo You can start the development server later with: npm run dev
)

pause