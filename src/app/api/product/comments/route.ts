import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import Review from '@/models/review.model';

export async function GET(req: Request) {
  try {
    await connectionPromise;
    const url = new URL(req.url);
    const productId = url.searchParams.get('product_id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const comments = await Review.find({ product_id: productId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectionPromise;
    const body = await req.json();
    const { comment, rating, product_id, user_id } = body;

    if (!rating || !product_id || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const approved = !comment;

    const newReview = new Review({
      comment,
      rating,
      product_id: new mongoose.Types.ObjectId(product_id),
      user_id: new mongoose.Types.ObjectId(user_id),
      approved,
    });

    await newReview.save();
    return NextResponse.json(newReview);
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 }
    );
  }
}