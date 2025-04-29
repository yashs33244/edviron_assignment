"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, AlertTriangle, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { resetPassword, verifyResetToken } from "@/lib/api";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");

  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function verifyToken() {
      const tokenParam = searchParams.get("token");
      if (!tokenParam) {
        toast({
          title: "Invalid Token",
          description: "No reset token was provided",
          variant: "destructive",
        });
        setIsVerifying(false);
        return;
      }

      setToken(tokenParam);

      try {
        const response = await verifyResetToken(tokenParam);
        if (response.success) {
          setIsTokenVerified(true);
        } else {
          toast({
            title: "Invalid Token",
            description: "The password reset link is invalid or has expired",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Invalid Token",
          description: "The password reset link is invalid or has expired",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    }

    verifyToken();
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword(token, password);
      if (response.success) {
        setIsResetComplete(true);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to reset password",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (isVerifying) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <CreditCard className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Verifying Reset Link</h1>
          <p className="text-muted-foreground">
            Please wait while we verify your password reset link...
          </p>
          <div className="animate-pulse h-6 bg-muted rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isTokenVerified && !isVerifying) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-3xl font-bold">Invalid Reset Link</h1>
          <p className="text-muted-foreground">
            The password reset link is invalid or has expired.
          </p>
          <Button
            onClick={() => router.push("/forgot-password")}
            className="bg-primary text-black hover:bg-primary/90"
          >
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  if (isResetComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="bg-primary/20 p-3 rounded-full w-fit mx-auto">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Password Reset Complete</h1>
          <p className="text-muted-foreground">
            Your password has been successfully reset.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-primary text-black hover:bg-primary/90"
          >
            Sign In with New Password
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <CreditCard className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <p className="text-muted-foreground">
            Enter a new password for your account
          </p>
        </div>
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-muted text-white rounded-xl border-2 border-gray-800 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 8 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-muted text-white rounded-xl border-2 border-gray-800 pr-10"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-black hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
