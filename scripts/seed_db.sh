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

# Function to check if MongoDB is ready
check_mongodb() {
    docker exec mongodb mongosh --eval "db.runCommand({ping:1})" --quiet
}

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until check_mongodb
do
    echo "MongoDB is unavailable - sleeping"
    sleep 1
done

echo "MongoDB is up and running!"

# Copy the init script to the container
docker cp scripts/db/init-script.js mongodb:/init-script.js

# Execute the init script
echo "Attempting to execute init script..."
if docker exec mongodb mongosh /init-script.js; then
    echo "Init script executed successfully."
else
    echo "Failed to execute init script. Error code: $?"
    echo "Dumping MongoDB logs:"
    docker logs mongodb
fi

echo "Database seeding process completed."