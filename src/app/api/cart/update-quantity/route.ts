import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import ShoppingCart from '@/models/shopping-cart.model';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, processedProductId, quantity } = body;

    if (!userId || !processedProductId || quantity === undefined) {
      console.error("Missing fields in request:", { userId, processedProductId, quantity });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectionPromise;

    const cart = await ShoppingCart.findOne({ userId });

    if (!cart) {
      console.error("Cart not found for user:", userId);
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const item = cart.items.find(
      (item) => item.processedProductId.toString() === processedProductId
    );

    if (!item) {
      console.error("Item not found in cart:", processedProductId);
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    if (quantity <= 0) {
      // Remove the item if quantity is <= 0
      console.log(`Removing item: ${processedProductId}`);
      cart.items = cart.items.filter(
        (item) => item.processedProductId.toString() !== processedProductId
      );
    } else {
      // Update the quantity
      console.log(`Updating item quantity: ${processedProductId}, new quantity: ${quantity}`);
      item.quantity = quantity;
    }

    await cart.save();

    console.log("Cart updated successfully:", cart);
    return NextResponse.json({ message: "Cart updated successfully." });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
