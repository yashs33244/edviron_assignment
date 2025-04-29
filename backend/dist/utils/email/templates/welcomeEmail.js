"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWelcomeEmailTemplate = void 0;
const getWelcomeEmailTemplate = ({ name, email, otp, baseUrl }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Edviron Finance</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #202020;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        
        .dark-theme {
          color: #ffffff;
          background-color: #000000;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #202020;
        }
        
        .logo-accent {
          color: #2BE82A;
        }
        
        .content {
          padding: 30px 0;
          line-height: 1.6;
        }
        
        h1 {
          color: #202020;
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: 700;
        }
        
        p {
          margin-bottom: 15px;
          color: #555555;
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
        
        .features {
          margin: 40px 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        
        .feature {
          background-color: #f5f5f5;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e0e0e0;
          margin-top: 15px;
        }
        
        .feature-title {
          color: #202020;
          font-weight: 600;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        
        .feature-icon {
          color: #2BE82A;
          margin-right: 8px;
        }
        
        .otp-box {
          background-color: #f5f5f5;
          border-radius: 12px;
          padding: 20px;
          margin: 30px 0;
          text-align: center;
          border: 1px solid #e0e0e0;
        }
        
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          color: #2BE82A;
          margin: 10px 0;
        }
        
        .otp-title {
          font-weight: 600;
          margin-bottom: 10px;
          color: #202020;
        }
        
        .footer {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
          color: #777777;
          font-size: 14px;
        }
        
        @media only screen and (max-width: 550px) {
          .container {
            width: 100%;
            padding: 10px;
          }
          
          .features {
            grid-template-columns: 1fr;
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
          <h1>Welcome to Edviron Finance, ${name}!</h1>
          
          <p>We're thrilled to have you join our platform. Your account has been successfully created with the email <span class="highlight">${email}</span>.</p>
          
          <p>Edviron Finance helps educational institutions optimize their payment processes, reduce costs, and increase operational efficiency.</p>
          
          <div class="otp-box">
            <div class="otp-title">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
            <p>Please use this code to verify your account. This code will expire in 10 minutes.</p>
          </div>
          
          <a href="${baseUrl}/verify-otp?email=${encodeURIComponent(email)}" class="button">Verify Your Account</a>
          
          <div class="features">
            <div class="feature">
              <div class="feature-title">
                <span class="feature-icon">✓</span> Secure Transactions
              </div>
              <p>End-to-end encryption ensures your financial data and transactions are always protected.</p>
            </div>
            
            <div class="feature">
              <div class="feature-title">
                <span class="feature-icon">✓</span> Detailed Analytics
              </div>
              <p>Track payment trends, view financial reports, and make data-driven decisions.</p>
            </div>
            
            <div class="feature">
              <div class="feature-title">
                <span class="feature-icon">✓</span> Financial Planning
              </div>
              <p>Set targets, create budgets, and monitor your school's financial health in real-time.</p>
            </div>
            
            <div class="feature">
              <div class="feature-title">
                <span class="feature-icon">✓</span> Payment Processing
              </div>
              <p>Process payments quickly and easily with our integrated payment gateway.</p>
            </div>
          </div>
          
          <p>If you have any questions or need assistance, feel free to contact our support team.</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Edviron Finance. All rights reserved.</p>
          <p>Our mailing address: <a href="mailto:support@edviron.com" style="color: #777777;">support@edviron.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.getWelcomeEmailTemplate = getWelcomeEmailTemplate;
