
import dotenv from 'dotenv';
import prisma from '../config/db';

// Load environment variables
dotenv.config();



async function clearOrders() {
  try {
    console.log('Starting to clear orders and order statuses...');

    // Delete all order statuses first (due to foreign key constraints)
    const deletedOrderStatuses = await prisma.orderStatus.deleteMany({});
    console.log(`Deleted ${deletedOrderStatuses.count} order statuses`);

    // Delete all orders
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`Deleted ${deletedOrders.count} orders`);

    console.log('Successfully cleared all orders and order statuses');
  } catch (error) {
    console.error('Error clearing orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
clearOrders(); 