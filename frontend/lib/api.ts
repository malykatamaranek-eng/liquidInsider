import axios from 'axios';
import type {
  User,
  LoginResponse,
  RegisterRequest,
  Product,
  Category,
  Cart,
  Order,
  OrderStatus,
  Payment,
  ProductFilters,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('accessToken', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    const { data } = await api.get('/products', { params: filters });
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  search: async (query: string): Promise<Product[]> => {
    const { data } = await api.get('/products/search', { params: { q: query } });
    return data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },

  getById: async (id: number): Promise<Category> => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },

  getProducts: async (id: number): Promise<Product[]> => {
    const { data } = await api.get(`/categories/${id}/products`);
    return data;
  },
};

// Cart API
export const cartAPI = {
  get: async (): Promise<Cart> => {
    const { data } = await api.get('/cart');
    return data;
  },

  addItem: async (productId: number, quantity: number): Promise<Cart> => {
    const { data } = await api.post('/cart/items', {
      product_id: productId,
      quantity,
    });
    return data;
  },

  updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
    return data;
  },

  removeItem: async (itemId: number): Promise<void> => {
    await api.delete(`/cart/items/${itemId}`);
  },

  clear: async (): Promise<void> => {
    await api.delete('/cart');
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders');
    return data;
  },

  getById: async (id: number): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  create: async (orderData: {
    shipping_address: string;
    payment_method: string;
  }): Promise<Order> => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  cancel: async (id: number): Promise<Order> => {
    const { data } = await api.post(`/orders/${id}/cancel`);
    return data;
  },
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: async (orderId: number): Promise<Payment> => {
    const { data } = await api.post('/payments/intent', { order_id: orderId });
    return data;
  },

  confirmPayment: async (paymentId: number): Promise<Payment> => {
    const { data } = await api.post(`/payments/${paymentId}/confirm`);
    return data;
  },
};

// Admin API
export const adminAPI = {
  // Dashboard
  getStats: async (): Promise<any> => {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  // Products
  getAllProducts: async (): Promise<Product[]> => {
    const { data } = await api.get('/admin/products');
    return data;
  },

  createProduct: async (productData: any): Promise<Product> => {
    const { data } = await api.post('/admin/products', productData);
    return data;
  },

  updateProduct: async (id: number, productData: any): Promise<Product> => {
    const { data } = await api.put(`/admin/products/${id}`, productData);
    return data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },

  // Orders
  getAllOrders: async (): Promise<Order[]> => {
    const { data } = await api.get('/admin/orders');
    return data;
  },

  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const { data } = await api.put(`/admin/orders/${id}/status`, { status });
    return data;
  },

  // Users
  getAllUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/admin/users');
    return data;
  },

  updateUserRole: async (id: number, role: string): Promise<User> => {
    const { data } = await api.put(`/admin/users/${id}/role`, { role });
    return data;
  },

  // Analytics
  getSalesData: async (startDate?: string, endDate?: string): Promise<any> => {
    const { data } = await api.get('/admin/analytics/sales', {
      params: { start_date: startDate, end_date: endDate },
    });
    return data;
  },

  getTopProducts: async (): Promise<any> => {
    const { data } = await api.get('/admin/analytics/top-products');
    return data;
  },

  // Settings
  getSettings: async (): Promise<any> => {
    const { data } = await api.get('/admin/settings');
    return data;
  },

  updateSettings: async (settings: any): Promise<any> => {
    const { data } = await api.put('/admin/settings', settings);
    return data;
  },
};

// Image API
export const imageAPI = {
  uploadImages: async (productId: string, files: File[]): Promise<any> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const { data } = await api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  getProductImages: async (productId: string): Promise<any> => {
    const { data } = await api.get(`/products/${productId}/images`);
    return data;
  },

  deleteImage: async (productId: string, imageId: string): Promise<any> => {
    const { data } = await api.delete(`/products/${productId}/images/${imageId}`);
    return data;
  },

  reorderImages: async (productId: string, imageOrders: Array<{ imageId: string; displayOrder: number }>): Promise<any> => {
    const { data } = await api.put(`/products/${productId}/images/reorder`, { imageOrders });
    return data;
  },

  setPrimaryImage: async (productId: string, imageId: string): Promise<any> => {
    const { data } = await api.put(`/products/${productId}/images/${imageId}/primary`);
    return data;
  },
};

export default api;
