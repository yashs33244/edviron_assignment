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
const db_1 = __importDefault(require("../config/db"));
// Load environment variables
dotenv_1.default.config();
function clearOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting to clear orders and order statuses...');
            // Delete all order statuses first (due to foreign key constraints)
            const deletedOrderStatuses = yield db_1.default.orderStatus.deleteMany({});
            console.log(`Deleted ${deletedOrderStatuses.count} order statuses`);
            // Delete all orders
            const deletedOrders = yield db_1.default.order.deleteMany({});
            console.log(`Deleted ${deletedOrders.count} orders`);
            console.log('Successfully cleared all orders and order statuses');
        }
        catch (error) {
            console.error('Error clearing orders:', error);
        }
        finally {
            yield db_1.default.$disconnect();
        }
    });
}
// Run the script
clearOrders();
