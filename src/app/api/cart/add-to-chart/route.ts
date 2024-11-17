//src/app/api/cart/add-to-chart/route.ts
import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import Product from '@/models/product.model';
import ProcessedProduct from '@/models/processed-product.model'; // Import the processed product model
import ShoppingCart from '@/models/shopping-cart.model'; // Import the shopping cart model
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const { userId, productId, size, color } = await req.json();

    console.log("Received payload:", { userId, productId, size, color });

    // Validate request payload
    if (!userId || !productId || !size || !color) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Connect to the database
    await connectionPromise;

    // Find the product using the Product model
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Validate size and color
    if (!product.sizes.includes(size) || !product.colors.includes(color)) {
      return NextResponse.json({ error: 'Invalid size or color selected' }, { status: 400 });
    }

    // Create the processed product object
    const processedProduct = {
      name: product.name,
      imageId: product.imageId,
      salePrice: product.salePrice, // Ensure `salePrice` exists in the model
      size,
      color,
      quantity: 1,
    };

    // Find or create the user's shopping cart
    let cart = await ShoppingCart.findOne({ userId });
    if (!cart) {
      cart = new ShoppingCart({ userId, items: [] });
    }

    // Add the processed product to the shopping cart
    cart.items.push(processedProduct);
    await cart.save();

    console.log("Item added to user's shopping cart");

    return NextResponse.json({ message: 'Item added to cart', cart: cart.items });
  } catch (error: any) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}