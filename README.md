# best-308

A base for boutique fashion market websites with ease of deployment

## Setup and Running

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start MongoDB and MongoDB Express**:

   ```bash
   cd db
   docker-compose up -d
   ```

3. **Initialize the database**:

   Copy the init-script.js into the MongoDB container: (from db/)

   ```bash
   docker cp ../scripts/init-script.js mongodb:/init-script.js
   ```

   Execute the script inside the container: (from db/)

   ```bash
   docker exec mongodb mongosh admin -u root -p rpassword --authenticationDatabase admin /init-script.js
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Accessing MongoDB Express

- URL: [http://localhost:8081](http://localhost:8081)
- Username: admin
- Password: pass

## Shutting Down

1. Stop the Next.js development server: `Ctrl+C`
2. Stop MongoDB and MongoDB Express:

   ```bash
   cd db
   docker-compose down
   ```

## Development

Edit `app/page.tsx` to modify the main page. The page auto-updates as you edit.
