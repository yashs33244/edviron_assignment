# PayGate Backend API

A comprehensive backend API for the Edviron school fee management system, built with Node.js, Express, and Prisma.

## Features

- **Payment Processing**: Integration with multiple payment gateways
- **Fee Management**: Comprehensive fee structure management
- **User Authentication**: Secure JWT-based authentication
- **School Management**: Multi-school support with role-based access control
- **Analytics**: Advanced reporting and analytics endpoints
- **Notifications**: SMS, email, and WhatsApp notification services

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) with [Bun](https://bun.sh/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Integrations**: Multiple payment gateway APIs
- **API Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Bun runtime
- MongoDB connection string
- Required API keys for payment gateways

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/edviron.git
   cd edviron/backend
   ```

2. Install dependencies
   ```bash
   bun install
   # or
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=4000
   MONGODB_URI=mongodb+srv://your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   PG_KEY=edvtest01
   PG_API_KEY=your-payment-gateway-api-key
   SCHOOL_ID=your-default-school-id
   CLIENT_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:3000
   ```

4. Generate Prisma client
   ```bash
   bunx prisma generate
   # or
   npx prisma generate
   ```

5. Start the development server
   ```bash
   bun dev
   # or
   npm run dev
   ```

## Project Structure

```
backend/
├── src/                    # Source code
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── index.ts            # Application entry point
├── prisma/                 # Prisma schema and migrations
├── types/                  # TypeScript type definitions
├── generated/              # Generated Prisma client
└── dist/                   # Compiled JavaScript code
```

## API Endpoints

The API provides the following main endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-reset-token/:token` - Verify reset token
- `GET /api/auth/profile` - Get user profile (protected)

### Payments
- `POST /api/payments/create-payment` - Create payment (protected)
- `POST /api/payments/webhook` - Process payment webhook
- `GET /api/payments/check-status/:collectRequestId` - Check transaction status (protected)
- `GET /api/payments/transactions` - Get all transactions (protected)
- `GET /api/payments/user-transactions` - Get user's transactions (protected) 
- `GET /api/payments/transactions/school/:schoolId` - Get transactions by school (protected)
- `GET /api/payments/transaction-status/:customOrderId` - Get transaction status

### Fee Management
- `GET /api/fees`