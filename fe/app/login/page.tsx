"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLogin, useForgotPassword } from "@/hooks/use-auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Use login mutation hook
  const {
    mutate: login,
    isPending: isLoginPending,
    isError: isLoginError,
    error: loginError,
  } = useLogin();

  // Use forgot password mutation hook
  const {
    mutate: forgotPassword,
    isPending: isForgotPasswordPending,
    isError: isForgotPasswordError,
    error: forgotPasswordError,
    isSuccess: isForgotPasswordSuccess,
  } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the login mutation with form data
    login({
      email,
      password,
    });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the forgot password mutation
    forgotPassword({ email: forgotPasswordEmail });

    // Show success message
    setForgotPasswordSuccess(true);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-black"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            </div>
            <div className="font-bold text-xl gradient-text">
              Finance Dashboard
            </div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-3xl p-8 shadow-xl border border-gray-800"
        >
          {!showForgotPassword ? (
            <>
              <h1 className="text-2xl font-bold mb-6 text-center">
                Welcome Back
              </h1>

              {isLoginError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm">
                  {loginError instanceof Error
                    ? loginError.message
                    : "Login failed. Please check your credentials."}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter your email"
                    required
                    disabled={isLoginPending}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Enter your password"
                      required
                      disabled={isLoginPending}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoginPending}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => setShowForgotPassword(true)}
                      disabled={isLoginPending}
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: isLoginPending ? 1 : 1.02 }}
                  whileTap={{ scale: isLoginPending ? 1 : 0.98 }}
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-black font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center"
                  disabled={isLoginPending}
                >
                  {isLoginPending ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <button
                  type="button"
                  className="text-gray-400 hover:text-white mr-2"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordSuccess(false);
                  }}
                >
                  ← Back
                </button>
                <h1 className="text-2xl font-bold text-center flex-1">
                  Reset Password
                </h1>
              </div>

              {isForgotPasswordError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm">
                  {forgotPasswordError instanceof Error
                    ? forgotPasswordError.message
                    : "Failed to send reset email. Please try again."}
                </div>
              )}

              {(isForgotPasswordSuccess || forgotPasswordSuccess) && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-xl text-green-400 text-sm">
                  Password reset email sent. Please check your inbox.
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label
                    htmlFor="forgotEmail"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="forgotEmail"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter your email"
                    required
                    disabled={isForgotPasswordPending}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: isForgotPasswordPending ? 1 : 1.02 }}
                  whileTap={{ scale: isForgotPasswordPending ? 1 : 0.98 }}
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-black font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center"
                  disabled={isForgotPasswordPending}
                >
                  {isForgotPasswordPending ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {!showForgotPassword && (
            <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-center text-sm text-gray-400 mb-4">
                Or continue with
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex justify-center items-center py-2 px-4 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </button>
                <button className="flex justify-center items-center py-2 px-4 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"
                    />
                  </svg>
                </button>
                <button className="flex justify-center items-center py-2 px-4 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.014-.627.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
