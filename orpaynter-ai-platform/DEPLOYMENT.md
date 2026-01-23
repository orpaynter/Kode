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
# Application
VITE_APP_NAME=OrPaynter AI Platform
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production

# Stripe (Live Keys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Security
JWT_SECRET=your-super-secure-jwt-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key

# Features
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
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
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

### Option 4: Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build and run:
```bash
docker build -t orpaynter-ai .
docker run -p 80:80 orpaynter-ai
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

- [ ] All environment variables are secure
- [ ] HTTPS is enabled
- [ ] CSP headers are configured
- [ ] Rate limiting is implemented
- [ ] Database RLS policies are active
- [ ] API keys are not exposed in client code
- [ ] Webhook signatures are verified
- [ ] CORS is properly configured

## Performance Optimization

### 1. CDN Configuration
- Enable CDN for static assets
- Configure proper cache headers
- Use image optimization

### 2. Monitoring
- Set up error tracking (Sentry)
- Configure performance monitoring
- Set up uptime monitoring

### 3. Analytics
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