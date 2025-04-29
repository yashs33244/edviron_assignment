"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { register } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await register(name, email, password);
      toast({
        title: "Account created",
        description: "Please check your email for the verification code",
      });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    } finally {
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
              height={20}
              className="h-24 w-auto"
              priority
            />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create an account
          </h1>
          <p className="text-sm text-gray-400">
            Enter your information to create an account
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-900 p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-300"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                className="flex h-12 w-full rounded-xl border  bg-zinc-800 px-4 py-2 text-white placeholder-gray-500 focus:border-[#2BE82A] focus:outline-none focus:ring-1 focus:ring-green-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
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
                className="flex h-12 w-full rounded-xl border  bg-zinc-800 px-4 py-2 text-white placeholder-gray-500 focus:border-[#2BE82A] focus:outline-none focus:ring-1 focus:ring-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="flex h-12 w-full rounded-xl border bg-zinc-800 px-4 py-2 text-white placeholder-gray-500 focus:border-[#2BE82A] focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
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
              <p className="mt-1 text-xs text-gray-400">
                Password must be at least 8 characters long
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#2BE82A] to-[#98E49B] px-4 py-2 text-base font-medium text-black shadow-lg shadow-green-500/30 transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 "
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <div className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#2BE82A] hover:text-[#2BE82A]/90"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
