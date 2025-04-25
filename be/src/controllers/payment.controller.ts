import type { Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import paymentService from '../services/payment.service';
import logger from '../utils/logger';

// Input validation schemas
const createPaymentSchema = z.object({
  studentName: z.string().min(2, 'Student name must be at least 2 characters'),
  studentId: z.string().min(1, 'Student ID is required'),
  studentEmail: z.string().email('Invalid email address'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
});

const webhookSchema = z.object({
  status: z.number(),
  order_info: z.object({
    order_id: z.string(),
    order_amount: z.number().or(z.string()),
    transaction_amount: z.number().or(z.string()),
    gateway: z.string(),
    bank_reference: z.string(),
    status: z.string(),
    payment_mode: z.string(),
    payemnt_details: z.string(),
    Payment_message: z.string(),
    payment_time: z.string(),
    error_message: z.string(),
  }),
});

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// Controller methods
export const createPayment = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validationResult = createPaymentSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationResult.error.format(),
      });
    }

    // Generate a custom order ID
    const timestamp = Date.now().toString();
    const randomPart = crypto.randomBytes(4).toString('hex');
    const customOrderId = `ORD-${timestamp}-${randomPart}`;

    // Create payment
    const result = await paymentService.createPayment({
      ...validationResult.data,
      customOrderId,
    });

    // Return response
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error: any) {
    logger.error(`Error in create payment controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    // Validate webhook payload
    const validationResult = webhookSchema.safeParse(req.body);
    if (!validationResult.success) {
      logger.error(`Invalid webhook payload: ${JSON.stringify(req.body)}`);
      logger.error(`Validation errors: ${JSON.stringify(validationResult.error.format())}`);
      
      // Still return 200 to acknowledge receipt
      return res.status(200).json({
        success: false,
        message: 'Invalid webhook payload',
      });
    }

    // Process webhook
    const webhookData = validationResult.data;
    const result = await paymentService.processWebhook(webhookData);

    // Always return 200 to acknowledge receipt
    return res.status(200).json({
      success: result,
      message: result ? 'Webhook processed successfully' : 'Error processing webhook',
    });
  } catch (error: any) {
    logger.error(`Error in webhook controller: ${error.message}`);
    
    // Still return 200 to acknowledge receipt
    return res.status(200).json({
      success: false,
      message: 'Error processing webhook',
    });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    // Parse pagination parameters
    const { page, limit } = paginationSchema.parse({
      page: req.query.page,
      limit: req.query.limit,
    });

    // Get transactions
    const result = await paymentService.getAllTransactions(page, limit);

    // Return response
    return res.status(200).json(result);
  } catch (error: any) {
    logger.error(`Error in get all transactions controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getTransactionsBySchool = async (req: Request, res: Response) => {
  try {
    // Parse pagination parameters
    const { page, limit } = paginationSchema.parse({
      page: req.query.page,
      limit: req.query.limit,
    });

    // Validate school ID
    const schoolId = req.params.schoolId;
    if (!schoolId) {
      return res.status(400).json({
        success: false,
        message: 'School ID is required',
      });
    }

    // Get transactions
    const result = await paymentService.getTransactionsBySchool(schoolId, page, limit);

    // Return response
    return res.status(200).json(result);
  } catch (error: any) {
    logger.error(`Error in get transactions by school controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getTransactionStatus = async (req: Request, res: Response) => {
  try {
    // Validate custom order ID
    const customOrderId = req.params.customOrderId;
    if (!customOrderId) {
      return res.status(400).json({
        success: false,
        message: 'Custom order ID is required',
      });
    }

    // Get transaction status
    const result = await paymentService.getTransactionStatus(customOrderId);

    // Return response
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error: any) {
    logger.error(`Error in get transaction status controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
