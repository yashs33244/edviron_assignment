import axios from 'axios';
import crypto from 'crypto';
import { env } from '../config/env';
import logger from '../utils/logger';
import prisma from '../config/db';

// Types
interface CreatePaymentParams {
  studentName: string;
  studentId: string;
  studentEmail: string;
  amount: number;
  customOrderId: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    redirectUrl?: string;
    orderId?: string;
  };
  error?: any;
}

// Payment Gateway Service
const paymentService = {
  /**
   * Create a payment request
   */
  createPayment: async (params: CreatePaymentParams): Promise<PaymentResponse> => {
    try {
      const { studentName, studentId, studentEmail, amount, customOrderId } = params;
      
      // Create a new order in the database
      const order = await prisma.order.create({
        data: {
          schoolId: env.SCHOOL_ID,
          trusteeId: env.PG_KEY,
          gatewayName: 'PhonePe',
          customOrderId,
          studentInfo: {
            name: studentName,
            id: studentId,
            email: studentEmail,
          },
          status: {
            create: {
              orderAmount: amount,
              transactionAmount: amount,
              status: 'pending',
            },
          },
        },
        include: {
          status: true,
        },
      });
      
      // Prepare payload for payment gateway
      const payload = {
        order_id: order.id,
        amount,
        student_name: studentName,
        student_id: studentId,
        student_email: studentEmail,
        school_id: env.SCHOOL_ID,
        trustee_id: env.PG_KEY,
        custom_order_id: customOrderId,
      };
      
      // Sign the payload with JWT
      const signedPayload = crypto.createHmac('sha256', env.JWT_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      // Call the payment gateway API
      const response = await axios.post(
        'https://api.paymentgateway.com/create-collect-request',
        {
          ...payload,
          signature: signedPayload,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.PG_API_KEY}`,
          },
        }
      );
      
      logger.info(`Payment request created: ${order.id}`);
      
      // Return success response with redirect URL
      return {
        success: true,
        message: 'Payment request created successfully',
        data: {
          redirectUrl: response.data.payment_url,
          orderId: order.id,
        },
      };
    } catch (error: any) {
      logger.error(`Error creating payment: ${error.message}`);
      
      return {
        success: false,
        message: 'Failed to create payment request',
        error: error.message,
      };
    }
  },
  
  /**
   * Process a webhook notification
   */
  processWebhook: async (webhookData: any): Promise<boolean> => {
    try {
      // Log the webhook payload
      logger.info(`Webhook received: ${JSON.stringify(webhookData)}`);
      
      // Validate webhook data
      if (!webhookData || !webhookData.order_info || !webhookData.order_info.order_id) {
        logger.error('Invalid webhook payload');
        return false;
      }
      
      // Extract data from webhook
      const {
        order_id,
        order_amount,
        transaction_amount,
        gateway,
        bank_reference,
        status,
        payment_mode,
        payemnt_details,
        Payment_message,
        payment_time,
        error_message,
      } = webhookData.order_info;
      
      // Store webhook log
      await prisma.webhookLog.create({
        data: {
          payload: webhookData,
          status: 'received',
        },
      });
      
      // Find order by transaction ID
      const order = await prisma.order.findFirst({
        where: {
          id: order_id,
        },
        include: {
          status: true,
        },
      });
      
      if (!order) {
        logger.error(`Order not found: ${order_id}`);
        return false;
      }
      
      // Update order status
      await prisma.orderStatus.update({
        where: {
          orderId: order.id,
        },
        data: {
          orderAmount: parseFloat(order_amount),
          transactionAmount: parseFloat(transaction_amount),
          paymentMode: payment_mode,
          paymentDetails: payemnt_details,
          bankReference: bank_reference,
          paymentMessage: Payment_message,
          status: status.toLowerCase(),
          errorMessage: error_message === 'NA' ? null : error_message,
          paymentTime: new Date(payment_time),
        },
      });
      
      logger.info(`Order status updated: ${order.id} - ${status}`);
      return true;
    } catch (error: any) {
      logger.error(`Error processing webhook: ${error.message}`);
      return false;
    }
  },
  
  /**
   * Get all transactions with pagination
   */
  getAllTransactions: async (page = 1, limit = 10, sort: Record<string, 1 | -1> = { createdAt: -1 }) => {
    try {
      const skip = (page - 1) * limit;
      
      const transactions = await prisma.order.findMany({
        include: {
          status: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: sort.createdAt === 1 ? 'asc' : 'desc',
        },
      });
      
      const total = await prisma.order.count();
      
      return {
        success: true,
        data: {
          transactions: transactions.map(order => ({
            collect_id: order.id,
            school_id: order.schoolId,
            gateway: order.gatewayName,
            order_amount: order.status?.orderAmount,
            transaction_amount: order.status?.transactionAmount,
            status: order.status?.status,
            custom_order_id: order.customOrderId,
            student_info: order.studentInfo,
            created_at: order.createdAt,
            payment_time: order.status?.paymentTime,
          })),
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error: any) {
      logger.error(`Error getting transactions: ${error.message}`);
      return {
        success: false,
        message: 'Failed to get transactions',
        error: error.message,
      };
    }
  },
  
  /**
   * Get transactions by school ID
   */
  getTransactionsBySchool: async (schoolId: string, page = 1, limit = 10) => {
    try {
      const skip = (page - 1) * limit;
      
      const transactions = await prisma.order.findMany({
        where: {
          schoolId,
        },
        include: {
          status: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      const total = await prisma.order.count({
        where: {
          schoolId,
        },
      });
      
      return {
        success: true,
        data: {
          transactions: transactions.map(order => ({
            collect_id: order.id,
            school_id: order.schoolId,
            gateway: order.gatewayName,
            order_amount: order.status?.orderAmount,
            transaction_amount: order.status?.transactionAmount,
            status: order.status?.status,
            custom_order_id: order.customOrderId,
            student_info: order.studentInfo,
            created_at: order.createdAt,
            payment_time: order.status?.paymentTime,
          })),
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error: any) {
      logger.error(`Error getting transactions by school: ${error.message}`);
      return {
        success: false,
        message: 'Failed to get transactions',
        error: error.message,
      };
    }
  },
  
  /**
   * Get transaction status by custom order ID
   */
  getTransactionStatus: async (customOrderId: string) => {
    try {
      const order = await prisma.order.findUnique({
        where: {
          customOrderId,
        },
        include: {
          status: true,
        },
      });
      
      if (!order) {
        return {
          success: false,
          message: 'Transaction not found',
        };
      }
      
      return {
        success: true,
        data: {
          collect_id: order.id,
          custom_order_id: order.customOrderId,
          school_id: order.schoolId,
          gateway: order.gatewayName,
          order_amount: order.status?.orderAmount,
          transaction_amount: order.status?.transactionAmount,
          status: order.status?.status,
          payment_mode: order.status?.paymentMode,
          payment_details: order.status?.paymentDetails,
          bank_reference: order.status?.bankReference,
          payment_message: order.status?.paymentMessage,
          error_message: order.status?.errorMessage,
          payment_time: order.status?.paymentTime,
          created_at: order.createdAt,
        },
      };
    } catch (error: any) {
      logger.error(`Error getting transaction status: ${error.message}`);
      return {
        success: false,
        message: 'Failed to get transaction status',
        error: error.message,
      };
    }
  },
};

export default paymentService;
