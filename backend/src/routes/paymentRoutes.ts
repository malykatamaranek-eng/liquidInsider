import { Router } from 'express';
import {
  createPaymentIntent,
  handleWebhook,
  getPaymentHistory,
} from '../controllers/paymentController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/create-intent', authenticate, createPaymentIntent);
router.post('/intent', authenticate, createPaymentIntent); // Alias for frontend compatibility
router.post('/webhook', handleWebhook);
router.get('/history', authenticate, getPaymentHistory);

export default router;
