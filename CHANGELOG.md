# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-02-01

### Security
- **CRITICAL**: Updated `next` from 14.0.4 to 15.2.9 to fix multiple critical vulnerabilities:
  - DoS via HTTP request deserialization with React Server Components
  - Authorization bypass in middleware
  - Cache poisoning vulnerability
  - Server-Side Request Forgery (SSRF) in Server Actions
  - RCE vulnerability in React flight protocol
- **HIGH**: Updated `multer` from 1.4.5-lts.1 to 2.0.2 to fix multiple DoS vulnerabilities:
  - DoS via unhandled exception from malformed requests
  - DoS via memory leaks from unclosed streams
  - DoS from maliciously crafted requests
- **MEDIUM**: Updated `nodemailer` from 6.9.7 to 7.0.7 to fix email domain interpretation conflict
- Updated `@types/multer` to 2.0.0 for compatibility with multer 2.x
- Updated `eslint-config-next` to 15.2.9 for compatibility with Next.js 15.x
- **Result**: ✅ Zero known vulnerabilities remaining

## [1.0.0] - 2024-02-01

### Added

#### Backend
- Express.js backend with TypeScript
- PostgreSQL database with Prisma ORM
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- User management (registration, login, profile)
- Product management with CRUD operations
- Category management
- Shopping cart functionality
- Order management with status tracking
- Payment integration (Stripe)
- Email service (nodemailer)
- Rate limiting middleware
- CORS configuration
- Helmet.js security headers
- Input validation with Joi
- Error handling middleware
- Request logging with Winston
- Database seeding script

#### Frontend
- Next.js 14 with App Router
- TypeScript configuration
- Tailwind CSS styling
- Responsive design (mobile-first)
- Authentication context
- Shopping cart context
- API client with axios
- Customer pages:
  - Homepage with hero and featured products
  - Product catalog with filters and search
  - Product detail pages
  - Shopping cart
  - Multi-step checkout
  - User account dashboard
  - Login and registration
  - Order history
- Admin panel:
  - Dashboard with metrics
  - Product management
  - Order management
  - User management
  - Analytics
  - Settings
- Reusable components (Navbar, Footer, ProductCard, Button, Input, Loading)
- Toast notifications (react-hot-toast)
- Lucide React icons

#### Infrastructure
- Docker Compose setup
- Environment variable templates
- ESLint configuration
- Production Dockerfiles
- Nginx configuration examples

#### Documentation
- Comprehensive README
- API documentation
- Deployment guide
- Contributing guidelines
- License (MIT)
- Changelog

### Security
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- CORS configuration
- Security headers with Helmet.js
- Input validation and sanitization
- SQL injection prevention with Prisma
- XSS protection

### Database Schema
- Users table with roles
- Products table with categories
- Orders table with status tracking
- OrderItems table
- Categories table
- Cart and CartItem tables
- Payments table with Stripe integration
- Wishlist table
- Addresses table

### Features
- Product browsing and filtering
- Search functionality
- Shopping cart with persistence
- User authentication and authorization
- Order placement and tracking
- Admin dashboard
- Product inventory management
- Role-based access control
- Email notifications
- Payment processing with Stripe
- Responsive design
- Loading states and error handling

[1.0.0]: https://github.com/malykatamaranek-eng/liquidInsider/releases/tag/v1.0.0
