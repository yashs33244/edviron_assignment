# Payment Gateway Backend API

A simple backend implementation for payment processing with MongoDB Atlas integration.

## Features

- User authentication with JWT
- Payment gateway integration
- Webhook handling for payment statuses
- Transaction listing and filtering
- MongoDB with Prisma ORM

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PG_KEY=edvtest01
PG_API_KEY=your_payment_gateway_api_key
SCHOOL_ID=your_school_id
PORT=4000
NODE_ENV=development
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Push the schema to the database:

```bash
npm run prisma:push
```

5. Build the application:

```bash
npm run build
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Payments

- `POST /api/payments/create-payment` - Create a payment request (requires authentication)
- `POST /api/payments/webhook` - Webhook endpoint for payment updates
- `GET /api/payments/transactions` - Get all transactions (requires authentication)
- `GET /api/payments/transactions/school/:schoolId` - Get transactions by school (requires authentication)
- `GET /api/payments/transaction-status/:customOrderId` - Get transaction status (requires authentication)

## Testing with Postman

1. Register a user:
   - Endpoint: `POST /api/auth/register`
   - Body: 
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }
     ```

2. Login to get JWT token:
   - Endpoint: `POST /api/auth/login`
   - Body:
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - Save the token from the response

3. Create a payment:
   - Endpoint: `POST /api/payments/create-payment`
   - Headers: `Authorization: Bearer <your_token>`
   - Body:
     ```json
     {
       "studentName": "Student Name",
       "studentId": "S12345",
       "studentEmail": "student@example.com",
       "amount": 2000
     }
     ```

4. Simulate a webhook:
   - Endpoint: `POST /api/payments/webhook`
   - Body:
     ```json
     {
       "status": 200,
       "order_info": {
         "order_id": "<your_generated_order_id>",
         "order_amount": 2000,
         "transaction_amount": 2200,
         "gateway": "PhonePe",
         "bank_reference": "YESBNK222",
         "status": "success",
         "payment_mode": "upi",
         "payemnt_details": "success@ybl",
         "Payment_message": "payment success",
         "payment_time": "2023-04-23T08:14:21.945+00:00",
         "error_message": "NA"
       }
     }
     ```

5. Get all transactions:
   - Endpoint: `GET /api/payments/transactions`
   - Headers: `Authorization: Bearer <your_token>`

## License

MIT 