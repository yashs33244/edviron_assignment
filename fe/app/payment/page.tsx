"use client";

import React, { useState } from "react";
import { useSimplePayment } from "@/hooks/use-edviron-pg";
import { Loader2 } from "lucide-react";

export default function PaymentPage() {
  const [amount, setAmount] = useState("");
  const { makePayment, isLoading, isRedirecting, error } = useSimplePayment();
  const [formError, setFormError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      // Validate amount
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        setFormError("Please enter a valid amount");
        return;
      }

      // Initiate payment with direct redirection
      const response = await makePayment(amount, "/payment/success");
      console.log("response", response);
      if (response.collect_request_url) {
        setRedirectUrl(response.collect_request_url);
      }

      // Store payment ID in case redirect doesn't happen automatically
      if (response.collect_request_id) {
        setPaymentId(response.collect_request_id);
        // Payment URL should automatically redirect
      }
      console.log("redirectUrl", redirectUrl);
    } catch (err) {
      console.error("Payment error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed";
      setFormError(errorMessage);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto bg-card rounded-3xl p-8 shadow-xl border border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center">Make a Payment</h1>

        {(formError || error) && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm">
            {formError ||
              (error instanceof Error ? error.message : "Payment failed")}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount (INR)
            </label>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter amount"
              required
              disabled={isLoading || isRedirecting}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            disabled={isLoading || isRedirecting}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Processing...
              </>
            ) : isRedirecting ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Redirecting to payment gateway...
              </>
            ) : (
              "Pay Now"
            )}
          </button>
        </form>

        {paymentId && (
          <div className="mt-6 p-4 bg-gray-800 rounded-xl text-sm">
            <p className="mb-2">
              If you are not redirected automatically, click the button below:
            </p>
            <a
              href={redirectUrl || ""}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Go to Payment Page
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
