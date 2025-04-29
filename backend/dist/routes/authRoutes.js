"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Register route
router.post('/register', authController_1.register);
// Login route
router.post('/login', authController_1.login);
// OTP verification routes
router.post('/verify-otp', authController_1.verifyOTP);
router.post('/resend-otp', authController_1.resendOTP);
// Forgot password routes
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.resetPassword);
router.get('/verify-reset-token/:token', authController_1.verifyResetToken);
// Get profile route (protected)
router.get('/profile', auth_1.protect, authController_1.getProfile);
exports.default = router;
