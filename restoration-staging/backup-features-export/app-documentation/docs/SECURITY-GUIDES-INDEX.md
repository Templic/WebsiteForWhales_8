# Security Documentation Inde

x

This document serves as a central index for all security-related documentation in the project.

## Core Security Guides - [Security Troubleshooting Guide](./SECURITY-TROUBLESHOOTING.md) - Solutions for common security issue

s

- [OpenAI Integration Guide](./SECURITY-OPENAI-INTEGRATION-GUIDE.md) - How OpenAI powers the security scanning system
- [Embedded Content Configuration](./SECURITY-CONFIGURATION-EMBEDDED-CONTENT-QUICK-FIX.md) - Configuring security for embedded content

## Quick Fix Utilities The project includes the following utility scripts to help resolve security issues quickly: - **fix-security-conflicts.js** - Quick fix script for resolving security conflict

s:

```bash

 # Fix all security conflict

s
 node fix-security-conflicts.js all

 # Fix only admin dashboard issue

s
 node fix-security-conflicts.js admin-dashboard

 # Fix only embedded content issue

s
 node fix-security-conflicts.js embed-content

 # Fix only OpenAI integration issue

s
 node fix-security-conflicts.js openai-integration


```

## Security System Components The security scanning system consists of several key components: 1. **Core Security Scanner** (`server/security/scanners/CoreSecurityScanner.ts`) - Performs comprehensive security checks - Integrates with OpenAI for AI-powered analysis - Generates detailed security reports 2. **Security Dashboard** (`src/components/admin/SecurityDashboard.tsx`) - Displays security scan results - Shows AI-generated security recommendations - Provides security status overview 3. **CSRF Protection** (`server/middleware/csrfProtection.ts`) - Implements Cross-Site Request Forgery protection - Includes bypass mechanisms for legitimate use cases 4. **Security Middlewares** - `adminCsrfBypass.ts` - CSRF bypass for admin routes - `embedContentCsrfBypass.ts` - CSRF bypass for embedded content - `cspBypassMiddleware.ts` - CSP adjustments for special case

s

## Security Configuration Security configuration is managed in several places: 1. **Environment Variables** (`.env.local`) - `OPENAI_API_KEY` - Key for AI-powered security analysis - `SECURITY_BYPASS_CSRF_FOR_ADMIN` - Enable CSRF bypass for admin routes - `SECURITY_BYPASS_CSRF_FOR_EMBEDS` - Enable CSRF bypass for embedded content - `SECURITY_ALLOW_OPENAI_IN_CSP` - Allow OpenAI connections in CSP 2. **Server Configuration** (`server/index.ts`) - Content Security Policy settings - CSRF protection configuration - Security middleware registratio

n

## Best Practices When working with the security system: 1. **Always test security changes thoroughly** before deploying to productio

n

2. **Document any security bypasses** with clear comments explaining the rationale

3. **Review AI-generated security recommendations** rather than implementing them blindly

4. **Keep the OpenAI API key secure** and never expose it in client-side code

5. **Regularly run security scans** to identify and address new issues

## Troubleshooting Common Issues See the [Security Troubleshooting Guide](./SECURITY-TROUBLESHOOTING.md) for detailed solutions to common issues like: - CSRF protection blocking legitimate admin dashboard acces

s

- Embedded content not loading due to security restrictions
- OpenAI integration failures due to CSP or CSRF protection

## See Also - [Embedded Content Security Configuration Guide](SECURITY-CONFIGURATION-EMBEDDED-CONTENT-QUICK-FIX.md) - 33% matc

h

- [Security Configuration for Embedded Content](SECURITY-CONFIGURATION-EMBEDDED-CONTENT.md) - 33% match
- [Security Troubleshooting Guide: Resolving Feature Conflicts](SECURITY-TROUBLESHOOTING.md) - 33% match
- [Embedded Content Security Changelog](EMBEDDED-CONTENT-CHANGELOG.md) - 25% match
- [Embedded Content Security Implementation](EMBEDDED-CONTENT-SECURITY.md) - 25% match