# LiquidInsider - Advanced E-Commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

A complete, production-ready e-commerce platform for selling liquids with modern tech stack. Built with Next.js 14, Express, TypeScript, PostgreSQL, and Prisma ORM.

## ✨ Features

- 🛍️ **Full E-Commerce Functionality**: Product catalog, cart, checkout, orders
- 🔐 **Secure Authentication**: JWT with refresh tokens, bcrypt password hashing
- 👥 **Multi-Role System**: Customer and Admin roles with different permissions
- 📦 **Product Management**: Complete CRUD operations with categories and inventory
- 💳 **Payment Integration**: Stripe payment processing ready
- 📧 **Email Notifications**: Order confirmations, password resets
- 📱 **Responsive Design**: Mobile-first, works on all devices
- ⚡ **Performance Optimized**: Fast loading, efficient queries, image optimization
- 🔒 **Security First**: Rate limiting, CORS, Helmet.js, input validation
- 📊 **Admin Dashboard**: Sales metrics, order management, user management
- 🎨 **Modern UI**: Tailwind CSS with smooth animations

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with animations
- **State Management**: React Context + Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT with refresh tokens
- **Payment**: Stripe integration

### Security
- JWT-based authentication with refresh token rotation
- Password hashing with bcrypt
- Rate limiting and DDoS protection
- CORS configuration
- Helmet.js for security headers
- Input validation and sanitization
- SQL injection prevention via Prisma ORM
- XSS protection with CSP headers

## Features

### Customer Features
- Browse products with filtering and sorting
- Product search functionality
- Shopping cart with persistence
- Multi-step checkout process
- User authentication (register/login)
- Order history and tracking
- Wishlist functionality
- Responsive mobile-first design

### Admin Features
- Dashboard with sales metrics
- Product management (CRUD operations)
- Order management and status updates
- User management
- Payment tracking
- Analytics and reports
- Store settings configuration

## Project Structure

```
liquidInsider/
├── frontend/                    # Next.js frontend
│   ├── app/
│   │   ├── (customer)/         # Customer-facing pages
│   │   ├── admin/              # Admin panel
│   │   └── api/                # API routes
│   ├── components/
│   ├── lib/
│   └── styles/
├── backend/                     # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── types/
│   └── prisma/
│       └── schema.prisma
├── docker-compose.yml
└── .env.example
```

## Getting Started

### Quick Start with Docker (Recommended)

The fastest way to get started:

```bash
# Clone the repository
git clone https://github.com/malykatamaranek-eng/liquidInsider.git
cd liquidInsider

# Copy environment variables
cp .env.example .env

# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d --build

# Wait 2-3 minutes for initialization, then visit:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001/api
# - Admin Panel: http://localhost:3000/admin
```

**Login credentials:**
- Email: `admin@liquidinsider.com`
- Password: `admin123`

For detailed Docker setup, see [DOCKER_SETUP.md](./DOCKER_SETUP.md)

### Manual Setup

Prerequisites: Node.js 18+, PostgreSQL 15+

1. **Clone the repository**
   ```bash
   git clone https://github.com/malykatamaranek-eng/liquidInsider.git
   cd liquidInsider
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Setup database (make sure PostgreSQL is running)
   npx prisma migrate dev
   npx prisma generate
   
   # Seed database with sample data (optional)
   npm run seed
   
   # Start backend server
   npm run dev
   # Backend runs on http://localhost:3001
   ```

4. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   
   # Start frontend server
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

### Access the Application

- **Customer Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs

### Default Admin Credentials
- **Email**: admin@liquidinsider.com
- **Password**: admin123 (Change this immediately!)

## Database Schema

### Main Tables
- **Users**: User accounts with authentication
- **Products**: Product catalog with inventory
- **Categories**: Product categorization
- **Orders**: Customer orders
- **OrderItems**: Individual order line items
- **Cart**: Shopping cart items
- **Payments**: Payment transactions

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item

## Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Migrations

```bash
cd backend
npx prisma migrate dev --name migration_name
npx prisma generate
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

### Environment Variables
Ensure all environment variables are properly configured for production:
- Use strong JWT secrets
- Configure production database
- Setup Stripe production keys
- Configure SMTP for emails
- Set NODE_ENV to "production"

### Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Security Considerations

1. **Change default admin credentials**
2. **Use strong JWT secrets**
3. **Enable HTTPS in production**
4. **Configure rate limiting appropriately**
5. **Setup proper CORS policies**
6. **Regular security updates**
7. **Monitor error logs**
8. **Backup database regularly**

## Performance Optimization

- Database query optimization with Prisma
- Image optimization and lazy loading
- Caching strategies (Redis recommended)
- CDN for static assets
- Database connection pooling
- Code splitting in Next.js

## Monitoring & Error Tracking

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior
- Custom logging with Winston/Pino

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For support, email support@liquidinsider.com or open an issue on GitHub.

## Roadmap

- [ ] Multi-currency support
- [ ] Advanced analytics dashboard
- [ ] Product reviews and ratings
- [ ] Email marketing integration
- [ ] Mobile app (React Native)
- [ ] Advanced inventory management
- [ ] Multi-vendor support
- [ ] Subscription products
