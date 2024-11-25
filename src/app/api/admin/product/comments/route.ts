

import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
      await connectionPromise;
      const db = mongoose.connection.db;
      
      if (!db) {
          console.error("Database connection is undefined");
          return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
      }

      const url = new URL(req.url);
      const productId = url.searchParams.get('product_id');

      if (!productId) {
          return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
      }

      // Create an OR query to match both string and ObjectId formats
      const searchCriteria = {
          $or: [
              { product_id: productId }, // String format
              { product_id: new mongoose.Types.ObjectId(productId) }, // ObjectId format
              { "product_id.$oid": productId } // Embedded ObjectId format
          ]
      };

      const comments = await db.collection('review').find(searchCriteria).toArray();
      
      // Transform the comments to ensure consistent format
      const formattedComments = comments.map(comment => ({
          ...comment,
          // Ensure product_id is consistently an ObjectId
          product_id: typeof comment.product_id === 'string' 
              ? new mongoose.Types.ObjectId(comment.product_id) 
              : comment.product_id,
          // Ensure user_id is consistently an ObjectId
          user_id: typeof comment.user_id === 'string' 
              ? new mongoose.Types.ObjectId(comment.user_id) 
              : comment.user_id
      }));

      return NextResponse.json(formattedComments, { status: 200 });
  }
  catch (error: any) {
      console.error("Error fetching comments:", error);
      return NextResponse.json({ 
          message: 'Error fetching comments', 
          error: error.toString() 
      }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    try {
      await connectionPromise;
      const db = mongoose.connection.db;
  
      if (!db) {
        console.error("Database connection is undefined");
        return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
      }
  
      const { searchParams } = new URL(req.url);
      const commentId = searchParams.get('id');
  
      if (!commentId) {
        return NextResponse.json({ message: 'Comment ID is required' }, { status: 400 });
      }
  
      const result = await db.collection('review').deleteOne({ _id: new mongoose.Types.ObjectId(commentId) });
      if (result.deletedCount === 0) {
        return NextResponse.json({ message: 'Comment not found or already deleted' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      return NextResponse.json({ message: 'Error deleting comment', error: error.toString() }, { status: 500 });
    }
  }
