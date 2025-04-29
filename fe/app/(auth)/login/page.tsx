"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/button-link";
import { Eye, EyeOff } from "lucide-react";

// Client component that uses useSearchParams
function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(email, password);

      // Check if the account needs verification
      if (response && response.needsVerification) {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        return;
      }

      // Redirect after successful login
      router.push(callbackUrl);
    } catch (error) {
      setError("Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Link href="/" className="">
            <Image
              src="/just_logo_2.png"
              alt="Logo"
              width={120}
              height={120}
              className="h-24 w-auto"
              priority
            />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-900 pt-10 pb-8 pl-6 pr-6 shadow-lg">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">
              Login to your account
            </h2>
            <p className="text-sm text-gray-400">
              Please enter your email address and password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-800 px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#2BE82A] hover:text-[#2BE82A]/90"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="flex h-12 w-full rounded-xl border border-[#2BE82A] bg-zinc-800 px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-sm font-medium text-red-500">{error}</div>
            )}
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#2BE82A] to-[#98E49B] px-4 py-2 text-base font-medium text-black shadow-lg shadow-green-500/30 transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[#2BE82A] hover:text-[#2BE82A]/90"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main component with suspense boundary
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
