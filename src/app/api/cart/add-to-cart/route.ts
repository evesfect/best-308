import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import ShoppingCart from '@/models/shopping-cart.model';
import Product from '@/models/product.model';
import ProcessedProduct from '@/models/processed-product.model';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId, size, color } = body;

    if (!userId || !productId || !size || !color) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectionPromise;

    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (
      !Array.isArray(product.sizes) ||
      !Array.isArray(product.colors) ||
      !product.sizes.includes(size) ||
      !product.colors.includes(color)
    ) {
      return NextResponse.json({ error: "Invalid size or color" }, { status: 400 });
    }

    const processedProduct = new ProcessedProduct({
      //get the same id with the product
      _id: product._id,
      name: product.name,
      imageId: product.imageId,
      salePrice: product.salePrice,
      size,
      color,
      quantity: 1,
      productId,
    });

    await processedProduct.save();

    let cart = await ShoppingCart.findOne({ userId });
    if (!cart) {
      cart = new ShoppingCart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.processedProductId.toString() === processedProduct._id.toString()
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ processedProductId: processedProduct._id, quantity: 1 });
    }

    await cart.save();

    return NextResponse.json({ message: "Item added to cart successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
