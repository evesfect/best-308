import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import ProcessedProduct from '@/models/processed-product.model';

export async function GET(req: NextRequest) {
    try {
        await connectionPromise;
        console.log("Database connected successfully");

        const db = mongoose.connection.db;
        if (!db) {
            console.error("Database connection is undefined");
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ProcessedProduct ID is required' }, { status: 400 });
        }

        console.log("Searching for ProcessedProduct by ID:", id);

        const processedProduct = await ProcessedProduct.findById(id).populate('productId');

        if (!processedProduct) {
            console.log("ProcessedProduct not found for ID:", id);
            return NextResponse.json({ message: 'ProcessedProduct not found' }, { status: 404 });
        }

        console.log("ProcessedProduct found:", processedProduct);
        return NextResponse.json(processedProduct);

    } catch (error: any) {
        console.error("Error fetching ProcessedProduct:", error);
        return NextResponse.json({ message: 'Error fetching ProcessedProduct', error: error.toString() }, { status: 500 });
    }
}
