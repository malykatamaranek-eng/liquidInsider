import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import {
  addToCartSchema,
  updateCartItemSchema,
} from '../middleware/schemas';

const router = Router();

router.get('/', authenticate, getCart);
router.post('/items', authenticate, validate(addToCartSchema), addToCart);
router.put('/items/:id', authenticate, validate(updateCartItemSchema), updateCartItem);
router.delete('/items/:id', authenticate, removeFromCart);
router.delete('/', authenticate, clearCart);

export default router;
