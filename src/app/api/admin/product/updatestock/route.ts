import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Product from '@/models/product.model';

interface StockUpdateRequest {
  _id: string;
  total_stock: { [key: string]: number };
  available_stock: { [key: string]: number };
}

export async function POST(req: Request) {
  try {
    // Log the incoming request body for debugging
    const body: StockUpdateRequest = await req.json();
    console.log('Received stock update request:', body);

    // Validate basic request structure
    if (!body) {
      console.error('No request body received');
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    if (!body._id) {
      console.error('Product ID is missing');
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    // Ensure connection to database
    await connectionPromise;

    // Validate stock data
    if (!body.total_stock || !body.available_stock) {
      console.error('Stock data is incomplete');
      return NextResponse.json({ message: 'Stock data is required' }, { status: 400 });
    }

    const validateStockNumbers = (stock: { [key: string]: number }) => 
      Object.values(stock).every(val => Number.isInteger(val) && val >= 0);

    if (!validateStockNumbers(body.total_stock) || !validateStockNumbers(body.available_stock)) {
      console.error('Invalid stock numbers');
      return NextResponse.json(
        { message: 'Stock numbers must be non-negative integers' },
        { status: 400 }
      );
    }

    // Convert ID to MongoDB ObjectId
    let productId;
    try {
      productId = new mongoose.Types.ObjectId(body._id);
    } catch (idError) {
      console.error('Invalid product ID format', idError);
      return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }

    // Find and update product
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      console.error('Product not found', body._id);
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Update product stock
    existingProduct.total_stock = body.total_stock;
    existingProduct.available_stock = body.available_stock;
    existingProduct.lastModified = new Date();

    const updatedProduct = await existingProduct.save();

    return NextResponse.json({ 
      message: 'Stock updated successfully', 
      product: updatedProduct 
    }, { status: 200 });

  } catch (error) {
    // Log the full error for server-side debugging
    console.error('Unexpected error in stock update:', error);

    return NextResponse.json(
      { 
        message: 'Error updating stock', 
        error: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
}