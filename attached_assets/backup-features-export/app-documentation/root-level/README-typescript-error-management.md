# TypeScript Error Management Syst

e

m A comprehensive, AI-powered platform for managing TypeScript errors and security vulnerabilities in large codebases.

## Overview The TypeScript Error Management System is designed to help developers identify, analyze, and fix TypeScript errors while simultaneously scanning for security vulnerabilities. It uses a sophisticated approach that combines static code analysis with AI-powered insights from multiple model

s.

## Key Features - **Intelligent Error Detection**: Scans TypeScript files to detect errors and security vulnerabilitie s - **AI-Powered Analysis**: Uses both OpenAI and Anthropic models to provide deep insight

s

- **Adaptive Model Selection**: Intelligently chooses the best AI model for each specific task
- **Security-First Approach**: Integrates security scanning directly into the error management process
- **Replit-Friendly Tools**: Designed with performance optimizations for running in Replit environments
- **PostgreSQL Integration**: Stores and retrieves error data for tracking and analysis

## Components ### Core Components - **Model Selection Strategy**: Intelligently selects between AI providers based on task type and error characteristic s - **AI Integration Module**: Unified interface for working with both OpenAI and Anthropi

c

- **Security Scanner**: Detects and analyzes security vulnerabilities in TypeScript code
- **Database Integration**: Stores errors, analyses, and security findings ### CLI Tools - **TypeScript Security Scanner**: Command-line tool for scanning projects for security issue

s
- **AI Model Selection Demo**: Demonstrates how different models are selected for various tasks
- **Security Scanner Runner**: Simplified interface for running security scans in different modes

## Getting Started ### Prerequisites - Node.js (v1 6+) - TypeScript (v4.

5+)

- PostgreSQL database (for storing error data)
- API keys for OpenAI and/or Anthropic ### Installation 1. Clone the repositor y 2. Install dependencie

s:

```

 npm install

``` 3. Set up environment variables:

```

 OPENAI_API_KEY=your_openai_key
 ANTHROPIC_API_KEY=your_anthropic_key
 DATABASE_URL=your_database_url

``` ### Running the AI Model Selection Demo To see how the system intelligently chooses between OpenAI and Anthropic model

s:

```

npx tsx run-ai-model-selection-demo.ts
``` ### Running the Security Scanner For a quick security scan of your projec

t:

```

npx tsx run-security-scanner.ts --path=. --mode=quick
``` For a more comprehensive scan:

```

npx tsx run-security-scanner.ts --path=. --mode=full --format=markdown
``` For a targeted scan of specific files or directories:

```

npx tsx run-security-scanner.ts --path=. --mode=targeted --include=src/auth,src/api
```

## Security Scanning The security scanner is designed to identify common vulnerabilities in TypeScript code, including: - SQL Injectio n - Cross-Site Scripting (XS

S)

- Cross-Site Request Forgery (CSRF)
- Authentication issues
- Authorization flaws
- Sensitive data exposure
- Encryption problems
- Input validation issues
- Denial of Service vulnerabilities
- Insecure logging
- Hardcoded secrets
- Race conditions
- Serialization issues
- Cookie security
- Content Security Policy ### Scan Modes - **Quick Scan**: Fast scan of a limited number of files (ideal for Repli

t)
- **Full Scan**: Comprehensive scan of the entire codebase
- **Targeted Scan**: Focused scan of specific directories or files ### Output Formats - **Console**: Colorized output to the console (defaul

t)
- **JSON**: Structured JSON data for programmatic processing
- **Markdown**: Formatted markdown for documentation or reports

## AI Model Selection Strategy The system uses a sophisticated strategy to choose between OpenAI and Anthropic models based on: ### Selection Criteria - **Task Type** (35% weight) - Error analysis (slight preference for Anthropic) - Security analysis (strong preference for Anthropic) - Fix generation (preference for OpenAI) - Documentation generation (preference for Anthropic) - **Error Characteristics** (25% weight) - Error category (e.g., type, import, declaration) - Error severity (critical/high errors favor Anthropic) - Complexity (longer, more complex errors favor Anthropic) - Security relevance (security-related errors favor Anthropic) - **Performance Metrics** (25% weight) - Past success rates for similar tasks - Response times - Provider usage balance - **User Preferences** (15% weight) - Speed priority (favors OpenAI) - Accuracy priority (favors Anthropic) ### Model Preferences by Task 1. **Error Analysis** - Simple type errors: OpenAI - Complex or security-related errors: Anthropic 2. **Security Analysis** - Always favors Anthropic for comprehensive reasoning 3. **Fix Generation** - Favors OpenAI for precise code generation 4. **Documentation Generation** - Favors Anthropic for detailed explanation

s

## Replit Optimizations The system includes several optimizations for running effectively in Replit environments: - **Concurrency Control**: Limits parallel operations to prevent resource exhaustio n - **Timeout Management**: Implements timeouts to prevent hanging processe

s

- **Quick Mode**: Fast scanning option that samples a limited number of files
- **Batch Processing**: Processes files in batches to avoid memory issues
- **Fallback Mechanisms**: Gracefully handles API failures and connectivity issues

## API Usage ### Working with the AI Analyze

r

```typescript

import { AIAnalyzer } from './src/utils/ai-integration';

// Create analyzer with automatic model selection

const analyzer = new AIAnalyzer({
 autoSelectModel: true,
 trackPerformance: true
});

// Analyze TypeScript error

const analysisResult = await analyzer.analyzeError(error, codeSnippet);

// Generate fix for an error

const fixResult = await analyzer.generateFix(error, codeSnippet);

// Analyze security implications

const securityResult = await analyzer.analyzeSecurityImplications(codeSnippet);

// Get performance metrics

const metrics = analyzer.getPerformanceMetrics();
```

## Contributing Contributions are welcome! Please feel free to submit a Pull Reques

t.

## License This project is licensed under the MIT License - see the LICENSE file for detail

s.