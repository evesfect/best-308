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
    console.log('Removing product:', productId); // Debug log

    await connectionPromise;

    // Modified query to ensure proper removal
    const result = await Wishlist.findOneAndUpdate(
      { userId: new Types.ObjectId(session.user.id) },
      { 
        $pull: { 
          items: { productId: productId }  // Make sure this matches your schema structure
        } 
      },
      { new: true }
    );

    console.log('Update result:', result); // Debug log

    if (!result) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Item removed from wishlist successfully',
      wishlist: result 
    }, { status: 200 });

  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 