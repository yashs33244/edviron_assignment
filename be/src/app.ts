import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import logger from './utils/logger';
import authRoutes from './routes/auth.routes';
import paymentRoutes from './routes/payment.routes';
import transactionRoutes from './routes/transaction.routes';
import { defaultLimiter } from './middleware/rate-limiter.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Initialize Express app
const app = express();

// Apply global middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS handling
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logging
app.use(defaultLimiter); // Rate limiting

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: env.NODE_ENV });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
