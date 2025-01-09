import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        await connectionPromise;
        const db = mongoose.connection.db;
  
        if (!db) {
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        const body = await req.json();
        console.log('Received refund test request:', body);

        // Create new refund document similar to order creation
        const newRefund = {
            _id: new mongoose.Types.ObjectId(),
            order_id: new mongoose.Types.ObjectId(body.order_id),
            user_id: new mongoose.Types.ObjectId(body.user_id),
            products: body.products, // Keep as plain object for now
            reason: body.reason,
            status: 'pending',
            requestDate: new Date(),
            refundAmount: 100 // Test amount
        };

        const result = await db.collection('refund').insertOne(newRefund);
        
        return NextResponse.json({ 
            message: 'Test refund request created successfully',
            refund: newRefund
        }, { status: 201 });

    } catch (error) {
        console.error('Error in test refund endpoint:', error);
        return NextResponse.json({ 
            error: 'Test failed',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}