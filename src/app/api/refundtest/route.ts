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

        if (!body.user_email) {
            return NextResponse.json({ message: 'User email is required' }, { status: 400 });
        }

        // Find corresponding invoice (uses email and product id)
        const invoice = await db.collection('invoice').findOne({
            'customerDetails.email': body.user_email,
            'items': { 
                $elemMatch: { 
                    _id: { $in: Object.keys(body.products) }
                }
            }
        });

        if (!invoice) {
            console.error('Invoice not found for:', {
                email: body.user_email,
                products: Object.keys(body.products)
            });
            return NextResponse.json({ 
                message: 'Invoice not found for these items',
                details: 'Please ensure the order and products are correct'
            }, { status: 404 });
        }

        let refundAmount = 0;
        for (const [productId, quantity] of Object.entries(body.products)) {
            const invoiceItem = invoice.items.find((item: any) => item._id === productId);
            if (invoiceItem) {
                refundAmount += invoiceItem.salePrice * (quantity as number);
            }
        }

        // New refund document
        const newRefund = {
            _id: new mongoose.Types.ObjectId(),
            order_id: new mongoose.Types.ObjectId(body.order_id),
            user_id: new mongoose.Types.ObjectId(body.user_id),
            products: body.products,
            reason: body.reason,
            status: 'pending',
            requestDate: new Date(),
            refundAmount: refundAmount
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