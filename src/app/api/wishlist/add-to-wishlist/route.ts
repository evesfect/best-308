import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectionPromise from '@/lib/mongodb';
import Wishlist from '@/models/wishlist.model';
import Product from '@/models/product.model';
import { Types } from 'mongoose';

export async function POST(req: Request) {
  try {
    // Get user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get data from request body
    const { productId, size, color } = await req.json();

    // Log the received data for debugging
    console.log('Received data:', { productId, size, color, userId: session.user.id });

    // Validate required fields
    if (!productId || !size || !color) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        received: { productId, size, color }
      }, { status: 400 });
    }

    await connectionPromise;

    // Verify product exists
    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if product is in wishlist
    const wishlist = await Wishlist.findOne({ 
      userId: new Types.ObjectId(session.user.id) 
    });
    
    if (wishlist) {
      // Check for duplicate item with same productId, size, and color
      const existingItem = wishlist.items.find(
        (item: { productId: string; size: string; color: string }) => 
          item.productId.toString() === productId && 
          item.size === size && 
          item.color === color
      );

      if (existingItem) {
        return NextResponse.json({ 
          error: 'This item with the same size and color is already in your wishlist' 
        }, { status: 400 });
      }

      // Add new item to wishlist
      wishlist.items.push({ 
        productId: new Types.ObjectId(productId), 
        size,
        color 
      });
      await wishlist.save();

      return NextResponse.json({ 
        message: 'Product added to wishlist',
        wishlist
      }, { status: 200 });
    }

    // If no wishlist exists, create a new one
    const newWishlist = await Wishlist.create({
      userId: new Types.ObjectId(session.user.id),
      items: [{ 
        productId: new Types.ObjectId(productId), 
        size,
        color 
      }]
    });

    return NextResponse.json({ 
      message: 'Wishlist created with product',
      wishlist: newWishlist
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


