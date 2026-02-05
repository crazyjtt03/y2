# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install production dependencies
RUN npm install --production

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy backend server code
COPY server.js ./

# Create data file with permissions (optional but good practice)
# RUN touch story.json && chmod 666 story.json

ENV PORT=80
EXPOSE 80

CMD ["node", "server.js"]
