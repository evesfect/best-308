import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';


export async function PATCH(req: Request) {
  try {
    await connectionPromise;
    console.log("Database connected successfully");

    const db = mongoose.connection.db;
    if (!db) {
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

    // Use `salePrice` or fallback to `price` for calculation
    const currentPrice = product.salePrice || product.price;
    if (typeof currentPrice !== 'number') {
      return NextResponse.json({ message: 'Invalid product price' }, { status: 400 });
    }

    const newPrice = parseFloat((currentPrice * (1 - discountRate / 100)).toFixed(2));

    await db.collection('product').updateOne(
      { _id: new mongoose.Types.ObjectId(productId) },
      { $set: { salePrice: newPrice } }
    );
    
    // Trigger email notifications after successful discount update
    try {
      console.log('Attempting to send notifications for productId:', productId);
      const notifyResponse = await fetch('http://localhost:3000/api/wishlist/notify-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      
      const notifyData = await notifyResponse.json();
      console.log('Notification response:', notifyData);
      
    } catch (notifyError) {
      console.error('Error sending notifications:', notifyError);
    }
    
    return NextResponse.json({ message: 'Product price updated', newPrice }, { status: 200 });
  } catch (error) {
    console.error('Error updating price:', error);
    return NextResponse.json({ message: 'Error updating price', error: (error as Error).toString() }, { status: 500 });
  }
}
