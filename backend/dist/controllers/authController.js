"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTP = exports.verifyResetToken = exports.resetPassword = exports.forgotPassword = exports.getProfile = exports.login = exports.verifyOTP = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const emailService_1 = __importDefault(require("../utils/email/emailService"));
const templates_1 = require("../utils/email/templates");
const PasswordReset_1 = require("../models/PasswordReset");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient = db_1.default;
const emailServiceClient = emailService_1.default;
/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield prismaClient.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = getOTPExpiry();
        // Create user
        const user = yield prismaClient.user.create({
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
        yield emailServiceClient.sendEmail(email, 'Welcome to Edviron Finance - Verify Your Account', (0, templates_1.getWelcomeEmailTemplate)({
            name,
            email,
            otp,
            baseUrl
        }));
        return res.status(201).json({
            message: 'User registered successfully. Please check your email for verification code.',
            userId: user.id
        });
    }
    catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.register = register;
// Generate a random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Set OTP expiry time (10 minutes from now)
const getOTPExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000);
};
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        // Find user by email
        const user = yield prismaClient.user.findUnique({
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
        yield prismaClient.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                otp: null,
                otpExpiry: null,
            },
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        return res.status(200).json({
            message: 'OTP verified successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.verifyOTP = verifyOTP;
/**
 * Login a user
 * @route POST /api/auth/login
 * @access Public
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user
        const user = yield prismaClient.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Verify password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check if user is verified
        if (!user.isVerified) {
            // Generate new OTP
            const otp = generateOTP();
            const otpExpiry = getOTPExpiry();
            // Update user with new OTP
            yield prismaClient.user.update({
                where: { id: user.id },
                data: { otp, otpExpiry },
            });
            // Get base URL from environment or default to localhost
            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
            // Send email with OTP
            yield emailServiceClient.sendEmail(email, 'Edviron Finance - Account Verification Required', (0, templates_1.getWelcomeEmailTemplate)({
                name: user.name,
                email,
                otp,
                baseUrl
            }));
            return res.status(200).json({
                message: 'Account not verified. Please check your email for verification code.',
                needsVerification: true,
                userId: user.id
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        return res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
/**
 * Get user profile
 * @route GET /api/auth/profile
 * @access Private
 */
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prismaClient.user.findUnique({
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
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.getProfile = getProfile;
/**
 * Forgot password - request password reset
 * @route POST /api/auth/forgot-password
 * @access Public
 */
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }
        // Check rate limit
        const withinRateLimit = yield PasswordReset_1.PasswordResetService.checkRateLimit(email);
        if (!withinRateLimit) {
            return res.status(429).json({
                success: false,
                message: 'Rate limit exceeded. Try again later.',
            });
        }
        // Check if user exists
        const user = yield prismaClient.user.findUnique({
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
        const token = yield PasswordReset_1.PasswordResetService.createResetToken(user.id);
        // Create reset link
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${baseUrl}/reset-password?token=${token}`;
        // Send password reset email
        const resetEmailTemplate = (0, templates_1.getPasswordResetEmailTemplate)({
            name: user.name,
            resetLink,
        });
        yield emailServiceClient.sendEmail(user.email, 'Reset Your Password - Edviron Finance', resetEmailTemplate);
        res.status(200).json({
            success: true,
            message: 'If the email is registered, a password reset link will be sent.',
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.forgotPassword = forgotPassword;
/**
 * Reset password - verify token and reset password
 * @route POST /api/auth/reset-password
 * @access Public
 */
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required',
            });
        }
        // Verify token
        const userId = yield PasswordReset_1.PasswordResetService.verifyToken(token);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }
        // Get user
        const user = yield prismaClient.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Check if new password is same as old password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (isMatch) {
            return res.status(400).json({
                success: false,
                message: 'New password cannot be the same as your old password',
            });
        }
        // Hash new password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Update user password
        yield prismaClient.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        // Mark token as used
        yield PasswordReset_1.PasswordResetService.markTokenAsUsed(token);
        res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.resetPassword = resetPassword;
/**
 * Verify reset token
 * @route GET /api/auth/verify-reset-token/:token
 * @access Public
 */
const verifyResetToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required',
            });
        }
        // Verify token
        const userId = yield PasswordReset_1.PasswordResetService.verifyToken(token);
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
    }
    catch (error) {
        console.error('Verify reset token error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.verifyResetToken = verifyResetToken;
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Find user by email
        const user = yield prismaClient.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = getOTPExpiry();
        // Update user with new OTP
        yield prismaClient.user.update({
            where: { id: user.id },
            data: { otp, otpExpiry },
        });
        // Get base URL from environment or default to localhost
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        // Send email with OTP
        yield emailServiceClient.sendEmail(email, 'Edviron Finance - Your Verification Code', (0, templates_1.getWelcomeEmailTemplate)({
            name: user.name,
            email,
            otp,
            baseUrl
        }));
        return res.status(200).json({
            message: 'OTP sent successfully. Please check your email.',
        });
    }
    catch (error) {
        console.error('Resend OTP error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.resendOTP = resendOTP;
