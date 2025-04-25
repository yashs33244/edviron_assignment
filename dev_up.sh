#!/bin/bash

# This script starts the application in development mode

echo "Starting the application in development mode..."

# Set environment for development
export DOCKER_ENV=Dockerfile.dev
export NODE_ENV=development

# Start containers in development mode
echo "Starting containers..."
docker-compose up -d

# Check if services are running
echo "Checking if services are running..."
docker-compose ps

echo "Development environment is up and running!"
echo -e "\nBackend URL: http://localhost:4000"
echo "Frontend URL: http://localhost:3000"
echo -e "\nLogs can be viewed with: docker-compose logs -f" 