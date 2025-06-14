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
ENV NEXT_PUBLIC_API_URL=https://edbe.itsyash.space
ENV NEXT_PUBLIC_PG_API_URL=https://dev-vanilla.edviron.com/erp
ENV NEXT_PUBLIC_PG_KEY=edvtest01

# Add next.config.js with output: 'standalone'
RUN if ! grep -q "output: 'standalone'" next.config.js; then \
    echo "module.exports = { ...require('./next.config.js'), output: 'standalone' };" > temp-config.js && \
    mv temp-config.js next.config.js; \
    fi

# Build the application
RUN bun run build

# Expose the port
EXPOSE 3000

# Use the standalone build output
CMD ["bun", "./node_modules/.bin/next", "start"] 