# Security Guidelines - OrPaynter AI Platform

This document outlines the security measures implemented in the OrPaynter AI Platform deployment.

## Environment Variable Security

### ⚠️ CRITICAL: Never Expose Secrets to the Client

**Rule:** Server-side secrets must NEVER use the `VITE_` prefix.

Vite exposes all environment variables with the `VITE_` prefix to the client-side code. This means they are visible in the browser and can be accessed by anyone.

### Client-Side Variables (Safe to use `VITE_` prefix)

These are public keys/values that can be safely exposed:

- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (starts with `pk_`)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_APP_*` - Application configuration
- `VITE_ENABLE_*` - Feature flags

### Server-Side Variables (NEVER use `VITE_` prefix)

These are sensitive secrets that must remain server-side only:

- `STRIPE_SECRET_KEY` - Stripe secret key (starts with `sk_`)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - JWT signing secret
- `ENCRYPTION_KEY` - Encryption key for sensitive data

## HTTPS and Transport Security

### Strict Transport Security (HSTS)

The nginx configuration enforces HTTPS with HSTS headers:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

This instructs browsers to:
- Only connect via HTTPS for 1 year (31536000 seconds)
- Apply the policy to all subdomains
- Be eligible for browser HSTS preload lists

### SSL/TLS Configuration

- **Protocols:** TLS 1.2 and TLS 1.3 only
- **Ciphers:** Strong cipher suites with forward secrecy
- **Session Management:** Session caching and resumption enabled
- **OCSP Stapling:** Enabled for certificate validation

## Content Security Policy (CSP)

The application uses a strict CSP that:

### ✅ Allowed Sources

- **Scripts:** Same-origin and Stripe.js only
- **Styles:** Same-origin with inline styles (required for Vite/React), Google Fonts
- **Fonts:** Same-origin and Google Fonts
- **Images:** Same-origin, data URIs, and HTTPS sources
- **Connect:** Same-origin, Stripe API, Supabase API
- **Frames:** Stripe.js only

### ❌ Blocked by Default

- Inline scripts (`unsafe-inline` removed for scripts)
- `eval()` and similar functions
- Object/embed plugins
- Unauthorized third-party scripts

### CSP Header

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' https://js.stripe.com; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: https:; 
  connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co; 
  frame-src https://js.stripe.com; 
  base-uri 'self'; 
  form-action 'self'; 
  upgrade-insecure-requests;
```

**Note:** `unsafe-inline` is only used for styles due to Vite/React dynamic styling requirements. All scripts must be from allowed sources.

## Additional Security Headers

### X-Frame-Options
```
X-Frame-Options: SAMEORIGIN
```
Prevents clickjacking by disallowing the site to be framed by other domains.

### X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
Prevents MIME type sniffing attacks.

### X-XSS-Protection
```
X-XSS-Protection: 1; mode=block
```
Enables browser XSS protection (legacy header, CSP is primary protection).

### Referrer-Policy
```
Referrer-Policy: strict-origin-when-cross-origin
```
Controls what information is sent in the Referer header.

### Permissions-Policy
```
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(self)
```
Controls which browser features can be used.

## Production Build Security

### Source Maps

Source maps are **disabled** in production (`sourcemap: false` in `vite.config.ts`).

This prevents attackers from easily reverse-engineering your application code.

### Console Logs

All console logs are **removed** in production (`drop_console: true`).

This prevents:
- Information leakage
- Performance overhead
- Cluttered browser consoles

### Code Minification

All code is minified with Terser, including:
- Dead code elimination
- Debugger statement removal
- Variable name mangling

## File Protection

The nginx configuration blocks access to:

- Hidden files (`.env`, `.git`, etc.)
- Backup files (`.bak`, `.sql`, etc.)
- Source files (`.sh`, `.conf`, etc.)
- Log files

## Health Monitoring

The included `health-check.sh` script validates:

- Application availability
- HTTPS enforcement
- Security header presence
- Response times
- Sensitive file protection

Run regularly to ensure security posture is maintained.

## Rate Limiting

Consider implementing rate limiting for:

- API endpoints
- File uploads
- Authentication attempts
- Search/query operations

Example nginx rate limiting:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
}
```

## Database Security

### Row Level Security (RLS)

Ensure RLS policies are enabled on all Supabase tables:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
```

### Service Role Key

The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. Only use it:
- Server-side
- For administrative tasks
- Never expose to client

## Stripe Webhook Security

Always verify webhook signatures:

```typescript
const signature = request.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  request.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

## Docker Security

The Dockerfile implements:

- Multi-stage builds (reduces attack surface)
- Non-root user (`nginx-app`)
- Minimal base image (Alpine Linux)
- Security updates applied
- Health checks enabled
- No unnecessary packages

## Regular Security Maintenance

### Weekly
- Monitor application logs for anomalies
- Check health check results
- Review error reports

### Monthly
- Update dependencies (`npm update`)
- Review security advisories
- Rotate API keys if needed

### Quarterly
- Security audit
- Penetration testing
- Review and update CSP
- Update SSL certificates (if self-managed)

## Incident Response

In case of a security incident:

1. **Contain:** Immediately block affected endpoints
2. **Investigate:** Review logs and identify breach scope
3. **Rotate:** Change all API keys and secrets
4. **Patch:** Fix the vulnerability
5. **Notify:** Inform affected users if required
6. **Document:** Record incident for future prevention

## Security Contacts

For security issues, please contact:
- Security team: [security@orpaynter.com]
- Urgent issues: [Use GitHub Security Advisories]

## Compliance

This configuration helps meet requirements for:

- PCI DSS (for payment processing)
- GDPR (data protection)
- SOC 2 (security controls)
- OWASP Top 10 (common vulnerabilities)

## References

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)
- [Supabase Security Guide](https://supabase.com/docs/guides/platform/security)

---

**Last Updated:** 2024
**Version:** 1.0
