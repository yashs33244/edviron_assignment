"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  getTransactions, 
  getSchoolTransactions,
  type TransactionFilters 
} from "@/api/payment-gateway";

// Interface for dashboard summary data
export interface DashboardSummary {
  totalTransactions: number;
  totalAmount: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
}

/**
 * Hook to fetch and calculate dashboard summary data
 */
export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async (): Promise<DashboardSummary> => {
      // Get all transactions (we'll set a higher limit to get as much data as possible)
      const transactionsData = await getTransactions(1, 100);
      
      // Calculate summary metrics
      let totalAmount = 0;
      let successfulTransactions = 0;
      let pendingTransactions = 0;
      let failedTransactions = 0;
      
      transactionsData.transactions.forEach(transaction => {
        // Sum up total amount
        totalAmount += transaction.order_amount;
        
        // Count transactions by status
        if (transaction.status === 'success') {
          successfulTransactions++;
        } else if (transaction.status === 'pending') {
          pendingTransactions++;
        } else if (transaction.status === 'failed') {
          failedTransactions++;
        }
      });
      
      return {
        totalTransactions: transactionsData.transactions.length,
        totalAmount,
        successfulTransactions,
        pendingTransactions,
        failedTransactions
      };
    },
    // Refetch data every 5 minutes
    refetchInterval: 5 * 60 * 1000
  });
}

/**
 * Hook to fetch recent successful transactions for the dashboard
 */
export function useRecentSuccessfulTransactions(limit = 5) {
  return useQuery({
    queryKey: ['recentSuccessfulTransactions', limit],
    queryFn: async () => {
      const filters: TransactionFilters = {
        status: 'success',
      };
      
      const transactionsData = await getTransactions(1, limit, filters);
      
      // Sort by date (newest first)
      const sortedTransactions = [...transactionsData.transactions].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      return sortedTransactions;
    }
  });
}

/**
 * Hook to fetch transaction analytics for dashboard charts
 */
export function useTransactionAnalytics() {
  return useQuery({
    queryKey: ['transactionAnalytics'],
    queryFn: async () => {
      const allTransactions = await getTransactions(1, 100);
      
      // Group by date to show transaction volume over time
      const transactionsByDate = allTransactions.transactions.reduce<Record<string, number>>((acc, transaction) => {
        const date = transaction.created_at.split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      
      // Convert to array format for charts
      const chartData = Object.entries(transactionsByDate).map(([date, count]) => ({
        date,
        count
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Calculate success rate
      const successRate = allTransactions.transactions.length > 0 
        ? (allTransactions.transactions.filter(t => t.status === 'success').length / allTransactions.transactions.length) * 100 
        : 0;
      
      return {
        chartData,
        successRate: Math.round(successRate * 10) / 10, // Round to 1 decimal place
      };
    }
  });
}

/**
 * Hook to fetch school-specific transaction summary
 */
export function useSchoolTransactionSummary(schoolId: string) {
  return useQuery({
    queryKey: ['schoolTransactionSummary', schoolId],
    queryFn: async () => {
      if (!schoolId) {
        throw new Error('School ID is required');
      }
      
      const schoolTransactions = await getSchoolTransactions(schoolId, 1, 100);
      
      // Calculate total amount for this school
      const totalAmount = schoolTransactions.transactions.reduce(
        (sum, transaction) => sum + transaction.order_amount, 
        0
      );
      
      return {
        totalTransactions: schoolTransactions.transactions.length,
        totalAmount,
        recentTransactions: schoolTransactions.transactions.slice(0, 5)
      };
    },
    enabled: !!schoolId
  });
} 