import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Product from '@/models/product.model';

// Example of your API handler for adding a product
export async function POST(req: Request) {
    try {
      await connectionPromise;
      const db = mongoose.connection.db;
  
      if (!db) {
        return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
      }
  
      const productData = await req.json();
      // Automatically generate the _id
      const newProduct = {
        _id: new mongoose.Types.ObjectId(),
        name: productData.name,
        description: productData.description,
        category: productData.category,
        salePrice: productData.price,
        total_stock: productData.total_stock,
        available_stock: productData.available_stock,
        sizes: productData.sizes,
        colors:productData.colors,
      };
  
      const result = await db.collection('product').insertOne(newProduct);
  
      return NextResponse.json({ product: newProduct }, { status: 201 });
    } catch (error) {
      console.error("Error adding product:", error);
      return NextResponse.json({ message: 'Error adding product', error: (error as Error).toString() }, { status: 500 });
    }
  }
  

// Function to handle deleting a product
export async function DELETE(req: Request) {
  try {
      await connectionPromise;
      const db = mongoose.connection.db;

      if (!db) {
          return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
      }

      const { searchParams } = new URL(req.url);
      const productId = searchParams.get('id');

      if (!productId) {
          return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
      }

      // Validate and convert productId to ObjectId
      let objectId;
      try {
          objectId = new mongoose.Types.ObjectId(productId);
      } catch (error) {
          return NextResponse.json({ message: 'Invalid Product ID format' }, { status: 400 });
      }

      // Delete the product
      const result = await Product.deleteOne({ _id: objectId });
      if (result.deletedCount === 0) {
          return NextResponse.json({ message: 'Product not found or already deleted' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json({ message: 'Error deleting product', error: (error as Error).toString() }, { status: 500 });
  }
}
