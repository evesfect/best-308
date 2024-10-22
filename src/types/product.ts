import { ObjectId } from 'mongodb';

// Define the Product interface for TypeScript
export interface Product {
    _id: ObjectId;
    name: string;
    description: string;
    sex : string;
    category: string;
    price: number;
    total_stock: Map<string, number>;
    available_stock: Map<string, number>;
}
