import axios from "axios"
// Import jsonwebtoken conditionally based on environment
const jwt = typeof window === 'undefined' 
  ? require('jsonwebtoken')  // Server-side only
  : null  // Client-side will not use this

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://edbe.itsyash.space"
const PG_API_URL = process.env.NEXT_PUBLIC_PG_API_URL || "https://dev-vanilla.edviron.com/erp"
const PG_KEY = process.env.NEXT_PUBLIC_PG_KEY || "edvtest01"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add JWT token to requests if it exists
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Authentication APIs
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/login", { email, password })
    return response.data
  } catch (error) {
    throw error
  }
}

export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/register", { name, email, password })
    return response.data
  } catch (error) {
    throw error
  }
}

export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await api.post("/api/auth/verify-otp", { email, otp })
    return response.data
  } catch (error) {
    throw error
  }
}

export const resendOTP = async (email: string) => {
  try {
    const response = await api.post("/api/auth/resend-otp", { email })
    return response.data
  } catch (error) {
    throw error
  }
}

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/api/auth/forgot-password", { email })
    return response.data
  } catch (error) {
    throw error
  }
}

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await api.post("/api/auth/reset-password", { token, password })
    return response.data
  } catch (error) {
    throw error
  }
}

// User API
export const getUserProfile = async () => {
  try {
    const response = await api.get("/api/auth/profile")
    return response.data
  } catch (error) {
    throw error
  }
}

// Transactions API
export const getTransactions = async (page = 1, limit = 10, filters: any = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  })
  const response = await api.get(`/api/payments/user-transactions?${params}`)
  return response.data
}

export const getUserTransactions = async (page = 1, limit = 10, filters: any = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  })
  const response = await api.get(`/api/payments/user-transactions?${params}`)
  return response.data
}

export const getTransactionsBySchool = async (schoolId: string, page = 1, limit = 10, filters: any = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  })
  const response = await api.get(`/api/payments/transactions/school/${schoolId}?${params}`)
  return response.data
}

export const getTransactionStatus = async (customOrderId: string) => {
  try {
    console.log(`[API] Getting transaction status for custom_order_id: ${customOrderId}`)
    const response = await api.get(`/api/payments/transaction-status/${customOrderId}`)
    console.log(`[API] Transaction status response:`, JSON.stringify(response.data, null, 2))
    return response.data
  } catch (error: any) {
    console.error("[API] Transaction status error:", error)
    throw new Error(error.response?.data?.message || error.message || 'Failed to get transaction status')
  }
}

export const checkTransactionStatus = async (collectRequestId: string) => {
  try {
    console.log(`[API] Checking transaction status for collect_request_id: ${collectRequestId}`);
    
    // Create URL with proper parameters
    const url = `/api/payments/check-status/${collectRequestId}`;
    console.log(`[API] Making request to: ${url}`);
    
    // First try to get status from our backend
    const startTime = Date.now();
    const response = await api.get(url);
    const endTime = Date.now();
    
    console.log(`[API] Transaction status response received in ${endTime - startTime}ms:`, 
      JSON.stringify(response.data, null, 2));
    
    // If we have a status, check it
    if (response.data.success && response.data.data) {
      const status = response.data.data.status?.toUpperCase();
      const dataStatus = response.data.data.status;
      console.log(`[API] Payment status extracted from response: ${status} (original: ${dataStatus})`);
      
      // Return the response regardless of status
      return response.data;
    } else {
      console.log(`[API] No success or data in response: ${JSON.stringify(response.data)}`);
      return response.data;
    }
  } catch (error: any) {
    console.error("[API] Transaction status check error:", error);
    
    // Detailed error logging
    if (error.response) {
      console.error("[API] Error response data:", error.response.data);
      console.error("[API] Error response status:", error.response.status);
      console.error("[API] Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("[API] No response received, request was:", error.request);
    } else {
      console.error("[API] Error message:", error.message);
    }
    console.error("[API] Error config:", error.config);
    
    let errorMessage = 'Failed to check transaction status';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
}

// Function to poll payment status at regular intervals
export const pollPaymentStatus = async (
  collectRequestId: string, 
  onSuccess: (data: any) => void, 
  onFailure: (message: string) => void,
  onPending: (data: any) => void,
  maxRetries = 15,
  retryDelay = 3000
) => {
  let retryCount = 0;
  
  const checkStatus = async () => {
    if (retryCount >= maxRetries) {
      onFailure("Payment verification timed out. Please contact support.");
      return;
    }
    
    try {
      console.log(`[API] Polling payment status (attempt ${retryCount + 1}/${maxRetries})`)
      const response = await checkTransactionStatus(collectRequestId);
      
      if (response.success && response.data) {
        const paymentStatus = response.data.status?.toUpperCase();
        
        if (paymentStatus === "SUCCESS" || response.data.status === "success") {
          console.log(`[API] Payment successful:`, response.data);
          await notifyWebhook(response.data);
          onSuccess(response.data);
          return;
        } else if (paymentStatus === "FAILED" || paymentStatus === "FAILURE" || response.data.status === "failed") {
          console.log(`[API] Payment failed:`, response.data);
          onFailure("Payment failed");
          return;
        } else {
          // Payment is still pending, retry
          console.log(`[API] Payment pending:`, response.data);
          onPending(response.data);
          retryCount++;
          setTimeout(checkStatus, retryDelay);
        }
      } else {
        // Error checking payment status
        console.log(`[API] Error checking payment status:`, response);
        retryCount++;
        setTimeout(checkStatus, retryDelay);
      }
    } catch (error: any) {
      console.error(`[API] Error in polling:`, error);
      retryCount++;
      setTimeout(checkStatus, retryDelay);
    }
  };
  
  // Start checking
  checkStatus();
};

// Function to notify webhook
export const notifyWebhook = async (paymentData: any) => {
  try {
    console.log(`[API] Notifying webhook about payment:`, paymentData);
    
    const webhookData = {
      status: paymentData.status || "SUCCESS",
      amount: paymentData.amount || paymentData.order_amount,
      transaction_amount: paymentData.transaction_amount || paymentData.amount || paymentData.order_amount,
      collect_request_id: paymentData.collect_request_id,
      custom_order_id: paymentData.custom_order_id,
      details: paymentData.details || {}
    };
    
    const response = await api.post('/api/payments/webhook', webhookData);
    console.log(`[API] Webhook notification response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`[API] Webhook notification error:`, error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to notify webhook');
  }
};

// Create payment - updated version that works in browser
export const createPayment = async (paymentData: {
  school_id: string
  amount: string
  callback_url: string
  student_info: {
    name: string
    id: string
    email: string
  }
  custom_order_id?: string
}) => {
  try {
    console.log('[API] Creating payment with data:', JSON.stringify(paymentData, null, 2))
    
    // Let the server handle JWT signing instead of doing it client-side
    const requestData = {
      school_id: paymentData.school_id,
      amount: paymentData.amount,
      callback_url: paymentData.callback_url,
      student_info: paymentData.student_info,
      // Include custom_order_id if provided
      custom_order_id: paymentData.custom_order_id,
      // Send PG_KEY to server so it can use it for signing
      pg_key: PG_KEY
    }
    
    const response = await api.post("/api/payments/create-payment", requestData)
    console.log('[API] Payment response:', JSON.stringify(response.data, null, 2))
    
    if (response.data?.success && response.data.data?.collect_request_url) {
      return {
        success: true,
        data: {
          // Make sure we're returning the fields that the frontend expects
          collect_request_url: response.data.data.collect_request_url,
          collect_request_id: response.data.data.collect_request_id,
          custom_order_id: response.data.data.custom_order_id,
          orderId: response.data.data.orderId,
          sign: response.data.data.sign
        }
      }
    } else if (response.data?.message) {
      throw new Error(response.data.message)
    } else {
      throw new Error('Failed to create payment request: No valid response')
    }
  } catch (error: any) {
    console.error("[API] Payment request error:", error)
    // Extract error message from Axios error if available
    let errorMessage = 'Payment creation failed'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    throw new Error(errorMessage)
  }
}

export const verifyResetToken = async (token: string) => {
  const response = await api.get(`/api/auth/verify-reset-token/${token}`);
  return response.data;
};

export default api