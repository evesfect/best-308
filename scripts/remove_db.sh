#!/bin/bash

# Stop and remove the existing MongoDB container
docker stop mongodb
docker rm mongodb

# Remove the MongoDB data volume
docker volume rm db_mongodb_data

echo "MongoDB container and data volume have been removed."