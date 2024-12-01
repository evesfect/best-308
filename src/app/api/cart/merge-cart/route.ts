import { NextResponse } from "next/server";
import connectionPromise from "@/lib/mongodb";
import ShoppingCart from "@/models/shopping-cart.model";
import Product from "@/models/product.model";
import ProcessedProduct from "@/models/processed-product.model";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, items } = body;

    console.log('=== Merge Cart API ===');
    console.log('Received request body:', body);

    // Validate the request body
    if (!userId || !Array.isArray(items)) {
      console.log('Validation failed - Missing required fields');
      console.log('userId:', userId);
      console.log('items:', items);
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectionPromise;
    console.log('MongoDB connected successfully');

    // Find or create the user's cart
    let cart = await ShoppingCart.findOne({ userId });
    console.log('Existing cart found:', cart ? 'Yes' : 'No');

    if (!cart) {
      cart = new ShoppingCart({ userId, items: [] });
      console.log('New cart created');
    }

    // Merge the local cart with the server-side cart
    for (const localItem of items) {
      console.log('Processing local item:', localItem);
      
      const processedProduct = await ProcessedProduct.findById(localItem.productId);
      if (!processedProduct) {
        console.log('Product not found:', localItem.productId);
        continue;
      }
      console.log('Found processed product:', processedProduct._id);

      const existingItem = cart.items.find(
        (item: { processedProductId: string; size: string; color: string }) =>
          item.processedProductId.toString() === localItem.productId.toString() &&
          item.size === localItem.size &&
          item.color === localItem.color
      );

      if (existingItem) {
        console.log('Updating existing item quantity:', {
          old: existingItem.quantity,
          new: existingItem.quantity + localItem.quantity
        });
        existingItem.quantity += localItem.quantity;
      } else {
        console.log('Adding new item to cart');
        cart.items.push({
          processedProductId: localItem.productId,
          size: localItem.size,
          color: localItem.color,
          quantity: localItem.quantity,
        });
      }
    }

    await cart.save();
    console.log('Cart saved successfully');
    
    return NextResponse.json({ 
      message: "Cart merged successfully.",
      cartId: cart._id,
      itemCount: cart.items.length
    });
  } catch (error) {
    console.error('Error in merge cart API:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
