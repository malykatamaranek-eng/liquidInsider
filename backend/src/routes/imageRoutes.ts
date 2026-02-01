import { Router } from 'express';
import {
  uploadProductImages,
  getProductImages,
  deleteProductImage,
  reorderProductImages,
  setPrimaryImage,
} from '../controllers/imageController';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { Role } from '@prisma/client';

const router = Router();

// Upload images (multiple files)
router.post(
  '/:id/images',
  authenticate,
  authorize(Role.ADMIN),
  upload.array('images', 10),
  uploadProductImages
);

// Get product images
router.get('/:id/images', getProductImages);

// Delete image
router.delete(
  '/:id/images/:imageId',
  authenticate,
  authorize(Role.ADMIN),
  deleteProductImage
);

// Reorder images
router.put(
  '/:id/images/reorder',
  authenticate,
  authorize(Role.ADMIN),
  reorderProductImages
);

// Set primary image
router.put(
  '/:id/images/:imageId/primary',
  authenticate,
  authorize(Role.ADMIN),
  setPrimaryImage
);

export default router;
