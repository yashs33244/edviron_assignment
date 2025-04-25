import type { Request, Response } from 'express';
import { z } from 'zod';
import userService from '../services/user.service';
import logger from '../utils/logger';

// Input validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Controller methods
export const register = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationResult.error.format(),
      });
    }

    // Register user
    const { email, password, name } = validationResult.data;
    const result = await userService.register({ email, password, name });

    // Return response
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error: any) {
    logger.error(`Error in register controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationResult.error.format(),
      });
    }

    // Login user
    const { email, password } = validationResult.data;
    const result = await userService.login({ email, password });

    // Return response
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(401).json(result);
    }
  } catch (error: any) {
    logger.error(`Error in login controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationResult.error.format(),
      });
    }

    // Process forgot password
    const { email } = validationResult.data;
    const result = await userService.forgotPassword(email);

    // Return response (always 200 to prevent email enumeration)
    return res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
    });
  } catch (error: any) {
    logger.error(`Error in forgot password controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validationResult = resetPasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationResult.error.format(),
      });
    }

    // Reset password
    const { token, password } = validationResult.data;
    const result = await userService.resetPassword(token, password);

    // Return response
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error: any) {
    logger.error(`Error in reset password controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // Get user profile
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const result = await userService.getProfile(req.user.id);

    // Return response
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error: any) {
    logger.error(`Error in get profile controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
