"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  getTransactions,
  getSchoolTransactions,
  getTransactionStatus,
  type PaymentRequest,
  type TransactionFilters,
} from "@/api/payment-gateway";

// Hook for creating a payment
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentData: PaymentRequest) => createPayment(paymentData),
    onSuccess: () => {
      // Invalidate transactions queries to refetch after creating a payment
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

// Hook for fetching all transactions with pagination and filtering
export function useTransactions(
  page = 1,
  limit = 10,
  filters: TransactionFilters = {}
) {
  return useQuery({
    queryKey: ["transactions", page, limit, filters],
    queryFn: () => getTransactions(page, limit, filters),
    keepPreviousData: true,
  });
}

// Hook for fetching school-specific transactions with pagination and filtering
export function useSchoolTransactions(
  schoolId: string,
  page = 1,
  limit = 10,
  filters: Omit<TransactionFilters, "schoolId"> = {}
) {
  return useQuery({
    queryKey: ["school-transactions", schoolId, page, limit, filters],
    queryFn: () => getSchoolTransactions(schoolId, page, limit, filters),
    keepPreviousData: true,
    enabled: !!schoolId,
  });
}

// Hook for getting transaction status
export function useTransactionStatus(orderId: string) {
  return useQuery({
    queryKey: ["transaction-status", orderId],
    queryFn: () => getTransactionStatus(orderId),
    enabled: !!orderId,
    // Refetch more frequently for pending transactions
    refetchInterval: (data) => {
      return data?.status === "pending" ? 5000 : false;
    },
  });
}
