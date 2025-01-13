import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import Order from '@/models/order.model';

export async function POST(req: Request){
    try{
        await connectionPromise;
        const db = mongoose.connection.db;
  
        if (!db) {
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        const orderData = await req.json();
      
        const newOrder = {
            _id: new mongoose.Types.ObjectId(),
            products: orderData.products,
            user_id: orderData.user_id,
            address: orderData.address,
            completed: orderData.completed,
            date: new Date(),
            status: orderData.status,
            totalPrice: orderData.totalPrice,
        };

        const result = await db.collection('order').insertOne(newOrder);
        return NextResponse.json({ order: newOrder }, { status: 201 });
    } catch (error) {
      console.error("Error adding order:", error);
      return NextResponse.json({ message: 'Error adding order', error: (error as Error).toString() }, { status: 500 });
    }
}