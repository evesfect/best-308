import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectionPromise from '@/lib/mongodb';
import Wishlist from '@/models/wishlist.model';
import Product from '@/models/product.model';
import { Types } from 'mongoose';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectionPromise;

    // Find user's wishlist and log it for debugging
    const wishlist = await Wishlist.findOne({ 
      userId: new Types.ObjectId(session.user.id) 
    }).lean();

    console.log("Raw wishlist data:", JSON.stringify(wishlist, null, 2)); // Debug log

    if (!wishlist) {
      return NextResponse.json({ 
        message: 'No wishlist found',
        items: [] 
      }, { status: 200 });
    }

    const populatedItems = await Promise.all(
      wishlist.items.map(async (item: any) => {
        console.log("Processing wishlist item:", item); // Debug log
        
        const product = await Product.findById(item.productId).lean();
        
        if (!product) {
          return null;
        }

        const wishlistItem: any = {
          _id: item._id,
          productId: item.productId,
          product: {
            name: product.name,
            description: product.description,
            salePrice: product.salePrice,
            imageId: product.imageId,
            category: product.category,
            available_stock: product.available_stock,
            colors: product.colors,
            sizes: product.sizes
          }
        };

        // Explicitly check and add size and color
        if (item.size !== undefined) wishlistItem.size = item.size;
        if (item.color !== undefined) wishlistItem.color = item.color;

        console.log("Processed wishlist item:", wishlistItem); // Debug log
        return wishlistItem;
      })
    );

    const validItems = populatedItems.filter(item => item !== null);

    return NextResponse.json({ 
      message: 'Wishlist retrieved successfully',
      items: validItems 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 