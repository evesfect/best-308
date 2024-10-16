# best-308

A base for boutique fashion market websites with ease of deployment

## Setup and Running

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Database Management**:

   We have several scripts to manage the MongoDB database:

   - Start the database:

     ```bash
     ./scripts/start_db.sh
     ```

   - Seed the database with initial data:

     ```bash
     ./scripts/seed_db.sh
     ```

   - Reset the database (remove all data and restart):

     ```bash
     ./scripts/reset_db.sh
     ```

   - Stop the database:

     ```bash
     ./scripts/stop_db.sh
     ```

   - Remove the database container and volume:

     ```bash
     ./scripts/remove_db.sh
     ```

   Note: Make sure the scripts are executable. If not, run:

   ```bash
   chmod +x scripts/*.sh
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Accessing MongoDB Express

- URL: [http://localhost:8081](http://localhost:8081)
- Username: admin
- Password: pass

## Shutting Down

1. Stop the Next.js development server: `Ctrl+C`
2. Stop MongoDB and MongoDB Express:

   ```bash
   ./scripts/stop_db.sh
   ```

## Development

Edit `app/page.tsx` to modify the main page. The page auto-updates as you edit.
