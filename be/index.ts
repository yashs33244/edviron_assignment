import app from './src/app';
import { env } from './src/config/env';
import logger from './src/utils/logger';
import prisma from './src/config/db';
import { initMailer } from './src/utils/mailer';
import fs from 'fs';
import path from 'path';

const PORT = env.PORT || 4000;

// Check if templates directory exists and create if not
const ensureTemplatesDirectory = () => {
  const templatesDir = path.join(__dirname, 'src', 'templates');
  if (!fs.existsSync(templatesDir)) {
    logger.info('Creating templates directory');
    fs.mkdirSync(templatesDir, { recursive: true });
  }
};

// Connect to database and start server
async function bootstrap() {
  try {
    // Ensure templates directory exists
    ensureTemplatesDirectory();
    
    // Initialize mailer
    initMailer();
    logger.info('Email service initialized');
    
    // Connect to the database
    await prisma.$connect();
    logger.info('Connected to database');

    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
      logger.info(`API documentation available at http://localhost:${PORT}/api-docs`);
      logger.info(`Health check endpoint: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap().catch((error) => {
  logger.error('Unhandled bootstrap error:', error);
  process.exit(1);
});

// Handle application shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});