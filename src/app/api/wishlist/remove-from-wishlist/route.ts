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

    // Get itemId from request body
    const { itemId } = await req.json();
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await connectionPromise;

    // Find user's wishlist and remove the item
    const result = await Wishlist.updateOne(
      { userId: new Types.ObjectId(session.user.id) },
      { $pull: { items: { _id: new Types.ObjectId(itemId) } } }
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