# TypeScript Error Management System - NPM Scrip

t

s The following NPM scripts can be added to your `package.json` to make running the TypeScript Error Management System easier:

```json
{
 "scripts": {
 "ts:scan": "node ./scripts/run-ts-error-scan.sh",
 "ts:scan:quick": "node ./scripts/run-ts-error-scan.sh --quick",
 "ts:scan:full": "node ./scripts/run-ts-error-scan.sh --full",
 "ts:scan:rootcause": "node ./scripts/run-ts-error-scan.sh --rootcause",
 "ts:fix": "node ./scripts/run-ts-error-scan.sh --fix",
 "ts:fix:apply": "node ./scripts/run-ts-error-scan.sh --fix --apply",
 "ts:interactive": "node ./scripts/run-ts-error-scan.sh --interactive",
 "ts:security": "node ./scripts/run-ts-error-scan.sh --scan-mode rootcause --security-check",
 "precommit": "npm run ts:scan:quick"
 }
}
```

## Available Scripts - **ts:scan**: Run the default incremental sca n - **ts:scan:quick**: Run a quick scan for fast feedbac

k

- **ts:scan:full**: Run a complete scan of all files
- **ts:scan:rootcause**: Run a scan with root cause analysis to identify underlying error sources
- **ts:fix**: Generate fix suggestions (dry run by default)
- **ts:fix:apply**: Generate and apply fixes automatically
- **ts:interactive**: Run the system in interactive mode with guided prompts
- **ts:security**: Run a security-focused scan checking for TypeScript errors that could lead to vulnerabilities
- **precommit**: Quick scan that can be used as a pre-commit hook

## Usage Example

s

```bash

# Run a quick sc

a

n

npm run ts:scan:quick

# Fix TypeScript errors with automatic applicati

o

n

npm run ts:fix:apply

# Interactive mode for guided scanning and fixi

n

g

npm run ts:interactive
```

## Integration To use these scripts: 1. Copy the script definitions to your package.jso n 2. Make sure run-ts-error-scan.sh is executabl

e:

```bash

 chmod +x scripts/run-ts-error-scan.sh

``` 3. Install any required dependencies