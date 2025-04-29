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
const db_1 = __importDefault(require("../src/config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
/**
 * Seed function - populates the database with test data
 */
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Starting seed...');
        try {
            // Clear existing data
            yield db_1.default.orderStatus.deleteMany();
            yield db_1.default.order.deleteMany();
            yield db_1.default.user.deleteMany();
            yield db_1.default.webhookLog.deleteMany();
            console.log('✓ Cleared existing data');
            // Create test user
            const hashedPassword = yield bcryptjs_1.default.hash('password123', 10);
            const user = yield db_1.default.user.create({
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
                const order = yield db_1.default.order.create({
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
                const orderStatus = yield db_1.default.orderStatus.create({
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
        }
        catch (error) {
            console.error('Error during seeding:', error);
        }
        finally {
            yield db_1.default.$disconnect();
        }
    });
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
