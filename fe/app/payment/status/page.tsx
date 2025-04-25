"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTransactionStatus } from "@/hooks/use-payment-gateway";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get orderId from URL
  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) {
      setOrderId(id);
    }
  }, [searchParams]);

  // Use the custom query hook
  const {
    data: transaction,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactionStatus(orderId);

  // Handle download receipt
  const handleDownloadReceipt = () => {
    toast({
      title: "Receipt downloaded",
      description: "Transaction receipt has been downloaded",
    });
  };

  // Get status badge variant based on transaction status
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
        <h2 className="text-3xl font-bold tracking-tight">
          Transaction Status
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <Link href="/payment/create">New Payment</Link>
          </Button>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            {orderId
              ? `Details for transaction: ${orderId}`
              : "No transaction ID provided"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Transaction ID
                  </p>
                  <Skeleton className="h-6 w-32 mt-1" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Order ID
                  </p>
                  <Skeleton className="h-6 w-48 mt-1" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Amount
                  </p>
                  <Skeleton className="h-6 w-24 mt-1" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Skeleton className="h-6 w-20 mt-1" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </p>
                  <Skeleton className="h-6 w-36 mt-1" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Date
                  </p>
                  <Skeleton className="h-6 w-36 mt-1" />
                </div>
              </div>
            </div>
          ) : isError ? (
            <div className="rounded-md bg-destructive/15 p-4">
              <div className="text-sm font-medium text-destructive">
                Error:{" "}
                {(error as Error)?.message ||
                  "Failed to fetch transaction status"}
              </div>
            </div>
          ) : !transaction ? (
            <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-semibold">No transaction found</h3>
                <p className="text-sm text-muted-foreground">
                  {orderId
                    ? "Unable to find transaction with the provided ID"
                    : "No transaction ID provided"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Transaction ID
                  </p>
                  <p className="text-lg font-semibold">
                    {transaction.collect_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Custom Order ID
                  </p>
                  <p className="text-lg font-semibold">
                    {transaction.custom_order_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    School ID
                  </p>
                  <p className="text-lg font-semibold">
                    {transaction.school_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Payment Gateway
                  </p>
                  <p className="text-lg font-semibold">{transaction.gateway}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Order Amount
                  </p>
                  <p className="text-lg font-semibold">
                    ₹{transaction.order_amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Transaction Amount
                  </p>
                  <p className="text-lg font-semibold">
                    ₹{transaction.transaction_amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant={getStatusBadgeVariant(transaction.status)}
                    className="mt-1 text-sm"
                  >
                    {transaction.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Payment Mode
                  </p>
                  <p className="text-lg font-semibold">
                    {transaction.payment_mode}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Bank Reference
                  </p>
                  <p className="text-lg font-semibold">
                    {transaction.bank_reference}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Payment Time
                  </p>
                  <p className="text-lg font-semibold">
                    {new Date(transaction.payment_time).toLocaleString()}
                  </p>
                </div>
              </div>

              {transaction.error_message && (
                <div className="rounded-md bg-destructive/15 p-4 mt-4">
                  <div className="text-sm font-medium text-destructive">
                    Error: {transaction.error_message}
                  </div>
                </div>
              )}

              {transaction.payment_message && (
                <div className="rounded-md bg-primary/15 p-4 mt-4">
                  <div className="text-sm font-medium text-primary">
                    Message: {transaction.payment_message}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        {transaction && transaction.status === "success" && (
          <CardFooter>
            <Button onClick={handleDownloadReceipt} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
