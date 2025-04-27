import { Metadata } from "next";
import { PaymentForm } from "@/components/payment-form";

export const metadata: Metadata = {
  title: "Make a Payment",
  description: "Make a secure payment to your school",
};

export default function PaymentPage() {
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Make a Payment</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Use our secure payment system to make payments to your school. All
        payments are processed securely.
      </p>
      <PaymentForm />
    </div>
  );
}
