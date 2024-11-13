import { ObjectId } from 'mongodb';

// Define the Product interface for TypeScript
export interface ProcessedProduct {
    _id: ObjectId;
    name: string;
    salePrice: number;
    quantity: number;
    imageId: string;
    size: string;
    color: string;
}

