# best-308
A base for boutique fashion market websites with ease of deployment

## Installation and Running

1. **Install dependencies**:
Run the following command to install the required dependencies:
```bash
npm install
```

2. **Run the development server**:
Use one of the following commands to start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Development

To populate your MongoDB with mock data for development purposes, you can use the provided initialization script.   
This script will create sample users, products, and sales data in your MongoDB instance.

-   Ensure MongoDB is installed and running on your local machine.
-   `mongosh` (MongoDB Shell) is required to execute the script.

```sh
mongosh scripts/init-script.js
```
