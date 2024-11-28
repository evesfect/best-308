# best-308

A base for boutique fashion market websites with ease of deployment

## Setup and Running

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Database Management**:

   We switched to MongoAtlas so you can check the database from the site:
   https://cloud.mongodb.com/v2/6744638557a77e6a1612f338#/overview

   To access mongosh aka mongo shell enter this command in the command line

  ```sudo docker exec -it mongodb mongosh "mongodb+srv://cluster0.rz8bd.mongodb.net/" --apiVersion 1 --username root

  The password is rpassword

4. **Run the development server**:

   ```bash
   npm run dev
   ```

6. **Access the application**:
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
