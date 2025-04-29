import { ObjectId } from 'mongodb';
import prisma from '../config/db';
import crypto from 'crypto';

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export interface PasswordResetAttempt {
  id: string;
  email: string;
  attemptCount: number;
  lastAttemptAt: Date;
}

export class PasswordResetService {
  /**
   * Create a password reset token
   */
  static async createResetToken(userId: string): Promise<string> {
    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Set expiration to 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    
    // Delete any existing tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { userId },
    });
    
    // Create a new token
    await prisma.passwordReset.create({
      data: {
        userId,
        token,
        expiresAt,
        used: false,
      },
    });
    
    return token;
  }
  
  /**
   * Verify a password reset token
   */
  static async verifyToken(token: string): Promise<string | null> {
    const resetToken = await prisma.passwordReset.findUnique({
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
  }
  
  /**
   * Mark a token as used
   */
  static async markTokenAsUsed(token: string): Promise<boolean> {
    try {
      await prisma.passwordReset.update({
        where: { token },
        data: { used: true },
      });
      return true;
    } catch (error) {
      console.error('Error marking token as used:', error);
      return false;
    }
  }
  
  /**
   * Check rate limit for password reset attempts
   * Returns true if within rate limit, false if exceeded
   */
  static async checkRateLimit(email: string): Promise<boolean> {
    const MAX_ATTEMPTS = 5; // 5 attempts per day
    const RESET_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // Get or create attempt record
    let attempt = await prisma.passwordResetAttempt.findUnique({
      where: { email },
    });
    
    const now = new Date();
    
    if (!attempt) {
      // First attempt
      await prisma.passwordResetAttempt.create({
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
      await prisma.passwordResetAttempt.update({
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
    await prisma.passwordResetAttempt.update({
      where: { email },
      data: {
        attemptCount: attempt.attemptCount + 1,
        lastAttemptAt: now,
      },
    });
    
    return true;
  }
} 