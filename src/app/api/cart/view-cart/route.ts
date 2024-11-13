import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import ShoppingCart from '@/models/shoppingcart.model';
import ProcessedProduct from '@/models/processed-product.model'; // Ensure this path is correct
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    // Ensure the database connection is established
    console.log("Fetching cart...", req);
    await connectionPromise;

    // Extract userId from the query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
    }

    // Convert userId to ObjectId using 'new'
    const cart = await ShoppingCart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
      .populate('items.processedProductId', 'name imageId salePrice size color quantity')
      .exec();

    console.log('Fetched cart:', cart); // Log the fetched cart

    if (!cart) {
      console.error('Shopping cart not found for user:', userId); // Log the error more clearly
      console.log('Cart:', cart);
      return NextResponse.json({ error: 'Shopping cart not found for user' }, { status: 404 });
    }

    // Format the cart items for the response
    const formattedCart = cart.items.map((item: any) => ({
      productId: item.processedProductId._id,
      name: item.processedProductId.name,
      imageId: item.processedProductId.imageId,
      salePrice: item.processedProductId.salePrice,
      size: item.processedProductId.size,
      color: item.processedProductId.color,
      quantity: item.processedProductId.quantity,
    }));

    return NextResponse.json({ cart: formattedCart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cart' },
      { status: 500 }
    );
  }
}