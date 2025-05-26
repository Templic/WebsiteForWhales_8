## Core Components ### Authentication Syste

m

- Location: server/security/auth/*
- Purpose: User identity verification
- Dependencies: JWT, Session Management ### CSRF Protectio

n
- Location: server/security/csrf/*
- Purpose: Cross-site request forgery prevention
- Dependencies: Token Management ### Rate Limitin

g
- Location: server/security/advanced/threat/*
- Purpose: Request rate control
- Dependencies: Redis Cache

## Security Middleware Chain 1. API Security (server/middleware/apiSecurity.t

s)

2. CSRF Protection (server/middleware/csrfProtection.ts) 3. Rate Limiting (server/middleware/rateLimit.ts)

4. Validation (server/middleware/validation.ts)

## Security Event System - Location: server/security/event

s/*

- Purpose: Security event logging and monitoring
- Dependencies: Logger Service, Event Queue