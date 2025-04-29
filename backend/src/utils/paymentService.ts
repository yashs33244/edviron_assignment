import axios from 'axios';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

// Payment gateway endpoints
const PG_API_URL = process.env.PG_API_URL || 'https://dev-vanilla.edviron.com/erp';
const PG_KEY = process.env.PG_KEY || 'edvtest01';
const API_KEY = process.env.API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw';
const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || '65b0e552dd31950a9b41c5fa'; // Default user ID for system-created orders

/**
 * Create a collect request at the payment gateway
 */
export const createCollectRequest = async ({
  studentName,
  studentId,
  studentEmail,
  amount,
  school_id,
  callback_url,
  sign,
  userId
}: {
  studentName: string;
  studentId: string;
  studentEmail: string;
  amount: string;
  school_id?: string;
  callback_url?: string;
  sign?: string;
  userId?: string;
}) => {
  try {
    // Use provided school_id or fall back to environment variable
    const schoolId = school_id || process.env.SCHOOL_ID || '65b0e6293e9f76a9694d84b4';
    
    // Create payload
    const payload = {
      school_id: schoolId,
      amount,
      callback_url: callback_url || `${process.env.CLIENT_URL}/payment-callback`,
    };

    // Use provided sign or create one if not provided
    let signature = sign;
    if (!signature) {
      signature = jwt.sign(payload, PG_KEY);
    }

    // Request data - only include fields the API expects
    const requestData = {
      school_id: schoolId,
      amount,
      callback_url: callback_url || `${process.env.CLIENT_URL}/payment-callback`,
      sign: signature
    };

    console.log('Creating payment request with data:', JSON.stringify(requestData, null, 2));

    // Make request to payment gateway
    const response = await axios.post(`${PG_API_URL}/create-collect-request`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
    });

    console.log('Payment gateway response:', JSON.stringify(response.data, null, 2));

    // Check if response is successful
    if (response.data.collect_request_id && response.data.collect_request_url) {
      // Generate a custom order ID
      const customOrderId = `ORD-${Date.now()}`;
      
      // Save the order to database
      const order = await prisma.order.create({
        data: {
          school_id: schoolId,
          trustee_id: studentId, // Assuming trustee_id is the studentId
          student_info: {
              name: studentName,
              id: studentId,
              email: studentEmail,
            },
          gateway_name: 'Edviron Payment Gateway',
          custom_order_id: customOrderId,
          collect_request_id: response.data.collect_request_id,
          // Add required user relation
          user: {
            connect: {
              id: userId || DEFAULT_USER_ID
            }
          }
        },
      });

      // Create initial order status
      await prisma.orderStatus.create({
        data: {
          collect_id: order.id,
          order_amount: parseFloat(amount),
          transaction_amount: 0,
          status: 'pending',
          payment_time: new Date()
        },
      });
      
      // Create initial transaction record
      await prisma.transaction.create({
        data: {
          order_id: order.id,
          school_id: schoolId,
          student_id: studentId,
          amount: parseFloat(amount),
          status: 'pending',
          payment_time: new Date()
        }
      });

      return {
        success: true,
        data: {
          collect_request_id: response.data.collect_request_id,
          collect_request_url: response.data.collect_request_url, // Use the correct field name from response
          sign: response.data.sign,
          custom_order_id: customOrderId,
          orderId: order.id
        },
      };
    } else {
      return {
        success: false,
        error: 'Failed to create payment request: Invalid response from payment gateway',
      };
    }
  } catch (error: any) {
    console.error('Create collect request error:', error.message);
    if (error.response) {
      console.error('Payment gateway error response:', JSON.stringify(error.response.data, null, 2));
    }
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Payment gateway error',
    };
  }
};

/**
 * Check payment status at the payment gateway
 */
export const checkPaymentStatus = async (collectRequestId: string, schoolId?: string) => {
  try {
    // Get the school ID
    const school_id = schoolId || process.env.SCHOOL_ID || '65b0e6293e9f76a9694d84b4';
    
    // Create and sign the JWT payload
    const payload = {
      school_id,
      collect_request_id: collectRequestId
    };
    console.log(`[PaymentService] Creating JWT payload for status check: ${JSON.stringify(payload)}`);
    
    const sign = jwt.sign(payload, PG_KEY);
    console.log(`[PaymentService] Generated JWT signature: ${sign.substring(0, 20)}...`);
    
    // Make request to check status
    const url = `${PG_API_URL}/collect-request/${collectRequestId}?school_id=${school_id}&sign=${encodeURIComponent(sign)}`;
    console.log(`[PaymentService] Checking payment status with URL: ${url}`);
    
    // Log API key partial for debugging (never log full API keys in production)
    const apiKeyPartial = API_KEY.substring(0, 15) + '...';
    console.log(`[PaymentService] Using API Key (partial): ${apiKeyPartial}`);
    
    const startTime = Date.now();
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      timeout: 10000, // 10 second timeout
    });
    const endTime = Date.now();
    
    console.log(`[PaymentService] Received response from payment gateway in ${endTime - startTime}ms`);
    console.log(`[PaymentService] Payment status response headers: ${JSON.stringify(response.headers)}`);
    console.log(`[PaymentService] Payment status response: ${JSON.stringify(response.data, null, 2)}`);

    // Find the order in our database
    const order = await prisma.order.findFirst({
      where: { collect_request_id: collectRequestId },
      include: { orderStatus: true }
    });

    if (!order) {
      console.log(`[PaymentService] Order not found for collect_request_id: ${collectRequestId}`);
      return {
        success: false,
        error: 'Order not found for the given collect request ID'
      };
    }

    console.log(`[PaymentService] Found order: ${order.id} for collect_request_id: ${collectRequestId}`);

    // Determine payment status - handle both uppercase and lowercase status values
    const responseStatus = response.data.status;
    const paymentStatus = 
      responseStatus?.toString().toUpperCase() === 'SUCCESS' ? 'success' :
      responseStatus?.toString().toUpperCase() === 'FAILED' || 
      responseStatus?.toString().toUpperCase() === 'FAILURE' ? 'failed' : 'pending';
    
    console.log(`[PaymentService] Normalized payment status for ${collectRequestId}: ${paymentStatus} (original: ${responseStatus})`);

    // Update the order status in the database
    let orderStatus;
    
    if (order.orderStatus) {
      // Update existing order status
      console.log(`[PaymentService] Updating existing order status: ${order.orderStatus.id}`);
      orderStatus = await prisma.orderStatus.update({
        where: { id: order.orderStatus.id },
        data: {
          status: paymentStatus,
          order_amount: parseFloat(response.data.amount?.toString() || '0'),
          transaction_amount: parseFloat(response.data.amount?.toString() || '0'),
          payment_details: JSON.stringify(response.data || {}),
          payment_time: new Date()
        }
      });
      console.log(`[PaymentService] Updated order status to: ${paymentStatus}`);
    } else {
      // Create new order status
      console.log(`[PaymentService] Creating new order status for order: ${order.id}`);
      orderStatus = await prisma.orderStatus.create({
        data: {
          collect_id: order.id,
          status: paymentStatus,
          order_amount: parseFloat(response.data.amount?.toString() || '0'),
          transaction_amount: parseFloat(response.data.amount?.toString() || '0'),
          payment_details: JSON.stringify(response.data || {}),
          payment_time: new Date()
        }
      });
      console.log(`[PaymentService] Created new order status with status: ${paymentStatus}`);
    }

    // If payment is successful, update the order record too
    if (paymentStatus === 'success') {
      console.log(`[PaymentService] Updating order record to mark as successful: ${order.id}`);
      await prisma.order.update({
        where: { id: order.id },
        data: {
          updatedAt: new Date()
        }
      });
      console.log(`[PaymentService] Updated order record for successful payment`);
    }

    console.log(`[PaymentService] Payment status update completed for ${collectRequestId}`);

    return {
      success: true,
      data: {
        ...response.data,
        orderStatus,
        status: responseStatus || paymentStatus,
        amount: response.data.amount,
        details: response.data.details || {},
        transaction_id: collectRequestId,
        order_amount: parseFloat(response.data.amount?.toString() || '0'),
        transaction_amount: parseFloat(response.data.amount?.toString() || '0'),
        collect_request_id: collectRequestId
      },
    };
  } catch (error: any) {
    console.error('[PaymentService] Check payment status error:', error.message);
    
    // Log detailed error information
    if (error.response) {
      console.error('[PaymentService] Error response status:', error.response.status);
      console.error('[PaymentService] Error response headers:', error.response.headers);
      console.error('[PaymentService] Error response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('[PaymentService] No response received. Request details:', error.request);
    }
    
    if (error.config) {
      console.error('[PaymentService] Request config:', {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers ? JSON.stringify(error.config.headers) : 'no headers',
        timeout: error.config.timeout
      });
    }
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Payment status check error',
    };
  }
};
