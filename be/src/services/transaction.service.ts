import prisma from '../config/db';
import logger from '../utils/logger';
import { env } from '../config/env';
import * as paymentGateway from '../utils/payment-gateway.util';
import * as mailer from '../utils/mailer';

/**
 * Interface for creating a payment
 */
export interface CreatePaymentParams {
  studentName: string;
  studentId: string;
  studentEmail: string;
  amount: number;
  customOrderId: string;
}

/**
 * Interface for webhook payload
 */
export interface WebhookPayload {
  status: number;
  order_info: {
    order_id: string;
    order_amount: number | string;
    transaction_amount: number | string;
    gateway: string;
    bank_reference: string;
    status: string;
    payment_mode: string;
    payemnt_details: string;
    Payment_message: string;
    payment_time: string;
    error_message: string;
  };
}

/**
 * Create a payment request
 * @param params - Payment request parameters
 */
export const createPayment = async (params: CreatePaymentParams) => {
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

    // Create payment in payment gateway
    const gatewayResponse = await paymentGateway.createPayment({
      orderId: order.id,
      amount,
      studentName,
      studentId,
      studentEmail,
      customOrderId,
    });

    logger.info(`Payment created: ${order.id}`);

    // Return response with redirect URL
    return {
      success: true,
      message: 'Payment request created successfully',
      data: {
        redirectUrl: gatewayResponse.payment_url,
        orderId: order.id,
        customOrderId,
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
};

/**
 * Process a webhook notification
 * @param payload - Webhook payload
 */
export const processWebhook = async (payload: WebhookPayload) => {
  try {
    logger.info(`Webhook received: ${JSON.stringify(payload)}`);

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
    } = payload.order_info;

    // Store webhook log
    await prisma.webhookLog.create({
      data: {
        payload: JSON.parse(JSON.stringify(payload)),
        status: 'received',
        processedAt: new Date(),
      },
    });

    // Find order by ID
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

    // Convert amounts to numbers if they're strings
    const orderAmountNum = typeof order_amount === 'string' ? parseFloat(order_amount) : order_amount;
    const transactionAmountNum = typeof transaction_amount === 'string' ? parseFloat(transaction_amount) : transaction_amount;

    // Update order status
    await prisma.orderStatus.update({
      where: {
        orderId: order.id,
      },
      data: {
        orderAmount: orderAmountNum,
        transactionAmount: transactionAmountNum,
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

    // Send confirmation email for successful payments
    if (status.toLowerCase() === 'success') {
      await mailer.sendPaymentConfirmationEmail(
        order.studentInfo.email,
        order.studentInfo.name,
        transactionAmountNum,
        order.id
      );
      logger.info(`Payment confirmation email sent: ${order.studentInfo.email}`);
    }

    return true;
  } catch (error: any) {
    logger.error(`Error processing webhook: ${error.message}`);
    return false;
  }
};

/**
 * Get all transactions with pagination
 * @param page - Page number
 * @param limit - Results per page
 * @param sort - Sort direction
 */
export const getAllTransactions = async (
  page = 1,
  limit = 10,
  sort: Record<string, 1 | -1> = { createdAt: -1 }
) => {
  try {
    const skip = (page - 1) * limit;

    // Get transactions with pagination
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

    // Get total count
    const total = await prisma.order.count();

    // Format response
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
};

/**
 * Get transactions by school ID
 * @param schoolId - School ID
 * @param page - Page number
 * @param limit - Results per page
 */
export const getTransactionsBySchool = async (schoolId: string, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    // Get transactions for the school
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

    // Get total count for the school
    const total = await prisma.order.count({
      where: {
        schoolId,
      },
    });

    // Format response
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
};

/**
 * Get transaction status by custom order ID
 * @param customOrderId - Custom order ID
 */
export const getTransactionStatus = async (customOrderId: string) => {
  try {
    // Find order by custom order ID
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

    // Format response
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
};
