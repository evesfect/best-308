import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import ShoppingCart from '@/models/shopping-cart.model';
import Product from '@/models/product.model';
import ProcessedProduct from '@/models/processed-product.model';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId, size, color, quantity = 1 } = body;

    // If userId is not provided, return a message for the client to handle local cart
    if (!userId) {
      return NextResponse.json({ error: "User not logged in. Use local cart for non-authenticated users." }, { status: 401 });
    }

    if (!productId || !size || !color) {
      console.error("Missing fields in request:", { userId, productId, size, color });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectionPromise;

    const product = await Product.findById(productId).lean();
    console.log("Fetched Product:", product);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Validate size and color
    if (
      !Array.isArray(product.sizes) ||
      !Array.isArray(product.colors) ||
      !product.sizes.includes(size) ||
      !product.colors.includes(color)
    ) {
      console.error("Invalid size or color:", { size, color });
      return NextResponse.json({ error: "Invalid size or color" }, { status: 400 });
    }

    // Find or create ProcessedProduct
    let processedProduct = await ProcessedProduct.findOne({
      productId,
      size,
      color,
    });

    if (!processedProduct) {
      processedProduct = new ProcessedProduct({
        productId,
        name: product.name,
        imageId: product.imageId,
        salePrice: product.salePrice,
        size,
        color,
        quantity: 1, // Initial quantity set as 1
        stockAvailable: 0, // Placeholder; stock updates will be handled in the future
      });
      await processedProduct.save();
    }

    // Update ShoppingCart
    let cart = await ShoppingCart.findOne({ userId });
    if (!cart) {
      cart = new ShoppingCart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.processedProductId.toString() === processedProduct._id.toString() &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        processedProductId: processedProduct._id,
        size,
        color,
        quantity,
      });
    }

    await cart.save();

    return NextResponse.json({ message: "Item added to cart successfully." });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
