import { Response, NextFunction } from 'express';
import { AuthRequest, ProductFilters } from '../types';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { slugify } from '../utils/helpers';

export const getProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      categoryId,
      minPrice,
      maxPrice,
      search,
      featured,
    } = req.query as unknown as ProductFilters;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { active: true };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured !== undefined) {
      const featuredValue = typeof featured === 'string' ? featured === 'true' : featured;
      where.featured = featuredValue;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { idOrSlug } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Unauthorized', 403);
    }

    const {
      name,
      description,
      price,
      images,
      inventory,
      categoryId,
      featured,
      active,
    } = req.body;

    const slug = slugify(name);

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      throw new AppError('Product with this name already exists', 400);
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        images: images || [],
        inventory: inventory || 0,
        categoryId,
        featured: featured || false,
        active: active !== undefined ? active : true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Unauthorized', 403);
    }

    const { id } = req.params;
    const {
      name,
      description,
      price,
      images,
      inventory,
      categoryId,
      featured,
      active,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }

    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = slugify(name);

      if (updateData.slug !== existingProduct.slug) {
        const slugExists = await prisma.product.findFirst({
          where: { slug: updateData.slug, id: { not: id } },
        });

        if (slugExists) {
          throw new AppError('Product with this name already exists', 400);
        }
      }
    }

    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (images !== undefined) updateData.images = images;
    if (inventory !== undefined) updateData.inventory = inventory;
    if (featured !== undefined) updateData.featured = featured;
    if (active !== undefined) updateData.active = active;

    if (categoryId !== undefined) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      updateData.categoryId = categoryId;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Unauthorized', 403);
    }

    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit = 6 } = req.query;

    const products = await prisma.product.findMany({
      where: {
        featured: true,
        active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};
