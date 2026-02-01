export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  role?: 'USER' | 'ADMIN';
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  slug: string;
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  image?: string;
  images?: string[];
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  ordering?: string;
  in_stock?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  user: string;
  items: CartItem[];
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price: number;
  subtotal?: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shipping_address?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  order: string;
  amount: number;
  status: PaymentStatus;
  payment_method: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}
