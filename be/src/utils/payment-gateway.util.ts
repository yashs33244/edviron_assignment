import axios from 'axios';
import crypto from 'crypto';
import { env } from '../config/env';
import logger from './logger';

// Base URL for the payment gateway API
const PAYMENT_API_BASE_URL = 'https://api.edvpayments.com';

/**
 * Interface for payment creation request
 */
export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  studentName: string;
  studentId: string;
  studentEmail: string;
  customOrderId: string;
}

/**
 * Interface for payment verification request
 */
export interface VerifyPaymentRequest {
  orderId: string;
}

/**
 * Sign payload using HMAC-SHA256
 * @param payload - The data to sign
 * @returns The signature
 */
export const signPayload = (payload: Record<string, any>): string => {
  try {
    return crypto
      .createHmac('sha256', env.JWT_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');
  } catch (error) {
    logger.error('Error signing payload:', error);
    throw new Error('Failed to sign payload');
  }
};

/**
 * Create a payment request
 * @param params - Payment request parameters
 * @returns The payment gateway response with redirect URL
 */
export const createPayment = async (params: CreatePaymentRequest) => {
  try {
    // Prepare the payload
    const payload = {
      order_id: params.orderId,
      amount: params.amount,
      student_name: params.studentName,
      student_id: params.studentId,
      student_email: params.studentEmail,
      school_id: env.SCHOOL_ID,
      trustee_id: env.PG_KEY,
      custom_order_id: params.customOrderId,
    };

    // Sign the payload
    const signature = signPayload(payload);

    // Call the payment gateway API
    const response = await axios.post(
      `${PAYMENT_API_BASE_URL}/create-collect-request`,
      {
        ...payload,
        signature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.PG_API_KEY}`,
        },
      }
    );

    logger.info(`Payment request created: ${params.orderId}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error creating payment: ${error.message}`);
    if (error.response) {
      logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`Payment creation failed: ${error.message}`);
  }
};

/**
 * Verify a payment
 * @param params - Payment verification parameters
 * @returns The payment status
 */
export const verifyPayment = async (params: VerifyPaymentRequest) => {
  try {
    // Prepare the payload
    const payload = {
      order_id: params.orderId,
      trustee_id: env.PG_KEY,
    };

    // Sign the payload
    const signature = signPayload(payload);

    // Call the payment gateway API
    const response = await axios.post(
      `${PAYMENT_API_BASE_URL}/verify-payment`,
      {
        ...payload,
        signature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.PG_API_KEY}`,
        },
      }
    );

    logger.info(`Payment verified: ${params.orderId}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error verifying payment: ${error.message}`);
    if (error.response) {
      logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};

/**
 * Validate webhook signature
 * @param payload - The webhook payload
 * @param signature - The signature from the webhook header
 * @returns Whether the signature is valid
 */
export const validateWebhookSignature = (
  payload: Record<string, any>,
  signature: string
): boolean => {
  try {
    const computedSignature = signPayload(payload);
    return crypto.timingSafeEqual(
      Buffer.from(computedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch (error) {
    logger.error('Error validating webhook signature:', error);
    return false;
  }
};
