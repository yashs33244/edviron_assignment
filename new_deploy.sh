#!/bin/bash

# This script deploys the latest Docker images using docker-compose

echo "Deploying the latest Docker images..."

# Stop current containers
echo "Stopping current containers..."
docker-compose down

# Remove old images
echo "Removing old images..."
docker rmi yashs3324/edviron-backend:latest || true
docker rmi yashs3324/edviron-frontend:latest || true

# Pull latest images
echo "Pulling latest images..."
docker pull yashs3324/edviron-backend:latest
docker pull yashs3324/edviron-frontend:latest || true

# Set environment for production
export DOCKER_ENV=Dockerfile.prod
export NODE_ENV=production

# Start containers in production mode
echo "Starting containers in production mode..."
docker-compose up -d

# Check if services are running
echo "Checking if services are running..."
docker-compose ps

echo "Deployment completed successfully!" 