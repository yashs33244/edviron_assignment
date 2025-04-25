import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import logger from './logger';

/**
 * Interface for JWT payload
 */
export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate a JWT token
 * @param payload - The data to include in the token
 * @param expiresIn - Token expiration time (default: 1 day)
 * @returns The generated JWT token
 */
export const generateToken = (
  payload: JwtPayload,
  expiresIn: string | number = '1d'
): string => {
  try {
    const options: jwt.SignOptions = { expiresIn: Number(expiresIn) };
    return jwt.sign(payload, env.JWT_SECRET, options);
  } catch (error) {
    logger.error('Error generating JWT token:', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Verify a JWT token
 * @param token - The JWT token to verify
 * @returns The decoded token payload or null if invalid
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    logger.error('Error verifying JWT token:', error);
    return null;
  }
};

/**
 * Decode a JWT token without verification
 * @param token - The JWT token to decode
 * @returns The decoded token payload or null if invalid
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    logger.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Generate a temporary token with short expiration
 * @param data - The data to include in the token
 * @param expiresIn - Token expiration time (default: 15 minutes)
 * @returns The generated JWT token
 */
export const generateTemporaryToken = (
  data: Record<string, any>,
  expiresIn: string | number = '15m'
): string => {
  try {
    const options: jwt.SignOptions = { expiresIn: Number(expiresIn) };
    return jwt.sign(data, env.JWT_SECRET, options);
  } catch (error) {
    logger.error('Error generating temporary JWT token:', error);
    throw new Error('Failed to generate temporary token');
  }
};
