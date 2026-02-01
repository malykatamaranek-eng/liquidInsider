import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { orderId } = req.body;

    if (!orderId) {
      throw new AppError('Order ID is required', 400);
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== req.user.id) {
      throw new AppError('Unauthorized', 403);
    }

    if (order.payment && order.payment.status === 'COMPLETED') {
      throw new AppError('Order already paid', 400);
    }

    const amount = Math.round(Number(order.total) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: req.user.id,
      },
    });

    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amount: order.total,
        status: 'PENDING',
        stripeId: paymentIntent.id,
      },
      update: {
        stripeId: paymentIntent.id,
        status: 'PENDING',
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      throw new AppError('No signature provided', 400);
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new AppError('Webhook secret not configured', 500);
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
    } catch (err: any) {
      throw new AppError(`Webhook signature verification failed: ${err.message}`, 400);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await prisma.$transaction([
            prisma.payment.update({
              where: { orderId },
              data: {
                status: 'COMPLETED',
                paymentMethod: paymentIntent.payment_method as string,
              },
            }),
            prisma.order.update({
              where: { id: orderId },
              data: { status: 'PROCESSING' },
            }),
          ]);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await prisma.payment.update({
            where: { orderId },
            data: { status: 'FAILED' },
          });
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        const payment = await prisma.payment.findUnique({
          where: { stripeId: paymentIntentId },
        });

        if (payment) {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'REFUNDED' },
            }),
            prisma.order.update({
              where: { id: payment.orderId },
              data: { status: 'REFUNDED' },
            }),
          ]);
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

export const getPaymentHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const whereClause: any = {};

    if (req.user.role !== 'ADMIN') {
      whereClause.order = {
        userId: req.user.id,
      };
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(payments);
  } catch (error) {
    next(error);
  }
};
