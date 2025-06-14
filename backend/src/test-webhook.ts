import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const API_URL = process.env.API_URL || "https://edbe.itsyash.space";
// Create a webhook simulator
async function simulateWebhook() {
  try {
    // Get collect request ID from command line
    const collectRequestId = process.argv[2];
    
    if (!collectRequestId) {
      console.error('Usage: npx ts-node src/test-webhook.ts <collect_request_id>');
      process.exit(1);
    }

    console.log(`Simulating webhook for collect_request_id: ${collectRequestId}`);

    // Create sample webhook payload
    const webhookPayload = {
      status: 'SUCCESS',
      amount: 10,
      transaction_amount: 10,
      status_code: 200,
      details: {
        payment_mode: 'upi',
        bank_ref: '1234567890',
        payment_methods: {
          upi: {
            channel: null,
            upi_id: null
          }
        }
      },
      custom_order_id: 'NA',
      collect_request_id: collectRequestId,
      capture_status: 'PENDING',
      jwt: 'dummy-jwt-token',
      sign: 'dummy-sign'
    };

    console.log('Sending webhook payload:', JSON.stringify(webhookPayload, null, 2));

    // Post to webhook endpoint
    const response = await axios.post(
      `${API_URL}/api/payments/webhook`,
      webhookPayload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Webhook response:', response.data);
  } catch (error: any) {
    console.error('Webhook simulation error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the simulator
simulateWebhook(); 