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
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.fromAddress = process.env.EMAIL_FROM || 'yashs3324@gmail.com';
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
            port: Number(process.env.EMAIL_SERVER_PORT) || 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_SERVER_USER || 'yashs3324@gmail.com',
                pass: process.env.EMAIL_SERVER_PASSWORD || 'avhszmzkkkfqjtwa',
            },
        });
    }
    /**
     * Send email using the configured transporter
     */
    sendEmail(to_1, subject_1, html_1) {
        return __awaiter(this, arguments, void 0, function* (to, subject, html, attachments = []) {
            try {
                const info = yield this.transporter.sendMail({
                    from: `"Edviron Payment System" <${this.fromAddress}>`,
                    to,
                    subject,
                    html,
                    attachments,
                });
                console.log(`Email sent: ${info.messageId}`);
                return true;
            }
            catch (error) {
                console.error('Error sending email:', error);
                return false;
            }
        });
    }
    /**
     * Verify the SMTP configuration
     */
    verifyConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transporter.verify();
                console.log('SMTP connection verified successfully');
                return true;
            }
            catch (error) {
                console.error('SMTP connection verification failed:', error);
                return false;
            }
        });
    }
}
// Create a singleton instance
const emailService = new EmailService();
exports.default = emailService;
