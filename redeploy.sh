#!/bin/bash

# Exit on any error
set -e

echo "Starting quick redeployment process..."

# Stop running containers
echo "Stopping running containers..."
docker-compose down

# Pull latest images
echo "Pulling latest images from Docker Hub..."
docker pull yashs3324/edviron-backend:latest
docker pull yashs3324/edviron-frontend:latest

# Start containers with updated images
echo "Starting containers with updated images..."
docker-compose up -d

echo "Redeployment completed successfully!"
echo "The application is now running at http://localhost:3000" 