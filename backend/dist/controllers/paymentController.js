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
exports.getTransactionStatus = exports.getUserTransactions = exports.getTransactionsBySchool = exports.getAllTransactions = exports.checkTransactionStatus = exports.processWebhook = exports.createPayment = void 0;
const db_1 = __importDefault(require("../config/db"));
const paymentService_1 = require("../utils/paymentService");
// Default values
const DEFAULT_SCHOOL_ID = process.env.SCHOOL_ID || '65b0e6293e9f76a9694d84b4';
const PG_KEY = process.env.PG_KEY || 'edvtest01';
const DEFAULT_TRUSTEE_ID = process.env.TRUSTEE_ID || '65b0e552dd31950a9b41c5ba';
const PG_API_URL = process.env.PG_API_URL || 'https://dev-vanilla.edviron.com/erp';
const API_KEY = process.env.API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw';
const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || '65b0e552dd31950a9b41c5fa'; // Default user ID for system operations
/**
 * Create a new payment request
 * @route POST /api/payments/create-payment
 * @access Private
 */
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("[Payment Controller] Create payment request received");
        const startTime = Date.now();
        // Extract payment details from request body
        const { school_id, amount, callback_url, student_info, pg_key, custom_order_id } = req.body;
        // Validate required fields
        if (!school_id || !amount || !callback_url || !student_info) {
            console.error("[Payment Controller] Missing required fields in create payment request");
            return res.status(400).json({
                success: false,
                message: "Missing required fields: school_id, amount, callback_url, and student_info are required"
            });
        }
        console.log(`[Payment Controller] Creating payment for school: ${school_id}, amount: ${amount}`);
        try {
            // Get the user ID from the authenticated request
            const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || DEFAULT_USER_ID;
            // Use the payment service
            const paymentResult = yield (0, paymentService_1.createCollectRequest)({
                studentName: student_info.name,
                studentId: student_info.id,
                studentEmail: student_info.email,
                amount,
                school_id,
                callback_url,
                userId // Pass the user ID
            });
            if (paymentResult.success) {
                return res.status(200).json({
                    success: true,
                    message: "Payment request created successfully",
                    data: paymentResult.data
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: paymentResult.error || "Failed to create payment request"
                });
            }
        }
        catch (dbError) {
            console.error(`[Payment Controller] Database error: ${dbError.message}`);
            return res.status(500).json({
                success: false,
                message: "Failed to process payment due to database error"
            });
        }
    }
    catch (error) {
        console.error(`[Payment Controller] Unexpected error: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred"
        });
    }
});
exports.createPayment = createPayment;
/**
 * Process webhook from payment gateway
 * @route POST /api/payments/webhook
 * @access Public (but typically secured by IP filtering or secret verification)
 */
const processWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Log the entire webhook payload
        console.log('Webhook payload:', JSON.stringify(req.body, null, 2));
        // Extract data from the webhook payload
        const { status, amount, transaction_amount, details, custom_order_id, collect_request_id } = req.body;
        if (!collect_request_id) {
            console.error('Missing collect_request_id in webhook payload');
            return res.status(200).json({
                success: false,
                message: 'Missing collect_request_id in webhook payload',
            });
        }
        // Log webhook
        try {
            yield db_1.default.webhookLog.create({
                data: {
                    payload: req.body,
                    status: (status === null || status === void 0 ? void 0 : status.toString()) || 'unknown',
                },
            });
        }
        catch (logError) {
            console.error('Failed to log webhook:', logError);
        }
        try {
            // Find existing order by collect_request_id
            let order = yield db_1.default.order.findFirst({
                where: { collect_request_id },
                include: { orderStatus: true },
            });
            // If no order found, try finding by custom_order_id
            if (!order && custom_order_id && custom_order_id !== 'NA') {
                order = yield db_1.default.order.findFirst({
                    where: { custom_order_id },
                    include: { orderStatus: true },
                });
            }
            if (!order) {
                console.log('Order not found, creating new one');
                // Create a new order record
                order = yield db_1.default.order.create({
                    data: {
                        school_id: DEFAULT_SCHOOL_ID,
                        trustee_id: DEFAULT_TRUSTEE_ID,
                        gateway_name: 'Edviron Payment Gateway not found order',
                        custom_order_id: custom_order_id !== 'NA' ? custom_order_id : `ORD-${Date.now()}`,
                        collect_request_id,
                        student_info: { name: 'Unknown', id: 'Unknown', email: 'Unknown' },
                        // Add required user relation
                        user: {
                            connect: {
                                id: DEFAULT_USER_ID
                            }
                        }
                    },
                    include: { orderStatus: true },
                });
            }
            // Determine payment status
            const paymentStatus = ((_a = status === null || status === void 0 ? void 0 : status.toString()) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === 'SUCCESS' ? 'success' :
                (((_b = status === null || status === void 0 ? void 0 : status.toString()) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === 'FAILURE' || ((_c = status === null || status === void 0 ? void 0 : status.toString()) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === 'FAILED') ? 'failed' : 'pending';
            // Update OrderStatus
            if (order && order.orderStatus) {
                // Update existing order status
                yield db_1.default.orderStatus.update({
                    where: { id: order.orderStatus.id },
                    data: {
                        order_amount: parseFloat((amount === null || amount === void 0 ? void 0 : amount.toString()) || '0') || order.orderStatus.order_amount,
                        transaction_amount: parseFloat((transaction_amount === null || transaction_amount === void 0 ? void 0 : transaction_amount.toString()) || '0') || order.orderStatus.transaction_amount,
                        status: paymentStatus,
                        payment_mode: (details === null || details === void 0 ? void 0 : details.payment_mode) || order.orderStatus.payment_mode,
                        payment_details: JSON.stringify(details || {}),
                        bank_reference: (details === null || details === void 0 ? void 0 : details.bank_ref) || order.orderStatus.bank_reference,
                        payment_time: new Date(),
                    }
                });
            }
            else if (order) {
                // Create new order status
                yield db_1.default.orderStatus.create({
                    data: {
                        collect_id: order.id,
                        order_amount: parseFloat((amount === null || amount === void 0 ? void 0 : amount.toString()) || '0') || 0,
                        transaction_amount: parseFloat((transaction_amount === null || transaction_amount === void 0 ? void 0 : transaction_amount.toString()) || '0') || 0,
                        status: paymentStatus,
                        payment_mode: details === null || details === void 0 ? void 0 : details.payment_mode,
                        payment_details: JSON.stringify(details || {}),
                        bank_reference: details === null || details === void 0 ? void 0 : details.bank_ref,
                        payment_time: new Date(),
                    }
                });
            }
            // Update or create Transaction record
            if (order) {
                const existingTransaction = yield db_1.default.transaction.findFirst({
                    where: { order_id: order.id }
                });
                if (existingTransaction) {
                    // Update existing transaction
                    yield db_1.default.transaction.update({
                        where: { id: existingTransaction.id },
                        data: {
                            amount: parseFloat((amount === null || amount === void 0 ? void 0 : amount.toString()) || '0') || existingTransaction.amount,
                            status: paymentStatus,
                            payment_mode: (details === null || details === void 0 ? void 0 : details.payment_mode) || existingTransaction.payment_mode,
                            payment_details: JSON.stringify(details || {}),
                            bank_reference: (details === null || details === void 0 ? void 0 : details.bank_ref) || existingTransaction.bank_reference,
                            payment_time: new Date(),
                        }
                    });
                }
                else {
                    // Create new transaction record
                    yield db_1.default.transaction.create({
                        data: {
                            order_id: order.id,
                            school_id: order.school_id,
                            student_id: order.student_info.id,
                            amount: parseFloat((amount === null || amount === void 0 ? void 0 : amount.toString()) || '0') || 0,
                            status: paymentStatus,
                            payment_mode: details === null || details === void 0 ? void 0 : details.payment_mode,
                            payment_details: JSON.stringify(details || {}),
                            bank_reference: details === null || details === void 0 ? void 0 : details.bank_ref,
                            payment_time: new Date(),
                        }
                    });
                }
            }
            res.status(200).json({
                success: true,
                message: 'Webhook processed successfully',
            });
        }
        catch (dbError) {
            console.error('Database error in webhook processing:', dbError.message);
            console.error('Stack trace:', dbError.stack);
            // Always return 200 for webhooks even if there's an error
            res.status(200).json({
                success: false,
                message: 'Database error processing webhook',
            });
        }
    }
    catch (error) {
        console.error('Process webhook error:', error.message);
        console.error('Stack trace:', error.stack);
        // Always return 200 for webhooks
        res.status(200).json({
            success: false,
            message: 'Error processing webhook',
        });
    }
});
exports.processWebhook = processWebhook;
/**
 * Check transaction status
 * @route GET /api/payments/check-status/:collectRequestId
 * @access Private
 */
const checkTransactionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    try {
        const { collectRequestId } = req.params;
        console.log(`[Backend] Received payment status check request for collectRequestId: ${collectRequestId}`);
        if (!collectRequestId) {
            console.log('[Backend] Error: collectRequestId is missing in the request');
            return res.status(400).json({
                success: false,
                message: 'Collect request ID is required',
            });
        }
        // Get school ID from request or use default
        const schoolId = ((_a = req.query.school_id) === null || _a === void 0 ? void 0 : _a.toString()) || DEFAULT_SCHOOL_ID;
        console.log(`[Backend] Using school_id: ${schoolId} for payment status check`);
        // Check if order exists first
        const existingOrder = yield db_1.default.order.findFirst({
            where: { collect_request_id: collectRequestId },
            include: { orderStatus: true },
        });
        if (existingOrder) {
            console.log(`[Backend] Found existing order: ${existingOrder.id} for collectRequestId: ${collectRequestId}`);
            // If order exists and has a success status, return that
            if (((_b = existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.orderStatus) === null || _b === void 0 ? void 0 : _b.status) === 'success') {
                console.log(`[Backend] Order ${existingOrder.id} already has success status, returning cached result`);
                return res.status(200).json({
                    success: true,
                    data: {
                        status: 'SUCCESS',
                        order_id: existingOrder.id,
                        collect_request_id: collectRequestId,
                        order_amount: existingOrder.orderStatus.order_amount,
                        transaction_amount: existingOrder.orderStatus.transaction_amount,
                        payment_details: existingOrder.orderStatus.payment_details,
                        payment_time: existingOrder.orderStatus.payment_time,
                        orderStatus: existingOrder.orderStatus,
                    },
                });
            }
            else {
                console.log(`[Backend] Order ${existingOrder.id} has status: ${((_c = existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.orderStatus) === null || _c === void 0 ? void 0 : _c.status) || 'no status'}, checking with payment gateway`);
            }
        }
        else {
            console.log(`[Backend] No order found for collectRequestId: ${collectRequestId}, will check with payment gateway`);
        }
        // Check payment status from the payment gateway
        console.log(`[Backend] Calling checkPaymentStatus for collectRequestId: ${collectRequestId} with schoolId: ${schoolId}`);
        const startTime = Date.now();
        const statusResponse = yield (0, paymentService_1.checkPaymentStatus)(collectRequestId, schoolId);
        const endTime = Date.now();
        console.log(`[Backend] Payment gateway response received in ${endTime - startTime}ms: ${JSON.stringify(statusResponse, null, 2)}`);
        if (!statusResponse.success) {
            console.log(`[Backend] Error from payment gateway: ${statusResponse.error}`);
            return res.status(400).json({
                success: false,
                message: statusResponse.error,
            });
        }
        const paymentStatus = ((_e = (_d = statusResponse.data) === null || _d === void 0 ? void 0 : _d.status) === null || _e === void 0 ? void 0 : _e.toUpperCase()) || 'UNKNOWN';
        console.log(`[Backend] Payment status from gateway: ${paymentStatus}`);
        // If payment status is successful, update order and trigger webhook simulation
        if (paymentStatus === 'SUCCESS' || ((_f = statusResponse.data) === null || _f === void 0 ? void 0 : _f.status) === 'success') {
            console.log('[Backend] Payment successful, updating order status');
            // Find the order
            const order = yield db_1.default.order.findFirst({
                where: { collect_request_id: collectRequestId },
                include: { orderStatus: true },
            });
            if (order) {
                console.log(`[Backend] Found order: ${order.id} to update with success status`);
                // Update order status to success
                if (order.orderStatus) {
                    console.log(`[Backend] Updating existing order status: ${order.orderStatus.id}`);
                    yield db_1.default.orderStatus.update({
                        where: { id: order.orderStatus.id },
                        data: {
                            status: 'success',
                            payment_time: new Date(),
                            payment_details: JSON.stringify(statusResponse.data || {})
                        }
                    });
                    console.log(`[Backend] Updated order status to success for order ${order.id}`);
                }
                else {
                    console.log(`[Backend] Creating new order status for order: ${order.id}`);
                    // Create new order status
                    yield db_1.default.orderStatus.create({
                        data: {
                            collect_id: order.id,
                            order_amount: parseFloat(((_g = statusResponse.data.amount) === null || _g === void 0 ? void 0 : _g.toString()) || '0'),
                            transaction_amount: parseFloat(((_h = statusResponse.data.amount) === null || _h === void 0 ? void 0 : _h.toString()) || '0'),
                            status: 'success',
                            payment_details: JSON.stringify(statusResponse.data || {}),
                            payment_time: new Date(),
                        }
                    });
                    console.log(`[Backend] Created new success order status for order ${order.id}`);
                }
                // Update or create transaction record
                const existingTransaction = yield db_1.default.transaction.findFirst({
                    where: { order_id: order.id }
                });
                if (existingTransaction) {
                    yield db_1.default.transaction.update({
                        where: { id: existingTransaction.id },
                        data: {
                            status: 'success',
                            amount: parseFloat(((_j = statusResponse.data.amount) === null || _j === void 0 ? void 0 : _j.toString()) || '0'),
                            payment_details: JSON.stringify(statusResponse.data || {}),
                            payment_time: new Date()
                        }
                    });
                    console.log(`[Backend] Updated transaction record for order ${order.id}`);
                }
                else {
                    yield db_1.default.transaction.create({
                        data: {
                            order_id: order.id,
                            school_id: order.school_id,
                            student_id: order.student_info.id,
                            amount: parseFloat(((_k = statusResponse.data.amount) === null || _k === void 0 ? void 0 : _k.toString()) || '0'),
                            status: 'success',
                            payment_details: JSON.stringify(statusResponse.data || {}),
                            payment_time: new Date(),
                        }
                    });
                    console.log(`[Backend] Created new transaction record for order ${order.id}`);
                }
                // Simulate webhook notification for successful payment
                const webhookData = {
                    status: 'SUCCESS',
                    amount: statusResponse.data.amount,
                    transaction_amount: statusResponse.data.amount,
                    collect_request_id: collectRequestId,
                    custom_order_id: order.custom_order_id,
                    details: statusResponse.data.details || {}
                };
                // Log webhook simulation
                console.log('[Backend] Simulating webhook for successful payment:', JSON.stringify(webhookData, null, 2));
                try {
                    // Log the webhook
                    yield db_1.default.webhookLog.create({
                        data: {
                            payload: webhookData,
                            status: 'SUCCESS',
                        },
                    });
                    console.log('[Backend] Successfully logged webhook data');
                }
                catch (logError) {
                    console.error('[Backend] Failed to log webhook simulation:', logError);
                }
            }
            else {
                console.log(`[Backend] No order found for collectRequestId: ${collectRequestId}, cannot update status`);
            }
        }
        else if (paymentStatus === 'FAILED' || paymentStatus === 'FAILURE' || ((_l = statusResponse.data) === null || _l === void 0 ? void 0 : _l.status) === 'failed') {
            console.log('[Backend] Payment failed, updating order status');
            // Find the order
            const order = yield db_1.default.order.findFirst({
                where: { collect_request_id: collectRequestId },
                include: { orderStatus: true },
            });
            if (order) {
                console.log(`[Backend] Found order: ${order.id} to update with failed status`);
                // Update order status to failed
                if (order.orderStatus) {
                    console.log(`[Backend] Updating existing order status: ${order.orderStatus.id}`);
                    yield db_1.default.orderStatus.update({
                        where: { id: order.orderStatus.id },
                        data: {
                            status: 'failed',
                            payment_time: new Date(),
                            payment_details: JSON.stringify(statusResponse.data || {})
                        }
                    });
                    console.log(`[Backend] Updated order status to failed for order ${order.id}`);
                }
                else {
                    console.log(`[Backend] Creating new order status for order: ${order.id}`);
                    // Create new order status
                    yield db_1.default.orderStatus.create({
                        data: {
                            collect_id: order.id,
                            order_amount: parseFloat(((_m = statusResponse.data.amount) === null || _m === void 0 ? void 0 : _m.toString()) || '0'),
                            transaction_amount: parseFloat(((_o = statusResponse.data.amount) === null || _o === void 0 ? void 0 : _o.toString()) || '0'),
                            status: 'failed',
                            payment_details: JSON.stringify(statusResponse.data || {}),
                            payment_time: new Date(),
                        }
                    });
                    console.log(`[Backend] Created new failed order status for order ${order.id}`);
                }
                // Update or create transaction record
                const existingTransaction = yield db_1.default.transaction.findFirst({
                    where: { order_id: order.id }
                });
                if (existingTransaction) {
                    yield db_1.default.transaction.update({
                        where: { id: existingTransaction.id },
                        data: {
                            status: 'failed',
                            payment_time: new Date(),
                            payment_details: JSON.stringify(statusResponse.data || {})
                        }
                    });
                    console.log(`[Backend] Updated transaction record with failed status for order ${order.id}`);
                }
                else {
                    yield db_1.default.transaction.create({
                        data: {
                            order_id: order.id,
                            school_id: order.school_id,
                            student_id: order.student_info.id,
                            amount: parseFloat(((_p = statusResponse.data.amount) === null || _p === void 0 ? void 0 : _p.toString()) || '0'),
                            status: 'failed',
                            payment_details: JSON.stringify(statusResponse.data || {}),
                            payment_time: new Date(),
                        }
                    });
                    console.log(`[Backend] Created new transaction record with failed status for order ${order.id}`);
                }
            }
            else {
                console.log(`[Backend] No order found for collectRequestId: ${collectRequestId}, cannot update status`);
            }
        }
        else {
            console.log(`[Backend] Payment status is ${paymentStatus}, which is neither success nor failed, treating as pending`);
        }
        console.log(`[Backend] Returning payment status response for ${collectRequestId}`);
        res.status(200).json({
            success: true,
            data: statusResponse.data,
        });
    }
    catch (error) {
        console.error('[Backend] Check transaction status error:', error);
        // Try to give more details about the error
        if (error.response) {
            console.error('[Backend] Error response from external API:', {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error: ' + (error.message || 'Unknown error'),
        });
    }
});
exports.checkTransactionStatus = checkTransactionStatus;
/**
 * Get all transactions
 * @route GET /api/payments/transactions
 * @access Private
 */
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Get pagination parameters
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Get filters
        const statusFilter = (_a = req.query.status) === null || _a === void 0 ? void 0 : _a.toString();
        const searchFilter = (_b = req.query.search) === null || _b === void 0 ? void 0 : _b.toString();
        const startDate = (_c = req.query.startDate) === null || _c === void 0 ? void 0 : _c.toString();
        const endDate = (_d = req.query.endDate) === null || _d === void 0 ? void 0 : _d.toString();
        // Build where clause
        const where = {};
        if (statusFilter && statusFilter !== 'all') {
            where.status = statusFilter;
        }
        if (startDate) {
            where.payment_time = Object.assign(Object.assign({}, (where.payment_time || {})), { gte: new Date(startDate) });
        }
        if (endDate) {
            where.payment_time = Object.assign(Object.assign({}, (where.payment_time || {})), { lte: new Date(endDate) });
        }
        // Count total transactions with filters
        const totalTransactions = yield db_1.default.transaction.count({ where });
        // Get all transactions from Transaction model with pagination
        const transactions = yield db_1.default.transaction.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        });
        // Format response
        const formattedTransactions = yield Promise.all(transactions.map((transaction) => __awaiter(void 0, void 0, void 0, function* () {
            // Get associated order details
            const order = yield db_1.default.order.findUnique({
                where: { id: transaction.order_id }
            });
            return {
                collect_id: transaction.id,
                order_id: transaction.order_id,
                school_id: transaction.school_id,
                gateway: (order === null || order === void 0 ? void 0 : order.gateway_name) || 'Unknown',
                order_amount: transaction.amount,
                transaction_amount: transaction.amount,
                status: transaction.status,
                custom_order_id: order === null || order === void 0 ? void 0 : order.custom_order_id,
                student_info: order === null || order === void 0 ? void 0 : order.student_info,
                created_at: transaction.createdAt,
                payment_time: transaction.payment_time,
            };
        })));
        // Calculate pagination data
        const totalPages = Math.ceil(totalTransactions / limit);
        res.status(200).json({
            success: true,
            data: {
                transactions: formattedTransactions,
                pagination: {
                    total: totalTransactions,
                    page,
                    pages: totalPages
                }
            },
        });
    }
    catch (error) {
        console.error('Get all transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.getAllTransactions = getAllTransactions;
/**
 * Get transactions by school
 * @route GET /api/payments/transactions/school/:schoolId
 * @access Private
 */
const getTransactionsBySchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { schoolId } = req.params;
        // Get pagination parameters
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Get filters
        const statusFilter = (_a = req.query.status) === null || _a === void 0 ? void 0 : _a.toString();
        const searchFilter = (_b = req.query.search) === null || _b === void 0 ? void 0 : _b.toString();
        const startDate = (_c = req.query.startDate) === null || _c === void 0 ? void 0 : _c.toString();
        const endDate = (_d = req.query.endDate) === null || _d === void 0 ? void 0 : _d.toString();
        // Build where clause
        const where = {
            school_id: schoolId
        };
        if (statusFilter && statusFilter !== 'all') {
            where.status = statusFilter;
        }
        if (startDate) {
            where.payment_time = Object.assign(Object.assign({}, (where.payment_time || {})), { gte: new Date(startDate) });
        }
        if (endDate) {
            where.payment_time = Object.assign(Object.assign({}, (where.payment_time || {})), { lte: new Date(endDate) });
        }
        // Count total transactions with filters
        const totalTransactions = yield db_1.default.transaction.count({ where });
        // Get transactions by school with pagination
        const transactions = yield db_1.default.transaction.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        });
        // Format response
        const formattedTransactions = yield Promise.all(transactions.map((transaction) => __awaiter(void 0, void 0, void 0, function* () {
            // Get associated order details
            const order = yield db_1.default.order.findUnique({
                where: { id: transaction.order_id }
            });
            return {
                collect_id: transaction.id,
                order_id: transaction.order_id,
                school_id: transaction.school_id,
                gateway: (order === null || order === void 0 ? void 0 : order.gateway_name) || 'Unknown',
                order_amount: transaction.amount,
                transaction_amount: transaction.amount,
                status: transaction.status,
                custom_order_id: order === null || order === void 0 ? void 0 : order.custom_order_id,
                student_info: order === null || order === void 0 ? void 0 : order.student_info,
                created_at: transaction.createdAt,
                payment_time: transaction.payment_time,
            };
        })));
        // Calculate pagination data
        const totalPages = Math.ceil(totalTransactions / limit);
        res.status(200).json({
            success: true,
            data: {
                transactions: formattedTransactions,
                pagination: {
                    total: totalTransactions,
                    page,
                    pages: totalPages
                }
            },
        });
    }
    catch (error) {
        console.error('Get transactions by school error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.getTransactionsBySchool = getTransactionsBySchool;
/**
 * Get user transactions
 * @route GET /api/payments/user-transactions
 * @access Private
 */
const getUserTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Get user ID from request
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        // Get pagination parameters
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Get filters
        const statusFilter = (_b = req.query.status) === null || _b === void 0 ? void 0 : _b.toString();
        const startDate = (_c = req.query.startDate) === null || _c === void 0 ? void 0 : _c.toString();
        const endDate = (_d = req.query.endDate) === null || _d === void 0 ? void 0 : _d.toString();
        // First find all orders for this user
        const userOrders = yield db_1.default.order.findMany({
            where: { userId },
            select: { id: true }
        });
        const orderIds = userOrders.map((order) => order.id);
        if (orderIds.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    transactions: [],
                    pagination: {
                        total: 0,
                        page,
                        pages: 0
                    }
                }
            });
        }
        // Build where clause for transactions
        const where = {
            order_id: { in: orderIds }
        };
        if (statusFilter && statusFilter !== 'all') {
            where.status = statusFilter;
        }
        if (startDate) {
            where.payment_time = Object.assign(Object.assign({}, (where.payment_time || {})), { gte: new Date(startDate) });
        }
        if (endDate) {
            where.payment_time = Object.assign(Object.assign({}, (where.payment_time || {})), { lte: new Date(endDate) });
        }
        // Count total transactions with filters
        const totalTransactions = yield db_1.default.transaction.count({ where });
        // Get user transactions
        const transactions = yield db_1.default.transaction.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });
        // Format response
        const formattedTransactions = yield Promise.all(transactions.map((transaction) => __awaiter(void 0, void 0, void 0, function* () {
            // Get associated order details
            const order = yield db_1.default.order.findUnique({
                where: { id: transaction.order_id }
            });
            return {
                collect_id: transaction.id,
                order_id: transaction.order_id,
                school_id: transaction.school_id,
                gateway: (order === null || order === void 0 ? void 0 : order.gateway_name) || 'Unknown',
                order_amount: transaction.amount,
                transaction_amount: transaction.amount,
                status: transaction.status,
                custom_order_id: order === null || order === void 0 ? void 0 : order.custom_order_id,
                student_info: order === null || order === void 0 ? void 0 : order.student_info,
                created_at: transaction.createdAt,
                payment_time: transaction.payment_time,
            };
        })));
        // Calculate pagination data
        const totalPages = Math.ceil(totalTransactions / limit);
        res.status(200).json({
            success: true,
            data: {
                transactions: formattedTransactions,
                pagination: {
                    total: totalTransactions,
                    page,
                    pages: totalPages
                }
            }
        });
    }
    catch (error) {
        console.error('Get user transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
exports.getUserTransactions = getUserTransactions;
/**
 * Get transaction status
 * @route GET /api/payments/transaction-status/:customOrderId
 * @access Private
 */
const getTransactionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customOrderId } = req.params;
        // First try to find the order
        const order = yield db_1.default.order.findFirst({
            where: {
                OR: [
                    { custom_order_id: customOrderId },
                    { collect_request_id: customOrderId }
                ]
            }
        });
        if (!order) {
            console.error(`Transaction not found for ID: ${customOrderId}`, {
                searchedBy: 'custom_order_id and collect_request_id'
            });
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }
        // Now find the transaction associated with this order
        const transaction = yield db_1.default.transaction.findFirst({
            where: { order_id: order.id }
        });
        if (!transaction) {
            console.error(`Transaction record not found for order ID: ${order.id}`);
            // Fall back to order status
            const orderStatus = yield db_1.default.orderStatus.findFirst({
                where: { collect_id: order.id }
            });
            return res.status(200).json({
                success: true,
                data: {
                    id: order.id,
                    custom_order_id: order.custom_order_id,
                    collect_request_id: order.collect_request_id,
                    status: (orderStatus === null || orderStatus === void 0 ? void 0 : orderStatus.status) || 'pending',
                    order_amount: (orderStatus === null || orderStatus === void 0 ? void 0 : orderStatus.order_amount) || 0,
                    transaction_amount: (orderStatus === null || orderStatus === void 0 ? void 0 : orderStatus.transaction_amount) || 0,
                    payment_mode: orderStatus === null || orderStatus === void 0 ? void 0 : orderStatus.payment_mode,
                    payment_details: orderStatus === null || orderStatus === void 0 ? void 0 : orderStatus.payment_details,
                    payment_time: orderStatus === null || orderStatus === void 0 ? void 0 : orderStatus.payment_time,
                    student_info: order.student_info,
                },
            });
        }
        res.status(200).json({
            success: true,
            data: {
                id: transaction.id,
                order_id: order.id,
                custom_order_id: order.custom_order_id,
                collect_request_id: order.collect_request_id,
                status: transaction.status,
                order_amount: transaction.amount,
                transaction_amount: transaction.amount,
                payment_mode: transaction.payment_mode,
                payment_details: transaction.payment_details,
                payment_time: transaction.payment_time,
                student_info: order.student_info,
            },
        });
    }
    catch (error) {
        console.error('Get transaction status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.getTransactionStatus = getTransactionStatus;
