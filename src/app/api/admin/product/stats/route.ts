import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Product from '@/models/product.model'; 
import User from '@/models/user.model';
import Order from '@/models/order.model';

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

      // Verify that the necessary collections exist
      const requiredCollections = ['product', 'user', 'order'];
      requiredCollections.forEach((collection) => {
        if (!collections.some(c => c.name === collection)) {
          console.error(`The '${collection}' collection does not exist in the database`);
          return NextResponse.json({ message: `${collection.charAt(0).toUpperCase() + collection.slice(1)} collection not found` }, { status: 500 });
        }
      });

      // Fetch statistics
      const totalProducts = await Product.countDocuments();
      const totalUsers = await User.countDocuments();
      const totalOrders = await Order.countDocuments();
      
      

      // Log the fetched statistics
      console.log("Fetched statistics:", { totalProducts, totalUsers, totalOrders});

      // Respond with the statistics
      return NextResponse.json({
        products: totalProducts,
        users: totalUsers,
        orders:totalOrders
      });

    } catch (error: any) {
      console.error("Error fetching stats:", error);
      return NextResponse.json({ message: 'Error fetching stats', error: error.toString() }, { status: 500 });
    }
}
    



