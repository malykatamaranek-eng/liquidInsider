import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../middleware/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.post('/', authenticate, validate(createOrderSchema), createOrder);
router.get('/', authenticate, getOrders);
router.get('/user/:userId', authenticate, authorize([Role.ADMIN]), getOrdersByUserId);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, authorize([Role.ADMIN]), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
