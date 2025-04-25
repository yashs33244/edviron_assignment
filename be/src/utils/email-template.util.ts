import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import logger from './logger';

/**
 * Path to email templates directory
 */
const templatesDir = path.join(__dirname, '../templates');

/**
 * Cache of compiled templates
 */
const templateCache: Record<string, Handlebars.TemplateDelegate> = {};

/**
 * Register Handlebars helpers
 */
Handlebars.registerHelper('formatDate', (date: Date | string) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

Handlebars.registerHelper('formatCurrency', (amount: number | string) => {
  if (!amount) return '₹0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(numAmount);
});

/**
 * Load and compile a template
 * @param templateName - The name of the template to load (without extension)
 * @returns The compiled template
 */
export const loadTemplate = (templateName: string): Handlebars.TemplateDelegate => {
  try {
    // Return cached template if available
    if (templateCache[templateName]) {
      return templateCache[templateName];
    }
    
    // Load template file
    const templatePath = path.join(templatesDir, `${templateName}.html`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    
    // Compile template
    const compiledTemplate = Handlebars.compile(templateContent);
    templateCache[templateName] = compiledTemplate;
    
    return compiledTemplate;
  } catch (error) {
    logger.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Failed to load template ${templateName}`);
  }
};

/**
 * Render a template with data
 * @param templateName - The name of the template to render (without extension)
 * @param data - The data to pass to the template
 * @returns The rendered HTML
 */
export const renderTemplate = (templateName: string, data: Record<string, any>): string => {
  try {
    const template = loadTemplate(templateName);
    return template(data);
  } catch (error) {
    logger.error(`Error rendering template ${templateName}:`, error);
    throw new Error(`Failed to render template ${templateName}`);
  }
};

/**
 * Available email templates
 */
export enum EmailTemplate {
  WELCOME = 'welcome',
  RESET_PASSWORD = 'reset-password',
  PAYMENT_CONFIRMATION = 'payment-confirmation',
}

/**
 * Get common template data
 * @returns Common template data
 */
export const getCommonTemplateData = () => {
  return {
    currentYear: new Date().getFullYear(),
    companyName: 'Payment Gateway',
    companyAddress: '123 Payment Street, Finance City, FC 12345',
    companyEmail: 'support@paymentgateway.com',
    companyPhone: '+1-800-123-4567',
    companyWebsite: 'https://paymentgateway.com',
  };
};
