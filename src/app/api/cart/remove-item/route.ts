import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import ShoppingCart from '@/models/shopping-cart.model';

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId, processedProductId } = body;

    // Handle non-logged-in users
    if (!userId) {
      return NextResponse.json({
        message: "User not logged in. Manage local cart on the client-side.",
      });
    }

    // Validate the request body for logged-in users
    if (!processedProductId) {
      console.error("Missing processedProductId in request:", { userId, processedProductId });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectionPromise;

    // Fetch the user's shopping cart
    const cart = await ShoppingCart.findOne({ userId });

    if (!cart) {
      console.error("Cart not found for user:", userId);
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find the item to remove
    const itemToRemove = cart.items.find(
      (item) => item.processedProductId.toString() === processedProductId
    );

    if (!itemToRemove) {
      console.error("Item not found in cart:", processedProductId);
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    // Update the cart by filtering out the item
    cart.items = cart.items.filter(
      (item) => item.processedProductId.toString() !== processedProductId
    );

    // Save the updated cart
    await cart.save();

    return NextResponse.json({ message: "Item removed successfully." });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
