import express, { Router } from 'express';
import { register, login, getProfile, forgotPassword, resetPassword, verifyResetToken, verifyOTP, resendOTP } from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router: Router = express.Router();

// Register route
router.post('/register', register as any);

// Login route
router.post('/login', login as any);

// OTP verification routes
router.post('/verify-otp', verifyOTP as any);
router.post('/resend-otp', resendOTP as any);

// Forgot password routes
router.post('/forgot-password', forgotPassword as any);
router.post('/reset-password', resetPassword as any);
router.get('/verify-reset-token/:token', verifyResetToken as any);

// Get profile route (protected)
router.get('/profile', protect as any, getProfile as any);

export default router; 