# Use official Node.js LTS as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


# Disable SSL verification for npm
RUN npm config set strict-ssl false
RUN npm config set registry http://registry.npmjs.org/
RUN npm install

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production

# Run the application
CMD ["node", "index.js"]
