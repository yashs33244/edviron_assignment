"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Create payment route (protected)
router.post('/create-payment', auth_1.protect, paymentController_1.createPayment);
// Webhook route (public)
router.post('/webhook', paymentController_1.processWebhook);
// Check transaction status with collect request ID (protected)
router.get('/check-status/:collectRequestId', auth_1.protect, paymentController_1.checkTransactionStatus);
// Get all transactions route (protected)
router.get('/transactions', auth_1.protect, paymentController_1.getAllTransactions);
// Get user's transactions route (protected)
router.get('/user-transactions', auth_1.protect, paymentController_1.getUserTransactions);
// Get transactions by school route (protected)
router.get('/transactions/school/:schoolId', auth_1.protect, paymentController_1.getTransactionsBySchool);
// Get transaction status route (protected)
router.get('/transaction-status/:customOrderId', paymentController_1.getTransactionStatus);
exports.default = router;
