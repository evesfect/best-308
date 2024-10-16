import { ObjectId } from 'mongodb';

// Define the Product interface for TypeScript
export interface Product {
    _id: ObjectId;
    name: string;
    price: number;
    description: string;
    inStock: boolean;
    quantity: number;
}
