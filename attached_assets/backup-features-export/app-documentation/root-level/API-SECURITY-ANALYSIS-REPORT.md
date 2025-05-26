# API Security Standards Analysis Repo

r

t **Generated:** 2025-05-23T02:13:25.901Z **Total Endpoints:** 609 **Overall Security Score:** 18/100 **Compliance:** 0%

## Executive Summary Comprehensive analysis of your API endpoints integrated with existing authentication middleware and security infrastructur

e.

## Critical Findings - **Vulnerable Endpoints:** 588 endpoints require immediate attentio n - **Authentication Gaps:** 11 protected endpoints missing authenticatio

n

- **CSRF Protection Gaps:** 287 mutation endpoints need CSRF protection
- **Security Issues:** 11 critical security vulnerabilities

## Integration Status ✅ **requireAuth Middleware:** Compatible and detected ✅ **CSRF Protection:** setupCSRFProtection system identified ✅ **Existing Infrastructure:** Fully compatibl

e

## Systemic Patterns ### Widespread Authentication Gap s - **Affected Endpoints:** 1

1

- **Root Cause:** Inconsistent application of requireAuth middleware
- **Security Risk:** Unauthorized access to sensitive operations and data
- **Fix Strategy:** Systematic application of requireAuth middleware to all protected routes ### CSRF Protection Gap

s
- **Affected Endpoints:** 287
- **Root Cause:** CSRF middleware not applied to mutation endpoints
- **Security Risk:** Cross-site request forgery vulnerability
- **Fix Strategy:** Apply CSRF protection to all state-changing operations

## Immediate Actions Required 1. CRITICAL: Apply requireAuth middleware to 11 endpoint s 2. HIGH: Implement CSRF protection for 287 mutation

s

## Authentication Gaps - GET /api/security/active-protection s - GET /api/security/stat

s

- GET /api/security/dashboard/settings
- GET /api/security/dashboard/metrics
- GET /api/security/dashboard/events
- GET /api/security/features
- GET /api/security/stats
- GET /api/security/events
- POST /api/security/features/update
- POST /api/security/policy/update
- POST /api/security/ai-analysis

## CSRF Protection Gaps - POST /audit-log s - POST /repair-task

s

- PUT /repair-tasks/:id
- POST /repair-tasks/:id/assign
- POST /repair-tasks/:id/status
- POST /import-export-jobs
- PUT /import-export-jobs/:id/status
- POST /batch-operations
- PUT /batch-operations/:id/status
- POST /schema-migrations
- PUT /schema-migrations/:id
- POST /schema-migrations/:id/apply
- POST /auto-fixes
- PUT /auto-fixes/:id
- PUT /auto-fixes/:id/toggle
- POST /auto-fixes/:id/run-result
- POST /login
- POST /register
- POST /logout
- POST /events
- POST /scan
- POST /multi-scan
- POST /fix/:id
- POST /events/:id/acknowledge
- POST /scan
- PUT /posts/:id/approve
- PUT /comments/:id/approve
- DELETE /comments/:id
- POST /content
- PUT /content/:id
- POST /comments/export
- POST /posts/export
- POST /files
- PUT /files/:id
- DELETE /files/:id
- POST /collections
- PUT /collections/:id
- DELETE /collections/:id
- POST /system
- PUT /system/:id
- DELETE /system/:id
- POST /
- PUT /:id
- PATCH /:id
- DELETE /:id
- PUT /settings/:id
- POST /scan
- POST /products
- PUT /products/:id
- DELETE /products/:id
- POST /categories
- PUT /categories/:id
- DELETE /categories/:id
- PUT /orders/:id/status
- POST /products/export
- POST /orders/export
- POST /stripe-config
- PUT /users/:id/role
- PUT /users/:id/ban
- DELETE /users/:id
- POST /users/export
- POST /ip-whitelist
- DELETE /ip-whitelist/:ip
- POST /check-permission
- POST /analyze
- POST /validate
- POST /analyze
- POST /variations
- POST /config
- POST /scan
- POST /totp/setup
- POST /totp/verify
- POST /recovery/generate
- POST /disable
- POST /adaptive/recalculate
- POST /threats/clear
- POST /config/:tier
- POST /blacklist
- DELETE /blacklist/:ip
- POST /reset/:tier/:identifier
- POST /subscribe
- POST /unsubscribe
- POST /dashboard/scripts/:scriptId/run
- POST /analyze
- POST /features
- PATCH /features/:id
- PATCH /features/:id/toggle
- POST /events
- POST /events/:id/resolve
- POST /scans
- POST /scans/:id/cancel
- POST /vulnerabilities/:id/fix
- PATCH /stats
- POST /audit-log-hash
- POST /record-log-review
- POST /login
- POST /register
- POST /logout
- POST /login
- POST /verify-2fa
- POST /verify-backup-code
- POST /setup-2fa
- POST /activate-2fa
- POST /disable-2fa
- POST /backup-codes/regenerate
- POST /logout
- POST /content
- PUT /content/:id
- POST /submit/:id
- POST /approve/:id
- POST /reject/:id
- POST /request-changes/:id
- POST /archive/:id
- POST /scheduler/run
- POST /scheduler/reset-metrics
- PATCH /content/:id/schedule
- POST /
- PUT /:id
- DELETE /:id
- POST /:id/version
- POST /history/:historyId/restore
- POST /:id/usage
- POST /:id/view
- POST /generate
- POST /enhance
- POST /summarize
- POST /sentiment
- POST /tags
- POST /recommendations
- POST /seo
- POST /insights
- POST /check-configuration
- POST /validate-query
- POST /maintenance/:task
- POST /scan
- POST /fix
- POST /fix-button
- POST /run-cli
- POST /keys/generate
- DELETE /keys/:id
- POST /encrypt/:keyId
- POST /decrypt
- POST /add
- POST /multiply
- POST /compute
- POST /ai-analysis
- POST /basic
- POST /ai-security
- POST /search
- POST /ask
- POST /token
- POST /search
- POST /ask
- POST /export
- POST /export/batch
- POST /feedback
- PUT /feedback/:id
- POST /login
- POST /refresh
- POST /logout
- POST /api/upload/media
- DELETE /api/media/:id
- POST /setup
- POST /verify
- POST /verify-backup
- POST /trust-device
- DELETE /trusted-devices/:deviceId
- POST /disable
- POST /regenerate-backup-codes
- POST /basic
- POST /ai-security
- POST /basic
- POST /ai-security
- POST /basic
- POST /ai-security
- POST /workflow/:id/read
- POST /workflow
- POST /completions
- POST /images
- POST /vision
- POST /secured
- POST /security-analysis
- POST /generate-keys
- POST /encrypt
- POST /decrypt
- POST /sign
- POST /verify
- POST /scans
- POST /settings
- POST /settings
- POST /scan
- POST /run
- POST /start
- POST /start-all
- DELETE /:id
- DELETE /
- POST /configuration
- POST /insights
- POST /documentation
- POST /threat-analysis
- POST /scans
- POST /quantum/generate-keys
- POST /quantum/encrypt
- POST /quantum/decrypt
- POST /
- PUT /:id
- DELETE /:id
- PUT /:id/publish
- PUT /:id/unpublish
- POST /:id/restore/:historyId
- POST /:id/usage
- POST /generate
- POST /errors
- PATCH /errors/:id
- POST /errors/:id/fix
- POST /patterns
- PATCH /patterns/:id
- POST /fixes
- PATCH /fixes/:id
- POST /errors
- PATCH /errors/:id
- POST /errors/:id/fix
- POST /patterns
- PATCH /patterns/:id
- POST /fixes
- PATCH /fixes/:id
- POST /contact
- POST /api-security
- POST /signup
- POST /security-test
- POST /pipeline/contact
- POST /pipeline/security
- POST /pipeline/signup
- POST /pipeline/db-operation
- POST /pipeline/cache
- POST /dashboard/scan
- POST /config/mode
- POST /config/feature
- POST /config/reset
- POST /config/recommended
- POST /users/:userId/mfa/reset
- POST /users/:userId/unlock
- POST /users/:userId/mfa/enforce
- POST /users/:userId/sessions/terminate
- POST /:id/resolve
- POST /block-ip
- POST /unblock-ip
- POST /rules
- POST /rules/:id/toggle
- DELETE /rules/:id
- POST /challenge
- POST /verify
- POST /keys/generate
- POST /data/encrypt
- POST /data/decrypt
- POST /data/operation
- POST /data/aggregate
- POST /admin/challenge
- POST /api/secure-data
- POST /api/custom-security
- POST /settings
- POST /scan/run
- POST /reset-metrics
- POST /products
- PATCH /products/:id
- DELETE /products/:id
- POST /categories
- PATCH /categories/:id
- DELETE /categories/:id
- POST /cart/items
- PATCH /cart/items/:itemId
- DELETE /cart/items/:itemId
- DELETE /cart
- POST /orders
- POST /cart/coupon
- POST /themes
- PUT /themes/:id
- DELETE /themes/:id
- POST /themes/:themeId/versions
- PUT /themes/:themeId/versions/:versionId/activate
- PUT /users/:userId/theme-preferences
- POST /themes/:themeId/share
- PUT /shared-themes/:id/revoke
- POST /themes/:themeId/download
- POST /themes/:themeId/feedback
- POST /themes/with-version
- POST /themes/:id/clone ---
*Generated by API Standards Enforcer - Integrated Analysis*