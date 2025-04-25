import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
config();

// Define schema for environment variables
const envSchema = z.object({
  // MongoDB
  MONGODB_URI: z.string().min(1),
  
  // Email
  EMAIL_SERVER_HOST: z.string().min(1),
  EMAIL_SERVER_PORT: z.coerce.number(),
  EMAIL_SERVER_USER: z.string().min(1),
  EMAIL_SERVER_PASSWORD: z.string().min(1),
  EMAIL_FROM: z.string().email(),
  
  // Auth
  JWT_SECRET: z.string().min(1),
  
  // Payment Gateway
  PG_KEY: z.string().min(1),
  PG_API_KEY: z.string().min(1),
  SCHOOL_ID: z.string().min(1),
  
  // Server
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse and validate environment variables
const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  console.error('❌ Invalid environment variables:', envResult.error.format());
  throw new Error('Invalid environment variables');
}

// Export validated environment variables
export const env = envResult.data;
