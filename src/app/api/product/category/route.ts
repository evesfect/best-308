import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb'; 
import Category from '@/models/category.model';



export async function GET(req: Request){
    try {
        // Establish database connection
        await connectionPromise;
        console.log("Database connected successfully");
    
        const db = mongoose.connection.db;
        if (!db) {
          console.error("Database connection is undefined");
          return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }
    
        // Check if the 'order' collection exists
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
    
        if (!collections.some(c => c.name === 'category')) {
          console.error("The 'category' collection does not exist in the database");
          return NextResponse.json({ message: 'Order collection not found' }, { status: 500 });
        }
    
        // Fetch all orders
        const categories = await Category.find();
        console.log("Orders fetched:", categories.length);
    
        if (categories.length === 0) {
          console.log("No categories found in the database.");
        }
    
        // Respond with the fetched orders
        return NextResponse.json(categories);
    
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ message: 'Error fetching orders', error: error.toString() }, { status: 500 });
      }

}