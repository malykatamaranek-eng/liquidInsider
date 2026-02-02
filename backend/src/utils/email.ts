import * as nodemailer from 'nodemailer';
import logger from './logger';

// Create transporter with fallback when SMTP not configured
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  // If SMTP not configured, return null (graceful degradation)
  if (!smtpHost || !smtpUser || !smtpPassword) {
    logger.warn('SMTP not configured - email notifications disabled');
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const transporter = createTransporter();
  
  if (!transporter) {
    logger.info(`[MOCK] Verification email would be sent to ${email} with token ${token}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@liquidinsider.com',
      to: email,
      subject: 'Verify your email - LiquidInsider',
      html: `
        <h1>Verify your email</h1>
        <p>Please click the link below to verify your email:</p>
        <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">
          Verify Email
        </a>
      `,
    });
    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending verification email:', error);
    // Don't throw - let registration continue
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const transporter = createTransporter();

  if (!transporter) {
    logger.info(`[MOCK] Password reset email would be sent to ${email} with token ${token}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@liquidinsider.com',
      to: email,
      subject: 'Reset your password - LiquidInsider',
      html: `
        <h1>Reset your password</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">
          Reset Password
        </a>
      `,
    });
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    // Don't throw - let password reset continue
  }
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderId: string
): Promise<void> => {
  const transporter = createTransporter();

  if (!transporter) {
    logger.info(`[MOCK] Order confirmation email would be sent to ${email} for order ${orderId}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@liquidinsider.com',
      to: email,
      subject: `Order Confirmation - Order #${orderId}`,
      html: `
        <h1>Order Confirmed</h1>
        <p>Thank you for your order!</p>
        <p>Your order number is: ${orderId}</p>
        <p>You can track your order at:</p>
        <a href="${process.env.FRONTEND_URL}/orders/${orderId}">
          View Order
        </a>
      `,
    });
    logger.info(`Order confirmation email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending order confirmation email:', error);
    // Don't throw - order is already created
  }
};
