"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPayment } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Default school ID from the environment
const DEFAULT_SCHOOL_ID = "65b0e6293e9f76a9694d84b4";

interface PaymentFormProps {
  onSuccess?: () => void;
}

export function PaymentForm({ onSuccess }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    school_id: DEFAULT_SCHOOL_ID,
    amount: "",
    student_name: "",
    student_id: "",
    student_email: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate a timestamp-based custom order ID
      const customOrderId = `ORD-${Date.now()}`;
      console.log(`Generated custom order ID: ${customOrderId}`);

      // Get the current domain for callback URL
      const baseCallbackUrl = `${window.location.origin}/payment-callback`;
      const callbackUrl = `${baseCallbackUrl}?custom_order_id=${customOrderId}`;

      console.log(`Using callback URL: ${callbackUrl}`);

      const response = await createPayment({
        school_id: formData.school_id,
        amount: formData.amount,
        callback_url: callbackUrl,
        student_info: {
          name: formData.student_name,
          id: formData.student_id,
          email: formData.student_email,
        },
        custom_order_id: customOrderId,
      });

      if (response.success && response.data?.collect_request_url) {
        const redirectUrl = response.data.collect_request_url;
        console.log("Redirecting to payment URL:", redirectUrl);

        // Store the collect_request_id in localStorage
        if (response.data.collect_request_id) {
          localStorage.setItem(
            "current_collect_request_id",
            response.data.collect_request_id
          );
          localStorage.setItem("payment_timestamp", Date.now().toString());
          console.log(
            `Stored collect_request_id in localStorage: ${response.data.collect_request_id}`
          );
        }

        // Call onSuccess if provided
        if (onSuccess) {
          onSuccess();
        }

        // Use window.location.href for redirect
        window.location.href = redirectUrl;
      } else {
        toast({
          title: "Error",
          description: "Payment URL not received. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Payment creation error:", error);
      toast({
        title: "Payment Creation Failed",
        description:
          error.message ||
          "There was an error creating the payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="hidden"
        id="school_id"
        name="school_id"
        value={formData.school_id}
      />
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="1"
          step="1"
          placeholder="Enter amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className="bg-muted rounded-xl border-2"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="student_name">Student Name</Label>
        <Input
          id="student_name"
          name="student_name"
          placeholder="Enter student name"
          value={formData.student_name}
          onChange={handleChange}
          required
          className="bg-muted rounded-xl border-2"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="student_id">Student ID</Label>
        <Input
          id="student_id"
          name="student_id"
          placeholder="Enter student ID"
          value={formData.student_id}
          onChange={handleChange}
          required
          className="bg-muted rounded-xl border-2"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="student_email">Student Email</Label>
        <Input
          id="student_email"
          name="student_email"
          type="email"
          placeholder="Enter student email"
          value={formData.student_email}
          onChange={handleChange}
          required
          className="bg-muted rounded-xl border-2"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-black hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Create Payment"
        )}
      </Button>
    </form>
  );
}
