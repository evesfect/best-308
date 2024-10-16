// src/app/api/product/[id]/route.ts

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import Product from '@/models/product.model';
import connectionPromise from '@/lib/mongodb';

function isValidObjectId(id: string): boolean {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    console.log("sa");
    await connectionPromise;

    if (!isValidObjectId(id)) {
        return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Error retrieving product:', error);
        return NextResponse.json({ message: 'Error retrieving product', error }, { status: 500 });
    }
}
