# TypeScript Error Management System - Quick Start Gui

d

e This guide will help you quickly set up and start using the TypeScript Error Management System for your projects.

## Installatio

n

```bash

# Clone the reposito

r

y

git clone https://github.com/your-org/typescript-error-management.git

cd typescript-error-management

# Install dependenci

e

s

npm install
```

## Basic Usage ### Scanning for TypeScript Errors To scan your project for TypeScript error

s:

```bash

npx ts-node src/cli/typescript-error-management.ts --project /path/to/your-project
``` This will scan your project and generate a report of TypeScript errors found. ### Scanning for Security Vulnerabilities To scan your project for security vulnerabilitie

s:

```bash

npx ts-node src/cli/typescript-security-scanner.ts --project /path/to/your-project
```

## Using AI-Powered Analysis For AI-powered analysis and fix suggestions, you'll need API keys for either OpenAI or Anthropic (or both for best results). ### Setting Up API Key

s

```bash

# Set up API keys as environment variabl

e

s

export OPENAI_API_KEY=your-openai-api-key

export ANTHROPIC_API_KEY=your-anthropic-api-key
``` ### Running with AI Analysi

s

```bash
# Run TypeScript error scanner with AI analys

i

s

npx ts-node src/cli/typescript-error-management.ts --project /path/to/your-project --include-ai-analysis

# Run security scanner with AI analys

i

s

npx ts-node src/cli/typescript-security-scanner.ts --project /path/to/your-project --include-ai-analysis
```

## Command Line Options ### TypeScript Error Managemen

t

```

--project, -p <path> Project directory to scan (default: current directory)
--output, -o <path> Output file path for results
--max-errors <number> Maximum number of errors to report (default: 100)
--include-ai-analysis Use AI to analyze errors and suggest fixes
--deep Perform deep analysis with dependency tracking
--min-severity=<level> Minimum error severity to report (critical, high, medium, low)
--categories=<list> Comma-separated list of error categories to check
--exclude=<list> Comma-separated list of directories or files to exclude
--ci-mode Run in CI mode with GitHub Actions integration
--fail-on-high-severity Exit with non-zero code for high severity issues
--quick Run in quick mode with limited scanning
``` ### Security Scanne

r

```

--project, -p <path> Project directory to scan (default: current directory)
--output, -o <path> Output file path for results
--max-issues <number> Maximum number of issues to report (default: 100)
--include-ai-analysis Use AI to analyze security issues and suggest fixes
--min-severity=<level> Minimum issue severity to report (critical, high, medium, low)
--exclude=<list> Comma-separated list of directories or files to exclude
--ci-mode Run in CI mode with GitHub Actions integration
--concurrency=<number> Maximum number of concurrent operations
--quick Run in quick mode with limited scanning
--check-node-modules Include node_modules in the scan (default: false)
--timeout=<seconds> Timeout in seconds for the scan (default: 120)
```

## CI/CD Integration ### GitHub Actions To integrate with GitHub Actions, create a workflow file in your projec

t:

```yaml

name: TypeScript Error Management

on:
 push:
 branches: [main, master]
 pull_request:
 branches: [main, master]

jobs:
 typescript-error-scan:
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v3
 - name: Setup Node.js
 uses: actions/setup-node@v3
 with:
 node-version: 18
 - name: Install dependencies
 run: npm ci
 - name: Run TypeScript Error Scanner
 run: npx ts-node src/cli/typescript-error-management.ts --include-ai-analysis --ci-mode
 env:
 OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
 ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
``` Alternatively, you can generate a workflow file automatically:

```bash
# Generate a GitHub Actions workflow fi

l

e

npx ts-node src/utils/generate-workflow.ts --output .github/workflows/typescript-errors.yml --include-security --include-ai
```

## Advanced Usage ### Customizing Model Selection The system automatically selects between OpenAI and Anthropic models based on the task. You can customize this behavior by editing `src/core/model-selection-strategy.ts`. ### Creating Custom Rules To add custom error detection rules, extend the base scanner in `src/utils/ts-error-scanner.t

s`.

## Troubleshooting ### Common Issues 1. **Timeout during scanning**: For large projects, try using the `--quick` mode or increasing the `--timeout` value. 2. **Memory issues**: Try setting the `--max-errors` or `--max-issues` to a lower number. 3. **Missing API keys**: Make sure your API keys are set correctly as environment variable

s.

## Contributing We welcome contributions! Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for detail

s.

## License This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for detail

s.