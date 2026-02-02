import { Router } from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../middleware/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', authenticate, authorize(Role.ADMIN), validate(createCategorySchema), createCategory);
router.put('/:id', authenticate, authorize(Role.ADMIN), validate(updateCategorySchema), updateCategory);
router.delete('/:id', authenticate, authorize(Role.ADMIN), deleteCategory);

export default router;
