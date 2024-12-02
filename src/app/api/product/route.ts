// File: src/app/api/product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import Review from '@/models/review.model';

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
      // Fetch products
      const productList = await Product.find(searchCriteria);

      // Fetch and count approved reviews for each product
      const reviewCounts = await Review.aggregate([
        { $match: { approved: true } },
        { $group: { _id: '$product_id', count: { $sum: 1 } } },
      ]);

      // Map review counts to product IDs
      const reviewCountMap = reviewCounts.reduce((map, obj) => {
        map[obj._id.toString()] = obj.count;
        return map;
      }, {});

      // Add review count to each product and sort by review count
      products = productList.map((product) => ({
        ...product.toObject(),
        reviewCount: reviewCountMap[product._id.toString()] || 0,
      })).sort((a, b) => b.reviewCount - a.reviewCount);

    }
    
    else {
      let sortCriteria: any = {};
      if (order === 'asc') {
        sortCriteria.salePrice = 1;
      } else if (order === 'desc') {
        sortCriteria.salePprice = -1;
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
