"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, getUserProfile } from "@/lib/api";
import React from "react"; // Add React import

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getUserProfile();
          setUser(userData.data);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiLogin(email, password);

      // Check if the user needs verification
      if (response.needsVerification) {
        return response; // Return the response for verification handling
      }

      // Handle normal login flow
      if (response.token) {
        // Store token in localStorage for client-side access
        localStorage.setItem("token", response.token);

        // Store token in a cookie for middleware access
        document.cookie = `token=${response.token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }`; // 7 days

        setUser(response.user);

        // Explicitly navigate to dashboard with a slight delay to ensure state updates
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");

    // Clear the cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setUser(null);
    router.push("/");
  };

  // Using React.createElement instead of JSX
  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      },
    },
    children
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
