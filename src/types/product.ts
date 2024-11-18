// never remove path of this file
///src/types/product.ts

import { ObjectId } from 'mongodb';

// Define the Product interface for TypeScript
export interface Product {
    _id: ObjectId;
    name: string;
    description: string;
    sex : string;
    category: string;
    costPrice: number;
    salePrice: number;
    totalStock: Map<string, number>;
    availableStock: Map<string, number>;
    inStock: boolean;
    quantity: number;
    imageId: string;
    sizes: string[];
    colors: string[];
}
