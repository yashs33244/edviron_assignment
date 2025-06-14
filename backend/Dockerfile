FROM oven/bun:1 as base

# Install OpenSSL and other dependencies
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package.json first to leverage Docker caching
COPY package.json ./

# Install dependencies with npm (bun seems to have issues with type definitions)
RUN apt-get update -y && apt-get install -y npm
RUN npm install
RUN npm install -D @types/bcryptjs@3.0.0

# Copy application code
COPY . .

# Create types directory and add bcryptjs.d.ts if it doesn't exist
RUN mkdir -p types && echo 'declare module "bcryptjs";' > types/bcryptjs.d.ts

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Define build-time arguments with default values
ARG PG_KEY=edvtest01
ARG PG_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw"
ARG SCHOOL_ID="65b0e6293e9f76a9694d84b4"
ARG MONGODB_URI="mongodb+srv://yash:12345678%40123@cluster0.tnfs0tz.mongodb.net/mydb?retryWrites=true&w=majority"
ARG JWT_SECRET="sjkfnslnfslnlnwf"
ARG PORT=4000
ARG CLIENT_URL=https://edviron.itsyash.space
ARG FRONTEND_URL=https://edviron.itsyash.space

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