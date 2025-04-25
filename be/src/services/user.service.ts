import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import logger from '../utils/logger';
import prisma from '../config/db';
import emailService from './email.service';

// Types
interface RegisterUserParams {
  email: string;
  password: string;
  name: string;
}

interface LoginParams {
  email: string;
  password: string;
}

// User Service
const userService = {
  /**
   * Register a new user
   */
  register: async (params: RegisterUserParams) => {
    try {
      const { email, password, name } = params;
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
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
        },
      });
      
      // Send welcome email
      await emailService.sendWelcomeEmail(email, name);
      
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      logger.info(`User registered: ${email}`);
      
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
      logger.error(`Error registering user: ${error.message}`);
      return {
        success: false,
        message: 'Registration failed',
        error: error.message,
      };
    }
  },
  
  /**
   * Login user
   */
  login: async (params: LoginParams) => {
    try {
      const { email, password } = params;
      
      // Find user
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }
      
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      logger.info(`User logged in: ${email}`);
      
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
      logger.error(`Error logging in: ${error.message}`);
      return {
        success: false,
        message: 'Login failed',
        error: error.message,
      };
    }
  },
  
  /**
   * Forgot password
   */
  forgotPassword: async (email: string) => {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      
      if (!user) {
        // Return success anyway to prevent email enumeration
        return {
          success: true,
          message: 'If your email is registered, you will receive a password reset link',
        };
      }
      
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
      
      // Save reset token to user
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          resetPasswordToken: resetToken,
          resetTokenExpiry: resetTokenExpiry,
        },
      });
      
      // Create reset link
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      // Send email
      await emailService.sendForgotPasswordEmail(email, user.name || 'User', resetLink);
      
      logger.info(`Password reset email sent: ${email}`);
      
      return {
        success: true,
        message: 'If your email is registered, you will receive a password reset link',
      };
    } catch (error: any) {
      logger.error(`Error in forgot password: ${error.message}`);
      return {
        success: false,
        message: 'Failed to process forgot password request',
        error: error.message,
      };
    }
  },
  
  /**
   * Reset password
   */
  resetPassword: async (token: string, newPassword: string) => {
    try {
      // Find user with valid reset token
      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetTokenExpiry: {
            gt: new Date(),
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
      
      // Update user password and clear reset token
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetTokenExpiry: null,
        },
      });
      
      logger.info(`Password reset successful: ${user.email}`);
      
      return {
        success: true,
        message: 'Password reset successful',
      };
    } catch (error: any) {
      logger.error(`Error resetting password: ${error.message}`);
      return {
        success: false,
        message: 'Failed to reset password',
        error: error.message,
      };
    }
  },
  
  /**
   * Get user profile
   */
  getProfile: async (userId: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
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
      logger.error(`Error getting user profile: ${error.message}`);
      return {
        success: false,
        message: 'Failed to get user profile',
        error: error.message,
      };
    }
  },
};

export default userService; 