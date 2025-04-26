"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  type RegisterRequest,
  type LoginRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
} from "@/api/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Hook for checking if user is authenticated
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Check if auth token exists
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  // Get current user profile
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: getProfile,
    enabled: isAuthenticated,
    retry: 1,
  });

  // Handle error in user profile fetch
  useEffect(() => {
    if (error) {
      // If error fetching profile, clear token and set authenticated to false
      localStorage.removeItem("auth_token");
      setIsAuthenticated(false);
    }
  }, [error]);

  // Logout function
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    router.push("/login");
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    logout: handleLogout,
  };
}

// Hook for user registration
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => register(userData),
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });

      // Redirect to dashboard
      router.push("/dashboard");
    },
  });
}

// Hook for user login
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });

      // Redirect to dashboard
      router.push("/dashboard");
    },
  });
}

// Hook for forgot password
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
  });
}

// Hook for reset password
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess: () => {
      // Redirect to login page after password reset
      router.push("/login");
    },
  });
}
