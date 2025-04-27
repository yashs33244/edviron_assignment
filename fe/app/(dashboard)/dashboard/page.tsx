"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { CreditCard, TrendingUp, AlertTriangle } from "lucide-react";
import { PaymentForm } from "@/components/payment-form";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["transactions-summary"],
    queryFn: async () => {
      const response = await getTransactions(1, 100);
      return response.data;
    },
  });

  const transactions = data?.transactions || [];

  // Calculate summary statistics
  const totalTransactions = transactions.length;
  const successfulTransactions = transactions.filter(
    (t: any) => t.status.toLowerCase() === "success"
  ).length;
  const failedTransactions = transactions.filter(
    (t: any) => t.status.toLowerCase() === "failed"
  ).length;
  const pendingTransactions = transactions.filter(
    (t: any) => t.status.toLowerCase() === "pending"
  ).length;

  const totalAmount = transactions.reduce(
    (sum: number, t: any) => sum + (t.order_amount || 0),
    0
  );
  const successRate = totalTransactions
    ? (successfulTransactions / totalTransactions) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your payment transactions
          </p>
        </div>
        <PaymentForm />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : totalTransactions}
            </div>
            <p className="text-xs text-muted-foreground">
              {successfulTransactions} successful, {pendingTransactions} pending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : `₹${totalAmount.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground">
              Success rate: {successRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Transactions
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : failedTransactions}
            </div>
            <p className="text-xs text-muted-foreground">
              {failedTransactions > 0
                ? "Action required"
                : "No failed transactions"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading recent transactions...</p>
            ) : (
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction: any) => (
                  <div
                    key={transaction.collect_id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.student_info?.name || "Unknown Student"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.custom_order_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        ₹{transaction.order_amount}
                      </div>
                      <StatusBadge status={transaction.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
            <CardDescription>Overview of transaction statuses</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-primary">
                  {successRate.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <div className="text-sm">
                    Success ({successfulTransactions})
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="text-sm">Pending ({pendingTransactions})</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive"></div>
                  <div className="text-sm">Failed ({failedTransactions})</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
