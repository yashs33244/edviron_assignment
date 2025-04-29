import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import { generateToken } from '../utils/jwt';
import emailService from '../utils/email/emailService';
import { getWelcomeEmailTemplate, getPasswordResetEmailTemplate } from '../utils/email/templates';
import { PasswordResetService } from '../models/PasswordReset';

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const prismaClient = prisma;
const emailServiceClient = emailService;

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Create user
    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
        isVerified: false,
      },
    });

    // Get base URL from environment or default to localhost
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Send welcome email with OTP
    await emailServiceClient.sendEmail(
      email,
      'Welcome to Edviron Finance - Verify Your Account',
      getWelcomeEmailTemplate({ 
        name, 
        email, 
        otp,
        baseUrl 
      })
    );

    return res.status(201).json({ 
      message: 'User registered successfully. Please check your email for verification code.',
      userId: user.id
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Generate a random OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Set OTP expiry time (10 minutes from now)
const getOTPExpiry = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000);
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Update user as verified
    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Generate new OTP
      const otp = generateOTP();
      const otpExpiry = getOTPExpiry();

      // Update user with new OTP
      await prismaClient.user.update({
        where: { id: user.id },
        data: { otp, otpExpiry },
      });

      // Get base URL from environment or default to localhost
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

      // Send email with OTP
      await emailServiceClient.sendEmail(
        email,
        'Edviron Finance - Account Verification Required',
        getWelcomeEmailTemplate({ 
          name: user.name, 
          email, 
          otp,
          baseUrl 
        })
      );

      return res.status(200).json({
        message: 'Account not verified. Please check your email for verification code.',
        needsVerification: true,
        userId: user.id
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user profile
 * @route GET /api/auth/profile
 * @access Private
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Forgot password - request password reset
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Check rate limit
    const withinRateLimit = await PasswordResetService.checkRateLimit(email);
    if (!withinRateLimit) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Try again later.',
      });
    }

    // Check if user exists
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 even if user doesn't exist for security
      return res.status(200).json({
        success: true,
        message: 'If the email is registered, a password reset link will be sent.',
      });
    }

    // Generate reset token
    const token = await PasswordResetService.createResetToken(user.id);

    // Create reset link
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // Send password reset email
    const resetEmailTemplate = getPasswordResetEmailTemplate({
      name: user.name,
      resetLink,
    });

    await emailServiceClient.sendEmail(
      user.email,
      'Reset Your Password - Edviron Finance',
      resetEmailTemplate
    );

    res.status(200).json({
      success: true,
      message: 'If the email is registered, a password reset link will be sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Reset password - verify token and reset password
 * @route POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    // Verify token
    const userId = await PasswordResetService.verifyToken(token);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Get user
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if new password is same as old password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(400).json({
        success: false,
        message: 'New password cannot be the same as your old password',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password
    await prismaClient.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await PasswordResetService.markTokenAsUsed(token);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Verify reset token
 * @route GET /api/auth/verify-reset-token/:token
 * @access Public
 */
export const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    // Verify token
    const userId = await PasswordResetService.verifyToken(token);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Update user with new OTP
    await prismaClient.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry },
    });

    // Get base URL from environment or default to localhost
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    // Send email with OTP
    await emailServiceClient.sendEmail(
      email,
      'Edviron Finance - Your Verification Code',
      getWelcomeEmailTemplate({ 
        name: user.name, 
        email, 
        otp,
        baseUrl 
      })
    );

    return res.status(200).json({
      message: 'OTP sent successfully. Please check your email.',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}; 