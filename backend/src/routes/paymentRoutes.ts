import express, { Router } from 'express';
import {
  createPayment,
  processWebhook,
  getAllTransactions,
  getTransactionsBySchool,
  getTransactionStatus,
  checkTransactionStatus,
  getUserTransactions
} from '../controllers/paymentController';
import { protect } from '../middlewares/auth';

const router: Router = express.Router();

// Create payment route (protected)
router.post('/create-payment', protect as any, createPayment as any);

// Webhook route (public)
router.post('/webhook', processWebhook as any);

// Check transaction status with collect request ID (protected)
router.get('/check-status/:collectRequestId', protect as any, checkTransactionStatus as any);

// Get all transactions route (protected)
router.get('/transactions', protect as any, getAllTransactions as any);

// Get user's transactions route (protected)
router.get('/user-transactions', protect as any, getUserTransactions as any);

// Get transactions by school route (protected)
router.get('/transactions/school/:schoolId', protect as any, getTransactionsBySchool as any);

// Get transaction status route (protected)
router.get('/transaction-status/:customOrderId', getTransactionStatus as any);

export default router; 