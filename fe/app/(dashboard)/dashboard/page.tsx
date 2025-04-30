"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions, getUserTransactions } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { CreditCard, TrendingUp, AlertTriangle, Plus } from "lucide-react";
import { PaymentForm } from "@/components/payment-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const { data: allTransactionsData, isLoading: isLoadingAll } = useQuery({
    queryKey: ["transactions-summary"],
    queryFn: async () => {
      const response = await getTransactions(1, 100);
      return response.data;
    },
  });

  const { data: userTransactionsData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user-transactions-summary"],
    queryFn: async () => {
      const response = await getUserTransactions(1, 5);
      return response.data;
    },
  });

  const allTransactions = allTransactionsData?.transactions || [];
  const userTransactions = userTransactionsData?.transactions || [];

  // Calculate summary statistics
  const totalTransactions = allTransactions.length;
  const successfulTransactions = allTransactions.filter(
    (t: any) => t.status.toLowerCase() === "success"
  ).length;
  const failedTransactions = allTransactions.filter(
    (t: any) => t.status.toLowerCase() === "failed"
  ).length;
  const pendingTransactions = allTransactions.filter(
    (t: any) => t.status.toLowerCase() === "pending"
  ).length;

  const totalAmount = allTransactions.reduce(
    (sum: number, t: any) => sum + (t.order_amount || 0),
    0
  );
  const successRate = totalTransactions
    ? (successfulTransactions / totalTransactions) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Dialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary text-black hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Create Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Payment</DialogTitle>
              <DialogDescription>
                Enter payment details to generate a new payment link
              </DialogDescription>
            </DialogHeader>
            <PaymentForm onSuccess={() => setIsPaymentDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card border-2 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingAll ? "Loading..." : totalTransactions}
            </div>
            <p className="text-xs text-muted-foreground">
              {successfulTransactions} successful, {pendingTransactions} pending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground border-2 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingAll ? "Loading..." : `₹${totalAmount.toLocaleString()}`}
            </div>
            <p className="text-xs text-primary-foreground/80">
              Success rate: {successRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white text-black border-2 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Transactions
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingAll ? "Loading..." : failedTransactions}
            </div>
            <p className="text-xs text-black/70">
              {failedTransactions > 0
                ? "Action required"
                : "No failed transactions"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-2 rounded-2xl">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Your Recent Transactions</CardTitle>
              <CardDescription>
                Your latest payment transactions
              </CardDescription>
            </div>
            <Link href="/user-transactions">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoadingUser ? (
              <p>Loading your transactions...</p>
            ) : userTransactions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No transactions found</p>
                <p className="text-sm">Make a payment to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userTransactions.map((transaction: any) => (
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
      </div>
    </div>
  );
}
