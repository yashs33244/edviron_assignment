import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { env } from '../config/env';
import logger from './logger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { compile } from 'handlebars';

// Initialize email transporter
let transporter: Transporter;

// Email templates cache
const templates: Record<string, HandlebarsTemplateDelegate> = {};

/**
 * Initialize the email transporter
 */
export const initMailer = (): void => {
  transporter = nodemailer.createTransport({
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    secure: env.EMAIL_SERVER_PORT === 465,
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Verify connection configuration
  transporter.verify((error) => {
    if (error) {
      logger.error('Error connecting to email server:', error);
    } else {
      logger.info('Ready to send emails');
    }
  });
};

/**
 * Load and compile a template from the templates directory
 */
export const loadTemplate = (templateName: string): HandlebarsTemplateDelegate => {
  if (templates[templateName]) {
    return templates[templateName];
  }

  try {
    const templatePath = join(__dirname, '../templates', `${templateName}.html`);
    const templateSource = readFileSync(templatePath, 'utf8');
    const template = compile(templateSource);
    templates[templateName] = template;
    return template;
  } catch (error) {
    logger.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
};

/**
 * Send an email
 */
export const sendMail = async (
  to: string | string[],
  subject: string,
  templateName: string,
  context: Record<string, any>
): Promise<boolean> => {
  if (!transporter) {
    initMailer();
  }

  try {
    const template = loadTemplate(templateName);
    const html = template(context);

    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: Array.isArray(to) ? to.join(',') : to,
      subject,
      html,
    });

    logger.info(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send a welcome email
 */
export const sendWelcomeEmail = async (to: string, name: string): Promise<boolean> => {
  return sendMail(to, 'Welcome to Payment Gateway!', 'welcome', { name });
};

/**
 * Send a password reset email
 */
export const sendPasswordResetEmail = async (
  to: string,
  name: string,
  resetToken: string
): Promise<boolean> => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  return sendMail(to, 'Reset Your Password', 'reset-password', { name, resetLink });
};

/**
 * Send a payment confirmation email
 */
export const sendPaymentConfirmationEmail = async (
  to: string,
  name: string,
  amount: number,
  transactionId: string
): Promise<boolean> => {
  return sendMail(to, 'Payment Confirmation', 'payment-confirmation', {
    name,
    amount: amount.toFixed(2),
    transactionId,
    date: new Date().toLocaleDateString(),
  });
}; 