import { ObjectId } from 'mongodb';

// Define the Order interface for TypeScript
export interface Order {
    _id: ObjectId;
    products: Map<ObjectId, number>; // ID and quantity
    user_id: ObjectId;
    address : string;
    completed: boolean;
    date: Date;
}
