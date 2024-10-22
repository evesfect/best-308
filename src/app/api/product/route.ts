import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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
        const order = url.searchParams.get('order');
        const id = url.searchParams.get('id');

        // Default search criteria (empty to return all products by default)
        let searchCriteria: any = {};

        // If an ID is provided, return the specific product
        if (id) {
            try {
                const product = await productsCollection.findOne({ _id: new ObjectId(id) });
                if (product) {
                    return NextResponse.json(product); // Return the found product
                } else {
                    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
                }
            } catch (error) {
                return NextResponse.json({ message: 'Invalid product ID format' }, { status: 400 });
            }
        }

        // Apply search criteria based on query and category
        if (query) {
            searchCriteria.$or = [
                { name: { $regex: query, $options: 'i' } }, // Search by name
                { description: { $regex: query, $options: 'i' } } // Search by description
            ];
        }

        if (category) {
            searchCriteria.category = category; // Filter by category
        }

        // Set sorting criteria if 'order' is specified
        let sortCriteria: any = {};
        if (order === 'asc') {
            sortCriteria.price = 1; // Ascending order
        } else if (order === 'desc') {
            sortCriteria.price = -1; // Descending order
        }

        // Fetch products based on search and sort criteria
        const products = await productsCollection.find(searchCriteria).sort(sortCriteria).toArray();
        console.log("Products fetched:", products.length);

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ message: 'Error fetching products', error }, { status: 500 });
    }
}
