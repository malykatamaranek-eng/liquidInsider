import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

export const getStats = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [totalSales, totalOrders, totalProducts, totalUsers] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.order.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.user.count({ where: { role: 'USER' } }),
    ]);

    res.json({
      totalSales: totalSales._sum.total || 0,
      totalOrders,
      totalProducts,
      totalUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map to snake_case for frontend
    const mappedOrders = orders.map(order => ({
      id: order.id,
      user_id: order.userId,
      user: {
        first_name: order.user.firstName,
        last_name: order.user.lastName,
        email: order.user.email,
      },
      total: order.total,
      status: order.status,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      items: order.items,
    }));

    res.json(mappedOrders);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    // Map to snake_case for frontend
    const mappedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
      is_active: user.isVerified,
      date_joined: user.createdAt,
    }));

    res.json(mappedUsers);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      throw new AppError('Invalid role', 400);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });

    res.json({
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
      is_active: user.isVerified,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: true,
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    const products = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          ...product,
          sales_count: item._sum.quantity,
          revenue: (item._sum.quantity || 0) * (product ? Number(product.price) : 0),
        };
      })
    );

    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getSalesData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const sales = await prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
      },
    });

    res.json({
      totalSales: sales._sum.total || 0,
      totalOrders: sales._count,
      newCustomers: 0, // TODO: implement customer tracking to differentiate new vs returning
      returningCustomers: 0, // TODO: implement customer tracking based on order history
      averageOrderValue: sales._count > 0 ? Number(sales._sum.total || 0) / sales._count : 0,
    });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // For now, return default settings
    res.json({
      store_name: process.env.STORE_NAME || 'LiquidInsider',
      store_email: process.env.STORE_EMAIL || 'admin@liquidinsider.com',
      store_phone: process.env.STORE_PHONE || '',
      shipping_rate: 5.99,
      free_shipping_threshold: 50,
      tax_rate: 8.5,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = req.body;
    // TODO: Implement settings storage in database
    res.json(settings);
  } catch (error) {
    next(error);
  }
};
