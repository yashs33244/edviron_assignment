"use client";

import type React from "react";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserTransactions } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, RefreshCw } from "lucide-react";

export default function UserTransactionsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    search: "",
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-transactions", page, limit, filters],
    queryFn: async () => {
      const apiFilters: any = { ...filters };
      if (filters.search) {
        apiFilters.search = filters.search;
      }
      const response = await getUserTransactions(page, limit, apiFilters);
      return response.data;
    },
  });

  const transactions = data?.transactions || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      setFilters({
        ...filters,
        startDate: format(range.from, "yyyy-MM-dd"),
        endDate: range.to ? format(range.to, "yyyy-MM-dd") : "",
      });
    } else {
      setFilters({
        ...filters,
        startDate: "",
        endDate: "",
      });
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
      search: "",
    });
    setDateRange(undefined);
    setPage(1);
  };

  const columns = [
    {
      accessorKey: "collect_id",
      header: "Transaction ID",
      cell: ({ row }: any) => {
        const id = row.getValue("collect_id");
        return <div className="font-medium">{id.substring(0, 8)}...</div>;
      },
    },
    {
      accessorKey: "custom_order_id",
      header: "Order ID",
    },
    {
      accessorKey: "school_id",
      header: "School ID",
      cell: ({ row }: any) => {
        const id = row.getValue("school_id");
        return <div>{id.substring(0, 8)}...</div>;
      },
    },
    {
      accessorKey: "gateway",
      header: "Gateway",
    },
    {
      accessorKey: "order_amount",
      header: "Amount",
      cell: ({ row }: any) => {
        const amount = Number.parseFloat(row.getValue("order_amount"));
        return <div className="text-right">₹{amount.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        return <StatusBadge status={row.getValue("status")} />;
      },
    },
    {
      accessorKey: "payment_time",
      header: "Date",
      cell: ({ row }: any) => {
        const date = row.getValue("payment_time");
        if (!date) return <div>-</div>;
        return <div>{new Date(date).toLocaleDateString()}</div>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Transactions</h1>
        <p className="text-muted-foreground">
          View and manage your payment transactions
        </p>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter your transactions by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger id="status" className="bg-muted text-white">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    placeholder="Order ID, Student name..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="bg-muted text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit">Apply Filters</Button>
              <Button type="button" variant="outline" onClick={resetFilters}>
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                className="ml-auto"
                onClick={() => refetch()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button type="button" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>My Transactions</CardTitle>
          <CardDescription>
            Showing {transactions.length} of {pagination.total} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24">
              <p>No transactions found.</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or make a payment
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={transactions}
              pagination={{
                pageCount: pagination.pages,
                page,
                onPageChange: setPage,
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
