import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for a user
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

/**
 * Generate JWT token for payment gateway API
 * @param {Object} payload - Data to be signed
 * @returns {string} JWT token
 */
export const generatePaymentToken = (payload: any): string => {
  return jwt.sign(payload, process.env.PG_API_KEY as string);
}; 