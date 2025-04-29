"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending the password reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <CreditCard className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <p className="text-muted-foreground">
            {isSubmitted
              ? "Check your email for a password reset link"
              : "Enter your email address to receive a password reset link"}
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-2xl text-center">
              <p className="text-white mb-4">
                If an account exists with the email{" "}
                <span className="text-primary font-semibold">{email}</span>, you
                will receive a password reset link shortly.
              </p>
              <p className="text-sm text-muted-foreground">
                Please check your email inbox and spam folder.
              </p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-primary text-black hover:bg-primary/90"
            >
              Return to Login
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted text-white rounded-xl border-2 border-gray-800"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-black hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
            <div className="text-center text-sm">
              <Link
                href="/login"
                className="text-primary hover:underline inline-flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
