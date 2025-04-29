FROM oven/bun:1

WORKDIR /app

# Copy package.json first to leverage Docker caching
COPY package.json ./

# Install dependencies
RUN bun install

# Copy application code (with proper .dockerignore this will be efficient)
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Set environment variables
ENV PG_KEY=edvtest01 \
    PG_API_KEY= \
    SCHOOL_ID= \
    MONGODB_URI= \
    JWT_SECRET= \
    PORT=4000 \
    CLIENT_URL=http://localhost:3000 \
    FRONTEND_URL=http://localhost:3000

# Expose port
EXPOSE 4000

# Start the application
CMD ["bun", "start"] 