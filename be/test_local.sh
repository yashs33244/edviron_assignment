#!/bin/bash

# This script tests the API locally

echo "Running local API tests..."

# Check if server is running
curl -s http://localhost:4000/health | grep -q "status"
if [ $? -eq 0 ]; then
  echo "Server is running!"
else
  echo "Server is not running! Starting server..."
  bun run dev &
  SERVER_PID=$!
  
  # Wait for server to start
  echo "Waiting for server to start..."
  sleep 5
fi

# Test authentication endpoints
echo "Testing authentication endpoints..."
curl -s -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
echo -e "\n"

# Test payment endpoints
echo "Testing payment endpoints..."
curl -s http://localhost:4000/api/payments/transactions
echo -e "\n"

# Clean up if we started the server
if [ ! -z "$SERVER_PID" ]; then
  echo "Stopping server..."
  kill $SERVER_PID
fi

echo "Tests completed!"
