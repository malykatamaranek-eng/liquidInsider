# LiquidInsider Deployment Guide

This guide covers deploying the LiquidInsider e-commerce platform to production.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ database
- Domain name (optional)
- Stripe account with API keys
- SMTP email service (Gmail, SendGrid, etc.)
- SSL certificate (for HTTPS)

## Environment Setup

### 1. Database Setup

For production, use a managed PostgreSQL service:
- **AWS RDS**
- **Digital Ocean Managed Databases**
- **Heroku Postgres**
- **Supabase**
- **Neon**

Example connection string:
```
DATABASE_URL="postgresql://username:password@hostname:5432/liquidinsider?schema=public&sslmode=require"
```

### 2. Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"

# JWT Secrets (Generate strong secrets!)
JWT_SECRET="your-very-long-random-secret-key-min-32-chars"
JWT_REFRESH_SECRET="another-very-long-random-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# API URLs
API_URL="https://api.yourdomain.com"
FRONTEND_URL="https://yourdomain.com"

# Stripe (Production Keys)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
FROM_EMAIL="noreply@yourdomain.com"

# Admin
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="strong-secure-password"

# Environment
NODE_ENV="production"
PORT="3001"
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install PostgreSQL (or use managed service)
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx
```

#### 2. Deploy Backend
```bash
# Clone repository
git clone https://github.com/malykatamaranek-eng/liquidInsider.git
cd liquidInsider/backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
nano .env  # Edit with production values

# Run Prisma migrations
npx prisma migrate deploy
npx prisma generate

# Seed database (optional)
npm run seed

# Build application
npm run build

# Start with PM2
pm2 start dist/server.js --name liquidinsider-api
pm2 save
pm2 startup
```

#### 3. Deploy Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build

# Start with PM2
pm2 start npm --name liquidinsider-frontend -- start
pm2 save
```

#### 4. Configure Nginx

Create `/etc/nginx/sites-available/liquidinsider`:
```nginx
# API Server
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/liquidinsider /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### Option 2: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Environment Variables: Add `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Deploy

#### Backend on Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Deploy from GitHub
5. Configure:
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment Variables: Add all backend env vars
6. Deploy

### Option 3: Docker Deployment

#### 1. Create Production Docker Compose

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: liquidinsider
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/liquidinsider
      NODE_ENV: production
    ports:
      - "3001:3001"
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: ${API_URL}
    ports:
      - "3000:3000"
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 2. Create Production Dockerfiles

**backend/Dockerfile.prod**:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3001
CMD ["npm", "start"]
```

**frontend/Dockerfile.prod**:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

#### 3. Deploy
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Post-Deployment Tasks

### 1. Run Database Migrations
```bash
cd backend
npx prisma migrate deploy
```

### 2. Create Admin User
```bash
npm run seed  # Or create manually via API
```

### 3. Configure Stripe Webhooks
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://api.yourdomain.com/api/payments/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to env vars

### 4. Setup Monitoring

#### PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
```

#### Error Tracking (Sentry)
Add to both frontend and backend:
```bash
npm install @sentry/node @sentry/react
```

### 5. Database Backups

Setup automated backups:
```bash
# Create backup script
cat > /home/deploy/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U user -h localhost liquidinsider > /backups/liquidinsider_$DATE.sql
# Delete backups older than 30 days
find /backups -name "liquidinsider_*.sql" -mtime +30 -delete
EOF

chmod +x /home/deploy/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/deploy/backup-db.sh
```

## Security Checklist

- [ ] Use HTTPS (SSL certificate)
- [ ] Enable firewall (ufw or cloud provider firewall)
- [ ] Change default admin password
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable rate limiting
- [ ] Setup CORS properly
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Database connection over SSL
- [ ] Disable directory listing in Nginx
- [ ] Setup fail2ban for SSH
- [ ] Use Stripe production keys
- [ ] Enable logging and monitoring

## Monitoring

### Application Logs
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Performance Monitoring
- Setup [New Relic](https://newrelic.com) or [Datadog](https://datadoghq.com)
- Enable [Google Analytics](https://analytics.google.com)
- Use [Sentry](https://sentry.io) for error tracking

## Scaling

### Horizontal Scaling
- Use load balancer (AWS ELB, Nginx load balancing)
- Multiple backend instances with PM2 cluster mode
- Redis for session storage and caching
- CDN for static assets (Cloudflare, AWS CloudFront)

### Database Scaling
- Enable connection pooling (already configured in Prisma)
- Setup read replicas for heavy read operations
- Implement caching layer (Redis)

## Maintenance

### Update Application
```bash
# Pull latest changes
git pull

# Backend
cd backend
npm install
npm run build
pm2 restart liquidinsider-api

# Frontend
cd ../frontend
npm install
npm run build
pm2 restart liquidinsider-frontend
```

### Database Migrations
```bash
cd backend
npx prisma migrate deploy
```

## Troubleshooting

### Backend won't start
- Check logs: `pm2 logs liquidinsider-api`
- Verify DATABASE_URL is correct
- Ensure Prisma client is generated: `npx prisma generate`

### Frontend 502 Error
- Check if backend is running: `pm2 status`
- Verify API_URL is correct in frontend env
- Check Nginx configuration

### Database Connection Issues
- Verify PostgreSQL is running
- Check connection string
- Ensure SSL is enabled if required
- Check firewall rules

## Support

For issues:
1. Check logs first
2. Review environment variables
3. Check firewall rules
4. Verify SSL certificates
5. Open GitHub issue if needed

## Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/getting-started/)
