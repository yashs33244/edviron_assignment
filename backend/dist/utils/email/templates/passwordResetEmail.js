"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordResetEmailTemplate = void 0;
const getPasswordResetEmailTemplate = ({ name, resetLink }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Edviron Finance</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #ffffff;
          background-color: #000000;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #333;
        }
        
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #ffffff;
        }
        
        .logo-accent {
          color: #2BE82A;
        }
        
        .content {
          padding: 30px 0;
          line-height: 1.6;
        }
        
        h1 {
          color: #ffffff;
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: 700;
        }
        
        p {
          margin-bottom: 15px;
          color: #cccccc;
        }
        
        .highlight {
          color: #2BE82A;
          font-weight: 600;
        }
        
        .button {
          display: inline-block;
          background-color: #2BE82A;
          color: #000000 !important;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 30px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }
        
        .note {
          background-color: #202020;
          border-radius: 12px;
          padding: 15px;
          margin: 25px 0;
          border: 1px solid #333;
        }
        
        .note-title {
          color: #ffffff;
          font-weight: 600;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        
        .note-icon {
          color: #2BE82A;
          margin-right: 8px;
        }
        
        .footer {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid #333;
          color: #999999;
          font-size: 14px;
        }
        
        .expire-warning {
          font-size: 14px;
          color: #ff9800;
          margin: 10px 0;
        }
        
        @media only screen and (max-width: 550px) {
          .container {
            width: 100%;
            padding: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Edviron <span class="logo-accent">Finance</span></div>
        </div>
        
        <div class="content">
          <h1>Reset Your Password</h1>
          
          <p>Hello ${name},</p>
          
          <p>We received a request to reset your password for your Edviron Finance account. To complete the password reset process, click on the button below:</p>
          
          <center>
            <a href="${resetLink}" class="button">Reset Password</a>
          </center>
          
          <p class="expire-warning">This password reset link will expire in 1 hour for security reasons.</p>
          
          <div class="note">
            <div class="note-title">
              <span class="note-icon">ℹ️</span> Security Note
            </div>
            <p>If you didn't request a password reset, please ignore this email or contact our support team if you're concerned about your account's security.</p>
          </div>
          
          <p>For your security, the link can only be used once and will lead you to a page where you can set a new password.</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Edviron Finance. All rights reserved.</p>
          <p>Our mailing address: <a href="mailto:support@edviron.com" style="color: #999999;">support@edviron.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.getPasswordResetEmailTemplate = getPasswordResetEmailTemplate;
