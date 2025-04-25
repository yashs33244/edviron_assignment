"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchTransactions, type TransactionFilters } from "@/api/transactions"

export function useTransactions(page = 1, pageSize = 10, filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ["transactions", page, pageSize, filters],
    queryFn: () => fetchTransactions(page, pageSize, filters),
    keepPreviousData: true,
  })
}
