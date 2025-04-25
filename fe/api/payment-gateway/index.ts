/**
 * Payment Gateway API client
 * Implements the API endpoints documented in API_DOCUMENTATION.md
 */

// Types
export interface PaymentRequest {
  studentName: string;
  studentId: string;
  studentEmail: string;
  amount: number;
}

export interface PaymentResponse {
  redirectUrl: string;
  orderId: string;
}

export interface Transaction {
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: "success" | "pending" | "failed";
  custom_order_id: string;
  student_info: {
    name: string;
    id: string;
    email: string;
  };
  created_at: string;
  payment_time: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface TransactionStatus {
  collect_id: string;
  custom_order_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: "success" | "pending" | "failed";
  payment_mode: string;
  payment_details: string;
  bank_reference: string;
  payment_message: string;
  error_message: string | null;
  payment_time: string;
  created_at: string;
}

export interface TransactionFilters {
  schoolId?: string;
  status?: string;
  search?: string;
  date?: string;
}

// Base API URL from environment or default to local development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

// Create payment
export async function createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
  const response = await fetch(`${API_BASE_URL}/api/payments/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(paymentData),
  });

  return handleResponse<{ success: boolean; message: string; data: PaymentResponse }>(response)
    .then(res => res.data);
}

// Get all transactions
export async function getTransactions(
  page = 1,
  limit = 10,
  filters: TransactionFilters = {}
): Promise<TransactionResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters.schoolId) queryParams.set('school_id', filters.schoolId);
  if (filters.status) queryParams.set('status', filters.status);
  if (filters.search) queryParams.set('search', filters.search);
  if (filters.date) queryParams.set('date', filters.date);

  const response = await fetch(`${API_BASE_URL}/api/payments/transactions?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    }
  });

  return handleResponse<{ success: boolean; data: TransactionResponse }>(response)
    .then(res => res.data);
}

// Get transactions by school
export async function getSchoolTransactions(
  schoolId: string,
  page = 1,
  limit = 10,
  filters: Omit<TransactionFilters, 'schoolId'> = {}
): Promise<TransactionResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters.status) queryParams.set('status', filters.status);
  if (filters.search) queryParams.set('search', filters.search);
  if (filters.date) queryParams.set('date', filters.date);

  const response = await fetch(`${API_BASE_URL}/api/payments/transactions/school/${schoolId}?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    }
  });

  return handleResponse<{ success: boolean; data: TransactionResponse }>(response)
    .then(res => res.data);
}

// Get transaction status
export async function getTransactionStatus(orderId: string): Promise<TransactionStatus> {
  const response = await fetch(`${API_BASE_URL}/api/payments/status/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    }
  });

  return handleResponse<{ success: boolean; data: TransactionStatus }>(response)
    .then(res => res.data);
}

// Helper function to get auth token from localStorage
function getAuthToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || '';
  }
  return '';
}