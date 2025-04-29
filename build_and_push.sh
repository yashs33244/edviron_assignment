#!/bin/bash

# Exit on any error
set -e

echo "Starting build and push process with Bun runtime..."

# Make script executable
chmod +x ./build_and_push.sh

# Build the backend image
echo "Building backend image with Bun..."
docker build -t yashs3324/edviron-backend:latest ./backend


# Build the frontend image
echo "Building frontend image with Bun..."
docker build -t yashs3324/edviron-frontend:latest ./fe

# Login to Docker Hub
echo "Logging in to Docker Hub..."
echo "Please enter your Docker Hub password when prompted:"
docker login -u yashs3324

# Push the images to Docker Hub
echo "Pushing backend image to Docker Hub..."
docker push yashs3324/edviron-backend:latest

echo "Pushing frontend image to Docker Hub..."
docker push yashs3324/edviron-frontend:latest

echo "Build and push process completed successfully!" 