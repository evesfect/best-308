// src/app/api/cart/add-to-cart.ts
// src/app/api/cart/add-to-cart.ts
import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import User from '@/models/user.model';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const { userId, productId } = await req.json();

    console.log("Received payload:", { userId, productId});

    // Connect to the database
    await connectionPromise;
    const db = mongoose.connection.db;
    console.log("Database connection status:", db ? "connected" : "not connected");

    if (!db) {
      console.error("Database connection error");
      return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
    }

    const user = await User.findById(userId);
    console.log("User found:", user);

    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await user.addToCart(productId);
    console.log("Item added to user's shopping cart");

    return NextResponse.json({ message: 'Item added to cart', cart: user.shoppingCart });
  } catch (error) {
    console.error("Error adding item to cart api:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
