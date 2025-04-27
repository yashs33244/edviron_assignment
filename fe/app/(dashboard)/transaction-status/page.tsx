"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactionStatus } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function TransactionStatusPage() {
  const searchParams = useSearchParams();
  const [customOrderId, setCustomOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // Initialize from URL parameters if present
  useEffect(() => {
    const orderIdFromUrl = searchParams.get("order_id");
    if (orderIdFromUrl) {
      setCustomOrderId(orderIdFromUrl);
      setIsSearching(true);
    }
  }, [searchParams]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["transaction-status", customOrderId],
    queryFn: async () => {
      if (!customOrderId) return null;
      console.log("Fetching transaction status for:", customOrderId);
      const response = await getTransactionStatus(customOrderId);

      // If payment is in a pending state, continue auto-refreshing
      if (
        response.data &&
        (response.data.status === "pending" ||
          response.data.status === "processing")
      ) {
        if (isAutoRefresh && !refreshInterval) {
          const interval = window.setInterval(() => {
            console.log("Auto-refreshing payment status...");
            refetch();
          }, 5000); // Refresh every 5 seconds
          setRefreshInterval(interval);
        }
      } else if (refreshInterval) {
        // Clear interval if payment is complete or failed
        window.clearInterval(refreshInterval);
        setRefreshInterval(null);
      }

      return response.data;
    },
    enabled: !!customOrderId && isSearching,
    refetchInterval: isAutoRefresh ? 5000 : false,
    refetchOnWindowFocus: true,
  });

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        window.clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customOrderId) {
      setIsSearching(true);
      refetch();
    }
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
    if (!isAutoRefresh) {
      refetch();
    } else if (refreshInterval) {
      window.clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  };

  // Format payment details if they exist
  const getFormattedDetails = () => {
    if (!data?.payment_details) return "No additional details available";

    try {
      const details = JSON.parse(data.payment_details);
      return (
        <div className="text-sm space-y-1">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium capitalize">
                {key.replace(/_/g, " ")}:{" "}
              </span>
              <span className="text-muted-foreground">
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </span>
            </div>
          ))}
        </div>
      );
    } catch (e) {
      return data.payment_details;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Transaction Status
        </h1>
        <p className="text-muted-foreground">
          Check the status of a specific transaction
        </p>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Check Transaction Status</CardTitle>
          <CardDescription>
            Enter a custom order ID to check its status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="customOrderId" className="sr-only">
                  Custom Order ID
                </Label>
                <Input
                  id="customOrderId"
                  placeholder="Enter custom order ID"
                  value={customOrderId}
                  onChange={(e) => setCustomOrderId(e.target.value)}
                  className="bg-muted"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-shrink-0">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
                <Button
                  type="button"
                  variant={isAutoRefresh ? "secondary" : "outline"}
                  onClick={toggleAutoRefresh}
                  className="flex-shrink-0"
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${
                      isAutoRefresh ? "animate-spin" : ""
                    }`}
                  />
                  {isAutoRefresh ? "Auto-Refreshing" : "Auto-Refresh"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {isSearching && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>
              {isLoading
                ? "Loading transaction details..."
                : `Details for order ID: ${customOrderId}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                <p>Loading transaction details...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-24">
                <p className="text-destructive">Error loading transaction</p>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "An unknown error occurred"}
                </p>
              </div>
            ) : !data ? (
              <div className="flex flex-col items-center justify-center h-24">
                <p>No transaction found with this order ID.</p>
                <p className="text-sm text-muted-foreground">
                  Please check the order ID and try again
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Order Information
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Order ID:</span>
                        <span className="text-sm font-medium">
                          {data.custom_order_id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Transaction ID:</span>
                        <span className="text-sm font-medium">
                          {data.collect_id || data.collect_request_id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">School ID:</span>
                        <span className="text-sm font-medium">
                          {data.school_id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Gateway:</span>
                        <span className="text-sm font-medium">
                          {data.gateway}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Payment Information
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Order Amount:</span>
                        <span className="text-sm font-medium">
                          ₹{data.order_amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Transaction Amount:</span>
                        <span className="text-sm font-medium">
                          ₹{data.transaction_amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payment Mode:</span>
                        <span className="text-sm font-medium">
                          {data.payment_mode || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payment Time:</span>
                        <span className="text-sm font-medium">
                          {data.payment_time
                            ? new Date(data.payment_time).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-lg p-4 ${
                    data.status === "success"
                      ? "bg-green-100/10"
                      : data.status === "failed"
                      ? "bg-red-100/10"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Status</h3>
                      <p className="text-sm text-muted-foreground">
                        {data.payment_message || "N/A"}
                      </p>
                    </div>
                    <StatusBadge status={data.status} className="text-sm" />
                  </div>
                  {data.error_message && (
                    <div className="mt-2 text-sm text-destructive">
                      Error: {data.error_message}
                    </div>
                  )}
                </div>

                {data.payment_details && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Additional Details
                    </h3>
                    <div className="mt-1 max-h-40 overflow-y-auto p-2 bg-muted/50 rounded-lg">
                      {getFormattedDetails()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setCustomOrderId("");
                setIsSearching(false);
                if (refreshInterval) {
                  window.clearInterval(refreshInterval);
                  setRefreshInterval(null);
                }
                setIsAutoRefresh(false);
              }}
            >
              New Search
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
