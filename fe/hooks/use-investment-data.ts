"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  getTransactions, 
  type TransactionFilters 
} from "@/api/payment-gateway";

/**
 * Hook to fetch investment summary data
 */
export function useInvestmentSummary() {
  return useQuery({
    queryKey: ['investmentSummary'],
    queryFn: async () => {
      // Get all transactions
      const transactionsData = await getTransactions(1, 100);
      
      // Calculate total amount
      const totalAmount = transactionsData.transactions.reduce(
        (sum, transaction) => sum + transaction.order_amount, 
        0
      );
      
      // Set a target that's 20% higher than current total
      const targetAmount = totalAmount * 1.2;
      
      // Calculate portfolio growth (could be based on time period comparison)
      // For now, using a fixed percentage as we don't have historical data
      const growthPercentage = 28;
      
      return {
        totalAmount,
        targetAmount,
        growthPercentage,
        // Mock credit data since we don't have credit information in the API
        creditAmount: 500000,
        creditRemaining: 999980
      };
    },
    refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
  });
}

/**
 * Hook to fetch monthly transaction data for charts
 */
export function useMonthlyTransactionData() {
  return useQuery({
    queryKey: ['monthlyTransactions'],
    queryFn: async () => {
      const transactionsData = await getTransactions(1, 500); // Get more transactions for better data
      
      // Group transactions by month
      const monthlyData = transactionsData.transactions.reduce<Record<string, number>>((acc, transaction) => {
        const date = new Date(transaction.created_at);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        acc[monthYear] = (acc[monthYear] || 0) + transaction.order_amount;
        return acc;
      }, {});
      
      // Convert to chart data format
      const chartData = Object.entries(monthlyData).map(([month, value]) => ({
        month,
        value
      })).sort((a, b) => {
        // Sort by month chronologically
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        const aDate = new Date(`${aMonth} 1, ${aYear}`);
        const bDate = new Date(`${bMonth} 1, ${bYear}`);
        return aDate.getTime() - bDate.getTime();
      });
      
      // Get last 6 months or pad with zeros if we don't have enough data
      const last6Months = chartData.slice(-6);
      if (last6Months.length < 6) {
        // Get current month and previous 5 months
        const months = [];
        const now = new Date();
        for (let i = 0; i < 6; i++) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.unshift(`${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`);
        }
        
        // Create a complete 6-month dataset with zeros for missing months
        const completeData = months.map(month => {
          const existingData = last6Months.find(data => data.month === month);
          return existingData || { month, value: 0 };
        });
        
        return completeData;
      }
      
      return last6Months;
    }
  });
} 