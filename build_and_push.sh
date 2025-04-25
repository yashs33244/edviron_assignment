#!/bin/bash

# This script builds and pushes Docker images to DockerHub

# Set username
DOCKER_USERNAME="yashs3324"

# Version tag (use current date and time if not provided)
VERSION=${1:-$(date +"%Y%m%d%H%M")}

echo "Building and pushing Docker images with version: $VERSION"

# Build backend image
echo "Building backend image..."
docker build -t $DOCKER_USERNAME/edviron-backend:$VERSION -f be/Dockerfile.prod be/

# Build frontend image (if Dockerfile exists)
if [ -f "fe/Dockerfile.prod" ]; then
  echo "Building frontend image..."
  docker build -t $DOCKER_USERNAME/edviron-frontend:$VERSION -f fe/Dockerfile.prod fe/
else
  echo "Frontend Dockerfile not found, skipping..."
fi

# Tag as latest
docker tag $DOCKER_USERNAME/edviron-backend:$VERSION $DOCKER_USERNAME/edviron-backend:latest
if [ -f "fe/Dockerfile.prod" ]; then
  docker tag $DOCKER_USERNAME/edviron-frontend:$VERSION $DOCKER_USERNAME/edviron-frontend:latest
fi

# Login to DockerHub
echo "Logging in to DockerHub..."
docker login -u $DOCKER_USERNAME

# Push images
echo "Pushing backend images..."
docker push $DOCKER_USERNAME/edviron-backend:$VERSION
docker push $DOCKER_USERNAME/edviron-backend:latest

if [ -f "fe/Dockerfile.prod" ]; then
  echo "Pushing frontend images..."
  docker push $DOCKER_USERNAME/edviron-frontend:$VERSION
  docker push $DOCKER_USERNAME/edviron-frontend:latest
fi

echo "Build and push completed successfully!" 