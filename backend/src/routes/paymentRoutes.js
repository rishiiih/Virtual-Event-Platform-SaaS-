import express from 'express';
import {
  createOrder,
  verifyPayment,
  handleWebhook,
  getPaymentHistory,
  cancelPayment
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Webhook route (must be BEFORE express.json() middleware)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/history', authenticate, getPaymentHistory);
router.delete('/cancel/:registrationId', authenticate, cancelPayment);

export default router;
