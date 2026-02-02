import * as nodemailer from 'nodemailer';
import logger from './logger';

// Check if email is configured
const isEmailConfigured = (): boolean => {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  );
};

// Create transporter only if configured
const createTransporter = () => {
  if (!isEmailConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {
  try {
    if (!isEmailConfigured()) {
      logger.warn('Email not configured, skipping verification email');
      return;
    }

    const transporter = createTransporter();
    if (!transporter) {
      return;
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@liquidinsider.com',
      to: email,
      subject: 'Verify your LiquidInsider email',
      html: `
        <h2>Verify your email</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>Or copy this link: ${verificationUrl}</p>
      `,
    });

    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending verification email:', error);
    // Don't throw - allow app to continue even if email fails
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  try {
    if (!isEmailConfigured()) {
      logger.warn('Email not configured, skipping password reset email');
      return;
    }

    const transporter = createTransporter();
    if (!transporter) {
      return;
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@liquidinsider.com',
      to: email,
      subject: 'Reset your LiquidInsider password',
      html: `
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>Or copy this link: ${resetUrl}</p>
        <p>This link expires in 24 hours.</p>
      `,
    });

    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    // Don't throw - allow app to continue even if email fails
  }
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderId: string,
  total: number
): Promise<void> => {
  try {
    if (!isEmailConfigured()) {
      logger.warn('Email not configured, skipping order confirmation email');
      return;
    }

    const transporter = createTransporter();
    if (!transporter) {
      return;
    }

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@liquidinsider.com',
      to: email,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order!</p>
        <p>Order ID: ${orderId}</p>
        <p>Total: $${total.toFixed(2)}</p>
        <p>You can track your order in your account dashboard.</p>
      `,
    });

    logger.info(`Order confirmation email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending order confirmation email:', error);
    // Don't throw - allow app to continue even if email fails
  }
};
