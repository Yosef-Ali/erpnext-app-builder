FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Copy MCP server code
COPY . .

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
