# Frontend Core Files

This document describes the core frontend files created for the LiquidInsider e-commerce platform.

## Directory Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── globals.css          # Global styles with Tailwind
│   └── page.tsx            # Home page
├── components/
│   ├── Navbar.tsx          # Navigation component
│   ├── Footer.tsx          # Footer component
│   ├── ProductCard.tsx     # Product card component
│   ├── Button.tsx          # Reusable button component
│   ├── Input.tsx           # Reusable input component
│   └── Loading.tsx         # Loading spinner component
├── lib/
│   ├── api.ts              # API client with axios
│   ├── types.ts            # TypeScript type definitions
│   ├── utils.ts            # Utility functions
│   └── context/
│       ├── AuthContext.tsx # Authentication context
│       └── CartContext.tsx # Shopping cart context
└── public/
    └── placeholder-product.png  # Placeholder image for products
```

## File Descriptions

### Layout & Styles

#### `app/layout.tsx`
Root layout component that wraps the entire application with:
- HTML structure with lang="en"
- SEO metadata
- Global styles import
- AuthProvider and CartProvider for state management
- Toaster component for notifications

#### `app/globals.css`
Global styles with:
- Tailwind CSS directives
- Smooth scrolling behavior
- Base styling for html and body elements
- Custom utility classes

#### `app/page.tsx`
Home page with:
- Hero section with call-to-action buttons
- Features section highlighting key benefits
- CTA section for user registration
- Navbar and Footer integration

### API & Types

#### `lib/api.ts`
Axios-based API client with:
- Base URL configuration from environment variables
- Request interceptor for authentication tokens
- Response interceptor for token refresh on 401 errors
- API functions for:
  - Authentication (login, register, logout, getCurrentUser)
  - Products (getAll, getById, search)
  - Categories (getAll, getById, getProducts)
  - Cart (get, addItem, updateItem, removeItem, clear)
  - Orders (getAll, getById, create, cancel)
  - Payments (createPaymentIntent, confirmPayment)

#### `lib/types.ts`
TypeScript type definitions matching backend models:
- User, LoginResponse, RegisterRequest
- Category, Product, ProductFilters
- Cart, CartItem
- Order, OrderItem, OrderStatus
- Payment, PaymentStatus

#### `lib/utils.ts`
Utility functions:
- `cn()` - Tailwind class name merger
- `formatPrice()` - Price formatting
- `formatDate()` - Date formatting
- `truncate()` - String truncation

### Context & State Management

#### `lib/context/AuthContext.tsx`
Authentication context providing:
- User state and loading state
- `login()` - Authenticate user and store tokens
- `register()` - Create new account
- `logout()` - Clear session and redirect
- `isAuthenticated` - Boolean for auth status
- `useAuth()` - Hook to access auth context
- Token storage in localStorage
- JWT decoding for user info
- Automatic token refresh on API calls

#### `lib/context/CartContext.tsx`
Shopping cart context providing:
- Cart state with items
- `addToCart()` - Add product to cart
- `removeFromCart()` - Remove item from cart
- `updateQuantity()` - Update item quantity
- `clearCart()` - Clear all items
- `getCartTotal()` - Calculate total price
- `getItemCount()` - Count total items
- `refreshCart()` - Sync with backend
- `useCart()` - Hook to access cart context
- Automatic synchronization with backend API

### Reusable Components

#### `components/Navbar.tsx`
Navigation component with:
- Logo and branding
- Desktop navigation links (Home, Products, Categories)
- Search bar with submit handler
- Cart icon with item count badge
- User menu:
  - Authenticated: Profile and Logout buttons
  - Unauthenticated: Login and Sign Up buttons
- Mobile responsive hamburger menu
- Mobile search bar
- Uses lucide-react icons

#### `components/Footer.tsx`
Footer component with:
- Company information and contact details
- Link sections:
  - Company (About, Careers, Blog, Contact)
  - Support (Help Center, Shipping, Returns, FAQ)
  - Legal (Terms, Privacy, Cookie Policy, Disclaimer)
- Social media icons (Facebook, Twitter, Instagram, LinkedIn)
- Copyright notice with dynamic year
- Responsive grid layout

#### `components/ProductCard.tsx`
Product card component with:
- Product image with Next.js Image optimization
- Category badge
- Product name and description (truncated)
- Price display
- Stock indicator
- Add to cart button
- Out of stock overlay when applicable
- Hover effects and animations
- Link to product detail page
- Props: `product: Product`

#### `components/Button.tsx`
Reusable button component with:
- Variants: primary, secondary, outline, danger, ghost
- Sizes: sm, md, lg
- Loading state with spinner
- Disabled state styling
- TypeScript interface extending HTMLButtonElement
- Tailwind CSS styling
- Forward ref support

#### `components/Input.tsx`
Reusable input component with:
- Label support
- Error message display
- Helper text
- Left and right icon slots
- Required field indicator
- Disabled state styling
- TypeScript interface extending HTMLInputElement
- Tailwind CSS styling
- Forward ref support

#### `components/Loading.tsx`
Loading spinner component with:
- Sizes: sm, md, lg, xl
- Optional loading text
- Full-screen overlay option
- Animated spinner using lucide-react
- Customizable className

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
```

## Dependencies

### Production
- `next` - React framework
- `react` - React library
- `react-dom` - React DOM
- `axios` - HTTP client
- `react-hot-toast` - Toast notifications
- `lucide-react` - Icon library
- `clsx` - Conditional class names
- `tailwind-merge` - Tailwind class merger
- `jwt-decode` - JWT token decoder
- `@stripe/stripe-js` - Stripe payment integration

### Development
- `typescript` - TypeScript
- `@types/node`, `@types/react`, `@types/react-dom` - Type definitions
- `tailwindcss` - Utility-first CSS framework
- `postcss` - CSS processing
- `autoprefixer` - CSS vendor prefixing
- `eslint` - Code linting
- `eslint-config-next` - Next.js ESLint configuration

## Features

### Authentication
- Token-based authentication with JWT
- Automatic token refresh
- Secure token storage in localStorage
- Protected routes (can be implemented in page components)

### Shopping Cart
- Real-time cart updates
- Backend synchronization
- Item quantity management
- Cart total calculation
- Item count display

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Hamburger menu for mobile
- Responsive grid layouts

### Error Handling
- Toast notifications for user feedback
- API error interceptors
- Form validation support
- Loading states

### Type Safety
- Full TypeScript support
- Type definitions for all API responses
- Proper component prop types
- Utility type functions

## Usage Examples

### Using Auth Context

```tsx
import { useAuth } from '@/lib/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Welcome, {user.first_name}!</div>;
}
```

### Using Cart Context

```tsx
import { useCart } from '@/lib/context/CartContext';

function MyComponent() {
  const { cart, addToCart, getItemCount } = useCart();

  return (
    <div>
      <p>Items in cart: {getItemCount()}</p>
      <button onClick={() => addToCart(productId, 1)}>
        Add to Cart
      </button>
    </div>
  );
}
```

### Using API Functions

```tsx
import { productsAPI } from '@/lib/api';

async function fetchProducts() {
  try {
    const products = await productsAPI.getAll({
      category: 1,
      min_price: 10,
      max_price: 100,
    });
    console.log(products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}
```

## Next Steps

To complete the frontend application, you should create:

1. **Pages**:
   - `/login` - Login page
   - `/register` - Registration page
   - `/products` - Products listing page
   - `/products/[id]` - Product detail page
   - `/categories` - Categories page
   - `/categories/[id]` - Category products page
   - `/cart` - Shopping cart page
   - `/checkout` - Checkout page
   - `/orders` - Order history page
   - `/profile` - User profile page

2. **Additional Components**:
   - Breadcrumbs
   - Pagination
   - Filters/Sort dropdowns
   - Product gallery
   - Review components
   - Order tracking

3. **Features**:
   - Product search
   - Filtering and sorting
   - Payment integration
   - Order management
   - User profile management

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Notes

- All components use Tailwind CSS for styling
- Icons are from lucide-react library
- Toast notifications use react-hot-toast
- Image optimization uses Next.js Image component
- Path aliases configured as `@/*` for imports
- All components are client components (use 'use client' directive)
- TypeScript strict mode enabled for better type safety
