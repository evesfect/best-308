import { ObjectId } from 'mongodb';
import {StaticImageData} from "next/image";

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
    inStock: boolean;
    quantity: number;
    imageUrl: string | StaticImageData;
    sizes: string[];
    colors: string[];
}
