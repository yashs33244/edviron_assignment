/**
 * Payment Gateway API client
 * This file integrates with our own backend payment API
 */

// Types for the payment API
export interface PaymentRequest {
  studentId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    redirectUrl: string;
    orderId: string;
    amount: number;
  }
}

export interface Transaction {
  _id?: string;
  id?: string;
  custom_order_id?: string;
  customOrderId?: string;
  order_id?: string;
  studentId?: string;
  studentName?: string;
  amount?: number;
  status: 'pending' | 'success' | 'failed' | 'loading';
  createdAt?: string;
  created_at?: string;
  paymentMethod?: string;
  payment_mode?: string;
  transactionId?: string;
  transaction_id?: string;
  order_amount?: number;
  transaction_amount?: number;
  payment_details?: any;
  payment_time?: string;
  student_info?: any;
}

export interface TransactionFilters {
  status?: 'pending' | 'success' | 'failed';
  startDate?: string;
  endDate?: string;
  schoolId?: string;
  studentId?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}

// API URL from env or default
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// Helper function to get headers with auth token
const getHeaders = () => {
  // Get token from local storage
  const getAuthToken = (): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || '';
    }
    return '';
  };

  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `API request failed with status ${response.status}`
    );
  }
  return response.json();
}

/**
 * Create a payment request through our backend
 * @param paymentData Payment request data
 * @returns Payment response with redirect URL
 */
export async function createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
  const response = await fetch(`${API_URL}/api/payments/create-payment`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(paymentData)
  });

  return handleResponse<PaymentResponse>(response);
}

/**
 * Get all transactions with optional filters and pagination
 * @param page Page number for pagination
 * @param limit Items per page
 * @param filters Optional filters for transactions
 * @returns Paginated list of transactions
 */
export async function getTransactions(
  page = 1, 
  limit = 10, 
  filters: TransactionFilters = {}
): Promise<PaginatedResponse<Transaction>> {
  // Build query string from filters
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value.toString();
      }
      return acc;
    }, {} as Record<string, string>)
  });

  const response = await fetch(`${API_URL}/api/payments/transactions?${queryParams}`, {
    headers: getHeaders()
  });

  return handleResponse<PaginatedResponse<Transaction>>(response);
}

/**
 * Get transactions for a specific school
 * @param schoolId ID of the school
 * @param page Page number for pagination
 * @param limit Items per page
 * @param filters Optional filters for transactions
 * @returns Paginated list of transactions for the school
 */
export async function getSchoolTransactions(
  schoolId: string, 
  page = 1, 
  limit = 10, 
  filters: Omit<TransactionFilters, 'schoolId'> = {}
): Promise<PaginatedResponse<Transaction>> {
  return getTransactions(page, limit, { ...filters, schoolId });
}

/**
 * Get transaction status by order ID or collect request ID
 * @param orderId Order ID or Collect Request ID to check
 * @returns Transaction details with status
 */
export async function getTransactionStatus(orderId: string): Promise<{ 
  success: boolean; 
  data: Transaction | null; 
  message: string 
}> {
  try {
    console.log(`Checking transaction status for ID: ${orderId}`);
    const response = await fetch(`${API_URL}/api/payments/transaction-status/${orderId}`, {
      headers: getHeaders()
    });

    const result = await handleResponse<{ success: boolean; data: Transaction | null; message: string }>(response);
    console.log(`Transaction status result:`, result);
    return result;
  } catch (error: any) {
    console.error(`Error checking transaction status:`, error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to get transaction status'
    };
  }
}

/**
 * Check status of payment using collect request ID
 * @param collectRequestId ID from payment gateway
 * @returns Status of the payment
 */
export async function checkPaymentStatus(collectRequestId: string): Promise<{
  success: boolean;
  data: {
    status: string;
    amount: number;
    details?: Record<string, any>;
  } | null;
  message: string;
}> {
  const response = await fetch(`${API_URL}/api/payments/check-status/${collectRequestId}`, {
    headers: getHeaders()
  });

  return handleResponse<{
    success: boolean;
    data: {
      status: string;
      amount: number;
      details?: Record<string, any>;
    } | null;
    message: string;
  }>(response);
}