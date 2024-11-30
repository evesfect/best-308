// File: src/app/api/product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: mongoose.Schema.Types.ObjectId, // Change to ObjectId to reference the Category
  price: Number,
  total_stock: {
    S: Number,
    M: Number,
    L: Number,
  },
  available_stock: {
    S: Number,
    M: Number,
    L: Number,
  },
  imageUrl: String,
}, { collection: 'product' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export async function GET(req: NextRequest) {
  try {
    await connectionPromise;
    console.log("Database connected successfully");

    const db = mongoose.connection.db;
    if (!db) {
      console.error("Database connection is undefined");
      return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
    }
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    if (!collections.some(c => c.name === 'product')) {
      console.error("The 'product' collection does not exist in the database");
      return NextResponse.json({ message: 'Product collection not found' }, { status: 500 });
    }

    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const category = url.searchParams.get('category');
    const order = url.searchParams.get('order');
    const id = url.searchParams.get('id');
    const sex = url.searchParams.get('sex'); // Get the sex parameter

    console.log("Query parameters:", { query, category, order, id, sex });

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
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    if (category) {
      try {
        // Log the raw category value
        console.log("Raw category value:", category);
        
        // Validate the category is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(category)) {
          console.error("Invalid category ObjectId:", category);
          return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
        }
    
        // Convert the category string to ObjectId before searching
        const categoryId = new mongoose.Types.ObjectId(category);
        console.log("Converted category ObjectId:", categoryId);
        
        searchCriteria.category = categoryId;
        console.log("Search criteria after category filter:", searchCriteria);
      } catch (error) {
        console.error("Error processing category filter:", error);
        return NextResponse.json({ message: 'Error processing category filter', error: (error as Error).toString() }, { status: 500 });
      }
    }

    // Adjust filter for sex based on the query parameter
    if (sex === 'male') {
      searchCriteria.sex = { $in: ["male", "unisex"] };
    } else if (sex === 'female') {
      searchCriteria.sex = { $in: ["female", "unisex"] };
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
