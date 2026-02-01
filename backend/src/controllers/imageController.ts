import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { uploadImage, deleteImage } from '../utils/imageService';

/**
 * Upload product images
 */
export const uploadProductImages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Unauthorized', 403);
    }

    const { id: productId } = req.params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if files were uploaded
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    // Get current max display order
    const lastImage = await prisma.productImage.findFirst({
      where: { productId },
      orderBy: { displayOrder: 'desc' },
    });

    const startOrder = lastImage ? lastImage.displayOrder + 1 : 0;

    // Upload and process each image
    const uploadedImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      const imageData = await uploadImage(file, productId);

      // Check if this should be the primary image
      const existingImages = await prisma.productImage.count({
        where: { productId },
      });

      const isPrimary = existingImages === 0;

      const productImage = await prisma.productImage.create({
        data: {
          productId,
          originalUrl: imageData.originalUrl,
          thumbnailUrl: imageData.thumbnailUrl,
          mediumUrl: imageData.mediumUrl,
          largeUrl: imageData.largeUrl,
          webpUrl: imageData.webpUrl,
          fileName: imageData.fileName,
          fileSize: imageData.fileSize,
          mimeType: imageData.mimeType,
          width: imageData.width,
          height: imageData.height,
          s3Key: imageData.s3Key,
          storageType: process.env.IMAGE_STORAGE_TYPE || 'local',
          displayOrder: startOrder + i,
          isPrimary,
        },
      });

      uploadedImages.push(productImage);
    }

    res.status(201).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      data: uploadedImages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product images
 */
export const getProductImages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: productId } = req.params;

    const images = await prisma.productImage.findMany({
      where: { productId },
      orderBy: { displayOrder: 'asc' },
    });

    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product image
 */
export const deleteProductImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Unauthorized', 403);
    }

    const { id: productId, imageId } = req.params;

    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
    });

    if (!image) {
      throw new AppError('Image not found', 404);
    }

    // Delete from storage
    await deleteImage(productId, image.fileName, image.storageType);

    // Delete from database
    await prisma.productImage.delete({
      where: { id: imageId },
    });

    // If this was the primary image, make the first remaining image primary
    if (image.isPrimary) {
      const firstImage = await prisma.productImage.findFirst({
        where: { productId },
        orderBy: { displayOrder: 'asc' },
      });

      if (firstImage) {
        await prisma.productImage.update({
          where: { id: firstImage.id },
          data: { isPrimary: true },
        });
      }
    }

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder product images
 */
export const reorderProductImages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Unauthorized', 403);
    }

    const { id: productId } = req.params;
    const { imageOrders } = req.body;

    if (!Array.isArray(imageOrders)) {
      throw new AppError('imageOrders must be an array', 400);
    }

    // Update display order for each image
    const updatePromises = imageOrders.map(({ imageId, displayOrder }) =>
      prisma.productImage.updateMany({
        where: {
          id: imageId,
          productId,
        },
        data: { displayOrder },
      })
    );

    await Promise.all(updatePromises);

    const updatedImages = await prisma.productImage.findMany({
      where: { productId },
      orderBy: { displayOrder: 'asc' },
    });

    res.json({
      success: true,
      message: 'Images reordered successfully',
      data: updatedImages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Set primary image
 */
export const setPrimaryImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Unauthorized', 403);
    }

    const { id: productId, imageId } = req.params;

    // Check if image exists
    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
    });

    if (!image) {
      throw new AppError('Image not found', 404);
    }

    // Remove primary status from all images of this product
    await prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });

    // Set this image as primary
    await prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });

    res.json({
      success: true,
      message: 'Primary image updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
