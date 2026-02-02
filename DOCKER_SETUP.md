# 🐳 Docker Setup Guide - LiquidInsider

Complete guide to running LiquidInsider with Docker Compose.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Configuration](#configuration)
4. [Troubleshooting](#troubleshooting)
5. [Advanced Usage](#advanced-usage)

## Prerequisites

- Docker Desktop (or Docker + Docker Compose)
- Git
- 4GB RAM minimum
- 2GB disk space

### Install Docker

- **Windows/Mac**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: [Docker](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/malykatamaranek-eng/liquidInsider.git
cd liquidInsider
```

### 2. Setup Environment
```bash
cp .env.example .env
```

### 3. Start Services
```bash
docker-compose up -d --build
```

### 4. Wait for Startup (~2-3 minutes)
```bash
# Check status
docker-compose ps

# Watch backend logs
docker-compose logs -f backend
```

### 5. Access Application

- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin
- API: http://localhost:3001/api

**Login**: admin@liquidinsider.com / admin123

## Configuration

### Environment Variables

Edit `.env` file to customize:

```bash
# Database
DB_USER=liquidinsider
DB_PASSWORD=liquidinsider
DB_NAME=liquidinsider
DB_PORT=5432

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT (change in production!)
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Optional: Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Optional: Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Email Configuration

Email is **optional**. If not configured:
- App works normally
- Email notifications are skipped gracefully

To enable email:
1. Get SMTP credentials (Gmail, SendGrid, etc.)
2. Add to `.env`:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```
3. Restart backend: `docker-compose restart backend`

## Troubleshooting

### Services Won't Start

**Error: "no configuration file provided"**
```bash
# Make sure you're in project root where docker-compose.yml is
cd /path/to/liquidInsider
docker-compose ps
```

**Error: "port already in use"**
```bash
# Change ports in .env
BACKEND_PORT=3002
FRONTEND_PORT=3001
docker-compose restart
```

**Error: "Cannot connect to Docker daemon"**
```bash
# Make sure Docker Desktop is running
# Windows: Open Docker Desktop app
# Linux: sudo service docker start
```

### Database Issues

**Error: "database does not exist"**
```bash
# Reset database
docker-compose down -v
docker-compose up -d --build
# Wait 2-3 minutes for seed
```

**Can't connect to database**
```bash
# Check if postgres is healthy
docker-compose ps postgres

# View postgres logs
docker-compose logs postgres

# Check database connection
docker-compose exec postgres psql -U liquidinsider -d liquidinsider -c "SELECT 1;"
```

### Backend Not Starting

**Error: "nodemailer is not a function"**
- Already fixed in latest version
- If still happening: remove SMTP vars and restart

**Error: "TypeError in email.ts"**
```bash
# View full error
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

**Backend keeps restarting**
```bash
# Check migrations
docker-compose exec backend npx prisma migrate status

# Reset database if needed
docker-compose down -v
docker-compose up -d --build
```

### Frontend Not Loading

**Error: "Cannot GET /admin"**
- Make sure backend is running: `docker-compose logs backend`
- Check API URL: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
- Restart frontend: `docker-compose restart frontend`

**Error: "Failed to fetch from API"**
```bash
# Check backend is accessible
curl http://localhost:3001/api/health

# View frontend logs
docker-compose logs frontend

# Check network
docker-compose exec frontend ping backend
```

### Login Issues

**Cannot login with admin credentials**
1. Check if seeding completed: `docker-compose logs backend | grep "seed completed"`
2. Reset database: `docker-compose down -v && docker-compose up -d --build`
3. Wait full 3 minutes for initialization

**"Invalid email or password"**
- Credentials: admin@liquidinsider.com / admin123
- Check database: 
  ```bash
  docker-compose exec postgres psql -U liquidinsider -d liquidinsider -c "SELECT email, role FROM \"User\";"
  ```

## Advanced Usage

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Follow in real-time
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Database Access

```bash
# Interactive PostgreSQL
docker-compose exec postgres psql -U liquidinsider -d liquidinsider

# Run SQL command
docker-compose exec postgres psql -U liquidinsider -d liquidinsider -c "SELECT * FROM \"User\";"

# Backup database
docker-compose exec postgres pg_dump -U liquidinsider liquidinsider > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T postgres psql -U liquidinsider -d liquidinsider
```

### Manual Database Operations

```bash
# Run migrations
docker-compose exec backend npx prisma migrate dev

# Generate Prisma client
docker-compose exec backend npx prisma generate

# Seed database
docker-compose exec backend npm run seed

# View Prisma schema
docker-compose exec backend cat prisma/schema.prisma
```

### Rebuild Everything

```bash
# Clean rebuild (deletes data!)
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Wait for initialization
sleep 180
docker-compose logs backend | grep "Database seed completed"
```

### Shell Access

```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Database shell
docker-compose exec postgres bash
```

### Performance Optimization

```bash
# Check container stats
docker stats

# Clear unused Docker resources
docker system prune -a

# Increase Docker memory (in Desktop settings)
# Windows/Mac: Docker Desktop > Settings > Resources > Memory
```

## Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)

Key differences:
- Use `docker-compose.prod.yml`
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper SMTP
- Setup SSL/HTTPS
- Use managed database service

## Support

- Issues: https://github.com/malykatamaranek-eng/liquidInsider/issues
- Documentation: See README.md and API.md
- Docker Docs: https://docs.docker.com/
