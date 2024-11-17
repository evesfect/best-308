import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import ProcessedProduct from '@/models/processed-product.model';
import ShoppingCart from '@/models/shopping-cart.model';
import {ShoppingCart as ShoppingCartType} from '@/types/shopping-cart'

export async function GET(req: Request) {
  try {
    // Ensure the database connection is established
    console.log("Fetching cart...");
    await connectionPromise;
    console.log('Model loaded:', ProcessedProduct);

    // Extract userId from the query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
    }

    const cart: ShoppingCartType = await ShoppingCart.findOne({ userId })
      .populate('items.processedProductId') // Populate ProcessedProduct
      .exec();

    if (!cart) {
      console.error('Shopping cart not found for user:', userId); // Log the error more clearly
      return NextResponse.json({ error: 'Shopping cart not found for user' }, { status: 404 });
    }

    const formattedCart = cart.items.map((item: any) => {
      return {
      productId: item.processedProductId._id,
      name: item.processedProductId.name,
      imageId: item.processedProductId.imageId,
      salePrice: item.processedProductId.salePrice,
      size: item.processedProductId.size,
      color: item.processedProductId.color,
      quantity: item.processedProductId.quantity,}
    });

    return NextResponse.json({ cart: formattedCart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cart' },
      { status: 500 }
    );
  }
}