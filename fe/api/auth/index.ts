/**
 * Authentication API client
 * Implements API endpoints for user authentication
 */

// Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Base API URL from environment or default to local development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `API request failed with status ${response.status}`
    );
  }
  return response.json();
}

// Register a new user
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return handleResponse<{ success: boolean; data: AuthResponse }>(response)
    .then(res => {
      // Store token in localStorage
      if (res.data.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', res.data.token);
      }
      return res.data;
    });
}

// Login user
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  return handleResponse<{ success: boolean; data: AuthResponse }>(response)
    .then(res => {
      // Store token in localStorage
      if (res.data.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', res.data.token);
      }
      return res.data;
    });
}

// Get user profile
export async function getProfile(): Promise<AuthResponse['user']> {
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    }
  });

  return handleResponse<{ success: boolean; data: AuthResponse['user'] }>(response)
    .then(res => res.data);
}

// Forgot password
export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{ success: boolean; message: string }>(response)
    .then(res => ({ message: res.message }));
}

// Reset password
export async function resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{ success: boolean; message: string }>(response)
    .then(res => ({ message: res.message }));
}

// Logout user
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

// Helper function to get auth token from localStorage
function getAuthToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || '';
  }
  return '';
} 