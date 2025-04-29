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
const db_1 = __importDefault(require("./config/db"));
// Load environment variables
dotenv_1.default.config();
// Find transaction by collect_request_id
function findTransaction() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            // Get collect request ID from command line
            const collectRequestId = process.argv[2];
            if (!collectRequestId) {
                console.error('Usage: npx ts-node src/find-transaction.ts <collect_request_id>');
                process.exit(1);
            }
            console.log(`Looking for transaction with collect_request_id: ${collectRequestId}`);
            // Find order by collect_request_id
            const order = yield db_1.default.order.findFirst({
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
                status: ((_a = order.orderStatus) === null || _a === void 0 ? void 0 : _a.status) || 'unknown',
                order_amount: ((_b = order.orderStatus) === null || _b === void 0 ? void 0 : _b.order_amount) || 0,
                transaction_amount: ((_c = order.orderStatus) === null || _c === void 0 ? void 0 : _c.transaction_amount) || 0,
                payment_mode: ((_d = order.orderStatus) === null || _d === void 0 ? void 0 : _d.payment_mode) || 'unknown',
                payment_time: (_e = order.orderStatus) === null || _e === void 0 ? void 0 : _e.payment_time,
            }, null, 2));
        }
        catch (error) {
            console.error('Error finding transaction:', error.message);
        }
        finally {
            yield db_1.default.$disconnect();
        }
    });
}
// Run the finder
findTransaction();
