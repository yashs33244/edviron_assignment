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
const dotenv_1 = __importDefault(require("dotenv"));
const paymentService_1 = require("./utils/paymentService");
// Load environment variables
dotenv_1.default.config();
function testPaymentGateway() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log('🧪 Testing Payment Gateway Integration...');
        console.log('----------------------------------------');
        console.log('Environment Variables:');
        console.log(`PG_KEY: ${process.env.PG_KEY}`);
        console.log(`SCHOOL_ID: ${process.env.SCHOOL_ID}`);
        console.log(`PG_API_KEY: ${(_a = process.env.PG_API_KEY) === null || _a === void 0 ? void 0 : _a.substring(0, 20)}...`);
        console.log('----------------------------------------');
        try {
            const paymentData = {
                studentName: 'Test Student',
                studentId: 'TS12345',
                studentEmail: 'test.student@example.com',
                amount: 1000,
            };
            console.log('Making payment request with data:', paymentData);
            const result = yield (0, paymentService_1.createCollectRequest)(paymentData);
            if (result.success) {
                console.log('✅ Payment request successful!');
                console.log('Response data:', result.data);
                if (result.data.redirectUrl) {
                    console.log('Redirect URL:', result.data.redirectUrl);
                }
            }
            else {
                console.log('❌ Payment request failed!');
                console.log('Error:', result.error);
            }
        }
        catch (error) {
            console.error('❌ Test failed with error:', error);
        }
    });
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
