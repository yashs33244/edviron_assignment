import nodemailer from 'nodemailer';
import { env } from '../config/env';
import logger from '../utils/logger';

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: env.EMAIL_SERVER_HOST,
  port: env.EMAIL_SERVER_PORT,
  secure: env.EMAIL_SERVER_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
});

// Define email templates
const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to Payment Gateway!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for joining our payment gateway service.</p>
        <p>You can now start using our platform to process transactions securely.</p>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The Payment Gateway Team</p>
      </div>
    `,
  }),
  forgotPassword: (name: string, resetLink: string) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Please click the link below to set a new password:</p>
        <p><a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Payment Gateway Team</p>
      </div>
    `,
  }),
  paymentConfirmation: (name: string, amount: number, transactionId: string) => ({
    subject: 'Payment Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Confirmation</h2>
        <p>Hello ${name},</p>
        <p>We're confirming that your payment of ₹${amount.toFixed(2)} has been processed successfully.</p>
        <p>Transaction ID: ${transactionId}</p>
        <p>Thank you for using our payment gateway!</p>
        <p>Best regards,<br>The Payment Gateway Team</p>
      </div>
    `,
  }),
};

// Service functions
const emailService = {
  /**
   * Send an email
   */
  sendEmail: async (to: string, template: keyof typeof emailTemplates, data: any) => {
    try {
      //@ts-ignore
      const { subject, html } = emailTemplates[template](...data);
      
      const mailOptions = {
        from: env.EMAIL_FROM,
        to,
        subject,
        html,
      };
      
      await transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${template} to ${to}`);
      return true;
    } catch (error) {
      logger.error(`Error sending email: ${error}`);
      return false;
    }
  },
  
  /**
   * Send welcome email
   */
  sendWelcomeEmail: async (to: string, name: string) => {
    return emailService.sendEmail(to, 'welcome', [name]);
  },
  
  /**
   * Send forgot password email
   */
  sendForgotPasswordEmail: async (to: string, name: string, resetLink: string) => {
    return emailService.sendEmail(to, 'forgotPassword', [name, resetLink]);
  },
  
  /**
   * Send payment confirmation email
   */
  sendPaymentConfirmationEmail: async (to: string, name: string, amount: number, transactionId: string) => {
    return emailService.sendEmail(to, 'paymentConfirmation', [name, amount, transactionId]);
  },
};

export default emailService;
