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
    total_stock: Map<string, number>;
    available_stock: Map<string, number>;
    inStock: boolean;
    quantity: number;
    imageId: string;
    sizes: string[];
    colors: string[];
    warranty:string;
    distributor:string;
    serialNum:string;
    model:string;
}
