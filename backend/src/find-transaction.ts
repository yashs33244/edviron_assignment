import dotenv from 'dotenv';
import prisma from './config/db';

// Load environment variables
dotenv.config();

// Find transaction by collect_request_id
async function findTransaction() {
  try {
    // Get collect request ID from command line
    const collectRequestId = process.argv[2];
    
    if (!collectRequestId) {
      console.error('Usage: npx ts-node src/find-transaction.ts <collect_request_id>');
      process.exit(1);
    }

    console.log(`Looking for transaction with collect_request_id: ${collectRequestId}`);

    // Find order by collect_request_id
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { custom_order_id: collectRequestId },
          { collect_request_id: collectRequestId }
        ]
      },
      include: {
        orderStatus: true
      }
    });

    if (!order) {
      console.log('No transaction found with this ID');
      process.exit(0);
    }

    console.log('Transaction found:');
    console.log(JSON.stringify({
      id: order.id,
      school_id: order.school_id,
      custom_order_id: order.custom_order_id,
      collect_request_id: order.collect_request_id,
      student_info: order.student_info,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      status: order.orderStatus?.status || 'unknown',
      order_amount: order.orderStatus?.order_amount || 0,
      transaction_amount: order.orderStatus?.transaction_amount || 0,
      payment_mode: order.orderStatus?.payment_mode || 'unknown',
      payment_time: order.orderStatus?.payment_time,
    }, null, 2));
  } catch (error: any) {
    console.error('Error finding transaction:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the finder
findTransaction(); 