"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaymentToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generate JWT token for a user
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
exports.generateToken = generateToken;
/**
 * Generate JWT token for payment gateway API
 * @param {Object} payload - Data to be signed
 * @returns {string} JWT token
 */
const generatePaymentToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.PG_API_KEY);
};
exports.generatePaymentToken = generatePaymentToken;
