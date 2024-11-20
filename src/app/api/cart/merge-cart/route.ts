import { NextResponse } from "next/server";
import connectionPromise from "@/lib/mongodb";
import ShoppingCart from "@/models/shopping-cart.model";
import Product from "@/models/product.model";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, items } = body;

    if (!userId || !Array.isArray(items)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectionPromise;

    let cart = await ShoppingCart.findOne({ userId });
    if (!cart) {
      cart = new ShoppingCart({ userId, items: [] });
    }

    for (const localItem of items) {
      const product = await Product.findById(localItem.productId);
      if (!product) continue;

      // Check if the item already exists in the cart
      const existingItem = cart.items.find(
        (item) =>
          item.processedProductId.toString() === localItem.productId &&
          item.size === localItem.size &&
          item.color === localItem.color
      );

      if (existingItem) {
        existingItem.quantity += localItem.quantity;
      } else {
        cart.items.push({
          processedProductId: localItem.productId,
          size: localItem.size,
          color: localItem.color,
          quantity: localItem.quantity,
        });
      }
    }

    await cart.save();
    return NextResponse.json({ message: "Cart merged successfully." });
  } catch (error) {
    console.error("Error merging cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
