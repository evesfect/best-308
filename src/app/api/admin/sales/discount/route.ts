// src/app/api/admin/product/discount/route.ts
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  try {
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

    const { productId, discountRate } = await req.json();

    if (!productId || typeof discountRate !== 'number') {
      return NextResponse.json({ message: 'Invalid product ID or discount rate' }, { status: 400 });
    }

    const product = await db.collection('product').findOne({ _id: new mongoose.Types.ObjectId(productId) });
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const newPrice = product.price * (1 - discountRate / 100);
    await db.collection('product').updateOne(
      { _id: new mongoose.Types.ObjectId(productId) },
      { $set: { price: newPrice } }
    );

    return NextResponse.json({ message: 'Product price updated', newPrice }, { status: 200 });
  } catch (error) {
    console.error('Error updating price:', error);
    return NextResponse.json({ message: 'Error updating price', error: (error as Error).toString() }, { status: 500 });
  }
}
