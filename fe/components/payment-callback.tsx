"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  checkTransactionStatus,
  pollPaymentStatus,
  notifyWebhook,
} from "@/lib/api";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Loader2 } from "lucide-react";

// Max number of retries for checking payment status
const MAX_RETRIES = 15;
// Delay between retries in milliseconds (3 seconds)
const RETRY_DELAY = 3000;

export default function PaymentCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Use a ref to track if component is mounted
  const isMounted = useRef(true);

  // Polling interval ID for cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add a log message to the logs array
  const addLog = (message: string) => {
    console.log(`[PaymentCallback] ${message}`);
    setLogs((prev) => [...prev, `${new Date().toISOString()} - ${message}`]);
  };

  // Notify webhook about payment status
  const notifyWebhook = async (paymentData: any) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://edbe.itsyash.space";
      addLog(
        `Notifying webhook about successful payment: ${JSON.stringify(
          paymentData
        )}`
      );

      // Send webhook notification
      const response = await axios.post(`${API_URL}/api/payments/webhook`, {
        status: paymentData.status || "SUCCESS",
        amount: paymentData.amount || paymentData.order_amount,
        transaction_amount:
          paymentData.transaction_amount ||
          paymentData.amount ||
          paymentData.order_amount,
        collect_request_id: paymentData.collect_request_id,
        custom_order_id: paymentData.custom_order_id,
        details: paymentData.details || {},
      });

      addLog(`Webhook notification response: ${JSON.stringify(response.data)}`);
      return true;
    } catch (error: any) {
      addLog(`Error notifying webhook: ${error.message}`);
      console.error("Webhook notification error:", error);
      return false;
    }
  };

  useEffect(() => {
    // Set isMounted to true when component mounts
    isMounted.current = true;
    addLog("Component mounted");

    // Cleanup function to clear polling and mark component as unmounted
    return () => {
      addLog("Component unmounting");
      isMounted.current = false;
      if (pollingIntervalRef.current) {
        clearTimeout(pollingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      // Extract parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      let collectRequestId = urlParams.get("collect_request_id");
      const customOrderId = urlParams.get("custom_order_id");
      const amount = urlParams.get("amount");
      const sessionId = urlParams.get("session_id");
      const edvironId = urlParams.get("EdvironCollectRequestId");
      const paymentStatus = urlParams.get("status");

      // Log all params for debugging
      addLog(
        `URL params: ${JSON.stringify({
          collectRequestId,
          customOrderId,
          amount,
          sessionId,
          edvironId,
          paymentStatus,
        })}`
      );

      // Check if collect_request_id is valid or literal string
      if (!collectRequestId || collectRequestId === "{collect_request_id}") {
        addLog(
          "Invalid collect_request_id, checking for EdvironCollectRequestId"
        );
        // Use EdvironCollectRequestId instead if available
        if (edvironId) {
          addLog(
            `Using EdvironCollectRequestId: ${edvironId} as collect_request_id`
          );
          collectRequestId = edvironId;
        } else {
          addLog("No valid transaction ID found in URL parameters");
          setError(
            "Payment verification failed: Missing transaction ID. Please contact support with your payment details."
          );
          setStatus("failed");
          return;
        }
      }

      // If we have a payment status in the URL and it's "SUCCESS"
      if (paymentStatus === "SUCCESS") {
        addLog(
          `Success status detected in URL, processing as successful payment`
        );
        setPaymentDetails({
          collect_request_id: collectRequestId,
          custom_order_id: customOrderId,
          status: "success",
          amount: amount,
        });
        setStatus("success");

        // Still try to check status from backend
        checkTransactionStatus(collectRequestId)
          .then((response) => {
            if (response.success) {
              addLog(
                `Payment confirmed from backend: ${JSON.stringify(
                  response.data
                )}`
              );
              setPaymentDetails((prev: Record<string, any>) => ({
                ...prev,
                ...response.data,
              }));
            }
          })
          .catch((err) => {
            addLog(`Backend status check error: ${err.message}`);
            // Don't change the status since we already know it's SUCCESS from URL param
          });

        return;
      }

      // If no custom order ID, note it but continue
      if (!customOrderId) {
        addLog("Missing custom_order_id in URL parameters");
      }

      setPaymentDetails({
        collect_request_id: collectRequestId,
        custom_order_id: customOrderId,
      });

      // Use the new polling function to check payment status
      pollPaymentStatus(
        collectRequestId,
        // On Success
        (data) => {
          addLog(`Payment successful: ${JSON.stringify(data)}`);
          setPaymentDetails(data);
          setStatus("success");
        },
        // On Failure
        (message) => {
          addLog(`Payment failed: ${message}`);
          setStatus("failed");
          setError(message);
        },
        // On Pending
        (data) => {
          addLog(`Payment status update: ${JSON.stringify(data)}`);
          setPaymentDetails((prev: any) => ({ ...prev, ...data }));
          setRetryCount((prev) => prev + 1);
        },
        MAX_RETRIES,
        RETRY_DELAY
      );
    }
  }, []);

  const handleGoHome = () => {
    addLog("Navigating to home page");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mb-4">
        <CardHeader>
          <CardTitle>
            Payment{" "}
            {status === "loading"
              ? "Processing"
              : status === "success"
              ? "Successful"
              : "Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading"
              ? "Please wait while we verify your payment..."
              : status === "success"
              ? "Your payment has been processed successfully!"
              : "We encountered an issue with your payment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Checking payment status...
              </p>
              {retryCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  Attempt {retryCount}/{MAX_RETRIES}
                </p>
              )}
            </div>
          )}
          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-semibold">Payment Completed</p>
                {paymentDetails?.order_amount && (
                  <p className="text-sm text-muted-foreground">
                    Amount: ₹{paymentDetails.order_amount}
                  </p>
                )}
                {paymentDetails?.transaction_id ? (
                  <p className="text-sm text-muted-foreground">
                    Transaction ID: {paymentDetails.transaction_id}
                  </p>
                ) : paymentDetails?.collect_request_id ? (
                  <p className="text-sm text-muted-foreground">
                    Reference ID: {paymentDetails.collect_request_id}
                  </p>
                ) : null}
                <p className="text-sm text-muted-foreground">
                  Date:{" "}
                  {new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
          {status === "failed" && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-semibold">Payment Failed</p>
                <p className="text-sm text-muted-foreground">
                  {error || "An error occurred during payment processing"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleGoHome}>Return to Home</Button>
        </CardFooter>
      </Card>

      {/* Debug logs section (hidden in production) */}
      {process.env.NODE_ENV !== "production" && (
        <div className="w-full max-w-md bg-black/90 text-white p-4 rounded-md text-xs overflow-auto max-h-60">
          <h3 className="font-bold mb-2">Debug Logs:</h3>
          <div className="space-y-1">
            {logs.map((log, index) => (
              <p key={index} className="font-mono">
                {log}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
