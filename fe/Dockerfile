FROM oven/bun:1

WORKDIR /app

# Copy package.json first to leverage Docker caching
COPY package.json ./

# Install dependencies
RUN bun install

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_PG_API_URL=https://dev-vanilla.edviron.com/erp
ENV NEXT_PUBLIC_PG_KEY=edvtest01

# Build the application
RUN bun run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["bun", "start"] 