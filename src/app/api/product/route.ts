// File: src/app/api/product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String, // 
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

    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const category = url.searchParams.get('category');
    const order = url.searchParams.get('order');
    const id = url.searchParams.get('id');
    const sex = url.searchParams.get('sex');

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
    
        // Since the category is now a string, no need for ObjectId validation
        searchCriteria.category = category; // Directly assign the category string to the search criteria
        console.log("Search criteria after category filter:", searchCriteria);
      } catch (error) {
        console.error("Error processing category filter:", error);
        return NextResponse.json(
          { message: "Error processing category filter", error: (error as Error).toString() },
          { status: 500 }
        );
      }
    }

    if (sex === 'male') {
      searchCriteria.sex = { $in: ["male", "unisex"] };
    } else if (sex === 'female') {
      searchCriteria.sex = { $in: ["female", "unisex"] };
    }

    console.log("Search criteria:", searchCriteria);

    let products;
    if (order === 'popularity') {
      // Sort by the number of reviews
      products = await Product.aggregate([
        { $match: searchCriteria }, // Apply filters
        {
          $lookup: {
            from: 'review', // Name of the review collection
            localField: '_id',
            foreignField: 'product_id',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' }, // Add reviewCount field
          },
        },
        { $sort: { reviewCount: -1 } }, // Sort by reviewCount in descending order
      ]);
    } else {
      let sortCriteria: any = {};
      if (order === 'asc') {
        sortCriteria.price = 1;
      } else if (order === 'desc') {
        sortCriteria.price = -1;
      }

      console.log("Sort criteria:", sortCriteria);

      products = await Product.find(searchCriteria).sort(sortCriteria);
    }

    console.log("Products fetched:", products.length);

    return NextResponse.json(products);

  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: 'Error fetching products', error: error.toString() }, { status: 500 });
  }
}
