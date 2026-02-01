# 🐳 Docker Setup Guide - LiquidInsider

## Prerequisites
- Docker Desktop installed and running
- Git (optional, for cloning)

## Quick Start (3 steps)

### 1. Clone and navigate to project
```bash
git clone https://github.com/malykatamaranek-eng/liquidInsider.git
cd liquidInsider
```

### 2. Copy environment file
```bash
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Mac/Linux
```

### 3. Start all services
```bash
docker-compose up -d --build
```

## Access the Application

After waiting 2-3 minutes for services to start:

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Backend API**: http://localhost:3001/api
- **Database**: localhost:5432

## Login Credentials

Default admin account created during seed:
- **Email**: admin@liquidinsider.com
- **Password**: admin123

Default test user:
- **Email**: test@example.com
- **Password**: password123

## Useful Commands

### Check service status
```bash
docker-compose ps
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f backend
```

### Stop services
```bash
docker-compose down
```

### Clean everything (reset database)
```bash
docker-compose down -v
docker-compose up -d --build
```

### Access database shell
```bash
docker-compose exec postgres psql -U liquidinsider -d liquidinsider
```

### Run backend commands
```bash
# Run seed manually
docker-compose exec backend npm run seed

# Run migrations
docker-compose exec backend npx prisma migrate dev

# Access backend shell
docker-compose exec backend bash
```

## Troubleshooting

### Backend fails to start
1. Check logs: `docker-compose logs backend`
2. Verify database is healthy: `docker-compose ps`
3. Reset database: `docker-compose down -v && docker-compose up -d --build`

### Port already in use
Change ports in docker-compose.yml:
- Frontend: `"3000:3000"` → `"3001:3000"`
- Backend: `"3001:3001"` → `"3002:3001"`

### Database connection error
1. Ensure postgres service is healthy: `docker-compose ps`
2. Wait 30+ seconds for database to initialize
3. Reset: `docker-compose down -v && docker-compose up -d --build`

### Email errors
Email is optional. If SMTP not configured, emails are skipped silently.
To enable emails, set SMTP variables in .env:
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASSWORD

## Development Workflow

### Make code changes
Changes to backend/frontend are automatically reflected (hot reload enabled)

### Restart services
```bash
docker-compose restart backend   # Restart backend only
docker-compose restart frontend  # Restart frontend only
docker-compose restart           # Restart all
```

### View database
```bash
# Via psql
docker-compose exec postgres psql -U liquidinsider -d liquidinsider

# Check tables
\dt

# Query data
SELECT * FROM "User";
SELECT * FROM "Product";
```

## Next Steps

1. ✅ Application is running
2. ✅ Admin panel is accessible
3. ✅ Database is seeded with sample data
4. ✅ Ready for development!

For API documentation, see [API.md](./API.md)
For deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)
