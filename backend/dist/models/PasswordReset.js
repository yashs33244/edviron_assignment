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
exports.PasswordResetService = void 0;
const db_1 = __importDefault(require("../config/db"));
const crypto_1 = __importDefault(require("crypto"));
class PasswordResetService {
    /**
     * Create a password reset token
     */
    static createResetToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate a random token
            const token = crypto_1.default.randomBytes(32).toString('hex');
            // Set expiration to 1 hour from now
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);
            // Delete any existing tokens for this user
            yield db_1.default.passwordReset.deleteMany({
                where: { userId },
            });
            // Create a new token
            yield db_1.default.passwordReset.create({
                data: {
                    userId,
                    token,
                    expiresAt,
                    used: false,
                },
            });
            return token;
        });
    }
    /**
     * Verify a password reset token
     */
    static verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const resetToken = yield db_1.default.passwordReset.findUnique({
                where: { token },
            });
            // Check if token exists, is not expired, and has not been used
            if (!resetToken) {
                return null;
            }
            if (resetToken.expiresAt < new Date()) {
                return null;
            }
            if (resetToken.used) {
                return null;
            }
            return resetToken.userId;
        });
    }
    /**
     * Mark a token as used
     */
    static markTokenAsUsed(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.default.passwordReset.update({
                    where: { token },
                    data: { used: true },
                });
                return true;
            }
            catch (error) {
                console.error('Error marking token as used:', error);
                return false;
            }
        });
    }
    /**
     * Check rate limit for password reset attempts
     * Returns true if within rate limit, false if exceeded
     */
    static checkRateLimit(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const MAX_ATTEMPTS = 5; // 5 attempts per day
            const RESET_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            // Get or create attempt record
            let attempt = yield db_1.default.passwordResetAttempt.findUnique({
                where: { email },
            });
            const now = new Date();
            if (!attempt) {
                // First attempt
                yield db_1.default.passwordResetAttempt.create({
                    data: {
                        email,
                        attemptCount: 1,
                        lastAttemptAt: now,
                    },
                });
                return true;
            }
            // Check if reset period has passed
            const timeSinceLastAttempt = now.getTime() - attempt.lastAttemptAt.getTime();
            if (timeSinceLastAttempt > RESET_PERIOD) {
                // Reset period has passed, reset attempt count
                yield db_1.default.passwordResetAttempt.update({
                    where: { email },
                    data: {
                        attemptCount: 1,
                        lastAttemptAt: now,
                    },
                });
                return true;
            }
            // Check if already reached max attempts
            if (attempt.attemptCount >= MAX_ATTEMPTS) {
                return false;
            }
            // Increment attempt count
            yield db_1.default.passwordResetAttempt.update({
                where: { email },
                data: {
                    attemptCount: attempt.attemptCount + 1,
                    lastAttemptAt: now,
                },
            });
            return true;
        });
    }
}
exports.PasswordResetService = PasswordResetService;
