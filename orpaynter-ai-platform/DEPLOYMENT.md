# OrPaynter AI Platform - Deployment Guide

This guide provides step-by-step instructions for deploying the OrPaynter AI Platform to production.

## Prerequisites

- Node.js 18+ installed
- Git repository access
- Stripe live API keys
- Supabase production project
- Domain name (optional but recommended)

## Environment Variables

Ensure all production environment variables are configured:

```env
# Application (Client-side - exposed via VITE_)
VITE_APP_NAME=OrPaynter AI Platform
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production

# Stripe - Public key only (Client-side)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe - Secrets (Server-side ONLY - never use VITE_ prefix)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase - Public credentials (Client-side)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Supabase - Service role (Server-side ONLY - never use VITE_ prefix)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Security (Server-side ONLY - never use VITE_ prefix)
JWT_SECRET=your-super-secure-jwt-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key

# Features (Client-side - exposed via VITE_)
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
VITE_ENABLE_NOTIFICATIONS=true
```

## Build for Production

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run production build:**
   ```bash
   npm run build
   ```

3. **Preview production build locally:**
   ```bash
   npm run preview
   ```

## Deployment Options

### Option 1: Vercel (Recommended)

#### Quick Deploy
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

#### Manual Setup
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on git push

#### Environment Variables in Vercel
Add these in your Vercel project settings:

**Client-side (exposed to browser):**
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Server-side only (never use VITE_ prefix):**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `ENCRYPTION_KEY`

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

#### Netlify Configuration
Create `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Option 3: AWS S3 + CloudFront

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to S3:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront distribution**
4. **Set up custom domain with Route 53**

### Option 4: Docker (Recommended for Production)

This repository includes a production-ready multi-stage Dockerfile with security best practices.

#### Build and Deploy

1. **Build the Docker image:**
   ```bash
   docker build -t orpaynter-ai-platform:latest \
     --build-arg VITE_APP_NAME="OrPaynter AI Platform" \
     --build-arg VITE_APP_VERSION="1.0.0" \
     --build-arg VITE_STRIPE_PUBLISHABLE_KEY="pk_live_..." \
     --build-arg VITE_SUPABASE_URL="https://your-project.supabase.co" \
     --build-arg VITE_SUPABASE_ANON_KEY="eyJ..." \
     --build-arg VITE_ENABLE_PWA="true" \
     --build-arg VITE_ENABLE_ANALYTICS="true" \
     .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name orpaynter-ai \
     -p 80:80 \
     --restart unless-stopped \
     orpaynter-ai-platform:latest
   ```

3. **Run with Docker Compose (recommended):**
   
   Create `docker-compose.yml`:
   ```yaml
   version: '3.8'
   
   services:
     web:
       build:
         context: .
         args:
           VITE_APP_NAME: "OrPaynter AI Platform"
           VITE_APP_VERSION: "1.0.0"
           VITE_STRIPE_PUBLISHABLE_KEY: "${VITE_STRIPE_PUBLISHABLE_KEY}"
           VITE_SUPABASE_URL: "${VITE_SUPABASE_URL}"
           VITE_SUPABASE_ANON_KEY: "${VITE_SUPABASE_ANON_KEY}"
           VITE_ENABLE_PWA: "true"
           VITE_ENABLE_ANALYTICS: "true"
       ports:
         - "80:80"
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost/health"]
         interval: 30s
         timeout: 3s
         retries: 3
         start_period: 5s
   ```
   
   Deploy:
   ```bash
   docker-compose up -d
   ```

4. **Check container health:**
   ```bash
   docker ps
   docker logs orpaynter-ai
   ```

#### Production Deployment with HTTPS

For production, use a reverse proxy (Nginx, Cloudflare, AWS ALB) to handle HTTPS:

**Option A: Nginx Reverse Proxy**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/ssl/certs/yourdomain.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.key;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Option B: Cloudflare**
- Point your domain DNS to your server IP
- Enable Cloudflare proxy (orange cloud)
- SSL/TLS mode: Full (strict)
- Automatic HTTPS rewrites: On

### Option 5: Self-Hosted with Nginx

Use the included `nginx.conf` for production deployment with full security headers.

#### Setup Instructions

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Copy files to web server:**
   ```bash
   sudo cp -r dist/* /usr/share/nginx/html/
   sudo cp nginx.conf /etc/nginx/sites-available/orpaynter-ai
   ```

3. **Update nginx.conf with your domain:**
   ```bash
   sudo nano /etc/nginx/sites-available/orpaynter-ai
   # Replace 'yourdomain.com' with your actual domain
   ```

4. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/orpaynter-ai /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Install SSL certificate (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

## Supabase Production Setup

### 1. Create Production Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project for production
3. Note down the project URL and anon key

### 2. Database Migration
1. **Export schema from development:**
   ```bash
   supabase db dump --schema-only > schema.sql
   ```

2. **Import to production:**
   ```bash
   psql -h your-prod-host -U postgres -d postgres < schema.sql
   ```

### 3. Row Level Security (RLS)
Ensure RLS policies are properly configured:
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON assessments TO authenticated;
```

### 4. Storage Configuration
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('project-images', 'project-images', true),
('assessment-photos', 'assessment-photos', true),
('documents', 'documents', false);

-- Set up storage policies
CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
```

## Stripe Production Setup

### 1. Webhook Configuration
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 2. Product Configuration
Create products in Stripe Dashboard:
- **Basic Plan**: $29/month
- **Professional Plan**: $99/month
- **Enterprise Plan**: $299/month

## Security Checklist

- [ ] All environment variables are secure and properly scoped
  - [ ] Server-side secrets do NOT use `VITE_` prefix
  - [ ] Client-side variables use `VITE_` prefix appropriately
- [ ] HTTPS is enabled with valid SSL certificate
- [ ] HSTS headers are configured (max-age=31536000)
- [ ] CSP headers are configured without `unsafe-inline`
- [ ] X-Frame-Options, X-Content-Type-Options headers are set
- [ ] Rate limiting is implemented for API endpoints
- [ ] Database RLS policies are active
- [ ] API keys are not exposed in client code
- [ ] Webhook signatures are verified
- [ ] CORS is properly configured
- [ ] Source maps are disabled in production
- [ ] Console logs are removed from production build

## Automated Health Checks

The repository includes a comprehensive health check script for monitoring your deployment.

### Running Health Checks

**Basic usage:**
```bash
./health-check.sh https://yourdomain.com
```

**In CI/CD (GitHub Actions):**
```yaml
- name: Health Check
  run: |
    chmod +x ./health-check.sh
    ./health-check.sh https://yourdomain.com
```

**With cron for monitoring:**
```bash
# Add to crontab (every 5 minutes)
*/5 * * * * /path/to/health-check.sh https://yourdomain.com >> /var/log/health-check.log 2>&1
```

### Health Check Features

The script validates:
- ✓ Application reachability (HTTP 200)
- ✓ HTTPS redirect (HTTP 301/308)
- ✓ Security headers (HSTS, CSP, X-Frame-Options, etc.)
- ✓ Health endpoint (/health)
- ✓ Static asset loading
- ✓ Response time (<3s optimal)
- ✓ Protection of sensitive files (.env, .git, etc.)

### Custom Health Checks

Add application-specific checks to the script:
```bash
# Example: Check Supabase connectivity
SUPABASE_STATUS=$(curl -s "$VITE_SUPABASE_URL/rest/v1/" | jq -r '.status')
if [ "$SUPABASE_STATUS" = "ok" ]; then
    print_result "Supabase Connection" 0 ""
else
    print_result "Supabase Connection" 1 "Not reachable"
fi
```

## Performance Optimization

### 1. Build Configuration

The `vite.config.ts` is optimized for production:
- ✓ Source maps disabled (`sourcemap: false`)
- ✓ Console logs removed (`drop_console: true`)
- ✓ Dead code elimination (`drop_debugger: true`)
- ✓ Code splitting with manual chunks
- ✓ Terser minification

### 2. CDN Configuration
- Enable CDN for static assets
- Configure proper cache headers (implemented in nginx.conf)
- Use image optimization
- Leverage browser caching

### 3. Nginx Optimizations

The included `nginx.conf` provides:
- Gzip compression for text assets
- Static asset caching (1 year for immutable files)
- HTTP/2 support
- Connection keep-alive

### 4. Monitoring
- Set up error tracking (Sentry recommended)
- Configure performance monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Use the included health-check.sh script

### 5. Analytics
- Google Analytics 4
- Stripe Analytics
- Custom event tracking

## Post-Deployment

### 1. Health Checks
- [ ] Application loads correctly
- [ ] Authentication works
- [ ] Payment processing works
- [ ] Database connections are stable
- [ ] File uploads work
- [ ] PWA installation works

### 2. Testing
- [ ] Run end-to-end tests
- [ ] Test payment flows
- [ ] Verify email notifications
- [ ] Check mobile responsiveness

### 3. Backup Strategy
- Set up automated database backups
- Configure file storage backups
- Document recovery procedures

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables:**
   - Ensure all required variables are set
   - Check variable naming (VITE_ prefix for client-side)
   - Verify API keys are valid

3. **Database Connection:**
   - Check Supabase project URL
   - Verify API keys
   - Check RLS policies

4. **Payment Issues:**
   - Verify Stripe keys are live keys
   - Check webhook configuration
   - Verify product IDs match

### Support

For deployment support:
- Check application logs
- Review error monitoring
- Contact development team

## Maintenance

### Regular Tasks
- Monitor application performance
- Update dependencies
- Review security logs
- Backup verification
- Performance optimization

### Updates
- Test in staging environment first
- Use blue-green deployment strategy
- Monitor post-deployment metrics
- Have rollback plan ready

---

**Note:** Always test the deployment process in a staging environment before deploying to production.