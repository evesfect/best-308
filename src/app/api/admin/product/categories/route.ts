import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
      await connectionPromise;
      const db = mongoose.connection.db;
      if (!db) {
        console.error("Database connection is undefined");
        return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
      }
  
      const body = await req.json();
      const { name, image } = body;
  
      // Validate input
      if (!name) {
        return NextResponse.json(
          { message: 'Name is required' },
          { status: 400 }
        );
      }
  
      // Use an empty string as default for the image
      const categoryImage = image || "";
  
      // Insert new category into the database
      const result = await db.collection('category').insertOne({
        name,
        image: categoryImage,
      });
  
      return NextResponse.json(
        { message: 'Category added successfully', categoryId: result.insertedId },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Error adding category:", error);
      return NextResponse.json(
        { message: 'Error adding category', error: error.toString() },
        { status: 500 }
      );
    }
}