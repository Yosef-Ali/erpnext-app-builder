FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Install pnpm
RUN npm install -g pnpm

# Copy package files first
COPY mcp-server/package*.json ./

# Install dependencies with pnpm
RUN pnpm install

# Copy MCP server code
COPY mcp-server/ .

EXPOSE 3000

CMD ["node", "server.js"]
