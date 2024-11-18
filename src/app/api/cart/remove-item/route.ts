import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import ShoppingCart from '@/models/shopping-cart.model';
import ProcessedProduct from '@/models/processed-product.model';

export async function DELETE(req: Request) {
  try {
    console.log('Starting DELETE /api/cart/remove-item');
    
    // Parse the request body
    const body = await req.json();
    console.log('Request body:', body);
    
    const { userId, processedProductId } = body;

    // Validate the inputs
    if (!userId || !processedProductId) {
        console.error('Validation error: Missing fields', { userId, processedProductId });
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      
    console.log('Input validation passed');

    await connectionPromise;
    console.log('Database connection established');

    // Find the user's shopping cart
    const cart = await ShoppingCart.findOne({ userId });
    console.log('Cart fetched:', cart);

    if (!cart) {
      console.error('Error: Cart not found');
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find the item in the cart by processedProductId
    const itemIndex = cart.items.findIndex(
        (item: { processedProductId: string }) => item.processedProductId.toString() === processedProductId
    );
      
    console.log('Item index in cart:', itemIndex);

    if (itemIndex === -1) {
      console.error('Error: Item not found in cart');
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    // Remove the item from the cart
    console.log('Removing item at index:', itemIndex);
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();
    console.log('Cart updated successfully');

    // Optionally delete the corresponding ProcessedProduct if no other carts reference it
    const otherCarts = await ShoppingCart.find({
      "items.processedProductId": processedProductId,
    });
    console.log('Other carts referencing the product:', otherCarts);

    if (otherCarts.length === 0) {
      console.log('No other references found. Deleting ProcessedProduct:', processedProductId);
      await ProcessedProduct.findByIdAndDelete(processedProductId);
    } else {
      console.log('Other references exist. Skipping ProcessedProduct deletion.');
    }

    return NextResponse.json({ message: "Item removed from cart successfully." });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/cart/remove-item:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to remove item from cart", details: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to remove item from cart", details: "Unknown error" },
        { status: 500 }
      );
    }
  }
}
