import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limiter.middleware';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authLimiter, authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', authLimiter, authController.login);

/**
 * @route POST /api/auth/forgot-password
 * @desc Send password reset email
 * @access Public
 */
router.post('/forgot-password', authLimiter, authController.forgotPassword);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset user password
 * @access Public
 */
router.post('/reset-password', authLimiter, authController.resetPassword);

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', authenticate, authController.getProfile);

export default router;
