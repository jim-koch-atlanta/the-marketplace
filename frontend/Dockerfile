# Use Node.js base image
FROM node:16-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including TypeScript globally
RUN npm install -g typescript && npm install

# Copy the remaining files
COPY . .

# Build the TypeScript code
RUN tsc

# Expose application port
EXPOSE 3000
EXPOSE 4200
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
