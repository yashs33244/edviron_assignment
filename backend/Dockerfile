FROM oven/bun:1 as builder

WORKDIR /app

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json first to leverage Docker caching
COPY package.json ./

# Install all dependencies including devDependencies for build steps
RUN bun install

# Copy application code
COPY . .

# Generate Prisma client and build the TypeScript code
RUN bun prisma generate && bun run build

# Production stage
FROM oven/bun:1

WORKDIR /app

# Install OpenSSL in the final image
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json
COPY package.json ./

# Install only production dependencies
RUN bun install --production

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated

# Define build-time arguments with default values
ARG PG_KEY=edvtest01
ARG PG_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw"
ARG SCHOOL_ID="65b0e6293e9f76a9694d84b4"
ARG MONGODB_URI="mongodb+srv://yash:12345678%40123@cluster0.tnfs0tz.mongodb.net/mydb?retryWrites=true&w=majority"
ARG JWT_SECRET="dfgdhfgjkgfds"
ARG PORT=4000
ARG CLIENT_URL=https://edviron.yashprojects.online
ARG FRONTEND_URL=https://edviron.yashprojects.online

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