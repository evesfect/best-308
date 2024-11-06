import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import User from '@/models/user.model';
import Product from '@/models/product.model'; // Assuming you have a Product model
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    // Ensure the database connection is established
    await connectionPromise;
    const db = mongoose.connection.db;

    if (!db) {
      return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
    }

    // Extract userId from the query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
    }

    // Find the user by ID and get cart product IDs
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch product details for each productId in the user's cart
    const productDetails = await Product.find({
      _id: { $in: user.shoppingCart },
    }).select('_id name price imageUrl'); // Only select needed fields

    return NextResponse.json({ cart: productDetails });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: 'Failed to retrieve cart' },
      { status: 500 }
    );
  }
}
