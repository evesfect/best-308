@echo off
setlocal enabledelayedexpansion

echo mongodb
docker-compose -f db\docker-compose.yml up -d

echo Waiting for MongoDB to be ready...

:wait_for_mongodb
docker exec mongodb mongosh --username root --password rpassword --authenticationDatabase admin --eval "db.runCommand({ping: 1})" --quiet
if %errorlevel% neq 0 (
    echo MongoDB is unavailable - sleeping
    timeout /t 3 /nobreak >nul
    goto wait_for_mongodb
)

echo MongoDB is up and running

echo Copying init script to MongoDB container...
docker cp scripts\db\init-script.js mongodb:/init-script.js

echo Attempting to execute init script...
docker exec mongodb mongosh --username root --password rpassword --authenticationDatabase admin /init-script.js
if %errorlevel% neq 0 (
    echo Failed to execute init script. Error code: %errorlevel%
    echo Dumping MongoDB logs:
    docker logs mongodb
) else (
    echo Init script executed successfully.
)

echo Database seeding process completed.
