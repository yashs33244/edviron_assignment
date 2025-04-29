"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { verifyOTP, resendOTP } from "@/lib/api";

export default function VerifyOTPPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if email is provided in URL params
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await verifyOTP(email, otp);

      toast({
        title: "Success",
        description: "Your account has been verified successfully",
      });

      // Store the token in both localStorage and cookie
      localStorage.setItem("token", response.token);
      document.cookie = `token=${response.token}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`; // 7 days

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description:
          error.response?.data?.message || "Invalid OTP or OTP expired",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await resendOTP(email);

      setEmailSent(true);
      toast({
        title: "OTP Sent",
        description: "A new verification code has been sent to your email",
      });

      // Hide the success message after 5 seconds
      setTimeout(() => setEmailSent(false), 5000);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to resend verification code",
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
          <h1 className="text-3xl font-bold">Verify Your Account</h1>
          <p className="text-muted-foreground">
            Enter the verification code sent to your email
          </p>
        </div>

        {emailSent && (
          <div className="bg-green-900/30 border border-green-500 text-green-200 p-4 rounded-md text-sm">
            Verification code has been sent to your email
          </div>
        )}

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
                className="bg-muted text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="bg-muted text-white"
                minLength={6}
                maxLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Account"}
            </Button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={handleResendOTP}
              className="text-primary text-sm hover:underline"
              disabled={isLoading}
            >
              Didn't receive a code? Send again
            </button>
          </div>

          <div className="text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
