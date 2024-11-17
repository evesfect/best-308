import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import ShoppingCart from '@/models/shopping-cart.model';
import '@/models/processed-product.model';

export async function GET(req: Request) {
  try {
    await connectionPromise;
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
    }

    const cart = await ShoppingCart.findOne({ userId })
      .populate('items.processedProductId')
      .exec();

    if (!cart) {
      return NextResponse.json({ cart: [] });
    }

    const formattedCart = cart.items
      .filter(item => item.processedProductId)
      .map((item) => ({
        productId: item.processedProductId?._id || null,
        name: item.processedProductId?.name || '',
        imageId: item.processedProductId?.imageId || '',
        salePrice: item.processedProductId?.salePrice || 0,
        size: item.processedProductId?.size || '',
        color: item.processedProductId?.color || '',
        quantity: item.quantity || 0,
      }));

    return NextResponse.json({ cart: formattedCart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cart', details: error.message },
      { status: 500 }
    );
  }
}
