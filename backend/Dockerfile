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
CMD ["node", "dist/index.js"] 