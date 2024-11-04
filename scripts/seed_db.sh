#!/bin/bash

set -e

# This script resets the database and seeds it with initial data

# Stop and remove the existing MongoDB container
docker stop mongodb || true
docker rm mongodb || true

# Remove the MongoDB data volume
docker volume rm db_mongodb_data || true

# Start a new MongoDB container
cd db
docker-compose up -d
cd ..

# Function to check if MongoDB is ready with authentication
check_mongodb() {
    docker exec mongodb mongosh --username root --password rpassword --authenticationDatabase admin --eval "db.runCommand({ping:1})" --quiet
}

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
max_attempts=30
attempt=1

until check_mongodb || [ $attempt -eq $max_attempts ]
do
    echo "MongoDB is unavailable - attempt $attempt of $max_attempts"
    sleep 2
    attempt=$((attempt + 1))
done

if [ $attempt -eq $max_attempts ]; then
    echo "Failed to connect to MongoDB after $max_attempts attempts"
    docker logs mongodb --tail 20
    exit 1
fi

echo "MongoDB is up and running!"

# Copy the init scripts to the container
echo "Copying initialization scripts..."
docker cp scripts/db/init-script.js mongodb:/init-script.js
docker cp scripts/db/init-images.ts mongodb:/init-images.ts

# Execute the init script with authentication
echo "Executing initialization script..."
if docker exec mongodb mongosh --username root --password rpassword --authenticationDatabase admin /init-script.js; then
    echo "Init script executed successfully."
else
    echo "Failed to execute init script. Last 20 lines of MongoDB logs:"
    docker logs mongodb --tail 20
    exit 1
fi

# Execute the TypeScript init-images script using ts-node
echo "Executing image initialization..."
if npx ts-node scripts/db/init-images.ts; then
    echo "Image initialization completed successfully."
else
    echo "Failed to initialize images. Check the error above."
    exit 1
fi

echo "Database seeding process completed successfully."