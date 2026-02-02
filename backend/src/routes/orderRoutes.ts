import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getUserOrders,
  getOrder,
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
router.get('/user/:userId', authenticate, authorize(Role.ADMIN), getUserOrders);
router.get('/:id', authenticate, getOrder);
router.put('/:id/status', authenticate, authorize(Role.ADMIN), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
