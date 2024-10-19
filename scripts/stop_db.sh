#!/bin/bash

# Navigate to the db directory
cd "$(dirname "$0")/../db" || exit

# Stop the MongoDB and MongoDB Express containers
docker-compose down

echo "MongoDB and MongoDB Express have been stopped."