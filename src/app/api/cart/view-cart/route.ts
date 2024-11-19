import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import ShoppingCart from '@/models/shopping-cart.model';
import '@/models/processed-product.model';

// Helper to format cart items
const formatCartItems = (cart) =>
  cart.items
    .filter((item) => item.processedProductId) // Filter valid processed products
    .map((item) => ({
      _id: item.processedProductId?._id || null,
      name: item.processedProductId?.name || '',
      imageId: item.processedProductId?.imageId || '',
      salePrice: item.processedProductId?.salePrice || 0,
      size: item.processedProductId?.size || '',
      color: item.processedProductId?.color || '',
      quantity: item.quantity || 0,
    }));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, localCart } = body;

    // Validate localCart
    if (!Array.isArray(localCart)) {
      return NextResponse.json(
        { error: 'Invalid local cart format' },
        { status: 400 }
      );
    }

    await connectionPromise;

    // Handle case where user is not logged in
    if (!userId) {
      console.log('User not logged in. Returning local cart.');
      return NextResponse.json({
        cart: localCart,
        totalPrice: calculateTotalPrice(localCart),
      });
    }

    // Fetch the cart for the logged-in user
    const cart = await ShoppingCart.findOne({ userId })
      .populate('items.processedProductId')
      .exec();

    if (!cart) {
      return NextResponse.json({ cart: [], totalPrice: 0 });
    }

    const formattedCart = formatCartItems(cart);

    const totalPrice = formattedCart.reduce(
      (sum, item) => sum + item.salePrice * item.quantity,
      0
    );

    return NextResponse.json({ cart: formattedCart, totalPrice });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cart', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to calculate total price
const calculateTotalPrice = (cart) =>
  cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
