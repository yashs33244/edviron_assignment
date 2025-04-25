import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { User } from '@prisma/client';
import prisma from '../config/db';
import logger from '../utils/logger';
import * as jwtUtil from '../utils/jwt.util';
import * as mailer from '../utils/mailer';

/**
 * Interface for registration parameters
 */
export interface RegisterParams {
  email: string;
  password: string;
  name: string;
}

/**
 * Interface for login parameters
 */
export interface LoginParams {
  email: string;
  password: string;
}

/**
 * Register a new user
 * @param params - Registration parameters
 */
export const register = async (params: RegisterParams) => {
  try {
    const { email, password, name } = params;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'user',
      },
    });

    // Generate JWT token
    const token = jwtUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Send welcome email
    await mailer.sendWelcomeEmail(email, name);

    // Return user info and token
    return {
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    };
  } catch (error: any) {
    logger.error(`Registration error: ${error.message}`);
    return {
      success: false,
      message: 'Registration failed',
      error: error.message,
    };
  }
};

/**
 * Login a user
 * @param params - Login parameters
 */
export const login = async (params: LoginParams) => {
  try {
    const { email, password } = params;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    // Generate JWT token
    const token = jwtUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user info and token
    return {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    };
  } catch (error: any) {
    logger.error(`Login error: ${error.message}`);
    return {
      success: false,
      message: 'Login failed',
      error: error.message,
    };
  }
};

/**
 * Send forgot password email with reset token
 * @param email - User email
 */
export const forgotPassword = async (email: string) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      return {
        success: true,
        message: 'If your email is registered, you will receive a password reset link',
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });

    // Send reset password email
    await mailer.sendPasswordResetEmail(email, user.name || 'User', resetToken);

    return {
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
    };
  } catch (error: any) {
    logger.error(`Forgot password error: ${error.message}`);
    return {
      success: false,
      message: 'Failed to process forgot password request',
      error: error.message,
    };
  }
};

/**
 * Reset password using token
 * @param token - Reset token
 * @param newPassword - New password
 */
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token is not expired
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid or expired token',
      };
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user with new password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetTokenExpiry: null,
      },
    });

    return {
      success: true,
      message: 'Password reset successful',
    };
  } catch (error: any) {
    logger.error(`Reset password error: ${error.message}`);
    return {
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    };
  }
};

/**
 * Get user profile
 * @param userId - User ID
 */
export const getProfile = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    logger.error(`Get profile error: ${error.message}`);
    return {
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    };
  }
};
