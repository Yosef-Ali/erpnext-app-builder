FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files first for better Docker layer caching
COPY app-builder-ui/package*.json ./

# Install dependencies with pnpm
RUN pnpm install

# Copy all app source files
COPY app-builder-ui/ .

EXPOSE 3000

CMD ["pnpm", "start"]
