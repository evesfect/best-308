import { ObjectId } from 'mongodb';

export interface Order {
    _id: ObjectId;
    products: Map<ObjectId, number>;
    user_id: ObjectId;
    address : string;
    completed: boolean;
    date: Date;
    status: string;
}
