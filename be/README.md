# Payment Gateway Backend API

This backend provides a set of RESTful APIs for integrating with payment gateways, managing transactions, and handling webhooks.

## Technology Stack

- **Runtime**: Bun.js / Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: JWT
- **Email**: Nodemailer
- **Validation**: Zod
- **Logging**: Winston
- **Documentation**: Swagger/OpenAPI (planned)

## Getting Started

### Prerequisites

- Bun.js >= 1.0.0 or Node.js >= 18
- MongoDB
- Docker (optional)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/payment-gateway

# Email
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=your-email@gmail.com

# Auth & JWT
JWT_SECRET=your-jwt-secret

# Payment Gateway
PG_KEY=edvtest01
PG_API_KEY=your-api-key
SCHOOL_ID=your-school-id

# Server
PORT=4000
NODE_ENV=development
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Generate Prisma client:
   ```bash
   bunx prisma generate
   ```
4. Push database schema:
   ```bash
   bunx prisma db push
   ```

### Running the Application

Development mode:
```bash
bun run dev
```

Production mode:
```bash
bun run build
bun run start
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset user password
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Payment Endpoints

- `POST /api/payments/create` - Create a new payment request
- `POST /api/payments/webhook` - Handle payment webhook notification
- `GET /api/payments/transactions` - Get all transactions with pagination
- `GET /api/payments/transactions/school/:schoolId` - Get transactions by school ID
- `GET /api/payments/status/:customOrderId` - Get transaction status by custom order ID

## Docker Support

Build and run with Docker:

```bash
docker build -t payment-gateway-be -f Dockerfile.dev .
docker run -p 4000:4000 payment-gateway-be
```

Or use Docker Compose (from project root):

```bash
docker-compose up -d
```

## Testing

Run tests:
```bash
./test_local.sh
```

## Deployment

For production deployment, use:

```bash
./new_deploy.sh
```

This will pull the latest Docker images and run in production mode.

## License

This project is proprietary and confidential.
