import { Request, Response } from 'express';
import prisma from '../config/db';
import { createCollectRequest, checkPaymentStatus } from '../utils/paymentService';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Default values
const DEFAULT_SCHOOL_ID = process.env.SCHOOL_ID || '65b0e6293e9f76a9694d84b4';
const PG_KEY = process.env.PG_KEY || 'edvtest01';
const DEFAULT_TRUSTEE_ID = process.env.TRUSTEE_ID || '65b0e552dd31950a9b41c5ba';
const PG_API_URL = process.env.PG_API_URL || 'https://dev-vanilla.edviron.com/erp';
const API_KEY = process.env.API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw';
const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || '65b0e552dd31950a9b41c5fa'; // Default user ID for system operations

/**
 * Create a new payment request
 * @route POST /api/payments/create-payment
 * @access Private
 */
export const createPayment = async (req: Request, res: Response) => {
  try {
    console.log("[Payment Controller] Create payment request received");
    const startTime = Date.now();
    
    // Extract payment details from request body
    const { 
      school_id,
      amount, 
      callback_url,
      student_info,
      pg_key,
      custom_order_id 
    } = req.body;

    // Validate required fields
    if (!school_id || !amount || !callback_url || !student_info) {
      console.error("[Payment Controller] Missing required fields in create payment request");
      return res.status(400).json({
        success: false,
        message: "Missing required fields: school_id, amount, callback_url, and student_info are required"
      });
    }

    console.log(`[Payment Controller] Creating payment for school: ${school_id}, amount: ${amount}`);
    
    try {
      // Get the user ID from the authenticated request
      const userId = (req as any).user?.id || DEFAULT_USER_ID;
      
      // Use the payment service
      const paymentResult = await createCollectRequest({
        studentName: student_info.name,
        studentId: student_info.id,
        studentEmail: student_info.email,
      amount,
      school_id,
      callback_url,
        userId // Pass the user ID
    });

      if (paymentResult.success) {
        return res.status(200).json({
          success: true,
          message: "Payment request created successfully",
          data: paymentResult.data
        });
      } else {
      return res.status(400).json({
          success: false,
          message: paymentResult.error || "Failed to create payment request"
        });
      }
    } catch (dbError: any) {
      console.error(`[Payment Controller] Database error: ${dbError.message}`);
      return res.status(500).json({
        success: false,
        message: "Failed to process payment due to database error"
      });
    }
  } catch (error: any) {
    console.error(`[Payment Controller] Unexpected error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred"
    });
  }
};

/**
 * Process webhook from payment gateway
 * @route POST /api/payments/webhook
 * @access Public (but typically secured by IP filtering or secret verification)
 */
export const processWebhook = async (req: Request, res: Response) => {
  try {
    // Log the entire webhook payload
    console.log('Webhook payload:', JSON.stringify(req.body, null, 2));
    
    // Extract data from the webhook payload
    const { 
      status, 
      amount, 
      transaction_amount, 
      details, 
      custom_order_id, 
      collect_request_id 
    } = req.body;

    if (!collect_request_id) {
      console.error('Missing collect_request_id in webhook payload');
      return res.status(200).json({
        success: false,
        message: 'Missing collect_request_id in webhook payload',
      });
    }

    // Log webhook
    try {
      await prisma.webhookLog.create({
        data: {
          payload: req.body,
          status: status?.toString() || 'unknown',
        },
      });
    } catch (logError) {
      console.error('Failed to log webhook:', logError);
    }

    try {
      // Find existing order by collect_request_id
      let order = await prisma.order.findFirst({
        where: { collect_request_id },
        include: { orderStatus: true },
      });

      // If no order found, try finding by custom_order_id
      if (!order && custom_order_id && custom_order_id !== 'NA') {
        order = await prisma.order.findFirst({
          where: { custom_order_id },
          include: { orderStatus: true },
        });
      }

      if (!order) {
        console.log('Order not found, creating new one');
        // Create a new order record
        order = await prisma.order.create({
          data: {
            school_id: DEFAULT_SCHOOL_ID,
            trustee_id: DEFAULT_TRUSTEE_ID,
            gateway_name: 'Edviron Payment Gateway not found order',
            custom_order_id: custom_order_id !== 'NA' ? custom_order_id : `ORD-${Date.now()}`,
            collect_request_id,
            student_info: { name: 'Unknown', id: 'Unknown', email: 'Unknown' },
            // Add required user relation
            user: {
              connect: {
                id: DEFAULT_USER_ID
              }
            }
          },
          include: { orderStatus: true },
        });
      }

      // Determine payment status
      const paymentStatus = status?.toString()?.toUpperCase() === 'SUCCESS' ? 'success' : 
                           (status?.toString()?.toUpperCase() === 'FAILURE' || status?.toString()?.toUpperCase() === 'FAILED') ? 'failed' : 'pending';

      // Update OrderStatus
      if (order && order.orderStatus) {
        // Update existing order status
        await prisma.orderStatus.update({
          where: { id: order.orderStatus.id },
          data: {
            order_amount: parseFloat(amount?.toString() || '0') || order.orderStatus.order_amount,
            transaction_amount: parseFloat(transaction_amount?.toString() || '0') || order.orderStatus.transaction_amount,
            status: paymentStatus,
            payment_mode: details?.payment_mode || order.orderStatus.payment_mode,
            payment_details: JSON.stringify(details || {}),
            bank_reference: details?.bank_ref || order.orderStatus.bank_reference,
            payment_time: new Date(),
          }
        });
      } else if (order) {
        // Create new order status
        await prisma.orderStatus.create({
          data: {
            collect_id: order.id,
            order_amount: parseFloat(amount?.toString() || '0') || 0,
            transaction_amount: parseFloat(transaction_amount?.toString() || '0') || 0,
            status: paymentStatus,
            payment_mode: details?.payment_mode,
            payment_details: JSON.stringify(details || {}),
            bank_reference: details?.bank_ref,
            payment_time: new Date(),
          }
        });
      }
      
      // Update or create Transaction record
      if (order) {
        const existingTransaction = await prisma.transaction.findFirst({
          where: { order_id: order.id }
        });
        
        if (existingTransaction) {
          // Update existing transaction
          await prisma.transaction.update({
            where: { id: existingTransaction.id },
            data: {
              amount: parseFloat(amount?.toString() || '0') || existingTransaction.amount,
              status: paymentStatus,
              payment_mode: details?.payment_mode || existingTransaction.payment_mode,
              payment_details: JSON.stringify(details || {}),
              bank_reference: details?.bank_ref || existingTransaction.bank_reference,
              payment_time: new Date(),
            }
          });
        } else {
          // Create new transaction record
          await prisma.transaction.create({
            data: {
              order_id: order.id,
              school_id: order.school_id,
              student_id: order.student_info.id,
              amount: parseFloat(amount?.toString() || '0') || 0,
              status: paymentStatus,
              payment_mode: details?.payment_mode,
              payment_details: JSON.stringify(details || {}),
              bank_reference: details?.bank_ref,
              payment_time: new Date(),
            }
          });
        }
      }

      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
      });
    } catch (dbError: any) {
      console.error('Database error in webhook processing:', dbError.message);
      console.error('Stack trace:', dbError.stack);
      
      // Always return 200 for webhooks even if there's an error
      res.status(200).json({
        success: false,
        message: 'Database error processing webhook',
      });
    }
  } catch (error: any) {
    console.error('Process webhook error:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Always return 200 for webhooks
    res.status(200).json({
      success: false,
      message: 'Error processing webhook',
    });
  }
};

/**
 * Check transaction status
 * @route GET /api/payments/check-status/:collectRequestId
 * @access Private
 */
export const checkTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { collectRequestId } = req.params;
    console.log(`[Backend] Received payment status check request for collectRequestId: ${collectRequestId}`);

    if (!collectRequestId) {
      console.log('[Backend] Error: collectRequestId is missing in the request');
      return res.status(400).json({
        success: false,
        message: 'Collect request ID is required',
      });
    }

    // Get school ID from request or use default
    const schoolId = req.query.school_id?.toString() || DEFAULT_SCHOOL_ID;
    console.log(`[Backend] Using school_id: ${schoolId} for payment status check`);

    // Check if order exists first
    const existingOrder = await prisma.order.findFirst({
      where: { collect_request_id: collectRequestId },
      include: { orderStatus: true },
    });

    if (existingOrder) {
      console.log(`[Backend] Found existing order: ${existingOrder.id} for collectRequestId: ${collectRequestId}`);
      
      // If order exists and has a success status, return that
      if (existingOrder?.orderStatus?.status === 'success') {
        console.log(`[Backend] Order ${existingOrder.id} already has success status, returning cached result`);
        return res.status(200).json({
          success: true,
          data: {
            status: 'SUCCESS',
            order_id: existingOrder.id,
            collect_request_id: collectRequestId,
            order_amount: existingOrder.orderStatus.order_amount,
            transaction_amount: existingOrder.orderStatus.transaction_amount,
            payment_details: existingOrder.orderStatus.payment_details,
            payment_time: existingOrder.orderStatus.payment_time,
            orderStatus: existingOrder.orderStatus,
          },
        });
      } else {
        console.log(`[Backend] Order ${existingOrder.id} has status: ${existingOrder?.orderStatus?.status || 'no status'}, checking with payment gateway`);
      }
    } else {
      console.log(`[Backend] No order found for collectRequestId: ${collectRequestId}, will check with payment gateway`);
    }

    // Check payment status from the payment gateway
    console.log(`[Backend] Calling checkPaymentStatus for collectRequestId: ${collectRequestId} with schoolId: ${schoolId}`);
    const startTime = Date.now();
    const statusResponse = await checkPaymentStatus(collectRequestId, schoolId);
    const endTime = Date.now();
    console.log(`[Backend] Payment gateway response received in ${endTime - startTime}ms: ${JSON.stringify(statusResponse, null, 2)}`);

    if (!statusResponse.success) {
      console.log(`[Backend] Error from payment gateway: ${statusResponse.error}`);
      return res.status(400).json({
        success: false,
        message: statusResponse.error,
      });
    }

    const paymentStatus = statusResponse.data?.status?.toUpperCase() || 'UNKNOWN';
    console.log(`[Backend] Payment status from gateway: ${paymentStatus}`);

    // If payment status is successful, update order and trigger webhook simulation
    if (paymentStatus === 'SUCCESS' || statusResponse.data?.status === 'success') {
      console.log('[Backend] Payment successful, updating order status');
      
      // Find the order
      const order = await prisma.order.findFirst({
        where: { collect_request_id: collectRequestId },
        include: { orderStatus: true },
      });

      if (order) {
        console.log(`[Backend] Found order: ${order.id} to update with success status`);
        // Update order status to success
        if (order.orderStatus) {
          console.log(`[Backend] Updating existing order status: ${order.orderStatus.id}`);
          await prisma.orderStatus.update({
            where: { id: order.orderStatus.id },
            data: {
              status: 'success',
              payment_time: new Date(),
              payment_details: JSON.stringify(statusResponse.data || {})
            }
          });
          console.log(`[Backend] Updated order status to success for order ${order.id}`);
        } else {
          console.log(`[Backend] Creating new order status for order: ${order.id}`);
          // Create new order status
          await prisma.orderStatus.create({
            data: {
              collect_id: order.id,
              order_amount: parseFloat(statusResponse.data.amount?.toString() || '0'),
              transaction_amount: parseFloat(statusResponse.data.amount?.toString() || '0'),
              status: 'success',
              payment_details: JSON.stringify(statusResponse.data || {}),
              payment_time: new Date(),
            }
          });
          console.log(`[Backend] Created new success order status for order ${order.id}`);
        }
        
        // Update or create transaction record
        const existingTransaction = await prisma.transaction.findFirst({
          where: { order_id: order.id }
        });
        
        if (existingTransaction) {
          await prisma.transaction.update({
            where: { id: existingTransaction.id },
            data: {
              status: 'success',
              amount: parseFloat(statusResponse.data.amount?.toString() || '0'),
              payment_details: JSON.stringify(statusResponse.data || {}),
              payment_time: new Date()
            }
          });
          console.log(`[Backend] Updated transaction record for order ${order.id}`);
        } else {
          await prisma.transaction.create({
            data: {
              order_id: order.id,
              school_id: order.school_id,
              student_id: order.student_info.id,
              amount: parseFloat(statusResponse.data.amount?.toString() || '0'),
              status: 'success',
              payment_details: JSON.stringify(statusResponse.data || {}),
              payment_time: new Date(),
            }
          });
          console.log(`[Backend] Created new transaction record for order ${order.id}`);
        }

        // Simulate webhook notification for successful payment
        const webhookData = {
          status: 'SUCCESS',
          amount: statusResponse.data.amount,
          transaction_amount: statusResponse.data.amount,
          collect_request_id: collectRequestId,
          custom_order_id: order.custom_order_id,
          details: statusResponse.data.details || {}
        };

        // Log webhook simulation
        console.log('[Backend] Simulating webhook for successful payment:', JSON.stringify(webhookData, null, 2));
        
        try {
          // Log the webhook
          await prisma.webhookLog.create({
            data: {
              payload: webhookData,
              status: 'SUCCESS',
            },
          });
          console.log('[Backend] Successfully logged webhook data');
        } catch (logError) {
          console.error('[Backend] Failed to log webhook simulation:', logError);
        }
      } else {
        console.log(`[Backend] No order found for collectRequestId: ${collectRequestId}, cannot update status`);
      }
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'FAILURE' || statusResponse.data?.status === 'failed') {
      console.log('[Backend] Payment failed, updating order status');
      
      // Find the order
      const order = await prisma.order.findFirst({
        where: { collect_request_id: collectRequestId },
        include: { orderStatus: true },
      });

      if (order) {
        console.log(`[Backend] Found order: ${order.id} to update with failed status`);
        // Update order status to failed
        if (order.orderStatus) {
          console.log(`[Backend] Updating existing order status: ${order.orderStatus.id}`);
          await prisma.orderStatus.update({
            where: { id: order.orderStatus.id },
            data: {
              status: 'failed',
              payment_time: new Date(),
              payment_details: JSON.stringify(statusResponse.data || {})
            }
          });
          console.log(`[Backend] Updated order status to failed for order ${order.id}`);
        } else {
          console.log(`[Backend] Creating new order status for order: ${order.id}`);
          // Create new order status
          await prisma.orderStatus.create({
            data: {
              collect_id: order.id,
              order_amount: parseFloat(statusResponse.data.amount?.toString() || '0'),
              transaction_amount: parseFloat(statusResponse.data.amount?.toString() || '0'),
              status: 'failed',
              payment_details: JSON.stringify(statusResponse.data || {}),
              payment_time: new Date(),
            }
          });
          console.log(`[Backend] Created new failed order status for order ${order.id}`);
        }
        
        // Update or create transaction record
        const existingTransaction = await prisma.transaction.findFirst({
          where: { order_id: order.id }
        });
        
        if (existingTransaction) {
          await prisma.transaction.update({
            where: { id: existingTransaction.id },
            data: {
              status: 'failed',
              payment_time: new Date(),
              payment_details: JSON.stringify(statusResponse.data || {})
            }
          });
          console.log(`[Backend] Updated transaction record with failed status for order ${order.id}`);
        } else {
          await prisma.transaction.create({
            data: {
              order_id: order.id,
              school_id: order.school_id,
              student_id: order.student_info.id,
              amount: parseFloat(statusResponse.data.amount?.toString() || '0'),
              status: 'failed',
              payment_details: JSON.stringify(statusResponse.data || {}),
              payment_time: new Date(),
            }
          });
          console.log(`[Backend] Created new transaction record with failed status for order ${order.id}`);
        }
      } else {
        console.log(`[Backend] No order found for collectRequestId: ${collectRequestId}, cannot update status`);
      }
    } else {
      console.log(`[Backend] Payment status is ${paymentStatus}, which is neither success nor failed, treating as pending`);
    }

    console.log(`[Backend] Returning payment status response for ${collectRequestId}`);

    res.status(200).json({
      success: true,
      data: statusResponse.data,
    });
  } catch (error: any) {
    console.error('[Backend] Check transaction status error:', error);
    
    // Try to give more details about the error
    if (error.response) {
      console.error('[Backend] Error response from external API:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error: ' + (error.message || 'Unknown error'),
    });
  }
};

/**
 * Get all transactions
 * @route GET /api/payments/transactions
 * @access Private
 */
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    // Get pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get filters
    const statusFilter = req.query.status?.toString();
    const searchFilter = req.query.search?.toString();
    const startDate = req.query.startDate?.toString();
    const endDate = req.query.endDate?.toString();
    
    // Build where clause
    const where: any = {};
    
    if (statusFilter && statusFilter !== 'all') {
      where.status = statusFilter;
    }
    
    if (startDate) {
      where.payment_time = {
        ...(where.payment_time || {}),
        gte: new Date(startDate)
      };
    }
    
    if (endDate) {
      where.payment_time = {
        ...(where.payment_time || {}),
        lte: new Date(endDate)
      };
    }
    
    // Count total transactions with filters
    const totalTransactions = await prisma.transaction.count({ where });
    
    // Get all transactions from Transaction model with pagination
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Format response
    const formattedTransactions = await Promise.all(transactions.map(async (transaction: any) => {
      // Get associated order details
      const order = await prisma.order.findUnique({
        where: { id: transaction.order_id }
      });

      return {
      collect_id: transaction.id,
        order_id: transaction.order_id,
      school_id: transaction.school_id,
        gateway: order?.gateway_name || 'Unknown',
        order_amount: transaction.amount,
        transaction_amount: transaction.amount,
        status: transaction.status,
        custom_order_id: order?.custom_order_id,
        student_info: order?.student_info,
      created_at: transaction.createdAt,
        payment_time: transaction.payment_time,
      };
    }));

    // Calculate pagination data
    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(200).json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: {
          total: totalTransactions,
          page,
          pages: totalPages
        }
      },
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Get transactions by school
 * @route GET /api/payments/transactions/school/:schoolId
 * @access Private
 */
export const getTransactionsBySchool = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;

    // Get pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get filters
    const statusFilter = req.query.status?.toString();
    const searchFilter = req.query.search?.toString();
    const startDate = req.query.startDate?.toString();
    const endDate = req.query.endDate?.toString();
    
    // Build where clause
    const where: any = {
      school_id: schoolId
    };
    
    if (statusFilter && statusFilter !== 'all') {
      where.status = statusFilter;
    }
    
    if (startDate) {
      where.payment_time = {
        ...(where.payment_time || {}),
        gte: new Date(startDate)
      };
    }
    
    if (endDate) {
      where.payment_time = {
        ...(where.payment_time || {}),
        lte: new Date(endDate)
      };
    }
    
    // Count total transactions with filters
    const totalTransactions = await prisma.transaction.count({ where });

    // Get transactions by school with pagination
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Format response
    const formattedTransactions = await Promise.all(transactions.map(async (transaction: any) => {
      // Get associated order details
      const order = await prisma.order.findUnique({
        where: { id: transaction.order_id }
      });

      return {
      collect_id: transaction.id,
        order_id: transaction.order_id,
      school_id: transaction.school_id,
        gateway: order?.gateway_name || 'Unknown',
        order_amount: transaction.amount,
        transaction_amount: transaction.amount,
        status: transaction.status,
        custom_order_id: order?.custom_order_id,
        student_info: order?.student_info,
      created_at: transaction.createdAt,
        payment_time: transaction.payment_time,
      };
    }));

    // Calculate pagination data
    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(200).json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: {
          total: totalTransactions,
          page,
          pages: totalPages
        }
      },
    });
  } catch (error) {
    console.error('Get transactions by school error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Get user transactions
 * @route GET /api/payments/user-transactions
 * @access Private
 */
export const getUserTransactions = async (req: Request, res: Response) => {
  try {
    // Get user ID from request
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Get pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get filters
    const statusFilter = req.query.status?.toString();
    const startDate = req.query.startDate?.toString();
    const endDate = req.query.endDate?.toString();
    
    // First find all orders for this user
    const userOrders = await prisma.order.findMany({
      where: { userId },
      select: { id: true }
    });
    
    const orderIds = userOrders.map(order => order.id);
    
    if (orderIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          transactions: [],
          pagination: {
            total: 0,
            page,
            pages: 0
          }
        }
      });
    }
    
    // Build where clause for transactions
    const where: any = {
      order_id: { in: orderIds }
    };
    
    if (statusFilter && statusFilter !== 'all') {
      where.status = statusFilter;
    }
    
    if (startDate) {
      where.payment_time = {
        ...(where.payment_time || {}),
        gte: new Date(startDate)
      };
    }
    
    if (endDate) {
      where.payment_time = {
        ...(where.payment_time || {}),
        lte: new Date(endDate)
      };
    }
    
    // Count total transactions with filters
    const totalTransactions = await prisma.transaction.count({ where });
    
    // Get user transactions
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
    
    // Format response
    const formattedTransactions = await Promise.all(transactions.map(async (transaction: any) => {
      // Get associated order details
      const order = await prisma.order.findUnique({
        where: { id: transaction.order_id }
      });

      return {
        collect_id: transaction.id,
        order_id: transaction.order_id,
        school_id: transaction.school_id,
        gateway: order?.gateway_name || 'Unknown',
        order_amount: transaction.amount,
        transaction_amount: transaction.amount,
        status: transaction.status,
        custom_order_id: order?.custom_order_id,
        student_info: order?.student_info,
        created_at: transaction.createdAt,
        payment_time: transaction.payment_time,
      };
    }));
    
    // Calculate pagination data
    const totalPages = Math.ceil(totalTransactions / limit);
    
    res.status(200).json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: {
          total: totalTransactions,
          page,
          pages: totalPages
        }
      }
    });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get transaction status
 * @route GET /api/payments/transaction-status/:customOrderId
 * @access Private
 */
export const getTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { customOrderId } = req.params;

    // First try to find the order
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { custom_order_id: customOrderId },
          { collect_request_id: customOrderId }
        ]
      }
    });

    if (!order) {
      console.error(`Transaction not found for ID: ${customOrderId}`, { 
        searchedBy: 'custom_order_id and collect_request_id'
      });
      
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Now find the transaction associated with this order
    const transaction = await prisma.transaction.findFirst({
      where: { order_id: order.id }
    });

    if (!transaction) {
      console.error(`Transaction record not found for order ID: ${order.id}`);
      
      // Fall back to order status
      const orderStatus = await prisma.orderStatus.findFirst({
        where: { collect_id: order.id }
      });
      
      return res.status(200).json({
        success: true,
        data: {
          id: order.id,
          custom_order_id: order.custom_order_id,
          collect_request_id: order.collect_request_id,
          status: orderStatus?.status || 'pending',
          order_amount: orderStatus?.order_amount || 0,
          transaction_amount: orderStatus?.transaction_amount || 0,
          payment_mode: orderStatus?.payment_mode,
          payment_details: orderStatus?.payment_details,
          payment_time: orderStatus?.payment_time,
          student_info: order.student_info,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: transaction.id,
        order_id: order.id,
        custom_order_id: order.custom_order_id,
        collect_request_id: order.collect_request_id,
        status: transaction.status,
        order_amount: transaction.amount,
        transaction_amount: transaction.amount,
        payment_mode: transaction.payment_mode,
        payment_details: transaction.payment_details,
        payment_time: transaction.payment_time,
        student_info: order.student_info,
      },
    });
  } catch (error) {
    console.error('Get transaction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};