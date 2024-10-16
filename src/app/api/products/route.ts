
import {NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

let client: MongoClient;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect('mongodb://root:rpassword@localhost:27017/e-commerce?authSource=admin', {
            maxPoolSize: 10,
        });
    }
    return client.db();
}

export async function GET(req: Request) {
    
    try {
        const db = await connectToDatabase();
        console.log("Database connected:", db.databaseName);
        const productsCollection = db.collection('product');

        const url = new URL(req.url);
        const query = url.searchParams.get('query');
        const category = url.searchParams.get('category');

        let searchCriteria: any = {};

        if (query) {
            searchCriteria.$or = [
                { name: { $regex: query, $options: 'i' } }, // Search by name
                { description: { $regex: query, $options: 'i' } } // Search by description
            ];
        }

        if(category){
            searchCriteria.category = category; //Search by category
        }

        const products = await productsCollection.find(searchCriteria).toArray();
        console.log("Products fetched:", products.length);

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ message: 'Error fetching products', error }, { status: 500 });
    }
}