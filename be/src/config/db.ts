import { PrismaClient } from '@prisma/client';

// Create a global instance of Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

export default prisma; 