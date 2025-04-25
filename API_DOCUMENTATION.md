# Payment Gateway API Documentation

This document provides detailed information about the Payment Gateway API endpoints, request/response formats, and usage examples.

## Base URL

- Development: `http://localhost:4000`
- Production: `https://api.paymentgateway.com` (example)

## Authentication

Most API endpoints require authentication using JWT tokens. Include the token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

### Obtaining a JWT Token

JWT tokens can be obtained by registering or logging in:

- `POST /api/auth/register`
- `POST /api/auth/login`

## API Endpoints

### Authentication

#### Register User

```
POST /api/auth/register
```

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "5f9d5b3b9d3e2a1b5c7d8e9f",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```

#### Login User

```
POST /api/auth/login
```

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "5f9d5b3b9d3e2a1b5c7d8e9f",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```

#### Forgot Password

```
POST /api/auth/forgot-password
```

Request:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "If your email is registered, you will receive a password reset link"
}
```

#### Reset Password

```
POST /api/auth/reset-password
```

Request:
```json
{
  "token": "af3c2b1d...",
  "password": "newpassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

#### Get User Profile

```
GET /api/auth/profile
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "5f9d5b3b9d3e2a1b5c7d8e9f",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2023-01-01T12:00:00.000Z"
  }
}
```

### Payments

#### Create Payment

```
POST /api/payments/create
```

Request:
```json
{
  "studentName": "Student Name",
  "studentId": "S12345",
  "studentEmail": "student@example.com",
  "amount": 2000
}
```

Response:
```json
{
  "success": true,
  "message": "Payment request created successfully",
  "data": {
    "redirectUrl": "https://paymentgateway.com/pay/xyzabc",
    "orderId": "5f9d5b3b9d3e2a1b5c7d8e9f"
  }
}
```

#### Webhook Handler

```
POST /api/payments/webhook
```

Request:
```json
{
  "status": 200,
  "order_info": {
    "order_id": "5f9d5b3b9d3e2a1b5c7d8e9f",
    "order_amount": 2000,
    "transaction_amount": 2200,
    "gateway": "PhonePe",
    "bank_reference": "YESBNK222",
    "status": "success",
    "payment_mode": "upi",
    "payemnt_details": "success@ybl",
    "Payment_message": "payment success",
    "payment_time": "2025-04-23T08:14:21.945+00:00",
    "error_message": "NA"
  }
}
```

Response:
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

#### Get All Transactions

```
GET /api/payments/transactions?page=1&limit=10
```

Response:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "collect_id": "5f9d5b3b9d3e2a1b5c7d8e9f",
        "school_id": "65b0e6293e9f76a9694d84b4",
        "gateway": "PhonePe",
        "order_amount": 2000,
        "transaction_amount": 2200,
        "status": "success",
        "custom_order_id": "ORD-1234567890-abcd",
        "student_info": {
          "name": "Student Name",
          "id": "S12345",
          "email": "student@example.com"
        },
        "created_at": "2023-01-01T12:00:00.000Z",
        "payment_time": "2023-01-01T12:05:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

#### Get Transactions by School

```
GET /api/payments/transactions/school/65b0e6293e9f76a9694d84b4?page=1&limit=10
```

Response:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "collect_id": "5f9d5b3b9d3e2a1b5c7d8e9f",
        "school_id": "65b0e6293e9f76a9694d84b4",
        "gateway": "PhonePe",
        "order_amount": 2000,
        "transaction_amount": 2200,
        "status": "success",
        "custom_order_id": "ORD-1234567890-abcd",
        "student_info": {
          "name": "Student Name",
          "id": "S12345",
          "email": "student@example.com"
        },
        "created_at": "2023-01-01T12:00:00.000Z",
        "payment_time": "2023-01-01T12:05:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

#### Get Transaction Status

```
GET /api/payments/status/ORD-1234567890-abcd
```

Response:
```json
{
  "success": true,
  "data": {
    "collect_id": "5f9d5b3b9d3e2a1b5c7d8e9f",
    "custom_order_id": "ORD-1234567890-abcd",
    "school_id": "65b0e6293e9f76a9694d84b4",
    "gateway": "PhonePe",
    "order_amount": 2000,
    "transaction_amount": 2200,
    "status": "success",
    "payment_mode": "upi",
    "payment_details": "success@ybl",
    "bank_reference": "YESBNK222",
    "payment_message": "payment success",
    "error_message": null,
    "payment_time": "2023-01-01T12:05:00.000Z",
    "created_at": "2023-01-01T12:00:00.000Z"
  }
}
```

## Error Handling

All API endpoints return standard error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": { /* Validation errors if applicable */ }
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints have rate limiting to prevent abuse:

- Authentication endpoints: 5 requests per 15 minutes per IP
- Other endpoints: 100 requests per 15 minutes per IP

Rate limit headers are included in responses:
- `RateLimit-Limit`: Maximum requests allowed in the window
- `RateLimit-Remaining`: Remaining requests in the current window
- `RateLimit-Reset`: Time when the rate limit window resets (Unix timestamp) 