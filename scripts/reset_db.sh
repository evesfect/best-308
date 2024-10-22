#!/bin/bash

# Stop and remove the existing MongoDB container
docker stop mongodb
docker rm mongodb

# Remove the MongoDB data volume
docker volume rm db_mongodb_data

# Start a new MongoDB container
cd "$(dirname "$0")/../db" || exit
docker-compose up -d

echo "Database has been reset and restarted without any data."
