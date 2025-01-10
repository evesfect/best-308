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
    const { productId, color, size } = await req.json();

    // Log the received data for debugging
    console.log('Received data:', { productId, color, size, userId: session.user.id });

    // Only validate productId
    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID is required', 
        received: { productId, color, size }
      }, { status: 400 });
    }

    // Ensure database connection
    const db = await connectionPromise;
    console.log('Database connection established');

    // Verify product exists and log the result
    const product = await Product.findById(productId).lean();
    console.log('Product lookup result:', product);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Log the user ID being used for wishlist lookup
    console.log('Looking for wishlist with userId:', session.user.id);

    // Check if product is in wishlist
    const wishlist = await Wishlist.findOne({ 
      userId: new Types.ObjectId(session.user.id) 
    });
    
    if (wishlist) {
      // Check for duplicate considering both color and size
      const existingItem = wishlist.items.find(
        (item: { productId: string; color?: string; size?: string }) => 
          item.productId.toString() === productId && 
          (!color || item.color === color) &&
          (!size || item.size === size)
      );

      if (existingItem) {
        return NextResponse.json({ 
          error: 'This item is already in your wishlist' 
        }, { status: 400 });
      }

      // Add new item to wishlist with optional color and size
      const newItem: { productId: Types.ObjectId; color?: string; size?: string } = {
        productId: new Types.ObjectId(productId)
      };
      if (color) newItem.color = color;
      if (size) newItem.size = size;
      
      wishlist.items.push(newItem);
      await wishlist.save();

      return NextResponse.json({ 
        message: 'Product added to wishlist',
        wishlist
      }, { status: 200 });
    }

    // If no wishlist exists, create a new one
    const newWishlistItem: { productId: Types.ObjectId; color?: string; size?: string } = {
      productId: new Types.ObjectId(productId)
    };
    if (color) newWishlistItem.color = color;
    if (size) newWishlistItem.size = size;

    const newWishlist = await Wishlist.create({
      userId: new Types.ObjectId(session.user.id),
      items: [newWishlistItem]
    });

    return NextResponse.json({ 
      message: 'Wishlist created with product',
      wishlist: newWishlist
    }, { status: 201 });

  } catch (error) {
    // Enhanced error logging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}





