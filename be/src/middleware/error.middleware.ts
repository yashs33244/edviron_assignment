import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found error handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Global error handler
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Default error status
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  
  // Handle Prisma errors
  if (err.code && err.code.startsWith('P')) {
    // See: https://www.prisma.io/docs/reference/api-reference/error-reference
    switch (err.code) {
      case 'P2002': // Unique constraint failed
        statusCode = 400;
        message = 'A record with this information already exists';
        break;
      case 'P2025': // Record not found
        statusCode = 404;
        message = 'Record not found';
        break;
      default:
        statusCode = 500;
        message = 'Database error';
    }
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }
  
  // Log error details
  if (statusCode >= 500) {
    logger.error(`Unhandled error: ${err.stack}`);
  } else {
    logger.warn(`Error response (${statusCode}): ${message}`);
  }
  
  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

/**
 * Async handler wrapper to avoid try-catch blocks
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
