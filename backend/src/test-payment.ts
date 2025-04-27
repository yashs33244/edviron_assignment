import dotenv from 'dotenv';
import { createCollectRequest } from './utils/paymentService';

// Load environment variables
dotenv.config();

async function testPaymentGateway() {
  console.log('🧪 Testing Payment Gateway Integration...');
  console.log('----------------------------------------');
  console.log('Environment Variables:');
  console.log(`PG_KEY: ${process.env.PG_KEY}`);
  console.log(`SCHOOL_ID: ${process.env.SCHOOL_ID}`);
  console.log(`PG_API_KEY: ${process.env.PG_API_KEY?.substring(0, 20)}...`);
  console.log('----------------------------------------');

  try {
    const paymentData = {
      studentName: 'Test Student',
      studentId: 'TS12345',
      studentEmail: 'test.student@example.com',
      amount: 1000,
    };

    console.log('Making payment request with data:', paymentData);
    const result = await createCollectRequest(paymentData);

    if (result.success) {
      console.log('✅ Payment request successful!');
      console.log('Response data:', result.data);
      if (result.data.redirectUrl) {
        console.log('Redirect URL:', result.data.redirectUrl);
      }
    } else {
      console.log('❌ Payment request failed!');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testPaymentGateway()
  .then(() => {
    console.log('Test completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 