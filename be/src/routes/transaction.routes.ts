import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth.middleware';
import { defaultLimiter } from '../middleware/rate-limiter.middleware';

const router = Router();

/**
 * @route POST /api/transactions
 * @desc Create a new payment transaction
 * @access Private
 */
router.post(
  '/',
  authenticate,
  defaultLimiter,
  transactionController.createPayment
);

/**
 * @route POST /api/transactions/webhook
 * @desc Handle payment webhook notification
 * @access Public
 */
router.post(
  '/webhook',
  transactionController.handleWebhook
);

/**
 * @route GET /api/transactions
 * @desc Get all transactions with pagination
 * @access Private
 */
router.get(
  '/',
  authenticate,
  defaultLimiter,
  transactionController.getAllTransactions
);

/**
 * @route GET /api/transactions/school/:schoolId
 * @desc Get transactions for a specific school
 * @access Private
 */
router.get(
  '/school/:schoolId',
  authenticate,
  defaultLimiter,
  transactionController.getTransactionsBySchool
);

/**
 * @route GET /api/transactions/:customOrderId
 * @desc Get transaction status by custom order ID
 * @access Private
 */
router.get(
  '/:customOrderId',
  authenticate,
  defaultLimiter,
  transactionController.getTransactionStatus
);

export default router;
