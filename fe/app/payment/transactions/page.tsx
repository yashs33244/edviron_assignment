"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactions } from "@/hooks/use-payment-gateway";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { TransactionFilters } from "@/api/payment-gateway";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [searchInput, setSearchInput] = useState("");

  // Use the custom query hook
  const { data, isLoading, isError, error, isFetching } = useTransactions(
    page,
    pageSize,
    filters
  );

  // Handle filter changes
  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle search submission
  const handleSearch = () => {
    handleFilterChange("search", searchInput);
  };

  // Handle status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "success":
        return "default";
      case "pending":
        return "outline";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <Button asChild>
          <Link href="/payment/create">New Payment</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Transactions</CardTitle>
          <CardDescription>
            Use the filters below to find specific transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            <div className="w-full md:w-[180px]">
              <Select
                onValueChange={(value) => handleFilterChange("status", value)}
                value={filters.status || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-[180px]">
              <Select
                onValueChange={(value) => handleFilterChange("date", value)}
                value={filters.date || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Dates</SelectItem>
                  <SelectItem value={new Date().toISOString().split("T")[0]}>
                    Today
                  </SelectItem>
                  <SelectItem
                    value={
                      new Date(Date.now() - 86400000)
                        .toISOString()
                        .split("T")[0]
                    }
                  >
                    Yesterday
                  </SelectItem>
                  <SelectItem
                    value={
                      new Date(Date.now() - 7 * 86400000)
                        .toISOString()
                        .split("T")[0]
                    }
                  >
                    Last Week
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSearch} className="w-full md:w-auto">
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading transactions..."
              : `Showing ${data?.transactions.length || 0} of ${
                  data?.pagination.total || 0
                } transactions`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="rounded-md bg-destructive/15 p-4">
              <div className="text-sm font-medium text-destructive">
                Error:{" "}
                {(error as Error)?.message || "Failed to fetch transactions"}
              </div>
            </div>
          ) : data?.transactions.length === 0 ? (
            <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-semibold">No transactions found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or create a new payment
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.transactions.map((transaction) => (
                      <TableRow key={transaction.collect_id}>
                        <TableCell className="font-medium">
                          {transaction.collect_id}
                        </TableCell>
                        <TableCell>{transaction.custom_order_id}</TableCell>
                        <TableCell>
                          {new Date(
                            transaction.created_at
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {transaction.student_info.name}
                          <div className="text-xs text-muted-foreground">
                            {transaction.student_info.id}
                          </div>
                        </TableCell>
                        <TableCell>₹{transaction.order_amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(transaction.status)}
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/payment/status?orderId=${transaction.custom_order_id}`}
                            >
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className={
                          page <= 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>

                    {[...Array(Math.min(5, data?.pagination.pages || 1))].map(
                      (_, i) => {
                        const pageNum = page <= 3 ? i + 1 : page - 2 + i;

                        if (pageNum > (data?.pagination.pages || 1))
                          return null;

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={() => setPage(pageNum)}
                              isActive={page === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={() => {
                          if (
                            !isFetching &&
                            page < (data?.pagination.pages || 1)
                          ) {
                            setPage((p) => p + 1);
                          }
                        }}
                        className={
                          isFetching || page >= (data?.pagination.pages || 1)
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
