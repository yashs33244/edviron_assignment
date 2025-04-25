import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { defaultLimiter } from '../middleware/rate-limiter.middleware';

const router = Router();

/**
 * @route POST /api/payments/create
 * @desc Create a new payment request
 * @access Private
 */
router.post('/create', authenticate, defaultLimiter, paymentController.createPayment);

/**
 * @route POST /api/payments/webhook
 * @desc Handle payment webhook
 * @access Public
 */
router.post('/webhook', paymentController.handleWebhook);

/**
 * @route GET /api/payments/transactions
 * @desc Get all transactions with pagination
 * @access Private
 */
router.get('/transactions', authenticate, defaultLimiter, paymentController.getAllTransactions);

/**
 * @route GET /api/payments/transactions/school/:schoolId
 * @desc Get transactions by school ID
 * @access Private
 */
router.get(
  '/transactions/school/:schoolId',
  authenticate,
  defaultLimiter,
  paymentController.getTransactionsBySchool
);

/**
 * @route GET /api/payments/status/:customOrderId
 * @desc Get transaction status by custom order ID
 * @access Private
 */
router.get(
  '/status/:customOrderId',
  authenticate,
  defaultLimiter,
  paymentController.getTransactionStatus
);

export default router;
