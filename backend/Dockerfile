FROM oven/bun:1

WORKDIR /app

# Copy package.json first to leverage Docker caching
COPY package.json ./

# Install dependencies
RUN bun install

# Copy application code (with proper .dockerignore this will be efficient)
COPY . .

# Define build-time arguments with default values
ARG PG_KEY=edvtest01
ARG PG_API_KEY=""
ARG SCHOOL_ID=""
ARG MONGODB_URI=""
ARG JWT_SECRET=""
ARG PORT=4000
ARG CLIENT_URL=http://localhost:3000
ARG FRONTEND_URL=http://localhost:3000

# Set environment variables from arguments
ENV PG_KEY=$PG_KEY \
    PG_API_KEY=$PG_API_KEY \
    SCHOOL_ID=$SCHOOL_ID \
    MONGODB_URI=$MONGODB_URI \
    JWT_SECRET=$JWT_SECRET \
    PORT=$PORT \
    CLIENT_URL=$CLIENT_URL \
    FRONTEND_URL=$FRONTEND_URL

# Expose port
EXPOSE $PORT

# Start the application
CMD ["bun", "start"] 