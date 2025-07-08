FROM node:18-alpine

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY app-builder-ui/package*.json ./

# Install dependencies
RUN npm install

# Copy all app source files
COPY app-builder-ui/ .

EXPOSE 3000

CMD ["npm", "start"]
