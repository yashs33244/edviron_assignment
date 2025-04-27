import { Metadata } from "next";
import PaymentCallback from "@/components/payment-callback";

export const metadata: Metadata = {
  title: "Payment Status",
  description: "Check the status of your payment",
};

export default function PaymentCallbackPage() {
  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment Status</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Your payment status is being processed. Please wait while we verify your
        transaction.
      </p>
      <PaymentCallback />
    </div>
  );
}
