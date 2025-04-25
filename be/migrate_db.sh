#!/bin/bash

# This script runs database migrations using Prisma

echo "Running database migrations..."
bunx prisma db push

if [ $? -eq 0 ]; then
  echo "Database migration completed successfully!"
else
  echo "Database migration failed!"
  exit 1
fi
