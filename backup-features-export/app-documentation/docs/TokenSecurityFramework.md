## Static vs. Rotating/Random Tokens our decision framework for when to use static tokens versus rotating or random tokens throughout the security management platfor

m.

## Static Tokens Static tokens remain the same for their lifetime and are appropriate for: | Use Case | Justification | Examples in Our Syste

m |

|----------|---------------|------------------------|

| Low-Risk Operations | Non-sensitive data access with minimal risk | Public API read-only access, dashboard analytics view |
| Configuration Settings | System validation without user authentication | Security scanner configurations, dashboard layout preferences |

| System-to-System Communication | Internal trusted service connections | Internal scanner to dashboard communication, health check endpoints |
| Development/Testing | Simplified workflows with controlled environments | Testing endpoints, scan simulation APIs |

| Long-lived Service Accounts | System components with persistent identities | Background security services, automated system agents |

## Rotating/Random Tokens Tokens that change regularly or are randomly generated for each use: | Use Case | Justification | Examples in Our Syste

m |

|----------|---------------|------------------------|

| User Authentication | Protect user sessions from hijacking | Dashboard login sessions, admin portal access |
| High-Value Operations | Protect sensitive data or operations | Admin operations, security policy changes, scanner configuration updates |

| CSRF Protection | Prevent cross-site request forgery | All form submissions, scanner trigger endpoints |
| External API Access | Limit impact of potential token leaks | API integrations with external security systems, public-facing APIs |

| One-Time Operations | Ensure operations cannot be replayed | Password reset, email verification, critical security changes |
| Multi-tier Authentication | Add additional security layer | Admin access to vulnerability data, security event management |

## Token Lifecycle Implementation Guidelines 1. **Issuance**: - Static tokens: Generated with strong entropy sources, stored securely with appropriate ACLs - Rotating tokens: Generated with timestamp components, include scoping parameters - Random tokens: Generate using cryptographically secure random number generators 2. **Storage**: - Backend: All tokens stored with appropriate encryption at rest - Client-side: Use HttpOnly, secure cookies for session tokens, avoid localStorage for sensitive tokens 3. **Validation**: - All tokens must be validated for authenticity, expiration, and appropriate scope - Implement strict token binding where appropriate (IP, user-agent, etc.) 4. **Rotation Schedules**: - User sessions: Rotate every 15-60 minutes based on sensitivity level - API tokens: Rotate daily or weekly based on usage patterns - Critical operation tokens: Single-use or short lifespan (minutes) 5. **Revocation**: - Maintain centralized revocation capability for all token types - Implement near real-time revocation for high-security context

s

## System-Specific Implementation | System Component | Token Type | Rotation/Expiry | Additional Security Measure

s |

|------------------|------------|----------------|------------------------------|

| Security Dashboard Login | Rotating | 30 minutes | IP binding, concurrent session limits |
| Scanner API Access | Rotating | 24 hours | Scope limited, API rate limiting |

| System Health Checks | Static | 90 days | Internal network only, minimal privileges |
| CSRF Protection | Random | Per request | Strict validation, no reuse |

| Security Event Audit | Rotating | 15 minutes | Cryptographic signing of audit trail |
| Admin Operations | Rotating | 15 minutes + re-auth | Step-up authentication for critical changes |

| External API Access | Rotating | 7 days | Limited scope, detailed logging |
| Embedded Dashboard Access | Rotating | 60 minutes | Origin validation, scope limiting |

| Security Scan Triggers | Random | Per request | Rate limiting, authorization checks |
| Configuration Changes | Random | Per operation | Admin approval workflow, change logging |

## Integration with Cache Strategy Our token lifecycle management is aligned with our tiered caching strategy: | Priority Level | Token Type | Typical Validity | Cache TT

L |

|---------------|------------|-----------------|----------|

| Critical | Random/Single-use | Minutes | 5 minutes |
| High | Rotating | 15-60 minutes | 15 minutes |

| Normal | Static/Rotating | Hours-Days | 60 minutes |

This alignment ensures that cached security results and token lifecycles are synchronized to maintain both security and performance.

## See Also - [CSRF Protection System](CSRF-PROTECTION-SYSTEM.md) - 25% matc

h

- [API Endpoints Documentation](API_ENDPOINTS.md) - 18% match
- [Security Implementation Plan](SECURITY-IMPLEMENTATION-PLAN.md) - 18% match
- [Security Scan System Documentation](SECURITY-SCAN-SYSTEM.md) - 18% match
- [Security Dashboard Security Model](security/admin/architecture/dashboard_security_model.md) - 18% match