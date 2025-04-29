"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const API_URL = process.env.API_URL || "https://edbe.yashprojects.online";
// Create a webhook simulator
function simulateWebhook() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield axios_1.default.post(`${API_URL}/api/payments/webhook`, webhookPayload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Webhook response:', response.data);
        }
        catch (error) {
            console.error('Webhook simulation error:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
        }
    });
}
// Run the simulator
simulateWebhook();
