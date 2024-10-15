# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy all source code
COPY . .

# Build the frontend
RUN yarn build

# Expose the default Next.js port
EXPOSE 3000

# Start the frontend app
CMD ["yarn", "start"]
