import connectionPromise from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){

    try {
        await connectionPromise;
        const db = mongoose.connection.db;
        if(!db){
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        const collections = await db.listCollections().toArray();
        if (!collections.some(c => c.name === 'order')) {
            return NextResponse.json({ message: 'Order collection not found' }, { status: 500 });
        }

        const orderCollection = db.collection('order');

        const url = new URL(req.url);

        //getting userId's of orders
        const userId = url.searchParams.get('user_id');

        if (Array.isArray(userId)) {
            return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
        }
            
        try {
            const userOrders = await orderCollection.find({ user_id: userId }).sort({ orderDate: -1 }).toArray();

            return NextResponse.json({ userOrders: userOrders ?? [] }, { status: 200 });

        } catch (error) {
            return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
        }
    }
    catch {
        return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
    }
}
