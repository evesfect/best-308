import { ObjectId } from 'mongodb';

export interface Review {
    _id: ObjectId;
    comment: string;
    rating: number;
    user_id: ObjectId;
    product_id: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
