import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import ProcessedProduct from '@/models/processed-product.model';

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
    console.log("Collections in database:", collections.map(c => c.name));

    if (!collections.some(c => c.name === 'processedProduct')) {
      console.error("The 'processedProduct' collection does not exist in the database");
      return NextResponse.json({ message: "'processedProduct' collection not found" }, { status: 500 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      console.error("No ID provided in query parameters");
      return NextResponse.json({ message: 'ID query parameter is required' }, { status: 400 });
    }

    console.log("Searching for processed product by ID:", id);

    // Ensure ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ID format provided:", id);
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    // Fetch processed product by ID
    const processedProduct = await ProcessedProduct.findById(id);
    if (processedProduct) {
      console.log("Processed product found:", processedProduct);
      
      // Return only the productId
      return NextResponse.json({ productId: processedProduct.productId }, { status: 200 });
    } else {
      console.error("Processed product not found for ID:", id);
      return NextResponse.json({ message: 'Processed product not found' }, { status: 404 });
    }

  } catch (error) {
    console.error("Unexpected error fetching processed product:", error);
    return NextResponse.json(
      { message: 'Error fetching processed product', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
