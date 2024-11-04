@echo off
setlocal enabledelayedexpansion

rem Stop and remove the existing MongoDB container
docker stop mongodb || ver > nul
docker rm mongodb || ver > nul

rem Remove the MongoDB data volume
docker volume rm db_mongodb_data || ver > nul

rem Start a new MongoDB container
cd db
docker-compose up -d
cd ..

echo Waiting for MongoDB to be ready...

:check_mongodb
docker exec mongodb mongosh --username root --password rpassword --authenticationDatabase admin --eval "db.runCommand({ping: 1})" --quiet
if %errorlevel% neq 0 (
    echo MongoDB is unavailable - sleeping
    timeout /t 2 /nobreak >nul
    set /a attempt+=1
    if !attempt! equ 30 (
        echo Failed to connect to MongoDB after 30 attempts
        docker logs mongodb --tail 20
        exit /b 1
    )
    goto check_mongodb
)

echo MongoDB is up and running!

rem Copy the init scripts to the container
echo Copying initialization scripts...
docker cp scripts\db\init-script.js mongodb:/init-script.js
docker cp scripts\db\init-images.ts mongodb:/init-images.ts

rem Execute the init script with authentication
echo Executing initialization script...
docker exec mongodb mongosh --username root --password rpassword --authenticationDatabase admin /init-script.js
if %errorlevel% neq 0 (
    echo Failed to execute init script. Last 20 lines of MongoDB logs:
    docker logs mongodb --tail 20
    exit /b 1
) else (
    echo Init script executed successfully.
)

rem Execute the TypeScript init-images script using ts-node
echo Executing image initialization...
npx ts-node scripts\db\init-images.ts
if %errorlevel% neq 0 (
    echo Failed to initialize images. Check the error above.
    exit /b 1
) else (
    echo Image initialization completed successfully.
)

echo Database seeding process completed successfully.