

import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
      // Ensure the database is connected
      await connectionPromise;
      console.log("Database connected successfully");
  
      // Log the current database and collections
      const db = mongoose.connection.db;
      if (db) {
        console.log("Current database:", db.databaseName);
      } else {
        console.error("Database connection is undefined");
        return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
      }
    

        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const requiredCollections = ['review'];
        requiredCollections.forEach((collection) => {
        if (!collections.some(c => c.name === collection)) {
          console.error(`The '${collection}' collection does not exist in the database`);
          return NextResponse.json({ message: `${collection.charAt(0).toUpperCase() + collection.slice(1)} collection not found` }, { status: 500 });
        }
        });

        const url = new URL(req.url);
        const productId = url.searchParams.get('product_id');

        let searchCriteria: any = {};

        if (productId) {
            searchCriteria = { product_id: new mongoose.Types.ObjectId(productId) };
        }

        const comments = await db.collection('review').find(searchCriteria).toArray();
        
        // Return the array of comments as JSON
        return NextResponse.json(comments, { status: 200 });


    }
    catch (error: any) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ message: 'Error fetching stats', error: error.toString() }, { status: 500 });
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
