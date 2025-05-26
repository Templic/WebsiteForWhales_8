# Security Documentation Inde

x

**Version:** 1.0.0 **Last Updated:** 2025-05-17 **Status:** Current This document serves as the central index for all security-related documentation in the project. Use this as a starting point for finding specific security documentation.

## Overview The security system consists of several integrated components that work together to provide comprehensive protection: - **Authentication System**: User identity verificatio

n

- **Authorization System**: Access control to resources
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: Protection against abuse and DOS attacks
- **Input Validation**: Prevents malicious input
- **Security Logging**: Records security events
- **Security Dashboard**: Monitoring and management interface

## Current Documentation These are the current, actively maintained security documents: - [SECURITY-DOCUMENTATION.md](../SECURITY-DOCUMENTATION.md) - **MAIN DOCUMENT** - The central source of truth for all security feature

s

- [Enhanced Security Dashboard](security-guides/enhanced-security-dashboard.md) - Guide for using the enhanced security dashboard
- [CSRF Protection Guide](security-guides/2-csrf-protection-guide.md) - Complete guide to CSRF protection implementation
- [Rate Limiting Guide](security-guides/3-rate-limiting-guide.md) - Details on the rate limiting system
- [Security Documentation Maintenance](maintenance/SECURITY_DOCUMENTATION_MAINTENANCE.md) - Guidelines for maintaining security documentation

## Implementation References ### Core Security Components - Authentication System - `server/auth.t

s`

- CSRF Protection - `server/middleware/csrfProtectionMiddleware.ts`
- Rate Limiting - `server/middleware/rateLimiter.ts`
- Input Validation - `server/middleware/validationPipelineMiddleware.ts` ### Dashboard Implementations - Standalone Dashboard - `server/routes/api/direct-security-dashboard.j

s`
- Enhanced Dashboard - `server/routes/api/enhanced-security-dashboard.js`
- Integrated Dashboard - `client/src/pages/IntegratedSecurityDashboardPage.tsx`

## Maintenance Tools The following tools help maintain security documentation integrity: - **Documentation Validator**: `scripts/validate-security-documentation.j

s`

- **Documentation Updater**: `scripts/update-security-docs.js`
- **Dashboard Diagnostics**: `scripts/diagnose-security-dashboard.js`

## Templates Use these templates when creating new security documentation: - [Security Feature Template](templates/SECURITY_FEATURE_TEMPLATE.m

d)

## Deprecated Documentation These documents are kept for historical reference but should not be used: - [Legacy Security Dashboard](security/security_dashboard_guide.md) - **DEPRECATE

D**

- [Old CSRF Protection](security/csrf-protection.md) - **DEPRECATED**
- [Security Implementation (Old)](SECURITY-IMPLEMENTATION.md) - **DEPRECATED**

## Troubleshooting If you encounter issues with security components: 1. Check the security log

s

2. Run the security dashboard diagnostics: `node scripts/diagnose-security-dashboard.js`

3. Verify that documentation matches implementation using: `node scripts/validate-security-documentation.js`

4. For circular dependencies between authentication and security, see [Enhanced Security Dashboard](security-guides/enhanced-security-dashboard.md) troubleshooting section

## See Also - [Security Guides Index (Updated May 2025)](security-guides/SECURITY-GUIDES-INDEX.md) - 31% matc

h

- [Security Implementation Guide](README-SECURITY.md) - 25% match
- [WebSocket Security Implementation](README-websocket-security.md) - 25% match
- [Security Implementation Guide](SECURITY-IMPLEMENTATION-GUIDE.md) - 25% match
- [Security Guide](SECURITY_GUIDE.md) - 25% match