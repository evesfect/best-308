import connectionPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";

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

export async function PATCH(req: NextRequest) {
    try {
        await connectionPromise;
        const db = mongoose.connection.db;
  
        if (!db) {
            return NextResponse.json(
                { message: "Database connection error" },
                { status: 500 }
            );
        }
  
        const userCollection = db.collection("user");
  
        const url = new URL(req.url);
        const userId = url.searchParams.get("_id");
  
        if (!userId || !ObjectId.isValid(userId)) {
            return NextResponse.json(
                { message: "Invalid or missing user ID" },
                { status: 400 }
            );
        }
  
        let updates;
        try {
            updates = await req.json();
        } catch {
            return NextResponse.json(
                { message: "Invalid JSON in request body" },
                { status: 400 }
            );
        }
  
        if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
            return NextResponse.json(
                { message: "Invalid updates provided" },
                { status: 400 }
            );
        }
  
        if (updates.phoneNumber) {
            const phoneNumberObject = parsePhoneNumberFromString(
                updates.phoneNumber,
                "TR" // Default region = Türkiye
            );
  
            if (!phoneNumberObject || !isValidPhoneNumber(updates.phoneNumber, "TR")) {
                return NextResponse.json(
                    { message: "Invalid phone number format." },
                    { status: 400 }
                );
            }
  
            updates.phoneNumber = phoneNumberObject.number;
        }
  
        const updatedUser = await userCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: updates },
            { returnDocument: "after" }
        );
  
        return NextResponse.json({ updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating user information:", error);
        return NextResponse.json(
            { message: "Failed to update user information" },
            { status: 500 }
        );
    }
}
