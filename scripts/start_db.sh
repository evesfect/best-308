#!/bin/bash

# Navigate to the db directory
cd "$(dirname "$0")/../db" || exit

# Start the MongoDB container
docker-compose up -d

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