import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

/**
 * Seed function - populates the database with test data
 */
async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // Clear existing data
    await prisma.orderStatus.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    await prisma.webhookLog.deleteMany();

    console.log('✓ Cleared existing data');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log(`✓ Created test user: ${user.email}`);

    // Create some test orders
    const orders = [];
    for (let i = 1; i <= 5; i++) {
      const order = await prisma.order.create({
        data: {
          school_id: process.env.SCHOOL_ID || '65b0e6293e9f76a9694d84b4',
          trustee_id: '65b0e552dd31950a9b41c5ba',
          student_info: {
            name: `Student ${i}`,
            id: `S1000${i}`,
            email: `student${i}@example.com`,
          },
          gateway_name: 'PhonePe',
          custom_order_id: `ORD-${Date.now()}-${i}`,
        },
      });
      orders.push(order);
    }

    console.log(`✓ Created ${orders.length} test orders`);

    // Create order statuses
    const statuses = ['pending', 'success', 'failed', 'processing', 'refunded'];
    const paymentModes = ['upi', 'netbanking', 'card', 'wallet'];

    for (let i = 0; i < orders.length; i++) {
      const orderStatus = await prisma.orderStatus.create({
        data: {
          collect_id: orders[i].id,
          order_amount: 1000 + i * 500,
          transaction_amount: 1000 + i * 500 + (i === 1 ? 200 : 0), // Add convenience fee for one transaction
          payment_mode: paymentModes[i % paymentModes.length],
          payment_details: `Payment details for order ${i + 1}`,
          bank_reference: `REF${i}${Date.now().toString().slice(-6)}`,
          payment_message: 'Transaction completed',
          status: statuses[i % statuses.length],
          error_message: i % statuses.length === 2 ? 'Payment failed due to insufficient funds' : null,
          payment_time: new Date(Date.now() - i * 3600000), // Stagger times by hour
        },
      });

      console.log(`✓ Created order status for order ${i + 1}: ${orderStatus.status}`);
    }

    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  }); 