import { Router } from 'express';
import {
  getStats,
  getAllProducts,
  getAllOrders,
  getAllUsers,
  updateUserRole,
  getTopProducts,
  getSalesData,
  getSettings,
  updateSettings,
} from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize(Role.ADMIN));

// Stats
router.get('/stats', getStats);

// Products
router.get('/products', getAllProducts);
router.get('/products/top', getTopProducts);

// Orders
router.get('/orders', getAllOrders);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

// Analytics
router.get('/analytics', getSalesData);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
