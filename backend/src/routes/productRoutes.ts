import { Router } from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import {
  createProductSchema,
  updateProductSchema,
} from '../middleware/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize([Role.ADMIN]), validate(createProductSchema), createProduct);
router.put('/:id', authenticate, authorize([Role.ADMIN]), validate(updateProductSchema), updateProduct);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), deleteProduct);

export default router;
