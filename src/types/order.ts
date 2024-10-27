import { ObjectId } from 'mongodb';

// Define the Order interface for TypeScript
export interface Order {
    _id: ObjectId;
    products: Map<string,number>; // ID and quantity
    user_id: string;
    address : string;
    completed: boolean;
    date: Date;
}
