import connectionPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
    
    try {
        await connectionPromise;
        const db = mongoose.connection.db;
        if(!db){
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        const collections = await db.listCollections().toArray();
        if (!collections.some(c => c.name === 'user')) {
            return NextResponse.json({ message: 'User collection not found' }, { status: 500 });
        }

        const userCollection = db.collection('user');

        const url = new URL(req.url);
        const userId = url.searchParams.get('_id');

        if (userId) {
            if (Array.isArray(userId)) {
                return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
            }
            
            try {
                const user = await userCollection.findOne({_id: new ObjectId(userId)});
                if (!user) {
                    return NextResponse.json({ error: 'User not found' }, { status: 404});
                }
                return NextResponse.json({user}, { status: 200 });

            } catch (error) {
                return NextResponse.json({error: 'Invalid user ID format'}, { status: 404});
            }
        } else {
            const users = await userCollection.find({}).toArray();
            return NextResponse.json({users}, { status: 200 });
        }
    }

    catch {
        return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
}
