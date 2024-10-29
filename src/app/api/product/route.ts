
// File: pages/api/product.ts (or wherever your API route is located)

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb'; // Adjust the path as needed


// Explicitly specify the collection name
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  total_stock: {
    S: Number,
    M: Number,
    L: Number
  },
  available_stock: {
    S: Number,
    M: Number,
    L: Number
  },
  imageUrl: String
}, { collection: 'product' }); // This explicitly tells Mongoose to use the 'product' collection

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export async function GET(req: Request) {

  try {
    // Ensure the database is connected
    await connectionPromise;
    console.log("Database connected successfully");

    // Log the current database and collections
    const db = mongoose.connection.db;
    if (db) {
      console.log("Current database:", db.databaseName);
    } else {
      console.error("Database connection is undefined");
      return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
    }
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    // Verify that the 'product' collection exists
    if (!collections.some(c => c.name === 'product')) {
      console.error("The 'product' collection does not exist in the database");
      return NextResponse.json({ message: 'Product collection not found' }, { status: 500 });
    }

    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const category = url.searchParams.get('category');
    const order = url.searchParams.get('order');
    const id = url.searchParams.get('id');

    console.log("Query parameters:", { query, category, order, id });

    let searchCriteria: any = {};

    if (id) {
      console.log("Searching for product by ID:", id);
      const product = await Product.findById(id);
      if (product) {
        console.log("Product found:", product);
        return NextResponse.json(product);
      } else {
        console.log("Product not found for ID:", id);
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
    }

    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) {
      searchCriteria.category = category;
    }

    console.log("Search criteria:", searchCriteria);

    let sortCriteria: any = {};
    if (order === 'asc') {
      sortCriteria.price = 1;
    } else if (order === 'desc') {
      sortCriteria.price = -1;
    }

    console.log("Sort criteria:", sortCriteria);

    // Log the raw MongoDB query
    console.log("Raw MongoDB query:", Product.find(searchCriteria).sort(sortCriteria).getFilter());

    let products;
    if (Object.keys(searchCriteria).length > 0 || Object.keys(sortCriteria).length > 0) {
      products = await Product.find(searchCriteria).sort(sortCriteria);
    } else {
      // If no search criteria or sort order, fetch all products
      products = await Product.find();
    }

    console.log("Products fetched:", products.length);
    
    if (products.length === 0) {
      console.log("No products found. Fetching a sample product...");
      const sampleProduct = await Product.findOne();
      console.log("Sample product:", sampleProduct);
    }

    return NextResponse.json(products);

  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: 'Error fetching products', error: error.toString() }, { status: 500 });
  }
}


