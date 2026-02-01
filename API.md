# LiquidInsider API Documentation

Base URL: `http://localhost:3001/api` (development)

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

Admin-only endpoints additionally require the user to have the `ADMIN` role.

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

---

### Login
**POST** `/auth/login`

Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

---

### Refresh Token
**POST** `/auth/refresh`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_jwt_token"
}
```

---

### Get Profile
**GET** `/auth/profile`

🔒 **Requires Authentication**

Get current user's profile.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "isVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Update Profile
**PUT** `/auth/profile`

🔒 **Requires Authentication**

Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "newemail@example.com"
}
```

---

### Forgot Password
**POST** `/auth/forgot-password`

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "If email exists, reset link has been sent"
}
```

---

### Reset Password
**POST** `/auth/reset-password`

Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "newSecurePassword123"
}
```

---

## Product Endpoints

### Get Products
**GET** `/products`

Get all products with optional filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `categoryId` (string): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `search` (string): Search query
- `featured` (boolean): Featured products only
- `sortBy` (string): Field to sort by (price, name, createdAt)
- `sortOrder` (string): asc or desc

**Response:** `200 OK`
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Orange Juice",
      "slug": "orange-juice",
      "description": "Fresh orange juice",
      "price": 4.99,
      "images": ["url1", "url2"],
      "inventory": 100,
      "categoryId": "uuid",
      "featured": true,
      "active": true,
      "category": {
        "id": "uuid",
        "name": "Juice",
        "slug": "juice"
      }
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

---

### Get Featured Products
**GET** `/products/featured`

Get featured products.

**Response:** `200 OK` (Same structure as Get Products)

---

### Get Product
**GET** `/products/:id`

Get single product by ID or slug.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Orange Juice",
  "slug": "orange-juice",
  "description": "Fresh orange juice",
  "price": 4.99,
  "images": ["url1"],
  "inventory": 100,
  "categoryId": "uuid",
  "featured": true,
  "active": true,
  "category": {
    "id": "uuid",
    "name": "Juice",
    "slug": "juice"
  }
}
```

---

### Create Product
**POST** `/products`

🔒 **Requires Admin**

Create a new product.

**Request Body:**
```json
{
  "name": "Apple Juice",
  "description": "Fresh apple juice",
  "price": 5.99,
  "categoryId": "uuid",
  "inventory": 50,
  "images": ["url"],
  "featured": false
}
```

---

### Update Product
**PUT** `/products/:id`

🔒 **Requires Admin**

Update a product.

---

### Delete Product
**DELETE** `/products/:id`

🔒 **Requires Admin**

Delete a product.

---

## Category Endpoints

### Get Categories
**GET** `/categories`

Get all categories.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Juice",
    "slug": "juice",
    "description": "Fresh juices",
    "image": "url",
    "_count": {
      "products": 5
    }
  }
]
```

---

### Get Category
**GET** `/categories/:id`

Get single category by ID or slug.

---

### Create Category
**POST** `/categories`

🔒 **Requires Admin**

Create a new category.

**Request Body:**
```json
{
  "name": "Energy Drinks",
  "description": "Boost your energy",
  "image": "url"
}
```

---

### Update Category
**PUT** `/categories/:id`

🔒 **Requires Admin**

Update a category.

---

### Delete Category
**DELETE** `/categories/:id`

🔒 **Requires Admin**

Delete a category (must have no products).

---

## Cart Endpoints

### Get Cart
**GET** `/cart`

🔒 **Requires Authentication**

Get user's cart with items.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "userId": "uuid",
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "quantity": 2,
      "product": {
        "id": "uuid",
        "name": "Orange Juice",
        "price": 4.99,
        "images": ["url"]
      }
    }
  ],
  "total": 9.98
}
```

---

### Add to Cart
**POST** `/cart/items`

🔒 **Requires Authentication**

Add item to cart.

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 1
}
```

---

### Update Cart Item
**PUT** `/cart/items/:id`

🔒 **Requires Authentication**

Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 3
}
```

---

### Remove from Cart
**DELETE** `/cart/items/:id`

🔒 **Requires Authentication**

Remove item from cart.

---

### Clear Cart
**DELETE** `/cart`

🔒 **Requires Authentication**

Clear all items from cart.

---

## Order Endpoints

### Create Order
**POST** `/orders`

🔒 **Requires Authentication**

Create a new order from cart items or specified items.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "address2": "Apt 4",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "555-1234"
  },
  "notes": "Leave at door"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "orderNumber": "ORD-ABC123",
  "userId": "uuid",
  "status": "PENDING",
  "subtotal": 9.98,
  "tax": 0.80,
  "shippingCost": 5.99,
  "total": 16.77,
  "items": [...],
  "shippingAddress": {...}
}
```

---

### Get Orders
**GET** `/orders`

🔒 **Requires Authentication** (User gets their orders, Admin gets all)

Get orders with optional filters.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `userId` (string): Filter by user (admin only)

---

### Get Order
**GET** `/orders/:id`

🔒 **Requires Authentication**

Get single order details.

---

### Update Order Status
**PUT** `/orders/:id/status`

🔒 **Requires Admin**

Update order status.

**Request Body:**
```json
{
  "status": "SHIPPED"
}
```

**Possible statuses:** PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED

---

## Payment Endpoints

### Create Payment Intent
**POST** `/payments/create-intent`

🔒 **Requires Authentication**

Create Stripe payment intent for checkout.

**Request Body:**
```json
{
  "orderId": "uuid"
}
```

**Response:** `200 OK`
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

---

### Stripe Webhook
**POST** `/payments/webhook`

Handle Stripe webhook events (payment confirmations).

*This endpoint is called by Stripe and requires webhook signature verification.*

---

### Get Payment History
**GET** `/payments/history`

🔒 **Requires Authentication**

Get user's payment history.

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**401 Unauthorized**
```json
{
  "error": "No token provided"
}
```

**403 Forbidden**
```json
{
  "error": "Forbidden: Insufficient permissions"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**429 Too Many Requests**
```json
{
  "error": "Too many requests, please try again later"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limits

- **General API:** 100 requests per 15 minutes
- **Auth endpoints:** 5 login attempts per 15 minutes
- **API routes:** 60 requests per minute

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl http://localhost:3001/api/products
```

### Get Cart (Authenticated)
```bash
curl http://localhost:3001/api/cart \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Postman Collection

A Postman collection is available in the repository at `/postman/liquidinsider.json` with all endpoints pre-configured.

---

## Support

For API issues or questions:
- Open an issue on GitHub
- Email: support@liquidinsider.com
