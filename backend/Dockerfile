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

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "dist/index.js"] 