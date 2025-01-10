import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectionPromise from '@/lib/mongodb';
import Wishlist from '@/models/wishlist.model';
import { Types } from 'mongoose';

export async function DELETE(req: Request) {
  try {
    // Get user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get productId from request body
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await connectionPromise;

    // Find user's wishlist and remove the item by productId
    const result = await Wishlist.updateOne(
      { userId: new Types.ObjectId(session.user.id) },
      { 
        $pull: { 
          items: { 
            productId: new Types.ObjectId(productId) 
          } 
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Item not found in wishlist' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Item removed from wishlist successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 