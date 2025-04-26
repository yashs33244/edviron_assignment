"use client";

import { 
  useMutation, 
  useQuery, 
  useQueryClient, 
  UseMutationResult, 
  UseQueryResult 
} from "@tanstack/react-query";

import { 
  createPayment, 
  getTransactions, 
  getSchoolTransactions, 
  getTransactionStatus,
  type PaymentRequest,
  type PaymentResponse,
  type Transaction,
  type TransactionFilters
} from "@/api/payment-gateway";

/**
 * Hook to create a payment
 */
export function useCreatePayment(): UseMutationResult<PaymentResponse, Error, PaymentRequest> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentData: PaymentRequest) => createPayment(paymentData),
    onSuccess: () => {
      // Invalidate transactions queries to refetch with the new payment
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

/**
 * Hook to fetch transactions with pagination and filters
 */
export function useTransactions(
  page = 1, 
  limit = 10, 
  filters: TransactionFilters = {}
): UseQueryResult<any> {
  return useQuery({
    queryKey: ["transactions", page, limit, filters],
    queryFn: () => getTransactions(page, limit, filters),
    placeholderData: keepPreviousDataUpdater,
  });
}

/**
 * Hook to fetch transactions for a specific school
 */
export function useSchoolTransactions(
  schoolId: string,
  page = 1,
  limit = 10,
  filters: Omit<TransactionFilters, 'schoolId'> = {}
): UseQueryResult<any> {
  return useQuery({
    queryKey: ['schoolTransactions', schoolId, page, limit, filters],
    queryFn: () => getSchoolTransactions(schoolId, page, limit, filters),
    placeholderData: keepPreviousDataUpdater,
    enabled: !!schoolId, // Only fetch if schoolId is provided
  });
}

/**
 * Hook to fetch transaction status for a specific order ID
 */
export function useTransactionStatus(orderId: string | null): UseQueryResult<any> {
  return useQuery({
    queryKey: ['transactionStatus', orderId],
    queryFn: () => {
      if (!orderId) throw new Error('Order ID is required');
      return getTransactionStatus(orderId);
    },
    enabled: !!orderId, // Only fetch if orderId is provided
  });
}

// Helper function to maintain previous data while fetching new data
const keepPreviousDataUpdater = (previousData: any) => previousData; 